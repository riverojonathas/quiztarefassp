'use client';

import { useState, useEffect, useReducer, useCallback } from 'react';
import { useQuestions } from '../../hooks/useQuestions';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import Confetti from 'react-confetti';

interface Question {
  id: string;
  statement: string;
  choices: string[];
  correctAnswer: number;
  skill: string;
  timeLimit: number;
}

// Estado centralizado do jogo
interface GameState {
  // Estados do jogo
  gameStarted: boolean;
  gameFinished: boolean;
  showResult: boolean;
  isCorrect: boolean;

  // Dados do jogo
  currentQuestion: Question | null;
  selectedAnswer: number | null;
  timeLeft: number;
  score: number;
  questionNumber: number;

  // UI/UX
  shakeAnimation: 'correct' | 'wrong' | null;
  showTimer: boolean;

  // Áudio/Intervalos
  warningInterval: NodeJS.Timeout | null;
}

// Ações do reducer
type GameAction =
  | { type: 'START_GAME' }
  | { type: 'LOAD_QUESTION'; payload: Question }
  | { type: 'NEXT_QUESTION' }
  | { type: 'SELECT_ANSWER'; payload: number }
  | { type: 'SUBMIT_ANSWER'; payload: { answerIndex: number; isCorrect: boolean; timeBonus: number } }
  | { type: 'UPDATE_TIME'; payload: number }
  | { type: 'SET_WARNING_INTERVAL'; payload: NodeJS.Timeout | null }
  | { type: 'SET_SHAKE_ANIMATION'; payload: 'correct' | 'wrong' | null }
  | { type: 'TOGGLE_TIMER' }
  | { type: 'FINISH_GAME' }
  | { type: 'RESET_GAME' };

// Estado inicial
const initialState: GameState = {
  gameStarted: false,
  gameFinished: false,
  showResult: false,
  isCorrect: false,
  currentQuestion: null,
  selectedAnswer: null,
  timeLeft: 30,
  score: 0,
  questionNumber: 1,
  shakeAnimation: null,
  showTimer: true,
  warningInterval: null,
};

// Reducer para gerenciar estado do jogo
function gameReducer(state: GameState, action: GameAction): GameState {
  switch (action.type) {
    case 'START_GAME':
      return {
        ...state,
        gameStarted: true,
      };

    case 'LOAD_QUESTION':
      return {
        ...state,
        currentQuestion: action.payload,
        timeLeft: action.payload.timeLimit,
        selectedAnswer: null,
        showResult: false,
      };

    case 'NEXT_QUESTION':
      return {
        ...state,
        questionNumber: state.questionNumber + 1,
      };

    case 'SELECT_ANSWER':
      return {
        ...state,
        selectedAnswer: action.payload,
      };

    case 'SUBMIT_ANSWER':
      return {
        ...state,
        selectedAnswer: action.payload.answerIndex,
        isCorrect: action.payload.isCorrect,
        score: state.score + (action.payload.isCorrect ? 100 + action.payload.timeBonus : 0),
        showResult: true,
        shakeAnimation: action.payload.isCorrect ? 'correct' : 'wrong',
      };

    case 'UPDATE_TIME':
      return {
        ...state,
        timeLeft: action.payload,
      };

    case 'SET_WARNING_INTERVAL':
      // Limpar intervalo anterior se existir
      if (state.warningInterval) {
        clearInterval(state.warningInterval);
      }
      return {
        ...state,
        warningInterval: action.payload,
      };

    case 'SET_SHAKE_ANIMATION':
      return {
        ...state,
        shakeAnimation: action.payload,
      };

    case 'TOGGLE_TIMER':
      return {
        ...state,
        showTimer: !state.showTimer,
      };

    case 'FINISH_GAME':
      return {
        ...state,
        gameFinished: true,
      };

    case 'RESET_GAME':
      // Limpar intervalo se existir
      if (state.warningInterval) {
        clearInterval(state.warningInterval);
      }
      return {
        ...initialState,
      };

    default:
      return state;
  }
}

