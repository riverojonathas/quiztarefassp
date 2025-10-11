'use client';

import { useState, useEffect } from 'react';
import { UserProfile, UserId } from '../domain/models';
import { supabase } from '../lib/supabase';

export function useUserProfile(userId: UserId | null) {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

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
          setProfile({
            id: data.id,
            userId: data.user_id,
            avatarSeed: data.avatar_seed,
            avatarUrl: data.avatar_url,
            nickname: data.nickname,
            notifications: data.notifications,
            theme: data.theme,
            language: data.language,
            createdAt: data.created_at,
            updatedAt: data.updated_at,
          });
        } else {
          // Create default profile if none exists
          const defaultProfile: UserProfile = {
            id: '',
            userId,
            notifications: {
              gameInvites: true,
              dailyReminders: true,
              achievements: true,
              leaderboardUpdates: false,
            },
            theme: 'light',
            language: 'pt-BR',
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
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
  }, [userId]);

  const updateProfile = async (updates: Partial<UserProfile>) => {
    if (!userId || !profile) return;

    try {
      setLoading(true);
      const updatedProfile = { ...profile, ...updates };

      const { error } = await supabase
        .from('user_profiles')
        .upsert({
          user_id: userId,
          avatar_seed: updatedProfile.avatarSeed,
          avatar_url: updatedProfile.avatarUrl,
          nickname: updatedProfile.nickname,
          notifications: updatedProfile.notifications,
          theme: updatedProfile.theme,
          language: updatedProfile.language,
        }, {
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

  return { profile, loading, error, updateProfile };
}