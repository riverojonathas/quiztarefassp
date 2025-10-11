'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useSessionStore } from '../../state/useSessionStore';
import { supabase } from '../../lib/supabase';
import { Button } from '../../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { LeaderboardEntry } from '../../domain/models';

export default function HomePage() {
  const user = useSessionStore((state) => state.user);
  const setUser = useSessionStore((state) => state.setUser);
  const [userRank, setUserRank] = useState<number | null>(null);
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    if (!user) {
      router.push('/login');
      return;
    }

    const loadLeaderboard = async () => {
      try {
        const { data, error } = await supabase
          .from('leaderboard')
          .select('*')
          .eq('scope', 'geral')
          .eq('scope_id', 'all')
          .order('score', { ascending: false })
          .limit(10);

        if (!error && data) {
          const mappedData = data.map(item => ({
            scope: item.scope,
            scopeId: item.scope_id,
            userId: item.user_id,
            score: item.score
          }));
          setLeaderboard(mappedData);
          const userEntry = mappedData.find(entry => entry.userId === user.id);
          if (userEntry) {
            setUserRank(mappedData.indexOf(userEntry) + 1);
          }
        }
      } catch (error) {
        console.error('Error loading leaderboard:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadLeaderboard();
  }, [user, router]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setUser(null as any); // Will redirect to login
    router.push('/login');
  };

  if (!user) {
    return null;
  }

  const handlePlayNow = () => {
    router.push('/lobby');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-500 to-purple-600 p-4">
      <div className="container mx-auto max-w-4xl">
        {/* Header with logout */}
        <div className="flex justify-between items-center mb-8">
          <div className="text-center flex-1">
            <h1 className="text-4xl font-bold text-white mb-2">Bem-vindo, {user.name}!</h1>
            <p className="text-xl text-white/80">Pronto para testar seus conhecimentos?</p>
          </div>
          <Button
            onClick={handleLogout}
            variant="outline"
            className="bg-white/10 border-white/20 text-white hover:bg-white/20"
          >
            Sair
          </Button>
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
                  {isLoading ? '...' : userRank ? `#${userRank}` : 'N/A'}
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

        {/* Top Players */}
        <Card className="bg-white/10 backdrop-blur-sm border-white/20 mb-8">
          <CardHeader>
            <CardTitle className="text-white">Top Jogadores</CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <p className="text-white/80">Carregando ranking...</p>
            ) : leaderboard.length > 0 ? (
              <div className="space-y-2">
                {leaderboard.slice(0, 5).map((entry, index) => (
                  <div key={`${entry.userId}-${index}`} className="flex justify-between items-center text-white">
                    <span className="flex items-center gap-2">
                      <span className="font-bold text-yellow-300">#{index + 1}</span>
                      <span>Jogador {entry.userId.slice(0, 8)}</span>
                    </span>
                    <span className="font-bold">{entry.score} pts</span>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-white/80">Nenhum jogo registrado ainda.</p>
            )}
          </CardContent>
        </Card>

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