import { createClient } from '@supabase/supabase-js';
import { config } from 'dotenv';

config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

const supabase = createClient(supabaseUrl, supabaseKey);

async function fixOnboardingColumn() {
  try {
    console.log('Verificando e corrigindo coluna onboarding_completed...');

    // Primeiro, tentar uma query simples para ver se a coluna existe
    const { error: checkError } = await supabase
      .from('user_profiles')
      .select('onboarding_completed')
      .limit(1);

    if (!checkError) {
      console.log('✅ Coluna onboarding_completed já existe!');
      return;
    }

    console.log('❌ Coluna onboarding_completed não existe. Criando...');

    // Como não podemos executar DDL via cliente anon, vamos tentar uma abordagem diferente
    // Vamos usar o cliente admin ou sugerir execução manual
    console.log('⚠️  Não é possível adicionar colunas via cliente anon.');
    console.log('📋 Execute manualmente no painel Supabase SQL Editor:');
    console.log(`
-- Adicionar coluna onboarding_completed
ALTER TABLE user_profiles ADD COLUMN onboarding_completed BOOLEAN DEFAULT FALSE;

-- Atualizar perfis existentes
UPDATE user_profiles
SET onboarding_completed = TRUE
WHERE nickname IS NOT NULL AND avatar_seed IS NOT NULL;
    `);

  } catch (error) {
    console.error('Erro geral:', error);
  }
}

fixOnboardingColumn();