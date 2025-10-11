import { create } from 'zustand';
import { User } from '../domain/models';

interface SessionState {
  user: User | null;
  lastScore: number | null;
  setUser: (user: User) => void;
  setLastScore: (score: number) => void;
  logout: () => void;
}

export const useSessionStore = create<SessionState>((set) => ({
  user: null,
  lastScore: null,
  setUser: (user) => set({ user }),
  setLastScore: (score) => set({ lastScore: score }),
  logout: () => set({ user: null, lastScore: null }),
}));