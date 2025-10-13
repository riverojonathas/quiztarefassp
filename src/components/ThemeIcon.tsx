'use client';

import React, { useEffect, useState } from 'react';
import { lazy, Suspense, ComponentType } from 'react';
import { LucideProps } from 'lucide-react';
import { useTheme } from '@/hooks/useTheme';
import { WorldCupIcons } from './icons/WorldCupIcons';

// Mapeamento de ícones temáticos da Copa
const worldCupIconMap: Record<string, ComponentType<{ className?: string }>> = {
  'trophy': WorldCupIcons.Trophy,
  'award': WorldCupIcons.Trophy,
  'medal': WorldCupIcons.Medal,
  'star': WorldCupIcons.Trophy,
  'target': WorldCupIcons.Goal,
  'flag': WorldCupIcons.Flag,
  'map': WorldCupIcons.World,
  'globe': WorldCupIcons.World,
  'stadium': WorldCupIcons.Stadium,
  'home': WorldCupIcons.Stadium,
  'ball': WorldCupIcons.Ball,
  'circle': WorldCupIcons.Ball,
  'play': WorldCupIcons.Ball,
  'gamepad-2': WorldCupIcons.Ball,
  'users': WorldCupIcons.Stadium,
  'user-check': WorldCupIcons.Medal,
  'settings': WorldCupIcons.Whistle,
  'cog': WorldCupIcons.Whistle,
  'bar-chart': WorldCupIcons.Medal,
  'trending-up': WorldCupIcons.Medal,
};

// Cache for loaded Lucide icons
const lucideIconCache = new Map<string, ComponentType<LucideProps>>();

interface ThemeIconProps extends LucideProps {
  name: string;
  fallback?: React.ReactNode;
}

function ThemeIconComponent({ name, fallback, ...props }: ThemeIconProps) {
  const { themeName } = useTheme();
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  // Se estiver no tema World Cup e o ícone tiver mapeamento temático, use o ícone temático
  if (themeName === 'world-cup-2026' && worldCupIconMap[name]) {
    const ThematicIcon = worldCupIconMap[name];
    return <ThematicIcon {...props} />;
  }

  // Durante SSR, retorna um placeholder
  if (!isClient) {
    return fallback || <div className="w-6 h-6 animate-pulse bg-gray-200 rounded" />;
  }

  // No cliente, usa lazy loading para ícones do Lucide
  if (lucideIconCache.has(name)) {
    const IconComponent = lucideIconCache.get(name);
    if (IconComponent && typeof IconComponent === 'function') {
      return <IconComponent {...props} />;
    }
    // If cached component is invalid, remove from cache and continue to lazy load
    lucideIconCache.delete(name);
  }

  // Create a lazy-loaded Lucide component
  const LazyLucideIcon = lazy(() =>
    import('lucide-react').then(module => {
      const IconComponent = module[name as keyof typeof module] as ComponentType<LucideProps>;
      if (IconComponent && typeof IconComponent === 'function') {
        // Cache the component for future use only if it exists and is valid
        lucideIconCache.set(name, IconComponent);
        return { default: IconComponent };
      } else {
        // Icon doesn't exist, use fallback
        const FallbackIcon = ({ ...props }: LucideProps) => (
          <svg {...props} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="12" cy="12" r="10" />
            <path d="m15 9-6 6" />
            <path d="m9 9 6 6" />
          </svg>
        );
        lucideIconCache.set(name, FallbackIcon);
        return { default: FallbackIcon };
      }
    }).catch(() => {
      // Fallback to a generic icon if import fails
      const FallbackIcon = ({ ...props }: LucideProps) => (
        <svg {...props} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <circle cx="12" cy="12" r="10" />
          <path d="m15 9-6 6" />
          <path d="m9 9 6 6" />
        </svg>
      );
      lucideIconCache.set(name, FallbackIcon);
      return { default: FallbackIcon };
    })
  );

  return (
    <Suspense fallback={fallback || <div className="w-6 h-6 animate-pulse bg-gray-200 rounded" />}>
      <LazyLucideIcon {...props} />
    </Suspense>
  );
}

export { ThemeIconComponent as ThemeIcon };