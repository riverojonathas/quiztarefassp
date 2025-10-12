'use client';

import { useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { MemoizedNavItem } from './MemoizedNavItem';
import { useSwipe } from '../hooks/useSwipe';
import { useBackGesture } from '../hooks/useBackGesture';

export function Header() {
  const router = useRouter();
  const pathname = usePathname();
  const [loadingStates, setLoadingStates] = useState<Record<string, boolean>>({});
  const navRef = useSwipe({
    onSwipeLeft: () => {
      const currentIndex = navItems.findIndex(item => isActive(item.href));
      const nextIndex = (currentIndex + 1) % navItems.length;
      handleNavigation(navItems[nextIndex].href);
    },
    onSwipeRight: () => {
      const currentIndex = navItems.findIndex(item => isActive(item.href));
      const prevIndex = currentIndex === 0 ? navItems.length - 1 : currentIndex - 1;
      handleNavigation(navItems[prevIndex].href);
    },
  });

  useBackGesture();

  const handleNavigation = async (href: string) => {
    if (pathname === href) return;

    setLoadingStates(prev => ({ ...prev, [href]: true }));
    router.push(href);
    setLoadingStates(prev => ({ ...prev, [href]: false }));
  };

  const navItems = [
    { href: '/home', icon: 'Home', label: 'Home', description: 'Página inicial' },
    { href: '/ranking', icon: 'Trophy', label: 'Ranking', description: 'Ver classificações' },
    { href: '/play', icon: 'Play', label: 'Jogar', description: 'Escolher modo de jogo' },
    { href: '/settings', icon: 'Settings', label: 'Config', description: 'Configurações' },
  ];

  const isActive = (href: string) => {
    if (href === '/home') {
      return pathname === '/home' || pathname === '/';
    }
    return pathname === href || pathname.startsWith(href + '/');
  };

  return (
    <nav
      ref={navRef}
      role="navigation"
      aria-label="Navegação principal"
      className="fixed bottom-0 left-0 right-0 z-50 bg-gradient-to-r from-blue-50 via-indigo-50 to-purple-50 backdrop-blur-md border-t border-indigo-200/50 shadow-xl pb-safe"
    >
      <div className="flex items-center justify-center px-2 py-2 max-w-md mx-auto relative">
        {navItems.map((item, index) => {
          const active = isActive(item.href);
          const isLoading = loadingStates[item.href];

          // Botão Jogar destacado no centro
          if (item.href === '/play') {
            return (
              <div key={item.href} className="mx-4">
                <button
                  onClick={() => handleNavigation(item.href)}
                  className="bg-gradient-to-r from-indigo-500 to-purple-600 text-white rounded-full p-3 shadow-lg hover:shadow-xl active:scale-95 transition-all duration-300 focus:outline-none focus:ring-4 focus:ring-indigo-300 group border-2 border-white/20"
                  aria-label="Jogar - Escolher modo de jogo"
                >
                  <div className="flex flex-col items-center">
                    <div className={`w-6 h-6 transition-all duration-300 ${isLoading ? 'animate-spin' : 'group-hover:scale-110'}`}>
                      {isLoading ? (
                        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                      ) : (
                        <svg className="w-6 h-6 drop-shadow-sm" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.828 14.828a4 4 0 01-5.656 0M9 10h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                      )}
                    </div>
                    <span className="text-xs font-bold mt-1 drop-shadow-sm">JOGAR</span>
                  </div>
                </button>
              </div>
            );
          }

          return (
            <MemoizedNavItem
              key={item.href}
              item={item}
              isActive={active}
              isLoading={isLoading}
              onNavigate={handleNavigation}
            />
          );
        })}
      </div>
    </nav>
  );
}