import { createClient } from '@supabase/supabase-js';
import type { Database } from './database.types';

// Configuração simples e direta
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

// Validação obrigatória - falha se não estiver configurado
if (!supabaseUrl || supabaseUrl === 'https://your-project.supabase.co') {
  throw new Error('NEXT_PUBLIC_SUPABASE_URL não configurado corretamente');
}

if (!supabaseKey || supabaseKey === 'your-anon-key') {
  throw new Error('NEXT_PUBLIC_SUPABASE_ANON_KEY não configurado corretamente');
}

// Cliente simples
export const supabase = createClient<Database>(supabaseUrl, supabaseKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true,
    flowType: 'pkce',
  },
});

// Função de erro simples
export const handleSupabaseError = (error: unknown, context: string) => {
  console.error(`Supabase error in ${context}:`, error);
  return { error: error instanceof Error ? error.message : 'Erro desconhecido' };
};