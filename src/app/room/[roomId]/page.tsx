'use client';

import { useParams, useSearchParams } from 'next/navigation';
import { useState, useEffect, useRef } from 'react';
import { io, Socket } from 'socket.io-client';
import { Suspense, lazy } from 'react';
import { Question, PlayerState, Match, User } from '../../../domain/models';
import { useSessionStore } from '../../../state/useSessionStore';
import { useScreenReaderAnnouncement } from '../../../hooks/useScreenReaderAnnouncement';
import { useLeaderboard } from '../../../hooks/useLeaderboard';
import { ChatMessage } from '../../../components/Chat';

// Lazy load components
const QuestionCard = lazy(() => import('../../../components/QuestionCard').then(module => ({ default: module.QuestionCard })));
const Timer = lazy(() => import('../../../components/Timer').then(module => ({ default: module.Timer })));
const Scoreboard = lazy(() => import('../../../components/Scoreboard').then(module => ({ default: module.Scoreboard })));
const Podium = lazy(() => import('../../../components/Podium').then(module => ({ default: module.Podium })));
const Chat = lazy(() => import('../../../components/Chat').then(module => ({ default: module.Chat })));

interface GameState {
  match: Match | null;
  currentQuestion: Question | null;
  timeLimit: number;
  timeRemaining: number;
  players: PlayerState[];
  gameStarted: boolean;
  gameFinished: boolean;
  loading: boolean;
  error: string | null;
  chatMessages: ChatMessage[];
  timerActive: boolean; // Controla se o timer deve estar rodando
}

