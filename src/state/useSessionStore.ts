import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { User } from '../domain/models';

interface SessionState {
  user: User | null;
  lastScore: number | null;
  setUser: (user: User) => void;
  setLastScore: (score: number) => void;
  logout: () => Promise<void>;
}

export const useSessionStore = create<SessionState>()(
  persist(
    (set) => ({
      user: null,
      lastScore: null,
      setUser: (user) => set({ user }),
      setLastScore: (score) => set({ lastScore: score }),
      logout: async () => {
        try {
          // Import supabase dynamically to avoid circular dependencies
          const { supabase } = await import('../lib/supabase');
          await supabase.auth.signOut();
        } catch (error) {
          console.error('Error signing out from Supabase:', error);
        } finally {
          // Always clear local state
          set({ user: null, lastScore: null });
        }
      },
    }),
    {
      name: 'quiz-session-storage',
      partialize: (state) => ({ user: state.user }), // Only persist user data
    }
  )
);