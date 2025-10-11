import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { User } from '../domain/models';

interface SessionState {
  user: User | null;
  lastScore: number | null;
  setUser: (user: User) => void;
  setLastScore: (score: number) => void;
  logout: () => void;
}

export const useSessionStore = create<SessionState>()(
  persist(
    (set) => ({
      user: null,
      lastScore: null,
      setUser: (user) => set({ user }),
      setLastScore: (score) => set({ lastScore: score }),
      logout: () => set({ user: null, lastScore: null }),
    }),
    {
      name: 'quiz-session-storage',
      partialize: (state) => ({ user: state.user }), // Only persist user data
    }
  )
);