export default function RoomPage() {
  const { roomId: _roomId } = useParams();
  const roomId = _roomId as string;
  const searchParams = useSearchParams();
  const mode = searchParams.get('mode') as 'solo' | 'dupla' || 'solo';

  const user = useSessionStore((state) => state.user);
  const setLastScore = useSessionStore((state) => state.setLastScore);
  const { addEntry } = useLeaderboard();
  const socketRef = useRef<Socket | null>(null);
  const announce = useScreenReaderAnnouncement();

  // Detectar se é modo solo (não multiplayer)
  const isSoloMode = roomId.startsWith('SOLO_') || mode === 'solo';

  const [gameState, setGameState] = useState<GameState>({
    match: null,
    currentQuestion: null,
    timeLimit: 10,
    timeRemaining: 10,
    players: [],
    gameStarted: false,
    gameFinished: false,
    loading: false,
    error: null,
    chatMessages: [],
    timerActive: false,
  });

  const [answerResult, setAnswerResult] = useState<{
    correct: boolean;
    newScore: number;
    newStreak: number;
  } | null>(null);

  const [gameFinishedData, setGameFinishedData] = useState<{ finalScores: PlayerState[] } | null>(null);

  // Initialize socket connection (only for multiplayer)
  useEffect(() => {
    if (!user || !roomId || isSoloMode) return;

    const socket = io(process.env.NEXT_PUBLIC_SOCKET_URL || 'http://localhost:3000', {
      path: '/api/socket',
    });

    socketRef.current = socket;

    // Join room
    socket.emit('room:join', {
      roomId,
      user: {
        id: user.id,
        name: user.name,
      },
    });

    // Socket event listeners
    socket.on('room:joined', (data) => {
      if (data.success) {
        setGameState(prev => ({
          ...prev,
          match: data.match,
          players: data.players,
        }));
        announce(`Entrou na sala ${roomId}. ${data.players.length} jogadores conectados.`, 'polite');
      } else {
        setGameState(prev => ({ ...prev, error: data.error }));
        announce(`Erro ao entrar na sala: ${data.error}`, 'assertive');
      }
    });

    socket.on('room:updated', (data) => {
      setGameState(prev => ({
        ...prev,
        match: data.match,
        players: data.players,
      }));
    });

    socket.on('game:started', (data) => {
      setGameState(prev => ({
        ...prev,
        match: data.match,
        currentQuestion: data.question,
        timeLimit: data.timeLimit,
        timeRemaining: data.timeLimit,
        gameStarted: true,
        loading: false,
        timerActive: true, // Multiplayer: timer starts active
      }));
      announce('Jogo iniciado! Primeira pergunta disponível.', 'assertive');
    });

    socket.on('question:next', (data) => {
      setGameState(prev => ({
        ...prev,
        currentQuestion: data.question,
        timeLimit: data.timeLimit,
        timeRemaining: data.timeLimit,
        loading: false,
        timerActive: true, // Multiplayer: timer starts active for new questions
      }));
      setAnswerResult(null);
      const roundNumber = data.question ? `Rodada ${data.question.round || 1}` : '';
      announce(`${roundNumber}. Nova pergunta disponível. ${data.timeLimit} segundos para responder.`, 'assertive');
    });

    socket.on('question:timeout', () => {
      setGameState(prev => ({ ...prev, timeRemaining: 0 }));
    });

    socket.on('answer:result', (result) => {
      setAnswerResult(result);
      const resultText = result.correct ? 'Resposta correta!' : 'Resposta incorreta.';
      announce(`${resultText} Pontuação: ${result.newScore}. Sequência: ${result.newStreak}.`, 'assertive');

      // In multiplayer mode, if someone answered and there are still players who haven't answered,
      // start a 15-second timer for the remaining players
      if (!isSoloMode && gameState.players.length > 1) {
        const answeredPlayerIds = gameState.players
          .filter(p => p.userId !== result.userId)
          .map(p => p.userId);

        // Check if there are still unanswered players (this is a simplified check)
        // In a real implementation, you'd track who has answered this question
        setGameState(prev => ({
          ...prev,
          timeRemaining: 15,
          timeLimit: 15,
          timerActive: true,
        }));
      }
    });

    socket.on('game:finished', (data) => {
      setGameState(prev => ({
        ...prev,
        match: data.match,
        gameFinished: true,
        players: data.finalScores,
      }));

      // Marcar que o jogo terminou para salvar pontuações depois
      setGameFinishedData(data);

      const winner = data.finalScores[0];
      announce(`Jogo finalizado! Primeiro lugar: ${winner.userId} com ${winner.score} pontos.`, 'assertive');
    });

    socket.on('game:error', (error) => {
      setGameState(prev => ({ ...prev, error: error.message }));
    });

    socket.on('chat:message', (message: ChatMessage) => {
      setGameState(prev => ({
        ...prev,
        chatMessages: [...prev.chatMessages, message]
      }));
    });

    socket.on('chat:history', (data: { messages: ChatMessage[] }) => {
      setGameState(prev => ({
        ...prev,
        chatMessages: data.messages
      }));
    });

    socket.on('chat:error', (error) => {
      console.error('Chat error:', error.message);
    });

    return () => {
      socket.disconnect();
    };
  }, [user, roomId, isSoloMode]);

  // Initialize solo mode game
  useEffect(() => {
    if (!user || !roomId || !isSoloMode) return;

    // Initialize solo game state
    const soloPlayer: PlayerState = {
      userId: user.id,
      score: 0,
      streak: 0,
      currentDifficulty: 1,
    };

    const soloMatch: Match = {
      id: roomId,
      roomId,
      mode: 'solo',
      round: 0,
      totalRounds: 5,
      players: [soloPlayer],
    };

    setGameState(prev => ({
      ...prev,
      match: soloMatch,
      players: [soloPlayer],
    }));

    announce('Modo solo iniciado. Clique em "Começar Jogo" para iniciar sua prática.', 'polite');
  }, [user, roomId, isSoloMode]);

    // Salvar pontuações no leaderboard quando o jogo terminar
  useEffect(() => {
    if (gameFinishedData && gameState.gameFinished && !gameState.loading) {
      const saveScores = async () => {
        try {
          if (isSoloMode) {
            // Modo solo - salvar apenas a pontuação do jogador atual
            const finalScore = gameState.players[0]?.score || 0;
            if (user && finalScore > 0) {
              console.log('Salvando pontuação no leaderboard (solo):', finalScore);
              await addEntry({
                scope: 'geral',
                scopeId: 'all',
                userId: user.id,
                score: finalScore,
              });
              console.log('Pontuação salva com sucesso no leaderboard');
            }
          } else {
            // Modo multiplayer - salvar pontuações de todos os jogadores
            if (gameFinishedData.finalScores && gameFinishedData.finalScores.length > 0) {
              const savePromises = (gameFinishedData.finalScores as PlayerState[])
                .filter((player: PlayerState) => player.score > 0)
                .map((player: PlayerState) => {
                  console.log('Salvando pontuação para jogador:', player.userId, player.score);
                  return addEntry({
                    scope: 'geral',
                    scopeId: 'all',
                    userId: player.userId,
                    score: player.score,
                  });
                });

              await Promise.all(savePromises);
              console.log('Pontuações salvas no leaderboard (multiplayer)');
            }
          }
        } catch (error) {
          console.error('Erro ao salvar pontuações no leaderboard:', error);
        }
      };

      // Pequeno delay para garantir que o estado esteja estabilizado
      setTimeout(saveScores, 100);
    }
  }, [gameFinishedData, gameState.gameFinished, gameState.loading, isSoloMode, user, addEntry, gameState.players]);

  // Timer countdown - only active when timerActive is true
  useEffect(() => {
    if (!gameState.gameStarted || gameState.timeRemaining <= 0 || !gameState.timerActive) return;

    const timer = setInterval(() => {
      setGameState(prev => {
        const newTimeRemaining = Math.max(0, prev.timeRemaining - 1);

        // Announce when time is running low
        if (newTimeRemaining === 5) {
          announce('Atenção: 5 segundos restantes!', 'assertive');
        }

        return {
          ...prev,
          timeRemaining: newTimeRemaining,
        };
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [gameState.gameStarted, gameState.timeRemaining, gameState.timerActive, announce]);

  const handleAnswer = (choiceId: string) => {
    if (isSoloMode) {
      handleSoloAnswer(choiceId);
    } else {
      if (!socketRef.current || !user) return;

      setGameState(prev => ({ ...prev, loading: true }));

      socketRef.current.emit('answer:submit', {
        roomId,
        userId: user.id,
        choiceId,
      });
    }
  };

  const handleStartGame = () => {
    if (isSoloMode) {
      handleStartSoloGame();
    } else {
      if (!socketRef.current) return;

      setGameState(prev => ({ ...prev, loading: true }));

      socketRef.current.emit('room:start', {
        roomId,
        totalRounds: 5,
        mode,
      });
    }
  };

  // Solo mode game logic
  const handleStartSoloGame = async () => {
    setGameState(prev => ({ ...prev, loading: true }));

    try {
      // Load first question from local data
      const response = await fetch('/data/questions.math.json');
      const questions: Question[] = await response.json();

      if (questions.length === 0) {
        throw new Error('Nenhuma pergunta disponível');
      }

      const firstQuestion = questions[0];
      firstQuestion.id = `solo_${Date.now()}_1`;

      setGameState(prev => ({
        ...prev,
        match: prev.match ? { ...prev.match, round: 1 } : null,
        currentQuestion: firstQuestion,
        timeLimit: firstQuestion.timeSuggestedSec || 30,
        timeRemaining: firstQuestion.timeSuggestedSec || 30,
        gameStarted: true,
        loading: false,
        timerActive: false, // Solo mode: no timer
      }));

      announce('Jogo solo iniciado! Primeira pergunta disponível.', 'assertive');
    } catch (error) {
      console.error('Error starting solo game:', error);
      setGameState(prev => ({
        ...prev,
        error: 'Erro ao carregar perguntas. Tente novamente.',
        loading: false
      }));
    }
  };

  const handleSoloAnswer = async (choiceId: string) => {
    if (!gameState.currentQuestion || !user) return;

    setGameState(prev => ({ ...prev, loading: true }));

    const selectedChoice = gameState.currentQuestion.choices.find(c => c.id === choiceId);
    const isCorrect = selectedChoice?.isCorrect || false;

    // Calculate score
    const basePoints = 100;
    const timeBonus = Math.floor((gameState.timeRemaining / gameState.timeLimit) * 50);
    const streakBonus = gameState.players[0]?.streak * 10 || 0;
    const pointsEarned = isCorrect ? (basePoints + timeBonus + streakBonus) : 0;

    const newScore = (gameState.players[0]?.score || 0) + pointsEarned;
    const newStreak = isCorrect ? ((gameState.players[0]?.streak || 0) + 1) : 0;

    // Update player state
    const updatedPlayer: PlayerState = {
      userId: user.id,
      score: newScore,
      streak: newStreak,
      currentDifficulty: gameState.players[0]?.currentDifficulty || 1,
    };

    setGameState(prev => ({
      ...prev,
      players: [updatedPlayer],
      loading: false,
    }));

    setAnswerResult({
      correct: isCorrect,
      newScore,
      newStreak,
    });

    const resultText = isCorrect ? 'Resposta correta!' : 'Resposta incorreta.';
    announce(`${resultText} Pontuação: ${newScore}. Sequência: ${newStreak}.`, 'assertive');

    // Auto-advance to next question after 2 seconds
    setTimeout(() => {
      handleSoloNextQuestion();
    }, 2000);
  };

  const handleSoloNextQuestion = async () => {
    if (!gameState.match) return;

    const nextRound = gameState.match.round + 1;

    if (nextRound > gameState.match.totalRounds) {
      // Game finished
      handleSoloGameFinished();
      return;
    }

    try {
      // Load next question
      const response = await fetch('/data/questions.math.json');
      const questions: Question[] = await response.json();

      if (questions.length === 0) {
        throw new Error('Nenhuma pergunta disponível');
      }

      // Get a random question (or cycle through them)
      const questionIndex = (nextRound - 1) % questions.length;
      const nextQuestion = questions[questionIndex];
      nextQuestion.id = `solo_${Date.now()}_${nextRound}`;

      setGameState(prev => ({
        ...prev,
        match: prev.match ? { ...prev.match, round: nextRound } : null,
        currentQuestion: nextQuestion,
        timeLimit: nextQuestion.timeSuggestedSec || 30,
        timeRemaining: nextQuestion.timeSuggestedSec || 30,
        loading: false,
        timerActive: false, // Solo mode: no timer
      }));

      setAnswerResult(null);

      announce(`Rodada ${nextRound}. Nova pergunta disponível. ${nextQuestion.timeSuggestedSec || 30} segundos para responder.`, 'assertive');
    } catch (error) {
      console.error('Error loading next question:', error);
      setGameState(prev => ({
        ...prev,
        error: 'Erro ao carregar próxima pergunta.',
        loading: false
      }));
    }
  };

  const handleSoloGameFinished = async () => {
    const finalScore = gameState.players[0]?.score || 0;

    // Salvar pontuação no leaderboard
    if (user && finalScore > 0) {
      try {
        await addEntry({
          scope: 'geral',
          scopeId: 'all',
          userId: user.id,
          score: finalScore,
        });
        console.log('Pontuação salva no leaderboard:', finalScore);
      } catch (error) {
        console.error('Erro ao salvar pontuação no leaderboard:', error);
      }
    }

    setGameState(prev => ({
      ...prev,
      gameFinished: true,
    }));

    announce(`Jogo solo finalizado! Sua pontuação final: ${finalScore} pontos.`, 'assertive');
  };

  const handleNextQuestion = () => {
    if (!socketRef.current) return;

    socketRef.current.emit('game:next', { roomId });
  };

  const handleTimeUp = () => {
    // Time is handled by server now
  };

  const handleSendMessage = (message: string) => {
    if (!socketRef.current || !user) return;

    socketRef.current.emit('chat:send', {
      roomId,
      userId: user.id,
      userName: user.name,
      message,
    });
  };

  // Loading state
  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p>Carregando...</p>
        </div>
      </div>
    );
  }

  // Error state
  if (gameState.error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-600 text-xl mb-4">❌</div>
          <h2 className="text-xl font-semibold mb-2">Erro</h2>
          <p className="text-gray-600">{gameState.error}</p>
        </div>
      </div>
    );
  }

  // Game finished
  if (gameState.gameFinished) {
    const finalScore = gameState.players[0]?.score || 0;
    const finalStreak = gameState.players[0]?.streak || 0;

    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-purple-500 to-pink-600 p-4">
        <h1 className="text-3xl font-bold mb-8 text-white">
          {isSoloMode ? '🎯 Prática Concluída!' : 'Fim da Partida!'}
        </h1>

        {isSoloMode ? (
          <div className="bg-white rounded-lg shadow-lg p-8 max-w-md w-full text-center mb-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">Seu Resultado</h2>

            <div className="space-y-4 mb-6">
              <div className="bg-blue-50 p-4 rounded-lg">
                <div className="text-3xl font-bold text-blue-600">{finalScore}</div>
                <div className="text-sm text-gray-600">Pontuação Total</div>
              </div>

              <div className="bg-green-50 p-4 rounded-lg">
                <div className="text-3xl font-bold text-green-600">{finalStreak}</div>
                <div className="text-sm text-gray-600">Melhor Sequência</div>
              </div>

              <div className="bg-purple-50 p-4 rounded-lg">
                <div className="text-lg font-semibold text-purple-600">
                  {finalScore >= 400 ? '🏆 Excelente!' :
                   finalScore >= 300 ? '🎉 Muito Bom!' :
                   finalScore >= 200 ? '👍 Bom!' : '💪 Continue Praticando!'}
                </div>
                <div className="text-sm text-gray-600">Avaliação</div>
              </div>
            </div>

            <p className="text-gray-600 mb-6">
              Você completou {gameState.match?.totalRounds || 5} perguntas de matemática.
              Cada resposta correta vale pontos baseados no tempo e sequência!
            </p>
          </div>
        ) : (
          <Suspense fallback={<div className="w-full max-w-md h-32 bg-gray-200 rounded-lg animate-pulse"></div>}>
            <Podium players={gameState.players} />
          </Suspense>
        )}

        <div className="mt-8 space-x-4">
          <button
            onClick={() => {
              setLastScore(finalScore);
              window.location.href = '/ranking';
            }}
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
          >
            Ver Ranking
          </button>
          <button
            onClick={() => window.location.href = '/lobby'}
            className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 transition-colors"
          >
            {isSoloMode ? '🎯 Nova Prática' : 'Nova Partida'}
          </button>
        </div>
      </div>
    );
  }

  // Waiting room
  if (!gameState.gameStarted) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-blue-500 to-purple-600 p-4">
        <div className="bg-white rounded-lg shadow-lg p-8 max-w-md w-full text-center">
          {isSoloMode ? (
            <>
              <h1 className="text-2xl font-bold mb-4">🎯 Modo Solo</h1>
              <p className="text-gray-600 mb-6">
                Pratique suas habilidades respondendo perguntas matemáticas.
              </p>

              <div className="mb-6">
                <h3 className="font-semibold mb-2">Seu Progresso</h3>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <div className="flex justify-between items-center mb-2">
                    <span>Pontuação Atual:</span>
                    <span className="font-semibold">{gameState.players[0]?.score || 0}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>Sequência Atual:</span>
                    <span className="font-semibold">{gameState.players[0]?.streak || 0}</span>
                  </div>
                </div>
              </div>

              <button
                onClick={handleStartGame}
                disabled={gameState.loading}
                className="w-full px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {gameState.loading ? 'Carregando perguntas...' : '🚀 Começar Prática'}
              </button>
            </>
          ) : (
            <>
              <h1 className="text-2xl font-bold mb-4">Sala {roomId}</h1>
              <p className="text-gray-600 mb-6">
                Aguardando jogadores...
              </p>

              <div className="mb-6">
                <h3 className="font-semibold mb-2">Jogadores ({gameState.players.length})</h3>
                <div className="space-y-2">
                  {gameState.players.map((player) => (
                    <div key={player.userId} className="flex items-center justify-between bg-gray-50 p-2 rounded">
                      <span>{player.userId === user.id ? 'Você' : `Jogador ${player.userId.slice(0, 4)}`}</span>
                      <span className="text-sm text-gray-500">Pontos: {player.score}</span>
                    </div>
                  ))}
                </div>
              </div>

              <button
                onClick={handleStartGame}
                disabled={gameState.loading || gameState.players.length === 0}
                className="w-full px-8 py-4 md:px-6 md:py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors text-lg md:text-base font-semibold min-h-[48px]"
              >
                {gameState.loading ? 'Iniciando...' : 'Iniciar Jogo'}
              </button>
            </>
          )}
        </div>
      </div>
    );
  }

  // Game in progress
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-500 to-pink-600 p-4">
      <div className="flex flex-col lg:flex-row gap-4 lg:gap-8 max-w-7xl w-full">
        {/* Main game area */}
        <div className="flex-1 flex flex-col items-center">
          {/* Game Info */}
          <div className="mb-4 text-white text-center">
            {isSoloMode ? (
              <>
                <p className="text-xl md:text-lg font-semibold">🎯 Modo Solo - Prática</p>
                <p className="text-base md:text-sm">Rodada {gameState.match?.round || 1} de {gameState.match?.totalRounds || 5}</p>
                <p className="text-sm md:text-xs mt-1">Pontuação: {gameState.players[0]?.score || 0} | Sequência: {gameState.players[0]?.streak || 0}</p>
              </>
            ) : (
              <>
                <p className="text-xl md:text-lg font-semibold">Sala {roomId}</p>
                <p className="text-base md:text-sm">Rodada {gameState.match?.round || 1} de {gameState.match?.totalRounds || 5}</p>
              </>
            )}
          </div>

          {/* Timer */}
          <div className="mb-8">
            <Suspense fallback={<div className="w-20 h-20 bg-gray-200 rounded-full animate-pulse"></div>}>
              <Timer
                duration={gameState.timeLimit}
                onTimeUp={handleTimeUp}
                timeRemaining={gameState.timeRemaining}
                showTimer={gameState.timerActive}
              />
            </Suspense>
          </div>

          {/* Question */}
          {gameState.currentQuestion && (
            <Suspense fallback={<div className="w-full max-w-2xl h-64 bg-gray-200 rounded-lg animate-pulse"></div>}>
              <QuestionCard
                question={gameState.currentQuestion}
                onAnswer={handleAnswer}
                disabled={gameState.loading || gameState.timeRemaining === 0}
              />
            </Suspense>
          )}

          {/* Answer Result */}
          {answerResult && (
            <div className={`mt-4 p-6 md:p-4 rounded-lg text-center text-white font-semibold text-lg md:text-base ${
              answerResult.correct ? 'bg-green-600' : 'bg-red-600'
            }`}>
              {answerResult.correct ? '✅ Correto!' : '❌ Incorreto!'}
              <div className="text-base md:text-sm mt-1">
                Pontuação: {answerResult.newScore} | Sequência: {answerResult.newStreak}
              </div>
            </div>
          )}

          {/* Loading */}
          {gameState.loading && (
            <div className="mt-4">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>
            </div>
          )}

          {/* Scoreboard */}
          <div className="mt-8">
            <Suspense fallback={<div className="w-full max-w-md h-32 bg-gray-200 rounded-lg animate-pulse"></div>}>
              <Scoreboard players={gameState.players} />
            </Suspense>
          </div>

          {/* Next Question Button (for host/admin) */}
          {gameState.timeRemaining === 0 && user.id === gameState.players[0]?.userId && (
            <button
              onClick={handleNextQuestion}
              className="mt-6 px-8 py-4 md:px-6 md:py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-lg md:text-base font-semibold min-h-[48px]"
            >
              Próxima Pergunta
            </button>
          )}
        </div>

        {/* Chat sidebar - only for multiplayer */}
        {!isSoloMode && (
          <div className="w-full lg:w-80 max-h-64 lg:max-h-none overflow-hidden">
            <Suspense fallback={<div className="w-full h-64 bg-gray-200 rounded-lg animate-pulse"></div>}>
              <Chat
                messages={gameState.chatMessages}
                onSendMessage={handleSendMessage}
                currentUserId={user.id}
                disabled={gameState.gameFinished}
              />
            </Suspense>
          </div>
        )}
      </div>
    </div>
  );
}