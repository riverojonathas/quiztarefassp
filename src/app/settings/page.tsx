'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { Button } from '../../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';
import { Settings, Save, Eye, EyeOff } from 'lucide-react';
import { useSessionStore } from '../../state/useSessionStore';
import { useUserProfile } from '../../hooks/useUserProfile';
import { supabase, safeSupabaseAuth } from '../../lib/supabase';
import { createAvatar } from '@dicebear/core';
import { adventurer } from '@dicebear/collection';
import { useAvatar } from '../../hooks/useAvatar';
import { useTheme } from '../../hooks/useTheme';
import { TeamSelector } from '../../components/TeamSelector';
import { ThemeTest } from '../../components/ThemeTest';
import { ThemeIcon } from '../../components/ThemeIcon';

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState('profile');
  const router = useRouter();

  const menuItems = [
    { id: 'profile', label: 'Perfil', icon: 'user' },
    { id: 'security', label: 'Segurança', icon: 'shield' },
    { id: 'notifications', label: 'Notificações', icon: 'bell' },
    { id: 'theme', label: 'Tema', icon: 'palette' },
  ];

  const renderContent = () => {
    switch (activeTab) {
      case 'profile':
        return <ProfileSettings />;
      case 'security':
        return <SecuritySettings />;
      case 'notifications':
        return <NotificationsSettings />;
      case 'theme':
        return <ThemeSettings />;
      default:
        return <ProfileSettings />;
    }
  };

  return (
    <motion.div
      className="min-h-screen p-3 sm:p-4 animate-fade-in flex flex-col"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    >
      <div className="container mx-auto max-w-6xl flex-1 flex flex-col">
        <div className="text-center mb-6 sm:mb-8">
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white mb-2">Configurações</h1>
          <p className="text-lg sm:text-xl text-white/80">Personalize sua experiência</p>
        </div>

        {/* Menu Mobile - Superior */}
        <div className="block lg:hidden mb-6">
          <div className="bg-white/10 backdrop-blur-sm rounded-lg p-1">
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-1">
              {menuItems.map((item) => {
                return (
                  <button
                    key={item.id}
                    onClick={() => setActiveTab(item.id)}
                    className={`flex flex-col items-center gap-1 p-3 rounded-md text-xs font-medium transition-colors ${
                      activeTab === item.id
                        ? 'bg-white/20 text-white'
                        : 'text-white/70 hover:bg-white/10 hover:text-white'
                    }`}
                  >
                    <ThemeIcon name={item.icon} className="w-4 h-4" />
                    {item.label}
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Conteúdo Principal */}
        <div className="flex-1 flex flex-col">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 sm:gap-6 mb-6">
            {/* Menu Lateral - Desktop */}
            <Card className="hidden lg:block lg:col-span-1 bg-white/10 backdrop-blur-sm border-white/20">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <Settings className="w-5 h-5" />
                  Menu
                </CardTitle>
              </CardHeader>
              <CardContent>
                <nav className="space-y-2">
                  {menuItems.map((item) => {
                    return (
                      <button
                        key={item.id}
                        onClick={() => setActiveTab(item.id)}
                        className={`w-full flex items-center gap-3 p-3 rounded-lg text-left transition-colors ${
                          activeTab === item.id
                            ? 'bg-white/20 text-white'
                            : 'text-white/70 hover:bg-white/10 hover:text-white'
                        }`}
                      >
                        <ThemeIcon name={item.icon} className="w-5 h-5" />
                        {item.label}
                      </button>
                    );
                  })}
                </nav>
              </CardContent>
            </Card>

            {/* Conteúdo */}
            <Card className="lg:col-span-3 bg-white/10 backdrop-blur-sm border-white/20">
              <CardContent className="p-4 sm:p-6">
                {renderContent()}
              </CardContent>
            </Card>
          </div>

          {/* Back to Home Button - Parte inferior fixa */}
          <div className="mt-auto pb-6">
            <div className="max-w-md mx-auto w-full">
              <motion.button
                onClick={() => router.push('/home')}
                className="bg-white/10 backdrop-blur-sm border border-white/20 text-white rounded-xl p-4 shadow-lg hover:bg-white/20 active:scale-95 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-white/50 group w-full"
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.99 }}
              >
                <div className="flex items-center justify-center space-x-3">
                  <div className="bg-white/20 rounded-full p-2 group-hover:scale-105 transition-transform duration-300">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                    </svg>
                  </div>
                  <div className="text-center flex-1">
                    <h3 className="text-base sm:text-lg font-medium">Voltar ao Início</h3>
                    <p className="text-white/60 text-xs sm:text-sm">Página inicial</p>
                  </div>
                  <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-300 opacity-60" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </div>
              </motion.button>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

// Componentes de Submenu
function ProfileSettings() {
  const user = useSessionStore((state) => state.user);
  const { profile, loading: profileLoading, error: profileError, updateProfile } = useUserProfile(user?.id || null);
  const [nickname, setNickname] = useState(user?.name || '');
  const [selectedAvatar, setSelectedAvatar] = useState('adventurer');
  const [avatarSeed, setAvatarSeed] = useState(user?.id || 'default');
  const [userEmail, setUserEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  // Load user email from Supabase auth
  useEffect(() => {
    const getUserEmail = async () => {
      try {
        const result = await safeSupabaseAuth.getUser();
        if ('data' in result && result.data?.user?.email) {
          setUserEmail(result.data.user.email);
        }
      } catch (error) {
        console.error('Error getting user email:', error);
      }
    };

    getUserEmail();
  }, []);

  // Load profile data when available
  useEffect(() => {
    if (profile) {
      setNickname(profile.nickname || user?.name || '');
      setAvatarSeed(profile.avatar_seed || user?.id || 'default');
    }
  }, [profile, user]);

  const { generateNewSeed } = useAvatar();

  const generateAvatar = (seed: string) => {
    try {
      const avatar = createAvatar(adventurer, { seed });
      return avatar.toDataUri();
    } catch {
      return '/avatar-default.svg';
    }
  };

  const handleSaveProfile = async () => {
    if (!user) return;

    setLoading(true);
    setMessage('');
    try {
      await updateProfile({
        nickname: nickname !== user.name ? nickname : undefined,
        avatar_seed: avatarSeed,
      });

      // Update session store if nickname changed
      if (nickname !== user.name) {
        useSessionStore.getState().setUser({ ...user, name: nickname });
      }

      setMessage('Perfil atualizado com sucesso!');
    } catch (error: unknown) {
      const err = error as Error;
      setMessage('Erro ao atualizar perfil: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Avatar e Apelido lado a lado */}
      <div className="flex items-start gap-4 sm:gap-6">
        <div className="flex-shrink-0">
          <img
            src={generateAvatar(avatarSeed)}
            alt="Avatar atual"
            className="w-16 h-16 sm:w-20 sm:h-20 rounded-full border-4 border-white cursor-pointer hover:scale-105 transition-transform duration-200"
            onClick={() => setAvatarSeed(generateNewSeed())}
          />
        </div>
        <div className="flex-1">
          <Label htmlFor="nickname" className="text-white text-sm sm:text-base">Apelido</Label>
          <Input
            id="nickname"
            value={nickname}
            onChange={(e) => setNickname(e.target.value)}
            className="bg-white/10 border-white/20 text-white placeholder-white/50 h-12 sm:h-10 mt-1"
            placeholder="Seu apelido"
          />
        </div>
      </div>

      {/* Email (somente leitura) */}
      <div>
        <Label htmlFor="email" className="text-white text-sm sm:text-base">Email</Label>
        <Input
          id="email"
          value={userEmail}
          readOnly
          className="bg-white/10 border-white/20 text-white h-12 sm:h-10 mt-1"
        />
        <p className="text-white/60 text-xs sm:text-sm mt-1">O email não pode ser alterado aqui.</p>
      </div>

      {/* Matrícula */}
      <div className="space-y-3 sm:space-y-4">
        <h3 className="text-lg sm:text-xl font-semibold text-white">Matrícula</h3>

        <div>
          <Label htmlFor="diretoriaEnsino" className="text-white text-sm sm:text-base">Diretoria de Ensino</Label>
          <Input
            id="diretoriaEnsino"
            value={profile?.diretoria_ensino || ''}
            readOnly
            className="bg-white/10 border-white/20 text-white h-12 sm:h-10 mt-1"
            placeholder="Não informado"
          />
        </div>

        <div>
          <Label htmlFor="escola" className="text-white text-sm sm:text-base">Escola</Label>
          <Input
            id="escola"
            value={profile?.escola || ''}
            readOnly
            className="bg-white/10 border-white/20 text-white h-12 sm:h-10 mt-1"
            placeholder="Não informado"
          />
        </div>

        <div>
          <Label htmlFor="nivelEscolar" className="text-white text-sm sm:text-base">Nível Escolar</Label>
          <Input
            id="nivelEscolar"
            value={profile?.nivel_escolar || ''}
            readOnly
            className="bg-white/10 border-white/20 text-white h-12 sm:h-10 mt-1"
            placeholder="Não informado"
          />
        </div>

        <div>
          <Label htmlFor="serie" className="text-white text-sm sm:text-base">Série</Label>
          <Input
            id="serie"
            value={profile?.serie || ''}
            readOnly
            className="bg-white/10 border-white/20 text-white h-12 sm:h-10 mt-1"
            placeholder="Não informado"
          />
        </div>

        <div>
          <Label htmlFor="turma" className="text-white text-sm sm:text-base">Turma</Label>
          <Input
            id="turma"
            value={profile?.turma || ''}
            readOnly
            className="bg-white/10 border-white/20 text-white h-12 sm:h-10 mt-1"
            placeholder="Não informado"
          />
        </div>
      </div>

      {/* Salvar Perfil */}
      <Button onClick={handleSaveProfile} disabled={loading} className="bg-blue-500 hover:bg-blue-600 w-full h-12 sm:h-10 text-sm sm:text-base">
        <Save className="w-4 h-4 mr-2" />
        Salvar Perfil
      </Button>

      {message && <p className="text-yellow-300 text-sm sm:text-base">{message}</p>}
    </div>
  );
}

function NotificationsSettings() {
  const user = useSessionStore((state) => state.user);
  const { profile, loading: profileLoading, error: profileError, updateProfile } = useUserProfile(user?.id || null);
  const [notifications, setNotifications] = useState({
    gameInvites: true,
    dailyReminders: true,
    achievements: true,
    leaderboardUpdates: false,
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  // Load notifications from profile
  useEffect(() => {
    if (profile?.notifications) {
      setNotifications(profile.notifications);
    }
  }, [profile]);

  const handleSave = async () => {
    if (!user) return;

    setLoading(true);
    setMessage('');
    try {
      await updateProfile({
        notifications,
      });
      setMessage('Notificações salvas com sucesso!');
    } catch (error: unknown) {
      const err = error as Error;
      setMessage('Erro ao salvar notificações: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  if (profileLoading) {
    return <div className="text-white">Carregando configurações...</div>;
  }

  if (profileError) {
    return <div className="text-red-400">Erro ao carregar configurações: {profileError}</div>;
  }

  return (
    <div className="space-y-4 sm:space-y-6">
      <h2 className="text-xl sm:text-2xl font-bold text-white mb-4">Notificações</h2>
      <div className="space-y-3 sm:space-y-4">
        <div className="flex items-center justify-between p-3 sm:p-4 bg-white/5 rounded-lg">
          <Label htmlFor="gameInvites" className="text-white text-sm sm:text-base cursor-pointer">Convites para jogos</Label>
          <input
            id="gameInvites"
            type="checkbox"
            checked={notifications.gameInvites}
            onChange={(e) => setNotifications({ ...notifications, gameInvites: e.target.checked })}
            className="w-5 h-5"
          />
        </div>
        <div className="flex items-center justify-between p-3 sm:p-4 bg-white/5 rounded-lg">
          <Label htmlFor="dailyReminders" className="text-white text-sm sm:text-base cursor-pointer">Lembretes diários</Label>
          <input
            id="dailyReminders"
            type="checkbox"
            checked={notifications.dailyReminders}
            onChange={(e) => setNotifications({ ...notifications, dailyReminders: e.target.checked })}
            className="w-5 h-5"
          />
        </div>
        <div className="flex items-center justify-between p-3 sm:p-4 bg-white/5 rounded-lg">
          <Label htmlFor="achievements" className="text-white text-sm sm:text-base cursor-pointer">Conquistas</Label>
          <input
            id="achievements"
            type="checkbox"
            checked={notifications.achievements}
            onChange={(e) => setNotifications({ ...notifications, achievements: e.target.checked })}
            className="w-5 h-5"
          />
        </div>
        <div className="flex items-center justify-between p-3 sm:p-4 bg-white/5 rounded-lg">
          <Label htmlFor="leaderboardUpdates" className="text-white text-sm sm:text-base cursor-pointer">Atualizações do ranking</Label>
          <input
            id="leaderboardUpdates"
            type="checkbox"
            checked={notifications.leaderboardUpdates}
            onChange={(e) => setNotifications({ ...notifications, leaderboardUpdates: e.target.checked })}
            className="w-5 h-5"
          />
        </div>
      </div>
      <Button onClick={handleSave} disabled={loading} className="bg-blue-500 hover:bg-blue-600 w-full h-12 sm:h-10 text-sm sm:text-base">
        <Save className="w-4 h-4 mr-2" />
        {loading ? 'Salvando...' : 'Salvar'}
      </Button>
      {message && <p className="text-yellow-300 text-sm sm:text-base">{message}</p>}
    </div>
  );
}

function ThemeSettings() {
  const { themeName, setTheme, favoriteTeam } = useTheme();

  return (
    <div className="space-y-4 sm:space-y-6">
      <h2 className="text-xl sm:text-2xl font-bold text-white mb-4">Tema</h2>
      <div className="space-y-3 sm:space-y-4">
        <div className="flex items-center gap-3 p-3 sm:p-4 bg-white/5 rounded-lg">
          <input
            id="original"
            type="radio"
            name="theme"
            value="original"
            checked={themeName === 'original'}
            onChange={(e) => setTheme('original')}
            className="w-5 h-5"
          />
          <Label htmlFor="original" className="text-white text-sm sm:text-base cursor-pointer">Original</Label>
          <span className="text-white/60 text-xs ml-auto">Padrão</span>
        </div>
        <div className="flex items-center gap-3 p-3 sm:p-4 bg-white/5 rounded-lg">
          <input
            id="world-cup-2026"
            type="radio"
            name="theme"
            value="world-cup-2026"
            checked={themeName === 'world-cup-2026'}
            onChange={(e) => setTheme('world-cup-2026')}
            className="w-5 h-5"
          />
          <Label htmlFor="world-cup-2026" className="text-white text-sm sm:text-base cursor-pointer">Copa do Mundo 2026</Label>
          <span className="text-white/60 text-xs ml-auto">Novo!</span>
        </div>
      </div>

      {/* Seletor de Time - só aparece quando tema World Cup está selecionado */}
      {themeName === 'world-cup-2026' && (
        <div className="mt-6">
          <TeamSelector />
        </div>
      )}

      {favoriteTeam && themeName === 'world-cup-2026' && (
        <div className="mt-4 p-4 bg-green-500/20 border border-green-500/30 rounded-lg">
          <p className="text-green-300 text-sm text-center">
            Tema personalizado aplicado com as cores do {favoriteTeam}!
          </p>
        </div>
      )}

      {/* Componente de debug para testar as cores */}
      <div className="mt-6">
        <ThemeTest />
      </div>
    </div>
  );
}

function SecuritySettings() {
  const user = useSessionStore((state) => state.user);
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  const handleChangePassword = async () => {
    if (newPassword !== confirmPassword) {
      setMessage('As senhas não coincidem.');
      return;
    }
    setLoading(true);
    setMessage('');
    try {
      const result = await safeSupabaseAuth.updateUser({
        password: newPassword
      });

      if (result.error) throw new Error(result.error);

      setMessage('Senha alterada com sucesso!');
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
    } catch (error: unknown) {
      const err = error as Error;
      setMessage('Erro ao alterar senha: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-4 sm:space-y-6">
      <h2 className="text-xl sm:text-2xl font-bold text-white mb-4">Segurança</h2>

      {/* Alterar Senha */}
      <div className="space-y-3 sm:space-y-4">
        <h3 className="text-lg sm:text-xl font-semibold text-white">Alterar Senha</h3>
        <div className="relative">
          <Label htmlFor="currentPassword" className="text-white text-sm sm:text-base">Senha Atual</Label>
          <Input
            id="currentPassword"
            type={showCurrentPassword ? 'text' : 'password'}
            value={currentPassword}
            onChange={(e) => setCurrentPassword(e.target.value)}
            className="bg-white/10 border-white/20 text-white placeholder-white/50 pr-10 h-12 sm:h-10 mt-1"
          />
          <button
            type="button"
            onClick={() => setShowCurrentPassword(!showCurrentPassword)}
            className="absolute right-3 top-8 sm:top-7 text-white"
          >
            {showCurrentPassword ? <EyeOff className="w-4 h-4 sm:w-5 sm:h-5" /> : <Eye className="w-4 h-4 sm:w-5 sm:h-5" />}
          </button>
        </div>
        <div className="relative">
          <Label htmlFor="newPassword" className="text-white text-sm sm:text-base">Nova Senha</Label>
          <Input
            id="newPassword"
            type={showNewPassword ? 'text' : 'password'}
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            className="bg-white/10 border-white/20 text-white placeholder-white/50 pr-10 h-12 sm:h-10 mt-1"
          />
          <button
            type="button"
            onClick={() => setShowNewPassword(!showNewPassword)}
            className="absolute right-3 top-8 sm:top-7 text-white"
          >
            {showNewPassword ? <EyeOff className="w-4 h-4 sm:w-5 sm:h-5" /> : <Eye className="w-4 h-4 sm:w-5 sm:h-5" />}
          </button>
        </div>
        <div className="relative">
          <Label htmlFor="confirmPassword" className="text-white text-sm sm:text-base">Confirmar Nova Senha</Label>
          <Input
            id="confirmPassword"
            type={showConfirmPassword ? 'text' : 'password'}
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            className="bg-white/10 border-white/20 text-white placeholder-white/50 pr-10 h-12 sm:h-10 mt-1"
          />
          <button
            type="button"
            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
            className="absolute right-3 top-8 sm:top-7 text-white"
          >
            {showConfirmPassword ? <EyeOff className="w-4 h-4 sm:w-5 sm:h-5" /> : <Eye className="w-4 h-4 sm:w-5 sm:h-5" />}
          </button>
        </div>
        <Button onClick={handleChangePassword} disabled={loading} className="bg-green-500 hover:bg-green-600 w-full h-12 sm:h-10 text-sm sm:text-base">
          <Save className="w-4 h-4 mr-2" />
          Alterar Senha
        </Button>
      </div>

      {message && <p className="text-yellow-300 text-sm sm:text-base">{message}</p>}
    </div>
  );
}