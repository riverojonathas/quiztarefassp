import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { User } from '../domain/models';

interface SessionState {
  user: User | null;
  lastScore: number | null;
  isLoading: boolean;
  setUser: (user: User | null) => void;
  setLastScore: (score: number) => void;
  setLoading: (loading: boolean) => void;
  logout: () => Promise<void>;
  initialize: () => Promise<void>;
}

export const useSessionStore = create<SessionState>()(
  persist(
    (set, get) => ({
      user: null,
      lastScore: null,
      isLoading: true,
      setUser: (user) => set({ user }),
      setLastScore: (score) => set({ lastScore: score }),
      setLoading: (loading) => set({ isLoading: loading }),
      logout: async () => {
        try {
          // Import supabase dynamically to avoid circular dependencies
          const { supabase } = await import('../lib/supabase');
          await supabase.auth.signOut();
        } catch (error) {
          console.error('Error signing out from Supabase:', error);
        } finally {
          // Always clear local state and persisted state
          set({ user: null, lastScore: null, isLoading: false });
          // Clear persisted data
          localStorage.removeItem('quiz-session-storage');
        }
      },
      initialize: async () => {
        try {
          const { supabase } = await import('../lib/supabase');

          // Get initial session
          const { data: { session }, error } = await supabase.auth.getSession();

          if (error) {
            // Handle "Auth session missing!" error gracefully
            if (error.message.includes('Auth session missing')) {
              set({ user: null, isLoading: false });
              return;
            }
            console.error('useSessionStore: Error getting session:', error);
            set({ isLoading: false });
            return;
          }

          if (session?.user) {
            // Check if user profile exists
            const { data: profileData, error: profileError } = await supabase
              .from('user_profiles')
              .select('nickname')
              .eq('user_id', session.user.id)
              .single();

            let profileNickname: string | null = null;
            if (!profileError && profileData) {
              profileNickname = profileData.nickname;
            }
            // If profile doesn't exist, it's not an error - just use email fallback

            set({
              user: {
                id: session.user.id,
                name: profileNickname || session.user.email || 'Usuário'
              },
              isLoading: false
            });
          } else {
            set({ user: null, isLoading: false });
          }

          // Listen for auth state changes
          supabase.auth.onAuthStateChange(
            async (event, session) => {
              try {
                const { supabase } = await import('../lib/supabase');
                if (event === 'SIGNED_IN' && session?.user) {
                  // Check if user profile exists
                  const { data: profileData, error: profileError } = await supabase
                    .from('user_profiles')
                    .select('nickname')
                    .eq('user_id', session.user.id)
                    .single();

                  let profileNickname: string | null = null;
                  if (!profileError && profileData) {
                    profileNickname = profileData.nickname;
                  }

                  set({
                    user: {
                      id: session.user.id,
                      name: profileNickname || session.user.email || 'Usuário'
                    },
                    isLoading: false
                  });
                } else if (event === 'SIGNED_OUT' || event === 'TOKEN_REFRESHED' && !session) {
                  set({ user: null, isLoading: false });
                } else if (event === 'TOKEN_REFRESHED' && session?.user) {
                  // Token was refreshed successfully, update user if needed
                  const currentUser = get().user;
                  if (!currentUser || currentUser.id !== session.user.id) {
                    const { data: profileData, error: profileError } = await supabase
                      .from('user_profiles')
                      .select('nickname')
                      .eq('user_id', session.user.id)
                      .single();

                    let profileNickname: string | null = null;
                    if (!profileError && profileData) {
                      profileNickname = profileData.nickname;
                    }

                    set({
                      user: {
                        id: session.user.id,
                        name: profileNickname || session.user.email || 'Usuário'
                      }
                    });
                  }
                }
              } catch (error) {
                console.error('Error in auth state change handler:', error);
                // Handle "Auth session missing!" error gracefully
                if (error instanceof Error && error.message.includes('Auth session missing')) {
                  console.log('Auth session missing during state change - clearing user');
                  set({ user: null, isLoading: false });
                }
              }
            }
          );
        } catch (error) {
          console.error('Error initializing session:', error);
          set({ isLoading: false });
        }
      },
    }),
    {
      name: 'quiz-session-storage',
      partialize: (state) => ({ user: state.user }), // Only persist user data
    }
  )
);