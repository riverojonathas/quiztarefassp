import { create } from 'zustand';
import { User } from '../domain/models';

interface SessionState {
  user: User | null;
  setUser: (user: User) => void;
  logout: () => void;
}

export const useSessionStore = create<SessionState>((set) => ({
  user: null,
  setUser: (user) => set({ user }),
  logout: () => set({ user: null }),
}));