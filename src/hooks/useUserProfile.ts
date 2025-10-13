'use client';

import { useState, useEffect } from 'react';
import { UserProfile, UserId } from '../domain/models';
import { supabase } from '../lib/supabase';
import { dbToUserProfile, userProfileToDb } from '../lib/database-mappers';

export function useUserProfile(userId: UserId | null) {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const refreshProfile = async () => {
    if (!userId) return;

    try {
      setLoading(true);
      console.log('useUserProfile: Refreshing profile for user:', userId);

      const { data, error } = await supabase
        .from('user_profiles')
        .select('*')
        .eq('user_id', userId)
        .single();

      if (error && error.code !== 'PGRST116') { // PGRST116 = no rows returned
        console.error('useUserProfile: Supabase error:', error);
        throw error;
      }

      if (data) {
        setProfile(dbToUserProfile(data));
      } else {
        // Create default profile if none exists
        const defaultProfile: UserProfile = {
          id: '',
          user_id: userId,
          avatar_seed: null,
          avatar_url: null,
          nickname: null,
          notifications: {
            gameInvites: true,
            dailyReminders: true,
            achievements: true,
            leaderboardUpdates: false,
          },
          theme: 'original',
          language: 'pt-BR',
          diretoria_ensino: null,
          escola: null,
          nivel_escolar: null,
          serie: null,
          turma: null,
          onboarding_completed: null,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        };
        setProfile(defaultProfile);
      }

      setError(null);
    } catch (err) {
      console.error('Erro ao carregar perfil:', err);
      setError('Erro ao carregar perfil do usuário');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!userId) {
      setProfile(null);
      setLoading(false);
      return;
    }

    const fetchProfile = async () => {
      try {
        setLoading(true);
        console.log('useUserProfile: Fetching profile for user:', userId);

        const { data, error } = await supabase
          .from('user_profiles')
          .select('*')
          .eq('user_id', userId)
          .single();

        if (error && error.code !== 'PGRST116') { // PGRST116 = no rows returned
          console.error('useUserProfile: Supabase error:', error);
          throw error;
        }

        if (data) {
          setProfile(dbToUserProfile(data));
        } else {
          // Create default profile if none exists
          const defaultProfile: UserProfile = {
            id: '',
            user_id: userId,
            avatar_seed: null,
            avatar_url: null,
            nickname: null,
            notifications: {
              gameInvites: true,
              dailyReminders: true,
              achievements: true,
              leaderboardUpdates: false,
            },
            theme: 'original',
            language: 'pt-BR',
            diretoria_ensino: null,
            escola: null,
            nivel_escolar: null,
            serie: null,
            turma: null,
            onboarding_completed: null,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
          };
          setProfile(defaultProfile);
        }

        setError(null);
      } catch (err) {
        console.error('Erro ao carregar perfil:', err);
        setError('Erro ao carregar perfil do usuário');
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [userId]); // Removed refreshTrigger from dependencies

  const updateProfile = async (updates: Partial<UserProfile>) => {
    if (!userId || !profile) return;

    try {
      setLoading(true);
      const updatedProfile = { ...profile, ...updates };

      const dbData = userProfileToDb(updatedProfile);

      const { error } = await supabase
        .from('user_profiles')
        .upsert(dbData, {
          onConflict: 'user_id'
        });

      if (error) throw error;

      setProfile(updatedProfile);
      setError(null);
    } catch (err) {
      console.error('Erro ao atualizar perfil:', err);
      setError('Erro ao salvar perfil');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return { profile, loading, error, updateProfile, refreshProfile };
}