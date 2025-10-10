'use client';

import { Difficulty } from '../domain/models';

interface DifficultyBadgeProps {
  difficulty: Difficulty;
}

export function DifficultyBadge({ difficulty }: DifficultyBadgeProps) {
  const colors = {
    1: 'bg-green-500',
    2: 'bg-yellow-500',
    3: 'bg-red-500',
  };

  return (
    <span className={`px-2 py-1 rounded text-white text-xs ${colors[difficulty]}`}>
      {difficulty === 1 ? 'Fácil' : difficulty === 2 ? 'Médio' : 'Difícil'}
    </span>
  );
}