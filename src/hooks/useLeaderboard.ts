'use client';

import { useState, useEffect } from 'react';
import { LeaderboardEntry } from '../domain/models';
import { supabase } from '../lib/supabase';
import { dbToLeaderboardEntry, leaderboardEntryToDb } from '../lib/database-mappers';

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

        setEntries(data?.map(dbToLeaderboardEntry) || []);
        setError(null);
      } catch (err) {
        console.error('Erro ao carregar leaderboard:', err);
        // Fallback para dados mockados em caso de erro
        const mockData: LeaderboardEntry[] = [
          { id: '1', scope: 'geral', scope_id: 'all', user_id: 'usuario1', score: 1700, created_at: null },
          { id: '2', scope: 'geral', scope_id: 'all', user_id: 'usuario2', score: 1600, created_at: null },
          { id: '3', scope: 'geral', scope_id: 'all', user_id: 'usuario3', score: 1500, created_at: null },
          { id: '4', scope: 'geral', scope_id: 'all', user_id: 'usuario4', score: 1400, created_at: null },
          { id: '5', scope: 'geral', scope_id: 'all', user_id: 'usuario5', score: 1300, created_at: null },
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
      const dbEntry = leaderboardEntryToDb(entry);
      const { error } = await supabase
        .from('leaderboard')
        .insert(dbEntry);

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
        setEntries(data.map(dbToLeaderboardEntry));
      }
    } catch (err) {
      setError('Erro ao adicionar entrada no ranking');
      console.error('Erro ao adicionar entrada:', err);
    }
  };

  return { entries, loading, error, addEntry, calculateXp, calculateLevel, calculateStreak, getBadges };
}