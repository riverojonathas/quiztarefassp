'use client';

import Link from 'next/link';
import { useSessionStore } from '../../state/useSessionStore';
import { useLeaderboard } from '../../hooks/useLeaderboard';
import { useGlobalStats } from '../../hooks/useGlobalStats';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Leaderboard } from '../../components/Leaderboard';
import { Users, Gamepad2, FileQuestion, Loader2 } from 'lucide-react';

export default function RankingPage() {
  const user = useSessionStore((state) => state.user);
  const lastScore = useSessionStore((state) => state.lastScore);

  // Usar o hook personalizado para leaderboard
  const { entries, loading: leaderboardLoading, error: leaderboardError } = useLeaderboard();

  // Usar o hook para estatísticas globais
  const { stats, loading: statsLoading, error: statsError } = useGlobalStats();

  return (
    <div className="min-h-screen bg-gradient-to-br from-yellow-500 to-orange-600 p-3 sm:p-4">
      <div className="container mx-auto max-w-md space-y-4 sm:space-y-6">
        {/* Estatísticas Globais */}
        <Card className="bg-white/90 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="w-5 h-5 text-blue-500" />
              Estatísticas Globais
            </CardTitle>
          </CardHeader>
          <CardContent>
            {statsLoading ? (
              <div className="flex items-center justify-center py-4">
                <Loader2 className="w-6 h-6 animate-spin text-blue-500" />
              </div>
            ) : statsError ? (
              <p className="text-red-500 text-center">{statsError}</p>
            ) : (
              <div className="grid grid-cols-3 gap-4 text-center">
                <div>
                  <div className="flex items-center justify-center mb-1">
                    <Users className="w-4 h-4 text-blue-500" />
                  </div>
                  <div className="text-2xl font-bold text-blue-600">{stats.totalUsers.toLocaleString()}</div>
                  <div className="text-xs text-gray-600">Usuários</div>
                </div>
                <div>
                  <div className="flex items-center justify-center mb-1">
                    <Gamepad2 className="w-4 h-4 text-green-500" />
                  </div>
                  <div className="text-2xl font-bold text-green-600">{stats.totalGames.toLocaleString()}</div>
                  <div className="text-xs text-gray-600">Jogos</div>
                </div>
                <div>
                  <div className="flex items-center justify-center mb-1">
                    <FileQuestion className="w-4 h-4 text-purple-500" />
                  </div>
                  <div className="text-2xl font-bold text-purple-600">{stats.totalQuestions}</div>
                  <div className="text-xs text-gray-600">Questões</div>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Última Pontuação */}
        {lastScore !== null && user && (
          <div className="bg-white rounded-xl border shadow-sm p-6 text-center">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Sua Última Pontuação</h2>
            <div className="text-4xl font-bold text-blue-600 mb-2">{lastScore}</div>
            <p className="text-gray-600">Parabéns, {user.name}!</p>
          </div>
        )}

        {/* Ranking Geral */}
        {leaderboardLoading ? (
          <Card className="w-full max-w-md">
            <CardContent className="flex items-center justify-center py-8">
              <Loader2 className="w-8 h-8 animate-spin text-yellow-500" />
              <span className="ml-2">Carregando ranking...</span>
            </CardContent>
          </Card>
        ) : leaderboardError ? (
          <Card className="w-full max-w-md">
            <CardContent className="text-center py-8">
              <p className="text-red-500">{leaderboardError}</p>
            </CardContent>
          </Card>
        ) : (
          <Leaderboard entries={entries} currentUserId={user?.id} />
        )}

        {/* Botões de Ação */}
        <div className="bg-white rounded-xl border shadow-sm p-4 sm:p-6">
          <div className="space-y-3 sm:space-y-4">
            <Link
              href="/play"
              className="w-full block text-center px-4 sm:px-6 py-3 sm:py-4 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-semibold text-sm sm:text-base"
            >
              🎯 Continuar Jogando
            </Link>
            <Link
              href="/home"
              className="w-full block text-center px-4 sm:px-6 py-3 sm:py-4 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors font-semibold text-sm sm:text-base"
            >
              🏠 Voltar para Home
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}