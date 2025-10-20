import { supabase } from './src/lib/supabase';

async function testQuestions() {
  try {
    console.log('Testando conexão com Supabase...');

    const { data, error } = await supabase
      .from('questions')
      .select('id, text, type, category, choices, correct_answer')
      .limit(3);

    if (error) {
      console.error('Erro na query:', error);
      return;
    }

    console.log('Questões encontradas:', data?.length || 0);
    if (data && data.length > 0) {
      console.log('Primeira questão:');
      console.log(JSON.stringify(data[0], null, 2));
    } else {
      console.log('Nenhuma questão encontrada');
    }
  } catch (err) {
    console.error('Erro geral:', err);
  }
}

testQuestions();