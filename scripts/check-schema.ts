import { createClient } from '@supabase/supabase-js';
import { config } from 'dotenv';

config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

const supabase = createClient(supabaseUrl, supabaseKey);

async function checkSchema() {
  try {
    console.log('Verificando schema da tabela user_profiles...');

    // Tentar fazer uma query simples para ver se a coluna existe
    const { data, error } = await supabase
      .from('user_profiles')
      .select('user_id, nickname, avatar_seed, onboarding_completed')
      .limit(1);

    if (error) {
      console.error('Erro ao consultar user_profiles:', error);
      return;
    }

    console.log('Schema OK - dados encontrados:', data);

    // Verificar se há algum perfil sem onboarding_completed
    const { data: profiles, error: profilesError } = await supabase
      .from('user_profiles')
      .select('user_id, nickname, avatar_seed, onboarding_completed')
      .is('onboarding_completed', null);

    if (profilesError) {
      console.error('Erro ao verificar perfis:', profilesError);
      return;
    }

    console.log(`Encontrados ${profiles?.length || 0} perfis sem onboarding_completed`);

  } catch (error) {
    console.error('Erro geral:', error);
  }
}

checkSchema();