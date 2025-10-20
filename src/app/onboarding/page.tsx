'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useSessionStore } from '../../state/useSessionStore';
import { supabase } from '../../lib/supabase';
import { Button } from '../../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';
import { createAvatar } from '@dicebear/core';
import { adventurer } from '@dicebear/collection';

export default function OnboardingPage() {
  const [step, setStep] = useState<'nickname' | 'avatar'>('nickname');
  const [nickname, setNickname] = useState('');
  const [selectedAvatar, setSelectedAvatar] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const user = useSessionStore((state) => state.user);
  const setUser = useSessionStore((state) => state.setUser);
  const router = useRouter();

  // Avatar options - using predefined seeds for consistency
  const avatarOptions = [
    'robot1', 'robot2', 'robot3', 'robot4', 'robot5', 'robot6'
  ];

  const generateAvatarForSeed = (seed: string) => {
    try {
      const avatar = createAvatar(adventurer, { seed });
      return avatar.toDataUri();
    } catch {
      return '/avatar-default.svg';
    }
  };

  useEffect(() => {
    const checkAuthAndProfile = async () => {
      const result = await supabase.auth.getUser();

      if (!('data' in result) || !result.data?.user) {
        router.push('/signin');
        return;
      }

      const authUser = result.data.user;

      // Check if user already has a complete profile
      const { data: profileData, error: profileError } = await supabase
        .from('user_profiles')
        .select('user_id, nickname, avatar_seed, onboarding_completed')
        .eq('user_id', authUser.id)
        .single();

      console.log('Profile query result:', { profileData, profileError });

      // Handle the case where profile doesn't exist
      if (profileError) {
        // Profile doesn't exist or network error, user needs to complete onboarding
        console.log('Profile does not exist or error, starting onboarding');
        setUser({ id: authUser.id, name: authUser.email || 'Usuário' });
        return;
      }
      if (profileData.onboarding_completed) {
        // Onboarding completed, go to home
        setUser({
          id: profileData.user_id || authUser.id,
          name: profileData.nickname || authUser.email || 'Usuário'
        });
        router.push('/home');
      } else {
        // Onboarding not completed, stay here
        setUser({ id: authUser.id, name: authUser.email || 'Usuário' });
      }
    };

    checkAuthAndProfile();
  }, [router, setUser]);

  const handleNicknameSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!nickname.trim()) {
      setError('Por favor, digite um apelido.');
      return;
    }

    // Check if nickname is unique
    try {
      const { data: existingUser, error: checkError } = await supabase
        .from('user_profiles')
        .select('user_id')
        .eq('nickname', nickname.trim())
        .single();

      if (checkError && checkError.code !== 'PGRST116') { // PGRST116 = no rows returned
        console.error('Nickname check error:', checkError);
        setError('Erro ao verificar disponibilidade do apelido.');
        return;
      }

      if (existingUser) {
        setError('Este apelido já está em uso. Escolha outro.');
        return;
      }
    } catch (err) {
      console.error('Unexpected nickname check error:', err);
      setError('Erro inesperado ao verificar apelido.');
      return;
    }

    setError('');
    setStep('avatar');
  };

  const handleAvatarSubmit = async () => {
    if (!selectedAvatar) {
      setError('Por favor, selecione um avatar.');
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      // Get current auth user to ensure we have the correct ID
      const { data: authData, error: authError } = await supabase.auth.getUser();

      console.log('Onboarding handleAvatarSubmit: auth result:', { authData, authError });

      if (authError) {
        console.error('Onboarding handleAvatarSubmit: Auth error:', authError);
        throw new Error('Erro de autenticação: ' + authError.message);
      }

      if (!authData?.user) {
        console.error('Onboarding handleAvatarSubmit: No auth user found');
        throw new Error('Usuário não autenticado - faça login novamente');
      }

      const authUser = authData.user;

      console.log('Onboarding handleAvatarSubmit: auth user ID:', authUser.id);
      console.log('Onboarding handleAvatarSubmit: auth user email:', authUser.email);
      console.log('Onboarding handleAvatarSubmit: store user:', user);
      console.log('Onboarding handleAvatarSubmit: nickname:', nickname.trim());
      console.log('Onboarding handleAvatarSubmit: avatar_seed:', selectedAvatar);

      // First, let's check if the user exists in auth.users by trying to get their session
      const { data: sessionData, error: sessionError } = await supabase.auth.getSession();
      console.log('Onboarding handleAvatarSubmit: session result:', { sessionData, sessionError });

      if (sessionError || !sessionData?.session) {
        console.error('Onboarding handleAvatarSubmit: No active session');
        throw new Error('Sessão expirada - faça login novamente');
      }

      // Use upsert to create or update the profile
      // Try with onboarding_completed first, fallback without it if column doesn't exist
      const upsertDataWithOnboarding = {
        user_id: authUser.id,
        nickname: nickname.trim(),
        avatar_seed: selectedAvatar,
        onboarding_completed: true
      };

      const upsertDataWithoutOnboarding = {
        user_id: authUser.id,
        nickname: nickname.trim(),
        avatar_seed: selectedAvatar
      };

      let { data: profileData, error: upsertError } = await supabase
        .from('user_profiles')
        .upsert(upsertDataWithOnboarding, {
          onConflict: 'user_id'
        })
        .select();

      // If onboarding_completed column doesn't exist, try without it
      if (upsertError && upsertError.message?.includes('onboarding_completed')) {
        console.log('Onboarding handleAvatarSubmit: onboarding_completed column not found, retrying without it');
        const retryResult = await supabase
          .from('user_profiles')
          .upsert(upsertDataWithoutOnboarding, {
            onConflict: 'user_id'
          })
          .select();

        profileData = retryResult.data;
        upsertError = retryResult.error;
      }

      console.log('Onboarding handleAvatarSubmit: upsert result:', { profileData, upsertError });

      if (upsertError) {
        console.error('Onboarding handleAvatarSubmit: Upsert error:', upsertError);
        const errorMessage = upsertError.message || upsertError.details || 'Erro ao salvar perfil';
        throw new Error(errorMessage);
      }

      // Update session store
      setUser({ ...user!, name: nickname.trim() });

      router.push('/home');
    } catch (error: unknown) {
      const err = error as Error;
      console.error('Onboarding handleAvatarSubmit: Final error:', err);
      setError('Erro ao salvar perfil: ' + err.message);
    } finally {
      setIsLoading(false);
    }
  };

  if (!user) return null;

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-500 to-purple-600 px-4 py-8 sm:px-6 lg:px-8">
      <Card className="w-full max-w-sm sm:max-w-md mx-auto">
        <CardHeader className="pb-4">
          <CardTitle className="text-center text-xl sm:text-2xl">
            {step === 'nickname' ? 'Bem-vindo!' : 'Escolha seu Avatar'}
          </CardTitle>
          <p className="text-center text-sm text-gray-600 dark:text-gray-400">
            {step === 'nickname'
              ? 'Vamos começar configurando seu perfil'
              : 'Personalize sua aparência no app'
            }
          </p>
        </CardHeader>
        <CardContent className="space-y-4 px-4 sm:px-6">
          {step === 'nickname' ? (
            <form onSubmit={handleNicknameSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="nickname" className="text-sm font-medium">Escolha seu apelido</Label>
                <Input
                  id="nickname"
                  value={nickname}
                  onChange={(e) => setNickname(e.target.value)}
                  placeholder="Seu apelido único"
                  className="h-11 text-base"
                  required
                />
              </div>
              {error && <p className="text-red-500 text-sm">{error}</p>}
              <Button type="submit" className="w-full h-11 text-base font-medium">
                Continuar
              </Button>
            </form>
          ) : (
            <div className="space-y-4">
              <div className="grid grid-cols-3 gap-4">
                {avatarOptions.map((avatar, index) => (
                  <button
                    key={avatar}
                    onClick={() => setSelectedAvatar(avatar)}
                    className={`p-2 rounded-lg border-2 transition-colors hover:scale-105 focus:outline-none focus:ring-2 focus:ring-blue-300 ${
                      selectedAvatar === avatar
                        ? 'border-blue-500 bg-blue-50 ring-2 ring-blue-300'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                    aria-label={`Selecionar avatar ${index + 1} de ${avatarOptions.length}`}
                    aria-pressed={selectedAvatar === avatar}
                  >
                    <img
                      src={generateAvatarForSeed(avatar)}
                      alt={`Opção de avatar ${index + 1}: estilo ${avatar}`}
                      className="w-full h-16 rounded"
                    />
                  </button>
                ))}
              </div>
              {error && <p className="text-red-500 text-sm">{error}</p>}
              <div className="flex gap-2">
                <Button
                  onClick={() => setStep('nickname')}
                  variant="outline"
                  className="flex-1 h-11 text-base"
                >
                  Voltar
                </Button>
                <Button
                  onClick={handleAvatarSubmit}
                  disabled={isLoading || !selectedAvatar}
                  className="flex-1 h-11 text-base font-medium"
                >
                  {isLoading ? 'Salvando...' : 'Finalizar'}
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}