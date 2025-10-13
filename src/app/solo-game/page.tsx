'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';

interface Question {
  id: string;
  statement: string;
  choices: string[];
  correctAnswer: number;
  skill: string;
  timeLimit: number;
}

export default function SoloGamePage() {
  const router = useRouter();

  // AudioContext compartilhado para melhor performance
  const [audioContext, setAudioContext] = useState<AudioContext | null>(null);

  // Funções para gerar sons usando Web Audio API
  const playSound = (frequency: number, duration: number, type: OscillatorType = 'sine') => {
    try {
      let ctx = audioContext;
      if (!ctx) {
        const AudioContextClass = window.AudioContext || (window as typeof window & { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
        ctx = new AudioContextClass();
        setAudioContext(ctx);
      }

      // Garantir que o AudioContext esteja ativo
      if (ctx.state === 'suspended') {
        ctx.resume();
      }

      const oscillator = ctx.createOscillator();
      const gainNode = ctx.createGain();

      oscillator.connect(gainNode);
      gainNode.connect(ctx.destination);

      oscillator.frequency.value = frequency;
      oscillator.type = type;

      gainNode.gain.setValueAtTime(0.3, ctx.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + duration);

      oscillator.start(ctx.currentTime);
      oscillator.stop(ctx.currentTime + duration);
    } catch (error) {
      console.warn('Web Audio API not supported:', error);
    }
  };

  const playCorrectSound = () => {
    // Sequência animada de acerto: C4 - E4 - G4 (dó-ré-mi)
    setTimeout(() => playSound(523, 0.15, 'sine'), 0);   // C4
    setTimeout(() => playSound(659, 0.15, 'sine'), 150); // E4
    setTimeout(() => playSound(784, 0.3, 'sine'), 300);  // G4
  };

  const playWrongSound = () => {
    // Som de erro animado: descida rápida com efeito de "wah"
    setTimeout(() => playSound(400, 0.1, 'sawtooth'), 0);   // Mi grave
    setTimeout(() => playSound(300, 0.1, 'sawtooth'), 100); // Ré grave
    setTimeout(() => playSound(200, 0.2, 'sawtooth'), 200); // Lá baixo
    setTimeout(() => playSound(150, 0.3, 'sawtooth'), 300); // Sol baixo
  };
  const playGameOverSound = () => {
    // Sequência de notas para fim de jogo
    setTimeout(() => playSound(523, 0.2), 0);   // C
    setTimeout(() => playSound(659, 0.2), 200); // E
    setTimeout(() => playSound(784, 0.4), 400); // G
  };

  const playWarningSound = () => {
    console.log('Tentando tocar som de aviso');
    // Som de aviso para tempo crítico - beep agudo e urgente
    playSound(1000, 0.15, 'square'); // Beep agudo mais longo para ser mais perceptível
  };

  const playStartSound = () => {
    // Sequência animada e empolgante para início do jogo: subida rápida e energética
    setTimeout(() => playSound(523, 0.1, 'sine'), 0);   // C4
    setTimeout(() => playSound(659, 0.1, 'sine'), 100); // E4
    setTimeout(() => playSound(784, 0.1, 'sine'), 200); // G4
    setTimeout(() => playSound(1047, 0.2, 'sine'), 300); // C5 - nota alta para empolgação
    setTimeout(() => playSound(1319, 0.3, 'triangle'), 400); // E5 - som mais rico para clímax
  };

  // Função para vibração
  const vibrate = (duration: number) => {
    if (navigator.vibrate) {
      navigator.vibrate(duration);
    }
  };
  const [currentQuestion, setCurrentQuestion] = useState<Question | null>(null);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [timeLeft, setTimeLeft] = useState(30);
  const [score, setScore] = useState(0);
  const [questionNumber, setQuestionNumber] = useState(1);
  const [gameStarted, setGameStarted] = useState(false);
  const [gameFinished, setGameFinished] = useState(false);
  const [showResult, setShowResult] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [warningInterval, setWarningInterval] = useState<NodeJS.Timeout | null>(null);
  const [shakeAnimation, setShakeAnimation] = useState<'correct' | 'wrong' | null>(null);
  const [showTimer, setShowTimer] = useState(true);

  // Mock questions for solo play
  const mockQuestions: Question[] = [
    {
      id: '1',
      statement: 'Qual é a capital do Brasil?',
      choices: ['São Paulo', 'Rio de Janeiro', 'Brasília', 'Salvador'],
      correctAnswer: 2,
      skill: 'Geografia',
      timeLimit: 30
    },
    {
      id: '2',
      statement: 'Quanto é 15 + 27?',
      choices: ['42', '41', '43', '40'],
      correctAnswer: 0,
      skill: 'Matemática',
      timeLimit: 20
    },
    {
      id: '3',
      statement: 'Quem escreveu "Dom Quixote"?',
      choices: ['Machado de Assis', 'Miguel de Cervantes', 'José Saramago', 'Gabriel García Márquez'],
      correctAnswer: 1,
      skill: 'Literatura',
      timeLimit: 25
    }
  ];

  useEffect(() => {
    if (gameStarted && timeLeft > 0 && !showResult) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timer);
    } else if (timeLeft === 0 && !showResult) {
      handleAnswer(-1); // Time out
    }
  }, [timeLeft, gameStarted, showResult]);

  // Efeito para aviso sonoro quando tempo está crítico
  useEffect(() => {
    // Limpar intervalo anterior sempre que as dependências mudam
    if (warningInterval) {
      clearInterval(warningInterval);
      setWarningInterval(null);
    }

    if (gameStarted && timeLeft <= 5 && timeLeft > 0 && !showResult) {
      console.log('Iniciando aviso sonoro - tempo crítico:', timeLeft);
      // Iniciar intervalo de aviso sonoro
      const interval = setInterval(() => {
        console.log('Tocando beep de aviso - tempo:', timeLeft);
        playWarningSound();
      }, 1000); // Toca a cada segundo
      setWarningInterval(interval);
    }

    // Cleanup quando o componente desmonta
    return () => {
      if (warningInterval) {
        console.log('Limpando intervalo de aviso sonoro');
        clearInterval(warningInterval);
        setWarningInterval(null);
      }
    };
  }, [timeLeft, gameStarted, showResult]); // Removido warningInterval das dependências para evitar loops

  const startGame = () => {
    // Inicializar AudioContext na primeira interação do usuário
    if (!audioContext) {
      try {
        const AudioContextClass = window.AudioContext || (window as typeof window & { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
        const ctx = new AudioContextClass();
        setAudioContext(ctx);
        // Tentar resumir o contexto (alguns navegadores requerem isso)
        if (ctx.state === 'suspended') {
          ctx.resume();
        }
      } catch (error) {
        console.warn('Erro ao inicializar AudioContext:', error);
      }
    }

    // Tocar som animador de início
    playStartSound();

    setGameStarted(true);
    loadNextQuestion();
  };

  const loadNextQuestion = () => {
    const question = mockQuestions[questionNumber - 1];
    setCurrentQuestion(question);
    setTimeLeft(question.timeLimit);
    setSelectedAnswer(null);
    setShowResult(false);
  };

  const handleAnswer = (answerIndex: number) => {
    if (!currentQuestion || showResult) return;

    setSelectedAnswer(answerIndex);
    const correct = answerIndex === currentQuestion.correctAnswer;
    setIsCorrect(correct);

    // Definir tipo de animação de tremor
    setShakeAnimation(correct ? 'correct' : 'wrong');

    // Feedback tátil e sonoro
    if (correct) {
      vibrate(100); // Vibração curta para acertos
      playCorrectSound(); // Som para acerto
    } else {
      vibrate(500); // Vibração longa para erros
      playWrongSound(); // Som para erro
    }

    if (correct) {
      const timeBonus = Math.max(0, timeLeft * 10);
      const basePoints = 100;
      setScore(prev => prev + basePoints + timeBonus);
    }

    setShowResult(true);

    // Resetar animação após 1 segundo
    setTimeout(() => {
      setShakeAnimation(null);
    }, 1000);

    setTimeout(() => {
      // Verificar se é a última pergunta antes de incrementar
      if (questionNumber >= mockQuestions.length) {
        setGameFinished(true);
      } else {
        setQuestionNumber(prev => prev + 1);
        loadNextQuestion();
      }
    }, 2000);
  };

  const resetGame = () => {
    // Limpar intervalo de aviso sonoro
    if (warningInterval) {
      clearInterval(warningInterval);
      setWarningInterval(null);
    }

    setGameStarted(false);
    setGameFinished(false);
    setScore(0);
    setQuestionNumber(1);
    setCurrentQuestion(null);
    setSelectedAnswer(null);
    setShowResult(false);
    setTimeLeft(30);
    setShowTimer(true);
  };

  // Efeito para tocar som de fim de jogo
  useEffect(() => {
    if (gameFinished) {
      playGameOverSound();
    }
  }, [gameFinished]);

  if (gameFinished) {
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
              <div className="text-2xl font-bold">{score}</div>
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
      </div>
    );
  }

  if (!gameStarted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 flex items-center justify-center px-4 py-8">
        <main className="w-full max-w-md">
          <div className="bg-white rounded-2xl p-6 sm:p-8 shadow-lg">
            <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4 text-center">
              Você está pronto?
            </h1>

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
                className="w-full bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-xl py-4 sm:py-5 font-bold text-lg sm:text-xl hover:shadow-lg active:scale-95 transition-all duration-300 shadow-green-200"
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
          {/* Header do jogo */}
          <div className="flex justify-between items-center mb-4">
            <div className="text-sm text-gray-600">
              Pergunta {questionNumber}/3
            </div>
            <div className="text-sm font-semibold text-gray-900">
              {score} pts
            </div>
          </div>

          {/* Timer - Sempre reserva espaço */}
          <div className="mb-4 min-h-[60px] flex items-end">
            {(showTimer || timeLeft <= 5) && (
              <div className="w-full">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm font-medium text-gray-700">Tempo</span>
                  <span className={`text-lg font-bold ${timeLeft <= 5 ? 'text-red-500 animate-pulse' : 'text-gray-900'}`}>
                    {timeLeft <= 5 ? `⏰ ${timeLeft}s` : `${timeLeft}s`}
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className={`h-2 rounded-full transition-all duration-1000 ${
                      timeLeft <= 5 ? 'bg-red-500' : 'bg-indigo-500'
                    }`}
                    style={{
                      width: timeLeft <= 5
                        ? `${(timeLeft / 5) * 100}%`  // Barra baseada nos 5 segundos finais
                        : `${(timeLeft / (currentQuestion?.timeLimit || 30)) * 100}%`  // Barra baseada no tempo total
                    }}
                  ></div>
                </div>
              </div>
            )}
          </div>

          {/* Questão */}
          {currentQuestion && (
            <motion.div
              className="bg-white rounded-2xl p-4 sm:p-6 shadow-lg mb-4"
              animate={shakeAnimation === 'correct' ? {
                x: [0, -5, 5, -5, 5, 0],
                transition: { duration: 0.5, ease: "easeInOut" }
              } : shakeAnimation === 'wrong' ? {
                x: [0, -10, 10, -10, 10, -5, 5, 0],
                transition: { duration: 0.8, ease: "easeInOut" }
              } : {}}
            >
              <div className="flex items-center mb-3">
                <span className="bg-indigo-100 text-indigo-700 text-xs font-semibold px-3 py-1 rounded-full">
                  {currentQuestion.skill}
                </span>
              </div>

              <h2 className="text-lg sm:text-xl font-bold text-gray-900 mb-4 sm:mb-6 leading-relaxed">
                {currentQuestion.statement}
              </h2>

              <div className="space-y-2 sm:space-y-3">
                {currentQuestion.choices.map((choice, index) => (
                  <button
                    key={index}
                    onClick={() => handleAnswer(index)}
                    disabled={showResult}
                    className={`w-full text-left p-3 sm:p-4 rounded-xl border-2 transition-all duration-300 ${
                      showResult
                        ? index === currentQuestion.correctAnswer
                          ? 'bg-green-100 border-green-500 text-green-800'
                          : index === selectedAnswer
                          ? 'bg-red-100 border-red-500 text-red-800'
                          : 'bg-gray-50 border-gray-200 text-gray-500'
                        : 'bg-white border-gray-200 hover:border-indigo-300 hover:bg-indigo-50 active:scale-95'
                    }`}
                  >
                    <div className="flex items-center">
                      <span className={`w-6 h-6 rounded-full border-2 flex items-center justify-center mr-3 text-sm font-bold ${
                        showResult
                          ? index === currentQuestion.correctAnswer
                            ? 'bg-green-500 border-green-500 text-white'
                            : index === selectedAnswer
                            ? 'bg-red-500 border-red-500 text-white'
                            : 'border-gray-300 text-gray-400'
                          : 'border-gray-300 text-gray-600'
                      }`}>
                        {String.fromCharCode(65 + index)}
                      </span>
                      <span className="flex-1">{choice}</span>
                      {showResult && index === currentQuestion.correctAnswer && (
                        <span className="text-green-600 ml-2">✓</span>
                      )}
                      {showResult && index === selectedAnswer && index !== currentQuestion.correctAnswer && (
                        <span className="text-red-600 ml-2">✗</span>
                      )}
                    </div>
                  </button>
                ))}
              </div>
            </motion.div>
          )}

          {/* Resultado temporário */}
          {showResult && (
            <div className={`text-center p-3 rounded-xl mb-3 ${
              isCorrect ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
            }`}>
              <div className="text-xl mb-1">
                {isCorrect ? '🎉' : '😞'}
              </div>
              <div className="font-semibold text-sm">
                {isCorrect ? 'Correto!' : 'Incorreto'}
              </div>
              {isCorrect && (
                <div className="text-xs mt-1">
                  +{100 + Math.max(0, timeLeft * 10)} pontos
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