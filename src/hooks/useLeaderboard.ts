'use client';

import { useState, useEffect } from 'react';
import { LeaderboardEntry } from '../domain/models';
import { supabase } from '../lib/supabase';

export function useLeaderboard(scope: string = 'geral', scopeId: string = 'all') {
  const [entries, setEntries] = useState<LeaderboardEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Função para calcular XP baseado na pontuação
  const calculateXp = (score: number) => score * 10;

  // Função para calcular nível baseado no XP
  const calculateLevel = (xp: number) => Math.floor(xp / 100) + 1;

  // Função para calcular streak (simplificado: baseado em jogos recentes, mockado por enquanto)
  const calculateStreak = (userId: string) => {
    // TODO: Implementar cálculo real baseado em histórico de jogos
    // Por enquanto, retorna um valor mockado
    return Math.floor(Math.random() * 10); // Mock: streak aleatório entre 0-9
  };

  // Função para obter badges do usuário
  const getBadges = (score: number, streak: number) => {
    const badges: string[] = [];
    if (score > 0) badges.push('Primeira Vitória');
    if (streak >= 7) badges.push('Streak de 7 Dias');
    // Adicionar mais badges conforme necessário
    return badges;
  };

  useEffect(() => {
    const fetchLeaderboard = async () => {
      try {
        setLoading(true);
        console.log('useLeaderboard: Fetching leaderboard for scope:', scope, 'scopeId:', scopeId);

        const { data, error } = await supabase
          .from('leaderboard')
          .select('*')
          .eq('scope', scope)
          .eq('scope_id', scopeId)
          .order('score', { ascending: false })
          .limit(50); // Limitar a 50 melhores posições

        if (error) {
          console.error('useLeaderboard: Supabase error:', error);
          throw error;
        }

        console.log('useLeaderboard: Raw data from Supabase:', data);
        console.log('useLeaderboard: Data length:', data?.length || 0);

        setEntries(data as LeaderboardEntry[]);
        setError(null);
      } catch (err) {
        console.error('Erro ao carregar leaderboard:', err);
        // Fallback para dados mockados em caso de erro
        const mockData: LeaderboardEntry[] = [
          { scope: 'geral', scopeId: 'all', userId: 'usuario1', score: 1700 },
          { scope: 'geral', scopeId: 'all', userId: 'usuario2', score: 1600 },
          { scope: 'geral', scopeId: 'all', userId: 'usuario3', score: 1500 },
          { scope: 'geral', scopeId: 'all', userId: 'usuario4', score: 1400 },
          { scope: 'geral', scopeId: 'all', userId: 'usuario5', score: 1300 },
        ];
        console.log('useLeaderboard: Using fallback mock data');
        setEntries(mockData);
        setError('Erro ao carregar ranking em tempo real');
      } finally {
        setLoading(false);
      }
    };

    fetchLeaderboard();
  }, [scope, scopeId]);

  const addEntry = async (entry: LeaderboardEntry) => {
    try {
      const { error } = await supabase
        .from('leaderboard')
        .insert(entry);

      if (error) throw error;

      // Recarregar o leaderboard após adicionar entrada
      const { data } = await supabase
        .from('leaderboard')
        .select('*')
        .eq('scope', scope)
        .eq('scope_id', scopeId)
        .order('score', { ascending: false })
        .limit(50);

      if (data) {
        setEntries(data as LeaderboardEntry[]);
      }
    } catch (err) {
      setError('Erro ao adicionar entrada no ranking');
      console.error('Erro ao adicionar entrada:', err);
    }
  };

  return { entries, loading, error, addEntry, calculateXp, calculateLevel, calculateStreak, getBadges };
}