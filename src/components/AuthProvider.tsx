'use client';

import { useEffect } from 'react';
import { useSessionStore } from '../state/useSessionStore';

interface AuthProviderProps {
  children: React.ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const initialize = useSessionStore((state) => state.initialize);

  useEffect(() => {
    // Initialize the session store when the app starts
    initialize();
  }, [initialize]);

  return <>{children}</>;
}