export default function SoloGamePage() {
  const router = useRouter();

  // Carregar questões do banco de dados
  const { questions: loadedQuestions, loading: questionsLoading, error: questionsError } = useQuestions(10);

  // Estado centralizado do jogo usando useReducer
  const [gameState, dispatch] = useReducer(gameReducer, initialState);

  // Estado separado para configurações de UI que não fazem parte do estado do jogo
  const [showTimer, setShowTimer] = useState(true);

  // Estados para feedback aprimorado
  const [showTimeoutModal, setShowTimeoutModal] = useState(false);
  const [wrongAttempts, setWrongAttempts] = useState<Set<number>>(new Set()); // Rastrear tentativas erradas por pergunta

  // Estado para navegação por teclado
  const [focusedOption, setFocusedOption] = useState<number | null>(null);

  // Funções para gerar sons usando Web Audio API otimizado
  const playSound = useCallback(async (frequency: number, duration: number, type: OscillatorType = 'sine') => {
    // Simplified audio implementation
    try {
      const audioContext = new (window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext)();
      const oscillator = audioContext.createOscillator();
      const gainNode = audioContext.createGain();

      oscillator.connect(gainNode);
      gainNode.connect(audioContext.destination);

      oscillator.frequency.setValueAtTime(frequency, audioContext.currentTime);
      oscillator.type = type;

      gainNode.gain.setValueAtTime(0.1, audioContext.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + duration);

      oscillator.start(audioContext.currentTime);
      oscillator.stop(audioContext.currentTime + duration);
    } catch {
      // Silently fail if audio is not available
    }
  }, []);

  const playGameOverSound = useCallback(async () => {
    // Sequência de notas para fim de jogo
    setTimeout(() => playSound(523, 0.2), 0);   // C
    setTimeout(() => playSound(659, 0.2), 200); // E
    setTimeout(() => playSound(784, 0.4), 400); // G
  }, [playSound]);

  const playWarningSound = useCallback(async () => {
    // Som de aviso para tempo crítico - beep agudo e urgente
    await playSound(1000, 0.15, 'square'); // Beep agudo mais longo para ser mais perceptível
  }, [playSound]);

  const playStartSound = useCallback(async () => {
    // Sequência animada e empolgante para início do jogo: subida rápida e energética
    setTimeout(() => playSound(523, 0.1, 'sine'), 0);   // C4
    setTimeout(() => playSound(659, 0.1, 'sine'), 100); // E4
    setTimeout(() => playSound(784, 0.1, 'sine'), 200); // G4
    setTimeout(() => playSound(1047, 0.2, 'sine'), 300); // C5 - nota alta para empolgação
    setTimeout(() => playSound(1319, 0.3, 'triangle'), 400); // E5 - som mais rico para clímax
  }, [playSound]);

  // Função para vibração
  const vibrate = (duration: number) => {
    if (navigator.vibrate) {
      navigator.vibrate(duration);
    }
  };

  const loadNextQuestion = useCallback(() => {
    const question = loadedQuestions[gameState.questionNumber - 1];
    dispatch({ type: 'LOAD_QUESTION', payload: question });
  }, [loadedQuestions, gameState.questionNumber]);

  // Carregar primeira questão quando as questões são carregadas
  useEffect(() => {
    if (loadedQuestions.length > 0 && !gameState.gameStarted && !gameState.gameFinished) {
      loadNextQuestion();
    }
  }, [loadedQuestions.length, gameState.gameStarted, gameState.gameFinished, loadNextQuestion]);

  useEffect(() => {
    if (gameState.gameStarted && gameState.timeLeft > 0 && !gameState.showResult) {
      const timer = setTimeout(() => {
        dispatch({ type: 'UPDATE_TIME', payload: gameState.timeLeft - 1 });
      }, 1000);
      return () => clearTimeout(timer);
    } else if (gameState.timeLeft === 0 && !gameState.showResult && !showTimeoutModal) {
      // Mostrar modal de timeout em vez de processar imediatamente
      setShowTimeoutModal(true);
    }
  }, [gameState.timeLeft, gameState.gameStarted, gameState.showResult, showTimeoutModal]);

  // Efeito para aviso sonoro quando tempo está crítico
  useEffect(() => {
    // Limpar intervalo anterior sempre que as dependências mudam
    dispatch({ type: 'SET_WARNING_INTERVAL', payload: null });

    if (gameState.gameStarted && gameState.timeLeft <= 5 && gameState.timeLeft > 0 && !gameState.showResult) {
      console.log('Iniciando aviso sonoro - tempo crítico:', gameState.timeLeft);
      // Iniciar intervalo de aviso sonoro
      const interval = setInterval(() => {
        console.log('Tocando beep de aviso - tempo:', gameState.timeLeft);
        playWarningSound();
      }, 1000); // Toca a cada segundo
      dispatch({ type: 'SET_WARNING_INTERVAL', payload: interval });
    }

    // Cleanup quando o componente desmonta
    return () => {
      if (gameState.warningInterval) {
        console.log('Limpando intervalo de aviso sonoro');
        clearInterval(gameState.warningInterval);
        dispatch({ type: 'SET_WARNING_INTERVAL', payload: null });
      }
    };
  }, [gameState.timeLeft, gameState.gameStarted, gameState.showResult, gameState.warningInterval, playWarningSound]);

  const startGame = async () => {
    // Tocar som animador de início
    await playStartSound();

    dispatch({ type: 'START_GAME' });
    loadNextQuestion();
  };

  const handleAnswer = useCallback((answerIndex: number) => {
    if (!gameState.currentQuestion || gameState.showResult) return;

    const correct = answerIndex === gameState.currentQuestion.correctAnswer;
    const timeBonus = Math.max(0, gameState.timeLeft * 10);

    // Funções de som locais
    const playCorrectSoundLocal = async () => {
      setTimeout(() => playSound(523, 0.15, 'sine'), 0);
      setTimeout(() => playSound(659, 0.15, 'sine'), 150);
      setTimeout(() => playSound(784, 0.3, 'sine'), 300);
    };

    const playWrongSoundLocal = async () => {
      setTimeout(() => playSound(400, 0.1, 'sawtooth'), 0);
      setTimeout(() => playSound(300, 0.1, 'sawtooth'), 100);
      setTimeout(() => playSound(200, 0.2, 'sawtooth'), 200);
      setTimeout(() => playSound(150, 0.3, 'sawtooth'), 300);
    };

    // Feedback tátil e sonoro
    if (correct) {
      vibrate(100); // Vibração curta para acertos
      playCorrectSoundLocal(); // Som para acerto
      // Limpar tentativas erradas desta pergunta
      setWrongAttempts(prev => {
        const newSet = new Set(prev);
        newSet.clear(); // Limpar todas as tentativas erradas da pergunta atual
        return newSet;
      });
    } else {
      vibrate(500); // Vibração longa para erros
      playWrongSoundLocal(); // Som para erro
      // Adicionar à lista de tentativas erradas
      setWrongAttempts(prev => new Set(prev).add(answerIndex));
      // Não processar como resposta final - permitir tentar novamente
      return;
    }

    dispatch({
      type: 'SUBMIT_ANSWER',
      payload: { answerIndex, isCorrect: correct, timeBonus }
    });

    // Resetar animação após 1 segundo
    setTimeout(() => {
      dispatch({ type: 'SET_SHAKE_ANIMATION', payload: null });
    }, 1000);

    setTimeout(() => {
      // Verificar se é a última pergunta antes de incrementar
      if (gameState.questionNumber >= loadedQuestions.length) {
        dispatch({ type: 'FINISH_GAME' });
      } else {
        dispatch({ type: 'NEXT_QUESTION' });
        const nextQuestion = loadedQuestions[gameState.questionNumber];
        dispatch({ type: 'LOAD_QUESTION', payload: nextQuestion });
        // Limpar tentativas erradas para nova pergunta
        setWrongAttempts(new Set());
      }
    }, 2000);
  }, [gameState, loadedQuestions, playSound]);

  const resetGame = () => {
    setWrongAttempts(new Set());
    dispatch({ type: 'RESET_GAME' });
  };

  // Efeito para tocar som de fim de jogo
  useEffect(() => {
    if (gameState.gameFinished) {
      playGameOverSound();
    }
  }, [gameState.gameFinished, playGameOverSound]);

  // Suporte a navegação por teclado
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (!gameState.currentQuestion || gameState.showResult) return;

      switch (event.key) {
        case 'ArrowUp':
          event.preventDefault();
          setFocusedOption(prev =>
            prev === null || prev === 0 ? gameState.currentQuestion!.choices.length - 1 : prev - 1
          );
          break;
        case 'ArrowDown':
          event.preventDefault();
          setFocusedOption(prev =>
            prev === null || prev === gameState.currentQuestion!.choices.length - 1 ? 0 : prev + 1
          );
          break;
        case 'Enter':
        case ' ':
          event.preventDefault();
          if (focusedOption !== null) {
            handleAnswer(focusedOption);
          }
          break;
        case '1':
        case '2':
        case '3':
        case '4':
          event.preventDefault();
          const optionIndex = parseInt(event.key) - 1;
          if (optionIndex < gameState.currentQuestion!.choices.length) {
            handleAnswer(optionIndex);
          }
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [gameState.currentQuestion, gameState.showResult, focusedOption, handleAnswer]);

  if (gameState.gameFinished) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 flex items-center justify-center px-4 py-8">
        <main className="w-full max-w-md">
          <div className="bg-white rounded-2xl p-8 shadow-lg text-center">
            <div className="text-6xl mb-4">🎉</div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Parabéns!
            </h1>
            <p className="text-gray-600 mb-6">
              Você completou o modo treino!
            </p>

            <div className="bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-xl p-6 mb-6">
              <div className="text-2xl font-bold">{gameState.score}</div>
              <div className="text-sm opacity-90">Pontos Totais</div>
            </div>

            <div className="space-y-3">
              <button
                onClick={resetGame}
                className="w-full bg-gradient-to-r from-indigo-500 to-purple-600 text-white rounded-xl py-3 font-semibold hover:shadow-lg active:scale-95 transition-all duration-300"
              >
                Jogar Novamente
              </button>

              <button
                onClick={() => router.push('/play')}
                className="w-full bg-gray-200 text-gray-700 rounded-xl py-3 font-semibold hover:bg-gray-300 active:scale-95 transition-all duration-300"
              >
                Voltar ao Menu
              </button>
            </div>
          </div>
        </main>

        {/* Confetti para final do jogo */}
        <Confetti
          width={window.innerWidth}
          height={window.innerHeight}
          recycle={false}
          numberOfPieces={300}
          gravity={0.2}
        />
      </div>
    );
  }

  if (!gameState.gameStarted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 flex items-center justify-center px-4 py-8">
        <main className="w-full max-w-md">
          <div className="bg-white rounded-2xl p-6 sm:p-8 shadow-lg">
            <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4 text-center">
              Você está pronto?
            </h1>

            {/* Loading state */}
            {questionsLoading && (
              <div className="text-center mb-6">
                <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600 mb-2"></div>
                <p className="text-gray-600">Carregando questões...</p>
              </div>
            )}

            {/* Error state */}
            {questionsError && (
              <div className="bg-red-50 border border-red-200 rounded-xl p-4 mb-6">
                <p className="text-red-800 text-sm">
                  Erro ao carregar questões: {questionsError}
                </p>
              </div>
            )}

            {/* Toggle Timer */}
            <div className="mb-6">
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-xl">
                <span className="text-sm font-medium text-gray-700">Mostrar timer</span>
                <button
                  onClick={() => setShowTimer(!showTimer)}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors duration-300 ${
                    showTimer ? 'bg-indigo-600' : 'bg-gray-300'
                  }`}
                >
                  <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform duration-300 ${
                      showTimer ? 'translate-x-6' : 'translate-x-1'
                    }`}
                  />
                </button>
              </div>
            </div>

            <div className="space-y-3 sm:space-y-4">
              <button
                onClick={startGame}
                disabled={questionsLoading || loadedQuestions.length === 0}
                className="w-full bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-xl py-4 sm:py-5 font-bold text-lg sm:text-xl hover:shadow-lg active:scale-95 transition-all duration-300 shadow-green-200 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                🚀 START
              </button>

              <button
                onClick={() => router.push('/home')}
                className="w-full bg-gray-200 text-gray-700 rounded-xl py-3 font-semibold hover:bg-gray-300 active:scale-95 transition-all duration-300"
              >
                Voltar para a home
              </button>
            </div>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 pb-4">
      <main className="pt-8 sm:pt-12 px-4 pb-4">
        <div className="max-w-md mx-auto">
          {/* Instruções de acessibilidade - apenas para leitores de tela */}
          <div className="sr-only" aria-live="polite">
            Modo treino do quiz. Use as setas para cima e para baixo para navegar entre as opções, Enter ou Espaço para selecionar, ou pressione 1-4 para escolher diretamente.
          </div>
          {/* Header do jogo */}
          <div className="flex justify-between items-center mb-4">
            <div className="text-sm text-gray-600">
              Pergunta {gameState.questionNumber}/{loadedQuestions.length}
            </div>
            <div className="text-sm font-semibold text-gray-900">
              {gameState.score} pts
            </div>
          </div>

          {/* Timer - Sempre reserva espaço */}
          <div className="mb-4 min-h-[60px] flex items-end">
            {(showTimer || gameState.timeLeft <= 5) && (
              <div className="w-full" role="timer" aria-live="polite" aria-label={`Tempo restante: ${gameState.timeLeft} segundos`}>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm font-medium text-gray-700">Tempo</span>
                  <span className={`text-lg font-bold ${gameState.timeLeft <= 5 ? 'text-red-500 animate-pulse' : 'text-gray-900'}`}>
                    {gameState.timeLeft <= 5 ? `⏰ ${gameState.timeLeft}s` : `${gameState.timeLeft}s`}
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2" role="progressbar" aria-valuenow={gameState.timeLeft} aria-valuemin={0} aria-valuemax={gameState.currentQuestion?.timeLimit || 30}>
                  <div
                    className={`h-2 rounded-full transition-all duration-1000 ${
                      gameState.timeLeft <= 5 ? 'bg-red-500' : 'bg-indigo-500'
                    }`}
                    style={{
                      width: gameState.timeLeft <= 5
                        ? `${(gameState.timeLeft / 5) * 100}%`  // Barra baseada nos 5 segundos finais
                        : `${(gameState.timeLeft / (gameState.currentQuestion?.timeLimit || 30)) * 100}%`  // Barra baseada no tempo total
                    }}
                  ></div>
                </div>
              </div>
            )}
          </div>

          {/* Questão */}
          {gameState.currentQuestion && (
            <motion.div
              className="bg-white rounded-2xl p-4 sm:p-6 shadow-lg mb-4"
              animate={gameState.shakeAnimation === 'correct' ? {
                x: [0, -5, 5, -5, 5, 0],
                transition: { duration: 0.5, ease: "easeInOut" }
              } : gameState.shakeAnimation === 'wrong' ? {
                x: [0, -10, 10, -10, 10, -5, 5, 0],
                transition: { duration: 0.8, ease: "easeInOut" }
              } : {}}
              role="main"
              aria-labelledby="question-text"
            >
              <div className="flex items-center mb-3">
                <span className="bg-indigo-100 text-indigo-700 text-xs font-semibold px-3 py-1 rounded-full" aria-label={`Categoria: ${gameState.currentQuestion.skill}`}>
                  {gameState.currentQuestion.skill}
                </span>
              </div>

              <h2 id="question-text" className="text-lg sm:text-xl font-bold text-gray-900 mb-4 sm:mb-6 leading-relaxed">
                {gameState.currentQuestion.statement}
              </h2>

              <div className="space-y-2 sm:space-y-3" role="radiogroup" aria-labelledby="question-text">
                {gameState.currentQuestion.choices.map((choice, index) => (
                  <button
                    key={index}
                    onClick={() => handleAnswer(index)}
                    disabled={gameState.showResult}
                    className={`w-full text-left p-3 sm:p-4 rounded-xl border-2 transition-all duration-300 ${
                      gameState.showResult
                        ? index === gameState.currentQuestion?.correctAnswer
                          ? 'bg-green-100 border-green-500 text-green-800'
                          : index === gameState.selectedAnswer
                          ? 'bg-red-100 border-red-500 text-red-800'
                          : 'bg-gray-50 border-gray-200 text-gray-500'
                        : wrongAttempts.has(index)
                        ? 'bg-red-50 border-red-300 text-red-700 animate-pulse'
                        : focusedOption === index
                        ? 'bg-indigo-50 border-indigo-400 ring-2 ring-indigo-200'
                        : 'bg-white border-gray-200 hover:border-indigo-300 hover:bg-indigo-50 active:scale-95'
                    }`}
                    role="radio"
                    aria-checked={gameState.selectedAnswer === index}
                    aria-disabled={gameState.showResult}
                    aria-label={`Opção ${String.fromCharCode(65 + index)}: ${choice}${
                      gameState.showResult
                        ? index === gameState.currentQuestion?.correctAnswer
                          ? ' - Resposta correta'
                          : index === gameState.selectedAnswer
                          ? ' - Sua resposta'
                          : ''
                        : wrongAttempts.has(index)
                        ? ' - Tentativa incorreta, tente novamente'
                        : ''
                    }`}
                    onFocus={() => setFocusedOption(index)}
                    onMouseEnter={() => setFocusedOption(index)}
                    onMouseLeave={() => setFocusedOption(null)}
                  >
                    <div className="flex items-center">
                      <span className={`w-6 h-6 rounded-full border-2 flex items-center justify-center mr-3 text-sm font-bold ${
                        gameState.showResult
                          ? index === gameState.currentQuestion?.correctAnswer
                            ? 'bg-green-500 border-green-500 text-white'
                            : index === gameState.selectedAnswer
                            ? 'bg-red-500 border-red-500 text-white'
                            : 'border-gray-300 text-gray-400'
                          : 'border-gray-300 text-gray-600'
                      }`}>
                        {String.fromCharCode(65 + index)}
                      </span>
                      <span className="flex-1">{choice}</span>
                      {gameState.showResult && index === gameState.currentQuestion?.correctAnswer && (
                        <span className="text-green-600 ml-2" aria-label="resposta correta">✓</span>
                      )}
                      {gameState.showResult && index === gameState.selectedAnswer && index !== gameState.currentQuestion?.correctAnswer && (
                        <span className="text-red-600 ml-2" aria-label="sua resposta">✗</span>
                      )}
                    </div>
                  </button>
                ))}
              </div>
            </motion.div>
          )}

          {/* Resultado temporário */}
          {gameState.showResult && (
            <div
              className={`text-center p-3 rounded-xl mb-3 ${
                gameState.isCorrect ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
              }`}
              role="status"
              aria-live="assertive"
              aria-label={
                gameState.selectedAnswer === -1
                  ? "Tempo esgotado! A resposta correta é mostrada acima."
                  : gameState.isCorrect
                  ? `Correto! Você ganhou ${100 + Math.max(0, gameState.timeLeft * 10)} pontos.`
                  : "Incorreto. A resposta correta é mostrada acima."
              }
            >
              <div className="text-xl mb-1">
                {gameState.selectedAnswer === -1 ? '⏰' : gameState.isCorrect ? '🎉' : '😞'}
              </div>
              <div className="font-semibold text-sm">
                {gameState.selectedAnswer === -1 ? 'Tempo Esgotado!' : gameState.isCorrect ? 'Correto!' : 'Incorreto'}
              </div>
              {gameState.isCorrect && gameState.selectedAnswer !== -1 && (
                <div className="text-xs mt-1">
                  +{100 + Math.max(0, gameState.timeLeft * 10)} pontos
                </div>
              )}
            </div>
          )}

          {/* Botão sair */}
          <div className="text-center mt-2">
            <button
              onClick={resetGame}
              className="text-gray-500 hover:text-gray-700 transition-colors duration-300 text-sm"
            >
              Sair do desafio
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}

