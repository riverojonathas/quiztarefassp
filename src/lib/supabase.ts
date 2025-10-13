import { createClient } from '@supabase/supabase-js';
import type { Database } from './database.types';

// Configuration for different environments
const isDevelopment = process.env.NODE_ENV === 'development';
const useLocalSupabase = process.env.USE_LOCAL_SUPABASE === 'true' || !process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL === 'https://your-project.supabase.co';

let supabaseUrl: string;
let supabaseKey: string;

if (isDevelopment && useLocalSupabase) {
  // Use local Supabase for development
  supabaseUrl = 'http://127.0.0.1:54321';
  supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6ImFub24iLCJleHAiOjE5ODM4MTI5OTZ9.CRXP1A7WOeoJeXxjNni43kdQwgnWNReilDMblYTn_I0';
  console.log('🔧 Using local Supabase development setup');
} else {
  // Use remote Supabase
  supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://your-project.supabase.co';
  supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'your-anon-key';
  console.log('✅ Using remote Supabase:', supabaseUrl);
}

// Validate environment variables for production
if (!isDevelopment && (!process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL === 'https://your-project.supabase.co')) {
  console.error('❌ NEXT_PUBLIC_SUPABASE_URL not configured for production');
}

if (!isDevelopment && (!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY === 'your-anon-key')) {
  console.error('❌ NEXT_PUBLIC_SUPABASE_ANON_KEY not configured for production');
}

// Create Supabase client with fallback for development
let supabase: ReturnType<typeof createClient<Database>>;

try {
  supabase = createClient(supabaseUrl, supabaseKey, {
    auth: {
      autoRefreshToken: true,
      persistSession: true,
      detectSessionInUrl: true,
      flowType: 'pkce',
    },
    global: {
      headers: {
        'X-Client-Info': 'quiz-app',
      },
      fetch: async (url, options = {}) => {
        try {
          const response = await fetch(url, options);
          return response;
        } catch (error) {
          // Intercept network errors for Supabase requests
          const urlString = url instanceof Request ? url.url : url.toString();
          if (urlString.includes('supabase') || urlString.includes('127.0.0.1:54321')) {
            console.warn('🚨 Supabase network error intercepted:', error);
            // Return a response that indicates network error
            return new Response(JSON.stringify({
              error: {
                message: 'Network error: Please check your internet connection and try again.',
                status: 0
              }
            }), {
              status: 0,
              statusText: 'Network Error',
              headers: { 'Content-Type': 'application/json' }
            });
          }
          throw error;
        }
      },
    },
  });
} catch (error) {
  console.error('Failed to create Supabase client:', error);
  // Create a minimal fallback client
  supabase = createClient('https://dummy.supabase.co', 'dummy-key', {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  });
}

export { supabase };

// Add error handling for network issues
supabase.auth.onAuthStateChange(async (event, session) => {
  try {
    console.log('Auth state changed:', event, session ? 'with session' : 'no session');

    // If there's a network error during token refresh, the session might be null
    if (event === 'TOKEN_REFRESHED' && !session) {
      console.warn('Token refresh failed - session is null, user may need to re-authenticate');
    }
  } catch (error) {
    console.warn('Error in auth state change handler:', error);
    // Don't throw - we don't want to break the auth flow
  }
});

