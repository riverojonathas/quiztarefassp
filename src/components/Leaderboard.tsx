'use client';

import { LeaderboardEntry } from '../domain/models';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Trophy, Medal, Award } from 'lucide-react';
import { motion } from 'framer-motion';
import { useSound } from 'use-sound';

interface LeaderboardProps {
  entries: LeaderboardEntry[];
  currentUserId?: string;
  showPositions?: boolean;
}

export function Leaderboard({ entries, currentUserId, showPositions = true }: LeaderboardProps) {
  const [playHover] = useSound('/hover.mp3', { volume: 0.3 }); // Assumindo que há um arquivo de som

  const sortedEntries = [...entries].sort((a, b) => b.score - a.score);

  const getPositionIcon = (position: number) => {
    switch (position) {
      case 1:
        return <Trophy className="w-5 h-5 text-yellow-500" />;
      case 2:
        return <Medal className="w-5 h-5 text-gray-400" />;
      case 3:
        return <Award className="w-5 h-5 text-amber-600" />;
      default:
        return <span className="w-5 h-5 flex items-center justify-center text-sm font-bold text-gray-500">{position}</span>;
    }
  };

  const getPositionStyle = (position: number, isCurrentUser: boolean) => {
    if (isCurrentUser) {
      return 'bg-blue-50 border border-blue-200 shadow-sm';
    }

    switch (position) {
      case 1:
        return 'bg-gradient-to-r from-yellow-50 to-yellow-100 border border-yellow-200';
      case 2:
        return 'bg-gradient-to-r from-gray-50 to-gray-100 border border-gray-200';
      case 3:
        return 'bg-gradient-to-r from-amber-50 to-amber-100 border border-amber-200';
      default:
        return 'bg-white border border-gray-100';
    }
  };

  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Trophy className="w-5 h-5 text-yellow-500" />
          Ranking {entries.length > 0 ? `(${entries.length} jogadores)` : ''}
        </CardTitle>
      </CardHeader>
      <CardContent>
        {sortedEntries.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <Trophy className="w-12 h-12 mx-auto mb-2 text-gray-300" />
            <p>Nenhum jogador ainda</p>
          </div>
        ) : (
          <ul className="space-y-2">
            {sortedEntries.map((entry, index) => {
              const position = index + 1;
              const isCurrentUser = currentUserId && entry.userId === currentUserId;
              return (
                <motion.li
                  key={`${entry.scope}-${entry.scopeId}-${entry.userId}`}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  whileHover={{ scale: 1.02 }}
                  onHoverStart={() => playHover()}
                  className={`flex items-center justify-between p-3 rounded-lg transition-all ${getPositionStyle(position, !!isCurrentUser)}`}
                >
                  <div className="flex items-center gap-3">
                    {showPositions && getPositionIcon(position)}
                    <span className={`font-medium ${isCurrentUser ? 'text-blue-800 font-semibold' : 'text-gray-800'}`}>
                      {entry.userId} {isCurrentUser && '(Você)'}
                    </span>
                  </div>
                  <span className={`font-bold text-lg ${isCurrentUser ? 'text-blue-600' : 'text-gray-700'}`}>
                    {entry.score.toLocaleString()} pts
                  </span>
                </motion.li>
              );
            })}
          </ul>
        )}
      </CardContent>
    </Card>
  );
}