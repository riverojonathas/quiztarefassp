'use client';

import { useEffect, useState } from 'react';
import { Leaderboard } from '../../components/Leaderboard';
import { LeaderboardEntry } from '../../domain/models';

// Mock data
const mockLeaderboard: LeaderboardEntry[] = [
  { scope: 'geral', scopeId: 'all', userId: 'usuario1', score: 1700 },
  { scope: 'geral', scopeId: 'all', userId: 'usuario2', score: 1600 },
  { scope: 'geral', scopeId: 'all', userId: 'usuario3', score: 1500 },
];

export default function RankingPage() {
  const [entries, setEntries] = useState<LeaderboardEntry[]>([]);

  useEffect(() => {
    setEntries(mockLeaderboard);
  }, []);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-yellow-500 to-orange-600 p-4">
      <Leaderboard entries={entries} />
    </div>
  );
}