// Enhanced error handler that checks network status
export const handleSupabaseError = async (error: unknown, context: string) => {
  const errorMessage = error instanceof Error ? error.message : String(error);

  // Check for specific Supabase error types
  if (errorMessage.includes('Failed to fetch') || errorMessage.includes('NetworkError') || errorMessage.includes('fetch failed')) {
    console.warn(`🚨 Network error in ${context}: Supabase service may be temporarily unavailable.`);
    return { error: 'Erro de conexão: Verifique sua internet e tente novamente. Se o problema persistir, o serviço pode estar temporariamente indisponível.' };
  }

  if (errorMessage.includes('Invalid login credentials')) {
    return { error: 'Email ou senha incorretos. Verifique suas credenciais e tente novamente.' };
  }

  if (errorMessage.includes('Email not confirmed')) {
    return { error: 'Email não confirmado. Verifique sua caixa de entrada e confirme seu email antes de fazer login.' };
  }

  if (errorMessage.includes('User already registered')) {
    return { error: 'Este email já está cadastrado. Tente fazer login ou use a opção "Esqueci minha senha".' };
  }

  if (errorMessage.includes('CORS')) {
    console.warn(`🚨 CORS error in ${context}: There may be a configuration issue.`);
    return { error: 'Erro de configuração. Tente novamente em alguns instantes.' };
  }

  // Check for database-specific errors
  if (errorMessage.includes('PGRST116')) {
    return { error: 'Perfil não encontrado. Complete seu cadastro primeiro.' };
  }

  console.error(`❌ Supabase error in ${context}:`, error);
  return { error: errorMessage || 'Ocorreu um erro inesperado. Tente novamente.' };
};

// Type definitions for safe wrappers
type SupabaseAuthResult<T = unknown> = { data: T; error: null } | { error: string };
type SupabaseDbResult<T = unknown> = { data: T; error: null } | { error: string };

// Wrapper for Supabase auth operations with error handling
export const safeSupabaseAuth = {
  getUser: async () => {
    try {
      const { data, error } = await supabase.auth.getUser();
      if (error) {
        return await handleSupabaseError(error, 'getUser');
      }
      return { data, error: null };
    } catch (error) {
      return await handleSupabaseError(error, 'getUser');
    }
  },

  getSession: async () => {
    try {
      const { data, error } = await supabase.auth.getSession();
      if (error) {
        return await handleSupabaseError(error, 'getSession');
      }
      return { data, error: null };
    } catch (error) {
      return await handleSupabaseError(error, 'getSession');
    }
  },

  signInWithPassword: async (credentials: { email: string; password: string }) => {
    try {
      const { data, error } = await supabase.auth.signInWithPassword(credentials);
      if (error) {
        return await handleSupabaseError(error, 'signInWithPassword');
      }
      return { data, error: null };
    } catch (error) {
      return await handleSupabaseError(error, 'signInWithPassword');
    }
  },

  signUp: async (credentials: { email: string; password: string }) => {
    try {
      const { data, error } = await supabase.auth.signUp(credentials);
      if (error) {
        return await handleSupabaseError(error, 'signUp');
      }
      return { data, error: null };
    } catch (error) {
      return await handleSupabaseError(error, 'signUp');
    }
  },

  signOut: async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) {
        return await handleSupabaseError(error, 'signOut');
      }
      return { error: null };
    } catch (error) {
      return await handleSupabaseError(error, 'signOut');
    }
  },

  resetPasswordForEmail: async (email: string, options?: { redirectTo?: string }) => {
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, options);
      if (error) {
        return await handleSupabaseError(error, 'resetPasswordForEmail');
      }
      return { error: null };
    } catch (error) {
      return await handleSupabaseError(error, 'resetPasswordForEmail');
    }
  },

  updateUser: async (updates: { password?: string; email?: string; data?: Record<string, unknown> }) => {
    try {
      const { data, error } = await supabase.auth.updateUser(updates);
      if (error) {
        return await handleSupabaseError(error, 'updateUser');
      }
      return { data, error: null };
    } catch (error) {
      return await handleSupabaseError(error, 'updateUser');
    }
  },
};

export const safeSupabaseDb = {
  from: (table: 'leaderboard' | 'users' | 'matches' | 'questions' | 'user_profiles') => ({
    select: (columns: string) => ({
      eq: (column: string, value: any) => ({ // eslint-disable-line @typescript-eslint/no-explicit-any
        single: async () => {
          try {
            const { data, error } = await supabase
              .from(table)
              .select(columns)
              .eq(column, value)
              .single();
            if (error) {
              return await handleSupabaseError(error, `select from ${table}`);
            }
            return { data, error: null };
          } catch (error) {
            return await handleSupabaseError(error, `select from ${table}`);
          }
        },
      }),
    }),
  }),
};