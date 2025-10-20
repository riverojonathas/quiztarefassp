'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useSessionStore } from '../../state/useSessionStore';
import { useUserProfile } from '../../hooks/useUserProfile';
import { supabase } from '../../lib/supabase';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Progress } from '../../components/ui/progress';
import { useLeaderboard } from '../../hooks/useLeaderboard';
import { motion } from 'framer-motion';
import Confetti from 'react-confetti';
import { createAvatar } from '@dicebear/core';
import { adventurer } from '@dicebear/collection';
import LoadingSpinner from '../../components/LoadingSpinner';

export default function HomePage() {
  const user = useSessionStore((state) => state.user);
  const isLoadingSession = useSessionStore((state) => state.isLoading);
  const { profile, refreshProfile } = useUserProfile(user?.id || null);
  const [userRank, setUserRank] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [xp, setXp] = useState(0);
  const [level, setLevel] = useState(1);
  const [badges, setBadges] = useState<string[]>([]);
  const [streak, setStreak] = useState(0);
  const [showConfetti, setShowConfetti] = useState(false);
  const router = useRouter();

  // Remover sons que causam 404 errors - substituir por funções vazias
  const playHover = () => {}; // Removido: useSound('/hover.mp3', { volume: 0.3 })
  const playSuccess = () => {}; // Removido: useSound('/success.mp3', { volume: 0.3 })

  const { calculateXp, calculateLevel, calculateStreak, getBadges } = useLeaderboard();

  // Função para gerar avatar
  const generateAvatar = (seed: string) => {
    try {
      const avatar = createAvatar(adventurer, { seed });
      return avatar.toDataUri();
    } catch {
      return '/avatar-default.svg';
    }
  };

  // Obter nome de exibição (nickname ou nome padrão)
  const displayName = profile?.nickname || user?.name || 'Jogador';

  // Verificar se o usuário é professor ou admin
  const isTeacherOrAdmin = profile?.role === 'professor' || profile?.role === 'admin';

  useEffect(() => {
    // If user is not logged in and session is loaded, redirect to signin
    if (!isLoadingSession && !user) {
      router.push('/signin');
      return;
    }

    // Only load data if user is logged in
    if (!isLoadingSession && user) {
      // Refresh profile data when component mounts
      refreshProfile();

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
          const userEntry = mappedData.find(entry => entry.userId === user.id);

          if (userEntry) {
            const rank = mappedData.indexOf(userEntry) + 1;
            setUserRank(rank);
            // Calcular XP baseado na pontuação
            const userXp = calculateXp(userEntry.score);
            setXp(userXp);
            setLevel(calculateLevel(userXp));
            setStreak(calculateStreak(user.id));
            setBadges(getBadges(userEntry.score, calculateStreak(user.id)));
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
  }
  }, [user, isLoadingSession, router, calculateXp, calculateLevel, calculateStreak, getBadges, refreshProfile]);

  // Show loading while session is being initialized
  if (isLoadingSession) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-500 to-purple-600">
        <div className="text-center">
          <LoadingSpinner size="xl" className="text-white mx-auto mb-4" />
          <p className="text-white">Carregando...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <motion.div className="min-h-screen bg-gradient-to-br from-blue-500 to-purple-600 p-3 sm:p-4 animate-fade-in pb-24" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      {showConfetti && <Confetti />}
      <div className="container mx-auto max-w-4xl sm:max-w-5xl md:max-w-6xl lg:max-w-7xl">
        {/* Header com Avatar */}
        <div className="text-center mb-6 sm:mb-8 relative">
          <motion.img
            src={profile?.avatar_seed ? generateAvatar(profile.avatar_seed) : '/avatar-default.svg'}
            alt={`Avatar personalizado de ${displayName}`}
            className="w-16 h-16 sm:w-20 sm:h-20 rounded-full mx-auto mb-3 sm:mb-4 border-4 border-white"
            whileHover={{ scale: 1.1 }}
            onClick={() => playHover()}
          />
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white mb-2">
            {isTeacherOrAdmin ? 'Painel Administrativo' : 'Bem-vindo, ' + displayName + '!'}
          </h1>
          <p className="text-lg sm:text-xl text-white/80">
            {isTeacherOrAdmin ? 'Gerencie questões e conteúdos educacionais' : 'Pronto para testar seus conhecimentos?'}
          </p>
          {!isTeacherOrAdmin && (
            <p className="text-yellow-300 text-base sm:text-lg">Nível {level} - {xp} XP</p>
          )}
        </div>

        {/* Seção de Progresso e Estatísticas - Apenas para estudantes */}
        {!isTeacherOrAdmin && (
          <div className="space-y-6 sm:space-y-8 mb-6 sm:mb-8">
            {/* Barra de Progresso */}
            <Card className="bg-white/10 backdrop-blur-sm border-white/20">
              <CardHeader className="pb-2 sm:pb-3">
                <CardTitle className="text-white text-lg sm:text-xl flex items-center space-x-2">
                  <svg className="w-5 h-5 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span>Seu Progresso</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-0">
                <div className="space-y-3">
                  <div className="flex justify-between text-sm text-white/80">
                    <span>Nível {level}</span>
                    <span>{(xp % 100)}%</span>
                  </div>
                  <Progress value={(xp % 100)} className="h-3 bg-white/20" />
                  <p className="text-white/60 text-sm">
                    {100 - (xp % 100)}% para o próximo nível
                  </p>
                  <div className="flex justify-between items-center pt-2 border-t border-white/10">
                    <div className="text-center flex-1">
                      <div className="text-2xl sm:text-3xl font-bold text-yellow-300">
                        {isLoading ? '...' : userRank ? `#${userRank}` : 'N/A'}
                      </div>
                      <p className="text-white/80 text-xs sm:text-sm">Posição no ranking</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Estatísticas Rápidas */}
            <div className="grid grid-cols-2 gap-4 sm:gap-6">
              {/* Streak */}
              <Card className="bg-white/10 backdrop-blur-sm border-white/20">
                <CardContent className="p-4 sm:p-6 text-center">
                  <div className="text-3xl sm:text-4xl font-bold text-orange-400 mb-2">
                    🔥 {streak}
                  </div>
                  <p className="text-white/80 text-sm sm:text-base">Dias de streak</p>
                </CardContent>
              </Card>

              {/* Badges */}
              <Card className="bg-white/10 backdrop-blur-sm border-white/20">
                <CardContent className="p-4 sm:p-6 text-center">
                  <div className="text-3xl sm:text-4xl font-bold text-purple-400 mb-2">
                    🏆 {badges.length}
                  </div>
                  <p className="text-white/80 text-sm sm:text-base">Conquistas</p>
                </CardContent>
              </Card>
            </div>

            {/* Recomendações */}
            <Card className="bg-white/10 backdrop-blur-sm border-white/20">
              <CardHeader className="pb-2 sm:pb-3">
                <CardTitle className="text-white text-lg sm:text-xl flex items-center space-x-2">
                  <svg className="w-5 h-5 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span>Dicas para Melhorar</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-0">
                <div className="space-y-3">
                  <div className="flex items-start space-x-3">
                    <div className="bg-blue-500/20 rounded-full p-2 mt-0.5">
                      <svg className="w-4 h-4 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                      </svg>
                    </div>
                    <div>
                      <p className="text-white/90 text-sm sm:text-base font-medium">Mantenha o streak!</p>
                      <p className="text-white/60 text-xs sm:text-sm">Jogue todos os dias para ganhar bônus</p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3">
                    <div className="bg-green-500/20 rounded-full p-2 mt-0.5">
                      <svg className="w-4 h-4 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                    <div>
                      <p className="text-white/90 text-sm sm:text-base font-medium">Complete desafios</p>
                      <p className="text-white/60 text-xs sm:text-sm">Ganhe badges e suba no ranking</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Seção Administrativa - Apenas para professores/admins */}
        {isTeacherOrAdmin && (
          <div className="space-y-6 sm:space-y-8 mb-6 sm:mb-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8">
              {/* Botão para Gerenciar Questões */}
              <motion.button
                onClick={() => router.push('/admin/questions')}
                className="bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-xl p-6 shadow-lg hover:shadow-xl active:scale-95 transition-all duration-300 focus:outline-none focus:ring-4 focus:ring-blue-300 group"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <div className="flex items-center justify-center space-x-4">
                  <div className="bg-white/20 rounded-full p-3 group-hover:scale-110 transition-transform duration-300">
                    <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                  </div>
                  <div className="text-center flex-1">
                    <h3 className="text-xl sm:text-2xl font-bold">Gerenciar Questões</h3>
                    <p className="text-blue-100 text-sm sm:text-base">Visualizar e editar questões</p>
                  </div>
                  <svg className="w-6 h-6 group-hover:translate-x-1 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </div>
              </motion.button>

              {/* Botão para Criar Nova Questão */}
              <motion.button
                onClick={() => router.push('/admin/questions/new')}
                className="bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-xl p-6 shadow-lg hover:shadow-xl active:scale-95 transition-all duration-300 focus:outline-none focus:ring-4 focus:ring-green-300 group"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <div className="flex items-center justify-center space-x-4">
                  <div className="bg-white/20 rounded-full p-3 group-hover:scale-110 transition-transform duration-300">
                    <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                    </svg>
                  </div>
                  <div className="text-center flex-1">
                    <h3 className="text-xl sm:text-2xl font-bold">Criar Questão</h3>
                    <p className="text-green-100 text-sm sm:text-base">Adicionar nova questão</p>
                  </div>
                  <svg className="w-6 h-6 group-hover:translate-x-1 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </div>
              </motion.button>
            </div>
          </div>
        )}

        {/* Seção Principal - Jogar - Apenas para estudantes */}
        {!isTeacherOrAdmin && (
          <div className="mb-6 sm:mb-8">
            {/* Play Now Button - CTA Principal */}
            <motion.button
              onClick={() => router.push('/play')}
              className="bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-xl p-6 shadow-lg hover:shadow-xl active:scale-95 transition-all duration-300 focus:outline-none focus:ring-4 focus:ring-green-300 group w-full"
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
                  <p className="text-green-100 text-sm sm:text-base">Teste seus conhecimentos</p>
                </div>
                <svg className="w-6 h-6 group-hover:translate-x-1 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </div>
            </motion.button>
          </div>
        )}

        {/* Botões Secundários */}
        <div className="mb-6 sm:mb-8">
          {/* Ranking Button - Apenas para estudantes */}
          {!isTeacherOrAdmin && (
            <motion.button
              onClick={() => router.push('/ranking')}
              className="bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-xl p-6 shadow-lg hover:shadow-xl active:scale-95 transition-all duration-300 focus:outline-none focus:ring-4 focus:ring-blue-300 group w-full mb-6 sm:mb-8"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <div className="flex items-center justify-center space-x-4">
                <div className="bg-white/20 rounded-full p-3 group-hover:scale-110 transition-transform duration-300">
                  <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
                  </svg>
                </div>
                <div className="text-center flex-1">
                  <h3 className="text-xl sm:text-2xl font-bold">Ver Ranking</h3>
                  <p className="text-blue-100 text-sm sm:text-base">Complete leaderboard</p>
                </div>
                <svg className="w-6 h-6 group-hover:translate-x-1 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </div>
            </motion.button>
          )}

          {/* Settings and Logout - Sempre visível */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 sm:gap-8">
            {/* Settings Button */}
            <motion.button
              onClick={() => router.push('/settings')}
              className="bg-white/10 backdrop-blur-sm border border-white/20 text-white rounded-xl p-4 shadow-lg hover:bg-white/20 active:scale-95 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-white/50 group w-full"
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.99 }}
            >
              <div className="flex items-center justify-center space-x-3">
                <div className="bg-white/20 rounded-full p-2 group-hover:scale-105 transition-transform duration-300">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                </div>
                <div className="text-center flex-1">
                  <h3 className="text-base sm:text-lg font-medium">Configurações</h3>
                  <p className="text-white/60 text-xs sm:text-sm">Personalizar app</p>
                </div>
                <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-300 opacity-60" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </div>
            </motion.button>

            {/* Logout Button */}
            <motion.button
              onClick={async () => {
                await useSessionStore.getState().logout();
                router.push('/signin');
              }}
              className="bg-white/10 backdrop-blur-sm border border-white/20 text-white rounded-xl p-4 shadow-lg hover:bg-white/20 active:scale-95 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-white/50 group w-full"
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.99 }}
            >
              <div className="flex items-center justify-center space-x-3">
                <div className="bg-white/20 rounded-full p-2 group-hover:scale-105 transition-transform duration-300">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                  </svg>
                </div>
                <div className="text-center flex-1">
                  <h3 className="text-base sm:text-lg font-medium">Sair da Conta</h3>
                  <p className="text-white/60 text-xs sm:text-sm">Encerrar sessão</p>
                </div>
                <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-300 opacity-60" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </div>
            </motion.button>
          </div>
        </div>

      </div>
    </motion.div>
  );
}