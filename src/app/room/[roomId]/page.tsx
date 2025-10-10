'use client';

import { useParams, useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { QuestionCard } from '../../../components/QuestionCard';
import { Timer } from '../../../components/Timer';
import { Scoreboard } from '../../../components/Scoreboard';
import { Podium } from '../../../components/Podium';
import { Question, PlayerState } from '../../../domain/models';
// Mock data for demo
const mockQuestions: Question[] = [
  {
    id: '1',
    statement: 'Quanto é 2 + 2?',
    choices: [
      { id: 'a', text: '3', isCorrect: false },
      { id: 'b', text: '4', isCorrect: true },
      { id: 'c', text: '5', isCorrect: false },
      { id: 'd', text: '6', isCorrect: false },
    ],
    difficulty: 1,
    tags: [],
    timeSuggestedSec: 10,
  },
  {
    id: '2',
    statement: 'Qual é a capital do Brasil?',
    choices: [
      { id: 'a', text: 'São Paulo', isCorrect: false },
      { id: 'b', text: 'Rio de Janeiro', isCorrect: false },
      { id: 'c', text: 'Brasília', isCorrect: true },
      { id: 'd', text: 'Salvador', isCorrect: false },
    ],
    difficulty: 1,
    tags: [],
    timeSuggestedSec: 10,
    imageUrl: 'https://via.placeholder.com/400x200?text=Mapa+do+Brasil',
  },
  {
    id: '3',
    statement: 'Resolva: 5 x 3 = ?',
    choices: [
      { id: 'a', text: '8', isCorrect: false },
      { id: 'b', text: '15', isCorrect: true },
      { id: 'c', text: '12', isCorrect: false },
      { id: 'd', text: '20', isCorrect: false },
    ],
    difficulty: 2,
    tags: [],
    timeSuggestedSec: 15,
  },
];

export default function RoomPage() {
  const { roomId } = useParams();
  const searchParams = useSearchParams();
  const mode = searchParams.get('mode') as 'solo' | 'dupla' || 'solo';
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [streak, setStreak] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [timeUp, setTimeUp] = useState(false);
  const [loading, setLoading] = useState(false);
  const [bot1Score, setBot1Score] = useState(0);
  const [bot1Streak, setBot1Streak] = useState(0);
  const [bot2Score, setBot2Score] = useState(0);
  const [bot2Streak, setBot2Streak] = useState(0);

  const currentQuestion = mockQuestions[currentQuestionIndex];
  const player: PlayerState = {
    userId: 'demo',
    score,
    streak,
    currentDifficulty: 1,
  };
  const bot1: PlayerState = {
    userId: 'bot1',
    score: bot1Score,
    streak: bot1Streak,
    currentDifficulty: 1,
  };
  const bot2: PlayerState | null = mode === 'dupla' ? {
    userId: 'bot2',
    score: bot2Score,
    streak: bot2Streak,
    currentDifficulty: 1,
  } : null;

  const getBotAnswer = (difficulty: number) => {
    // Bot has higher chance to answer correctly based on difficulty
    const correctChance = difficulty === 1 ? 0.8 : difficulty === 2 ? 0.6 : 0.4;
    return Math.random() < correctChance;
  };

  const handleAnswer = async (choiceId: string) => {
    setLoading(true);
    // Simulate delay for loading
    await new Promise(resolve => setTimeout(resolve, 1000));
    const isCorrect = currentQuestion.choices.find(c => c.id === choiceId)?.isCorrect;
    if (isCorrect) {
      setScore(score + 100 + streak * 10);
      setStreak(streak + 1);
    } else {
      setStreak(0);
    }
    // Bot1 answers
    const bot1Correct = getBotAnswer(currentQuestion.difficulty);
    if (bot1Correct) {
      setBot1Score(bot1Score + 100 + bot1Streak * 10);
      setBot1Streak(bot1Streak + 1);
    } else {
      setBot1Streak(0);
    }
    // Bot2 answers if dupla
    if (mode === 'dupla') {
      const bot2Correct = getBotAnswer(currentQuestion.difficulty);
      if (bot2Correct) {
        setBot2Score(bot2Score + 100 + bot2Streak * 10);
        setBot2Streak(bot2Streak + 1);
      } else {
        setBot2Streak(0);
      }
    }
    nextQuestion();
    setLoading(false);
  };

  const nextQuestion = () => {
    if (currentQuestionIndex < mockQuestions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
      setTimeUp(false);
    } else {
      setGameOver(true);
    }
  };

  const handleTimeUp = () => {
    setTimeUp(true);
    setStreak(0);
    setBot1Streak(0);
    if (mode === 'dupla') setBot2Streak(0);
    nextQuestion();
  };

  const players = [player, bot1];
  if (bot2) players.push(bot2);

  if (gameOver) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-purple-500 to-pink-600 p-4">
        <h1 className="text-3xl font-bold mb-8">Fim da Partida!</h1>
        <Podium players={players} />
        <div className="mt-8 space-x-4">
          <button
            onClick={() => navigator.share({ title: 'Meu resultado no Quiz!', text: `Pontuação: ${player.score}` })}
            className="px-4 py-2 bg-purple-500 text-white rounded"
          >
            Compartilhar
          </button>
          <button
            onClick={() => window.location.href = '/ranking'}
            className="px-4 py-2 bg-blue-500 text-white rounded"
          >
            Ver Ranking
          </button>
          <button
            onClick={() => window.location.href = '/analytics'}
            className="px-4 py-2 bg-green-500 text-white rounded"
          >
            Ver Analytics
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-purple-500 to-pink-600 p-4">
      <div className="mb-8">
        <Timer duration={currentQuestion?.timeSuggestedSec || 10} onTimeUp={handleTimeUp} />
      </div>
      {currentQuestion && (
        <QuestionCard
          question={currentQuestion}
          onAnswer={handleAnswer}
          disabled={timeUp || loading}
        />
      )}
      {loading && (
        <div className="mt-4">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>
        </div>
      )}
      <div className="mt-8">
        <Scoreboard players={players} />
      </div>
    </div>
  );
}