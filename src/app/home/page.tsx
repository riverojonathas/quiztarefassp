'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useSessionStore } from '../../state/useSessionStore';
import { Button } from '../../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { LeaderboardEntry } from '../../domain/models';

// Mock ranking data
const mockRanking: LeaderboardEntry[] = [
  { scope: 'geral', scopeId: 'all', userId: 'usuario1', score: 1700 },
  { scope: 'geral', scopeId: 'all', userId: 'usuario2', score: 1600 },
  { scope: 'geral', scopeId: 'all', userId: 'usuario3', score: 1500 },
  { scope: 'geral', scopeId: 'all', userId: 'demo', score: 1400 },
];

export default function HomePage() {
  const user = useSessionStore((state) => state.user);
  const [userRank, setUserRank] = useState<number | null>(null);
  const router = useRouter();

  useEffect(() => {
    if (user) {
      const sortedRanking = mockRanking.sort((a, b) => b.score - a.score);
      const rank = sortedRanking.findIndex(entry => entry.userId === user.id) + 1;
      setUserRank(rank > 0 ? rank : null);
    }
  }, [user]);

  if (!user) {
    router.push('/login');
    return null;
  }

  const handlePlayNow = () => {
    router.push('/lobby');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-500 to-purple-600 p-4">
      <div className="container mx-auto max-w-4xl">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">Bem-vindo, {user.name}!</h1>
          <p className="text-xl text-white/80">Pronto para testar seus conhecimentos?</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {/* Ranking Card */}
          <Card className="bg-white/10 backdrop-blur-sm border-white/20">
            <CardHeader>
              <CardTitle className="text-white">Sua Posição</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center">
                <div className="text-6xl font-bold text-yellow-300 mb-2">
                  {userRank ? `#${userRank}` : 'N/A'}
                </div>
                <p className="text-white/80">no ranking geral</p>
              </div>
            </CardContent>
          </Card>

          {/* Play Now Card */}
          <Card className="bg-white/10 backdrop-blur-sm border-white/20 md:col-span-2">
            <CardHeader>
              <CardTitle className="text-white">Jogar Agora</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-white/80 mb-4">
                Desafie-se em um quiz competitivo! Escolha o modo e jogue contra bots inteligentes.
              </p>
              <Button onClick={handlePlayNow} className="w-full bg-green-500 hover:bg-green-600">
                Jogar Agora
              </Button>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Button
            onClick={() => router.push('/ranking')}
            variant="outline"
            className="bg-white/10 border-white/20 text-white hover:bg-white/20"
          >
            Ver Ranking Completo
          </Button>
          <Button
            onClick={() => router.push('/analytics')}
            variant="outline"
            className="bg-white/10 border-white/20 text-white hover:bg-white/20"
          >
            Minhas Estatísticas
          </Button>
          <Button
            onClick={() => router.push('/lobby')}
            variant="outline"
            className="bg-white/10 border-white/20 text-white hover:bg-white/20"
          >
            Criar/Entrar Sala
          </Button>
        </div>
      </div>
    </div>
  );
}