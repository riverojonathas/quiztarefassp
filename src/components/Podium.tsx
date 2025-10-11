'use client';

import { motion } from 'framer-motion';
import { PlayerState } from '../domain/models';

interface PodiumProps {
  players: PlayerState[];
}

export function Podium({ players }: PodiumProps) {
  const sortedPlayers = [...players].sort((a, b) => b.score - a.score).slice(0, 3);

  const getPositionLabel = (index: number) => {
    switch (index) {
      case 0: return 'Primeiro lugar';
      case 1: return 'Segundo lugar';
      case 2: return 'Terceiro lugar';
      default: return '';
    }
  };

  const getMedalLabel = (index: number) => {
    switch (index) {
      case 0: return 'Medalha de ouro';
      case 1: return 'Medalha de prata';
      case 2: return 'Medalha de bronze';
      default: return '';
    }
  };

  return (
    <div
      className="flex justify-center items-end space-x-4"
      role="region"
      aria-label="Pódio dos três primeiros colocados"
      aria-live="polite"
      aria-atomic="true"
    >
      {sortedPlayers.map((player, index) => (
        <motion.div
          key={player.userId}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.2 }}
          className={`flex flex-col items-center p-4 rounded-lg ${
            index === 0 ? 'bg-yellow-200 h-32' : index === 1 ? 'bg-gray-200 h-24' : 'bg-orange-200 h-20'
          }`}
          role="article"
          aria-label={`${getPositionLabel(index)}: ${player.userId} com ${player.score} pontos`}
        >
          <span
            className="font-bold"
            aria-hidden="true"
          >
            {player.userId}
          </span>
          <span
            aria-hidden="true"
          >
            {player.score} pts
          </span>
          <div
            className="mt-2 text-2xl"
            role="img"
            aria-label={getMedalLabel(index)}
            aria-hidden="false"
          >
            {index === 0 ? '🥇' : index === 1 ? '🥈' : '🥉'}
          </div>
        </motion.div>
      ))}
    </div>
  );
}