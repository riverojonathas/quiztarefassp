'use client';

import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';

interface GlobalStats {
  totalUsers: number;
  totalGames: number;
  totalQuestions: number;
}

export function useGlobalStats() {
  const [stats, setStats] = useState<GlobalStats>({
    totalUsers: 0,
    totalGames: 0,
    totalQuestions: 0,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        setLoading(true);

        // Buscar total de usuários
        const { count: usersCount, error: usersError } = await supabase
          .from('users')
          .select('*', { count: 'exact', head: true });

        if (usersError) throw usersError;

        // Buscar total de jogos (matches)
        const { count: gamesCount, error: gamesError } = await supabase
          .from('matches')
          .select('*', { count: 'exact', head: true });

        if (gamesError) throw gamesError;

        // Buscar total de questões
        const { count: questionsCount, error: questionsError } = await supabase
          .from('questions')
          .select('*', { count: 'exact', head: true });

        if (questionsError) throw questionsError;

        setStats({
          totalUsers: usersCount || 0,
          totalGames: gamesCount || 0,
          totalQuestions: questionsCount || 0,
        });

        setError(null);
      } catch (err) {
        console.error('Erro ao carregar estatísticas:', err);
        // Fallback para dados mockados em caso de erro
        setStats({
          totalUsers: 1250,
          totalGames: 5432,
          totalQuestions: 89,
        });
        setError('Erro ao carregar estatísticas em tempo real');
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  return { stats, loading, error };
}