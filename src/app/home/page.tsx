'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useSessionStore } from '../../state/useSessionStore';
import { useUserProfile } from '../../hooks/useUserProfile';
import { supabase } from '../../lib/supabase';
import { Button } from '../../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { LeaderboardEntry } from '../../domain/models';
import { useLeaderboard } from '../../hooks/useLeaderboard';
import { motion } from 'framer-motion';
import Confetti from 'react-confetti';
import { useSound } from 'use-sound';
import { createAvatar } from '@dicebear/core';
import { adventurer } from '@dicebear/collection';

export default function HomePage() {
  const user = useSessionStore((state) => state.user);
  const { profile } = useUserProfile(user?.id || null);
  const [userRank, setUserRank] = useState<number | null>(null);
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [xp, setXp] = useState(0);
  const [level, setLevel] = useState(1);
  const [badges, setBadges] = useState<string[]>([]);
  const [streak, setStreak] = useState(0);
  const [showBadges, setShowBadges] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);
  const router = useRouter();

  const [playSuccess] = useSound('/success.mp3', { volume: 0.5 });
  const [playHover] = useSound('/hover.mp3', { volume: 0.3 });

  const { calculateXp, calculateLevel, calculateStreak, getBadges } = useLeaderboard();

  // Função para gerar avatar
  const generateAvatar = (seed: string) => {
    try {
      const avatar = createAvatar(adventurer, { seed });
      return avatar.toDataUri();
    } catch {
      return '/avatar-default.png';
    }
  };

  // Obter nome de exibição (nickname ou nome padrão)
  const displayName = profile?.nickname || user?.name || 'Jogador';

  useEffect(() => {
    if (!user) {
      router.push('/signin');
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

        if (error) {
          console.error('Error loading leaderboard:', error);
          return;
        }

        if (data && data.length > 0) {
          const mappedData = data.map(item => ({
            scope: item.scope,
            scopeId: item.scope_id,
            userId: item.user_id,
            score: item.score
          }));
          setLeaderboard(mappedData);

          const userEntry = mappedData.find(entry => entry.userId === user.id);

          if (userEntry) {
            const rank = mappedData.indexOf(userEntry) + 1;
            setUserRank(rank);
            // Calcular XP baseado na pontuação
            const userXp = calculateXp(userEntry.score);
            setXp(userXp);
            setLevel(calculateLevel(userXp));
            setStreak(calculateStreak(user.id));
            setBadges(getBadges(userEntry.score, streak));
            // Confetti se subiu no ranking
            if (rank <= 3) {
              setShowConfetti(true);
              playSuccess();
              setTimeout(() => setShowConfetti(false), 3000);
            }
          } else {
            // Se o usuário não está no ranking, mostrar posição baseada no total de jogadores + 1
            setUserRank(mappedData.length + 1);
            setXp(0);
            setLevel(1);
            setStreak(0);
            setBadges([]);
          }
        } else {
          // Se não há dados no leaderboard, o usuário é o primeiro
          setUserRank(1);
          setLeaderboard([]);
          setXp(0);
          setLevel(1);
          setStreak(0);
          setBadges([]);
        }
      } catch (error) {
        console.error('Error loading leaderboard:', error);
        // Em caso de erro, definir posição padrão
        setUserRank(1);
        setXp(0);
        setLevel(1);
        setStreak(0);
        setBadges([]);
      } finally {
        setIsLoading(false);
      }
    };

    loadLeaderboard();
  }, [user, router, calculateXp, calculateLevel, calculateStreak, getBadges, playSuccess]);

  const handlePlayNow = () => {
    router.push('/play');
  };

  if (!user) {
    return null;
  }

  return (
    <motion.div className="min-h-screen bg-gradient-to-br from-blue-500 to-purple-600 p-3 sm:p-4 animate-fade-in pb-24" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      {showConfetti && <Confetti />}
      <div className="container mx-auto max-w-4xl sm:max-w-5xl md:max-w-6xl lg:max-w-7xl">
        {/* Header com Avatar */}
        <div className="text-center mb-6 sm:mb-8">
          <motion.img
            src={profile?.avatarSeed ? generateAvatar(profile.avatarSeed) : '/avatar-default.png'}
            alt="Avatar"
            className="w-16 h-16 sm:w-20 sm:h-20 rounded-full mx-auto mb-3 sm:mb-4 border-4 border-white"
            whileHover={{ scale: 1.1 }}
            onClick={() => playHover()}
          />
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white mb-2">Bem-vindo, {displayName}!</h1>
          <p className="text-lg sm:text-xl text-white/80">Pronto para testar seus conhecimentos?</p>
          <p className="text-yellow-300 text-base sm:text-lg">Nível {level} - {xp} XP</p>
        </div>

        {/* Barra de Progresso */}
        <motion.div
          className="w-full bg-gray-200 rounded-full h-3 sm:h-4 mb-6 sm:mb-8 mx-auto max-w-md"
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ duration: 0.5 }}
        >
          <div
            className="bg-yellow-300 h-3 sm:h-4 rounded-full transition-all duration-500"
            style={{ width: `${(xp % 100) / 100 * 100}%` }}
          ></div>
        </motion.div>

        {/* Streak */}
        <div className="text-center mb-4 sm:mb-6">
          <p className="text-white text-base sm:text-lg">Streak: {streak} dias 🔥</p>
          {streak < 7 && <p className="text-red-300 text-sm sm:text-base">Jogue hoje para não perder o streak!</p>}
        </div>

        {/* Badges */}
        <div className="text-center mb-6 sm:mb-8">
          <Button onClick={() => setShowBadges(!showBadges)} className="bg-purple-500 hover:bg-purple-600 text-sm sm:text-base px-4 py-2 sm:px-6 sm:py-3">
            Ver Badges
          </Button>
          {showBadges && (
            <motion.div
              className="mt-3 sm:mt-4 bg-white p-3 sm:p-4 rounded-lg shadow-lg max-w-md mx-auto"
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              {badges.length > 0 ? badges.map(badge => <p key={badge} className="text-gray-800 text-sm sm:text-base">{badge}</p>) : <p className="text-sm sm:text-base">Nenhum badge ainda</p>}
            </motion.div>
          )}
        </div>

        {/* Recomendações */}
        <div className="text-center mb-6 sm:mb-8">
          <p className="text-white text-sm sm:text-base">Recomendação: Continue de onde parou - Quiz de Matemática</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6 mb-6 sm:mb-8">
          {/* Ranking Card */}
          <Card className="bg-white/10 backdrop-blur-sm border-white/20 lg:col-span-1 w-full">
            <CardHeader className="pb-2 sm:pb-4">
              <CardTitle className="text-white text-lg sm:text-xl">Sua Posição</CardTitle>
            </CardHeader>
            <CardContent className="pt-0">
              <div className="text-center">
                <div className="text-4xl sm:text-5xl md:text-6xl font-bold text-yellow-300 mb-2">
                  {isLoading ? '...' : userRank ? `#${userRank}` : 'N/A'}
                </div>
                <p className="text-white/80 text-sm sm:text-base">no ranking geral</p>
              </div>
            </CardContent>
          </Card>

          {/* Play Now Button - Transformed into main CTA */}
          <motion.button
            onClick={() => router.push('/play')}
            className="bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-xl p-6 shadow-lg hover:shadow-xl active:scale-95 transition-all duration-300 focus:outline-none focus:ring-4 focus:ring-green-300 group lg:col-span-2 w-full"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <div className="flex items-center justify-center space-x-4">
              <div className="bg-white/20 rounded-full p-3 group-hover:scale-110 transition-transform duration-300">
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.828 14.828a4 4 0 01-5.656 0M9 10h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <div className="text-center flex-1">
                <h3 className="text-xl sm:text-2xl font-bold">Jogar Agora</h3>
              </div>
              <svg className="w-6 h-6 group-hover:translate-x-1 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </div>
          </motion.button>
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
                  <motion.div
                    key={`${entry.userId}-${index}`}
                    className="flex justify-between items-center text-white"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    whileHover={{ scale: 1.05 }}
                    onHoverStart={() => playHover()}
                  >
                    <span className="flex items-center gap-2">
                      <span className="font-bold text-yellow-300">#{index + 1}</span>
                      <span>Jogador {entry.userId.slice(0, 8)}</span>
                    </span>
                    <span className="font-bold">{entry.score} pts</span>
                  </motion.div>
                ))}
              </div>
            ) : (
              <p className="text-white/80">Nenhum jogo registrado ainda.</p>
            )}
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
          <Button
            onClick={() => router.push('/ranking')}
            variant="outline"
            className="bg-white/10 border-white/20 text-white hover:bg-white/20 py-3 sm:py-4 text-sm sm:text-base"
          >
            Ver Ranking Completo
          </Button>
          <Button
            onClick={() => router.push('/lobby')}
            variant="outline"
            className="bg-white/10 border-white/20 text-white hover:bg-white/20 py-3 sm:py-4 text-sm sm:text-base"
          >
            Criar/Entrar Sala
          </Button>
        </div>

        {/* Navigation Buttons - Replacing Header */}
        <motion.div
          className="fixed bottom-0 left-0 right-0 z-50 bg-gradient-to-r from-blue-50 via-indigo-50 to-purple-50 backdrop-blur-md border-t border-indigo-200/50 shadow-xl pb-safe"
          initial={{ y: 100 }}
          animate={{ y: 0 }}
          transition={{ delay: 0.5, duration: 0.3 }}
        >
          <div className="flex items-center justify-center px-2 py-2 max-w-md mx-auto relative">
            {/* Home Button */}
            <button
              onClick={() => router.push('/home')}
              className="flex flex-col items-center p-2 rounded-lg transition-all duration-300 hover:bg-white/20"
              aria-label="Home"
            >
              <svg className="w-6 h-6 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
              </svg>
              <span className="text-xs font-medium mt-1 text-gray-700">Home</span>
            </button>

            {/* Ranking Button */}
            <button
              onClick={() => router.push('/ranking')}
              className="flex flex-col items-center p-2 rounded-lg transition-all duration-300 hover:bg-white/20"
              aria-label="Ranking"
            >
              <svg className="w-6 h-6 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
              </svg>
              <span className="text-xs font-medium mt-1 text-gray-700">Ranking</span>
            </button>

            {/* Play Button - Central and Highlighted */}
            <div className="mx-4">
              <button
                onClick={() => router.push('/play')}
                className="bg-gradient-to-r from-indigo-500 to-purple-600 text-white rounded-full p-3 shadow-lg hover:shadow-xl active:scale-95 transition-all duration-300 focus:outline-none focus:ring-4 focus:ring-indigo-300 group border-2 border-white/20"
                aria-label="Jogar - Escolher modo de jogo"
              >
                <div className="flex flex-col items-center">
                  <svg className="w-6 h-6 drop-shadow-sm" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.828 14.828a4 4 0 01-5.656 0M9 10h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  <span className="text-xs font-bold mt-1 drop-shadow-sm">JOGAR</span>
                </div>
              </button>
            </div>

            {/* Rooms Button */}
            <button
              onClick={() => router.push('/rooms')}
              className="flex flex-col items-center p-2 rounded-lg transition-all duration-300 hover:bg-white/20"
              aria-label="Salas"
            >
              <svg className="w-6 h-6 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
              <span className="text-xs font-medium mt-1 text-gray-700">Salas</span>
            </button>

            {/* Settings Button */}
            <button
              onClick={() => router.push('/settings')}
              className="flex flex-col items-center p-2 rounded-lg transition-all duration-300 hover:bg-white/20"
              aria-label="Configurações"
            >
              <svg className="w-6 h-6 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              <span className="text-xs font-medium mt-1 text-gray-700">Config</span>
            </button>
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
}