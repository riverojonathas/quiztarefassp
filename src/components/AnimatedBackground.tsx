'use client';

import React from 'react';
import { useTheme } from '@/hooks/useTheme';
import { nationalTeamColors } from '@/lib/themes';

interface AnimatedBackgroundProps {
  children: React.ReactNode;
}

export const AnimatedBackground: React.FC<AnimatedBackgroundProps> = ({ children }) => {
  const { themeName, favoriteTeam } = useTheme();

  if (themeName === 'world-cup-2026') {
    return (
      <div className="relative min-h-screen overflow-hidden">
        <WorldCupBackgroundSimple favoriteTeam={favoriteTeam} />
        <div className="relative z-10">
          {children}
        </div>
      </div>
    );
  }

  // Tema original - background padrão
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-500 to-purple-600">
      {children}
    </div>
  );
};

interface WorldCupBackgroundProps {
  favoriteTeam: string | null;
}

const WorldCupBackgroundSimple: React.FC<{ favoriteTeam: string | null }> = ({ favoriteTeam }) => {
  return (
    <div className="fixed inset-0 -z-10">
      {/* Gradiente base */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-900/20 via-blue-600/10 to-blue-400/20" />

      {/* Elementos flutuantes */}
      <FloatingElements favoriteTeam={favoriteTeam} />

      {/* Overlay sutil */}
      <div className="absolute inset-0 bg-black/5" />
    </div>
  );
};

interface FloatingElementsProps {
  favoriteTeam: string | null;
}

const FloatingElements: React.FC<FloatingElementsProps> = ({ favoriteTeam }) => {
  const teamColors = favoriteTeam ? nationalTeamColors[favoriteTeam] : null;

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {/* Bolas de futebol flutuantes */}
      <div className="absolute top-20 left-10 animate-float-slow">
        <FootballIcon className="w-8 h-8 opacity-20" color={teamColors?.primary || '#1e40af'} />
      </div>
      <div className="absolute top-40 right-20 animate-float-medium">
        <FootballIcon className="w-6 h-6 opacity-15" color={teamColors?.secondary || '#3b82f6'} />
      </div>
      <div className="absolute bottom-32 left-1/4 animate-float-fast">
        <FootballIcon className="w-4 h-4 opacity-25" color={teamColors?.primary || '#1e40af'} />
      </div>
      <div className="absolute top-1/3 right-10 animate-float-slow">
        <FootballIcon className="w-5 h-5 opacity-20" color={teamColors?.secondary || '#3b82f6'} />
      </div>

      {/* Bandeiras flutuantes */}
      {favoriteTeam && (
        <>
          <div className="absolute top-60 left-20 animate-float-medium">
            <FlagIcon className="w-6 h-4 opacity-30" primaryColor={teamColors?.primary} secondaryColor={teamColors?.secondary} />
          </div>
          <div className="absolute bottom-40 right-1/3 animate-float-slow">
            <FlagIcon className="w-8 h-5 opacity-25" primaryColor={teamColors?.primary} secondaryColor={teamColors?.secondary} />
          </div>
        </>
      )}

      {/* Estrelas/troféus sutis */}
      <div className="absolute top-32 right-1/3 animate-pulse-slow">
        <StarIcon className="w-3 h-3 opacity-15" color={teamColors?.primary || '#fbbf24'} />
      </div>
      <div className="absolute bottom-60 left-1/2 animate-pulse-medium">
        <StarIcon className="w-2 h-2 opacity-20" color={teamColors?.secondary || '#f59e0b'} />
      </div>
    </div>
  );
};

// Componentes de ícones simples
const FootballIcon: React.FC<{ className?: string; color: string }> = ({ className, color }) => (
  <svg className={className} viewBox="0 0 24 24" fill={color}>
    <circle cx="12" cy="12" r="10" opacity="0.8"/>
    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17.93c-3.94-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.39z"/>
  </svg>
);

const FlagIcon: React.FC<{ className?: string; primaryColor?: string; secondaryColor?: string }> = ({
  className,
  primaryColor = '#009739',
  secondaryColor = '#FEDD00'
}) => (
  <svg className={className} viewBox="0 0 24 24" fill="none">
    <path d="M4 21V2h16l-2 5 2 5H4" fill={primaryColor} opacity="0.8"/>
    <rect x="4" y="2" width="2" height="19" fill="#8B4513" opacity="0.6"/>
    <rect x="6" y="4" width="10" height="2" fill={secondaryColor} opacity="0.9"/>
  </svg>
);

const StarIcon: React.FC<{ className?: string; color: string }> = ({ className, color }) => (
  <svg className={className} viewBox="0 0 24 24" fill={color}>
    <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
  </svg>
);