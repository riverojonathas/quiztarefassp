'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { nationalTeamColors } from '@/lib/themes';
import { useSessionStore } from '@/state/useSessionStore';
import { useUserProfile } from '@/hooks/useUserProfile';

// Tipos básicos
interface Theme {
  name: string;
  colors: Record<string, string>;
  fonts: Record<string, string>;
  spacing: Record<string, string>;
  borderRadius: string;
  shadows: Record<string, string>;
}

type ThemeName = 'original' | 'world-cup-2026';

interface ThemeContextType {
  theme: Theme;
  themeName: ThemeName;
  setTheme: (themeName: ThemeName) => void;
  favoriteTeam: string | null;
  setFavoriteTeam: (team: string | null) => void;
  getTeamColors: (team: string) => { primary: string; secondary: string } | null;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

// Tema padrão
const defaultTheme: Theme = {
  name: 'default',
  colors: {
    primary: '#3b82f6',
    secondary: '#6366f1',
    accent: '#8b5cf6',
    background: 'linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 25%, #f0f9ff 50%, #e0f2fe 75%, #f0f9ff 100%)',
    surface: '#ffffff',
    text: '#1f2937',
    textSecondary: '#6b7280',
    success: '#10b981',
    error: '#ef4444',
    warning: '#f59e0b',
  },
  fonts: {
    primary: 'Inter, system-ui, sans-serif',
    secondary: 'Inter, system-ui, sans-serif',
  },
  spacing: {
    small: '0.5rem',
    medium: '1rem',
    large: '1.5rem',
  },
  borderRadius: '0.75rem',
  shadows: {
    small: '0 1px 2px 0 rgb(0 0 0 / 0.05)',
    medium: '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)',
    large: '0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)',
  },
};

// Tema da Copa
const worldCup2026Theme: Theme = {
  name: 'world-cup-2026',
  colors: {
    primary: '#1e40af',
    secondary: '#dc2626',
    accent: '#fbbf24',
    background: 'linear-gradient(135deg, #1e3a8a 0%, #1e40af 25%, #3b82f6 50%, #60a5fa 75%, #93c5fd 100%)',
    surface: '#ffffff',
    text: '#0f172a',
    textSecondary: '#475569',
    success: '#059669',
    error: '#dc2626',
    warning: '#d97706',
  },
  fonts: {
    primary: 'Inter, system-ui, sans-serif',
    secondary: 'Inter, system-ui, sans-serif',
  },
  spacing: {
    small: '0.5rem',
    medium: '1rem',
    large: '1.5rem',
  },
  borderRadius: '0.75rem',
  shadows: {
    small: '0 1px 2px 0 rgb(0 0 0 / 0.05)',
    medium: '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)',
    large: '0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)',
  },
};

const availableThemes = {
  original: defaultTheme,
  'world-cup-2026': worldCup2026Theme,
};

interface ThemeProviderProps {
  children: ReactNode;
}

export function ThemeProvider({ children }: ThemeProviderProps) {
  const [themeName, setThemeName] = useState<ThemeName>('original');
  const [favoriteTeam, setFavoriteTeam] = useState<string | null>(null);
  const { user } = useSessionStore();
  const { profile, updateProfile } = useUserProfile(user?.id || null);

  useEffect(() => {
    // Load from localStorage first (for immediate UI update)
    const savedTheme = localStorage.getItem('quiz-theme') as ThemeName;
    const savedTeam = localStorage.getItem('quiz-favorite-team');

    if (savedTheme && availableThemes[savedTheme]) {
      setThemeName(savedTheme);
    }

    if (savedTeam) {
      setFavoriteTeam(savedTeam);
    }

    // If user is logged in, sync with Supabase profile
    if (user && profile) {
      if (profile.theme && availableThemes[profile.theme as ThemeName]) {
        setThemeName(profile.theme as ThemeName);
        localStorage.setItem('quiz-theme', profile.theme);
      }
      // favoriteTeam is not stored in profile yet
      // if (profile.favoriteTeam) {
      //   setFavoriteTeam(profile.favoriteTeam);
      //   localStorage.setItem('quiz-favorite-team', profile.favoriteTeam);
      // }
    }
  }, [user, profile]);

  const setTheme = async (newThemeName: ThemeName) => {
    setThemeName(newThemeName);
    localStorage.setItem('quiz-theme', newThemeName);

    // Save to Supabase if user is logged in
    if (user && updateProfile) {
      try {
        await updateProfile({ theme: newThemeName });
      } catch (error) {
        console.error('Erro ao salvar tema no Supabase:', error);
      }
    }
  };

  const handleSetFavoriteTeam = async (team: string | null) => {
    setFavoriteTeam(team);
    if (team) {
      localStorage.setItem('quiz-favorite-team', team);
    } else {
      localStorage.removeItem('quiz-favorite-team');
    }

    // Save to Supabase if user is logged in - disabled for now
    // if (user && updateProfile) {
    //   try {
    //     await updateProfile({ favoriteTeam: team || undefined });
    //   } catch (error) {
    //     console.error('Erro ao salvar time favorito no Supabase:', error);
    //   }
    // }
  };

  const getTeamColors = (team: string) => {
    return nationalTeamColors[team] || null;
  };

  const theme = availableThemes[themeName];

  useEffect(() => {
    const root = document.documentElement;

    Object.entries(theme.colors).forEach(([key, value]) => {
      root.style.setProperty(`--color-${key}`, value);
    });

    Object.entries(theme.fonts).forEach(([key, value]) => {
      root.style.setProperty(`--font-${key}`, value);
    });

    Object.entries(theme.spacing).forEach(([key, value]) => {
      root.style.setProperty(`--spacing-${key}`, value);
    });

    root.style.setProperty('--border-radius', theme.borderRadius);

    Object.entries(theme.shadows).forEach(([key, value]) => {
      root.style.setProperty(`--shadow-${key}`, value);
    });

    if (themeName === 'world-cup-2026' && favoriteTeam) {
      const teamColors = getTeamColors(favoriteTeam);
      if (teamColors) {
        root.style.setProperty('--primary', teamColors.primary);
        root.style.setProperty('--secondary', teamColors.secondary);
      }
    }
  }, [theme, themeName, favoriteTeam]);

  const value: ThemeContextType = {
    theme,
    themeName,
    setTheme,
    favoriteTeam,
    setFavoriteTeam: handleSetFavoriteTeam,
    getTeamColors,
  };

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme(): ThemeContextType {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
}
