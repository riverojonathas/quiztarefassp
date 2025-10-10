'use client';

import { LeaderboardEntry } from '../domain/models';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';

interface LeaderboardProps {
  entries: LeaderboardEntry[];
}

export function Leaderboard({ entries }: LeaderboardProps) {
  const sortedEntries = [...entries].sort((a, b) => b.score - a.score);

  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle>Ranking</CardTitle>
      </CardHeader>
      <CardContent>
        <ul className="space-y-2">
          {sortedEntries.map((entry, index) => (
            <li key={`${entry.scope}-${entry.scopeId}-${entry.userId}`} className="flex justify-between items-center">
              <span>{index + 1}. {entry.userId}</span>
              <span className="font-bold">{entry.score} pts</span>
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  );
}