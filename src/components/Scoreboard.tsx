'use client';

import { PlayerState } from '../domain/models';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';

interface ScoreboardProps {
  players: PlayerState[];
}

export function Scoreboard({ players }: ScoreboardProps) {
  const sortedPlayers = [...players].sort((a, b) => b.score - a.score);

  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle>Placar</CardTitle>
      </CardHeader>
      <CardContent>
        <ul className="space-y-2">
          {sortedPlayers.map((player, index) => (
            <li key={player.userId} className="flex justify-between items-center">
              <span>
                {index + 1}. {player.userId} {player.streak > 0 && `🔥${player.streak}`}
              </span>
              <span className="font-bold">{player.score} pts</span>
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  );
}