'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useSessionStore } from '../state/useSessionStore';

export function Header() {
  const user = useSessionStore((state) => state.user);
  const logout = useSessionStore((state) => state.logout);
  const router = useRouter();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleLogout = async () => {
    await logout();
    router.push('/signin');
  };

  const navItems = [
    { href: '/home', label: '🏠 Home', description: 'Página inicial' },
    { href: '/lobby', label: '🎮 Lobby', description: 'Criar/Entrar em salas' },
    { href: '/ranking', label: '🏆 Ranking', description: 'Ver classificações' },
    { href: '/analytics', label: '📊 Analytics', description: 'Suas estatísticas' },
  ];

  return (
    <header className="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 shadow-lg">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          {/* Logo/Brand */}
          <Link href="/home" className="flex items-center space-x-2 group">
            <div className="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center group-hover:bg-white/30 transition-colors">
              <span className="text-white font-bold text-lg">Q</span>
            </div>
            <span className="text-white font-bold text-xl hidden sm:block">QuizMaster</span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-1">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="relative px-4 py-2 text-white/90 hover:text-white font-medium rounded-lg hover:bg-white/10 transition-all duration-200 group"
                title={item.description}
              >
                {item.label}
                <span className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-0 h-0.5 bg-white group-hover:w-full transition-all duration-300"></span>
              </Link>
            ))}
          </nav>

          {/* User Section */}
          <div className="flex items-center space-x-3">
            {user && (
              <div className="hidden sm:flex items-center space-x-2 text-white/90">
                <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center">
                  <span className="text-sm font-medium">
                    {user.name.charAt(0).toUpperCase()}
                  </span>
                </div>
                <span className="text-sm font-medium">{user.name}</span>
              </div>
            )}

            {/* Logout Button */}
            {user && (
              <button
                onClick={handleLogout}
                className="px-4 py-2 bg-white/10 hover:bg-white/20 text-white font-medium rounded-lg transition-colors duration-200 flex items-center space-x-2"
              >
                <span>🚪</span>
                <span className="hidden sm:inline">Sair</span>
              </button>
            )}

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="md:hidden p-2 text-white hover:bg-white/10 rounded-lg transition-colors"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={isMenuOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"} />
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden border-t border-white/10">
            <nav className="py-4 space-y-2">
              {navItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="block px-4 py-3 text-white/90 hover:text-white hover:bg-white/10 rounded-lg transition-colors flex items-center space-x-3"
                  onClick={() => setIsMenuOpen(false)}
                >
                  <span className="text-lg">{item.label.split(' ')[0]}</span>
                  <span>{item.label.split(' ').slice(1).join(' ')}</span>
                </Link>
              ))}

              {user && (
                <div className="px-4 py-3 border-t border-white/10 mt-4">
                  <div className="flex items-center space-x-3 mb-3">
                    <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
                      <span className="text-white font-medium">
                        {user.name.charAt(0).toUpperCase()}
                      </span>
                    </div>
                    <div>
                      <p className="text-white font-medium">{user.name}</p>
                      <p className="text-white/60 text-sm">Logado</p>
                    </div>
                  </div>
                  <button
                    onClick={() => {
                      handleLogout();
                      setIsMenuOpen(false);
                    }}
                    className="w-full px-4 py-2 bg-red-500/20 hover:bg-red-500/30 text-white font-medium rounded-lg transition-colors flex items-center justify-center space-x-2"
                  >
                    <span>🚪</span>
                    <span>Sair da conta</span>
                  </button>
                </div>
              )}
            </nav>
          </div>
        )}
      </div>
    </header>
  );
}