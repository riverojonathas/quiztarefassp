'use client';

import { motion } from 'framer-motion';
import { PlayerState } from '../domain/models';

interface PodiumProps {
  players: PlayerState[];
}

export function Podium({ players }: PodiumProps) {
  const sortedPlayers = [...players].sort((a, b) => b.score - a.score).slice(0, 3);

  return (
    <div className="flex justify-center items-end space-x-4">
      {sortedPlayers.map((player, index) => (
        <motion.div
          key={player.userId}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.2 }}
          className={`flex flex-col items-center p-4 rounded-lg ${
            index === 0 ? 'bg-yellow-200 h-32' : index === 1 ? 'bg-gray-200 h-24' : 'bg-orange-200 h-20'
          }`}
        >
          <span className="font-bold">{player.userId}</span>
          <span>{player.score} pts</span>
          <div className="mt-2 text-2xl">
            {index === 0 ? '🥇' : index === 1 ? '🥈' : '🥉'}
          </div>
        </motion.div>
      ))}
    </div>
  );
}