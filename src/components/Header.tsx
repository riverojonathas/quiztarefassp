'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useSessionStore } from '../state/useSessionStore';

export function Header() {
  const user = useSessionStore((state) => state.user);
  const logout = useSessionStore((state) => state.logout);
  const [theme, setTheme] = useState('default'); // default, blue, green

  const themes = {
    default: 'bg-gradient-to-r from-blue-500 to-purple-600',
    blue: 'bg-gradient-to-r from-blue-400 to-blue-600',
    green: 'bg-gradient-to-r from-green-400 to-green-600',
  };

  return (
    <header className={`shadow p-4 ${themes[theme as keyof typeof themes]}`}>
      <div className="container mx-auto flex justify-between items-center">
        <h1 className="text-xl font-bold text-white">Quiz App</h1>
        <nav className="space-x-4">
          <Link href="/home" className="text-white hover:underline">Home</Link>
          <Link href="/lobby" className="text-white hover:underline">Lobby</Link>
          <Link href="/ranking" className="text-white hover:underline">Ranking</Link>
          <Link href="/analytics" className="text-white hover:underline">Analytics</Link>
          <select
            value={theme}
            onChange={(e) => setTheme(e.target.value)}
            className="bg-white text-black rounded px-2 py-1"
          >
            <option value="default">Tema Padrão</option>
            <option value="blue">Tema Azul</option>
            <option value="green">Tema Verde</option>
          </select>
          {user && <button onClick={logout} className="text-white hover:underline">Logout</button>}
        </nav>
      </div>
    </header>
  );
}