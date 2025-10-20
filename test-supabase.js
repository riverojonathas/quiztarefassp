import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://ntiadxsvduowjvxuahzy.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im50aWFkeHN2ZHVvd2p2eHVhaHp5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjAxMTczNTIsImV4cCI6MjA3NTY5MzM1Mn0.SItaxMOqKWgO7lQfy2rMwdariy9vzIWGvZU_CmKFqxo';

const supabase = createClient(supabaseUrl, supabaseKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false,
  },
});

async function testQuestions() {
  try {
    console.log('Testing basic connectivity...');

    // Test basic connectivity
    const { data: testData, error: testError } = await supabase
      .from('questions')
      .select('count')
      .limit(1);

    if (testError) {
      console.error('❌ Basic connectivity error:', testError);
      return;
    }

    console.log('✅ Basic connectivity works');

    console.log('\nTesting questions table...');

    const { data, error } = await supabase
      .from('questions')
      .select('*')
      .eq('type', 'multiple_choice')
      .limit(5);

    if (error) {
      console.error('❌ Error fetching questions:', error);
      console.error('Error details:', {
        message: error.message,
        code: error.code,
        details: error.details,
        hint: error.hint
      });
      return;
    }

    console.log('✅ Query executed successfully');
    console.log('Questions found:', data?.length || 0);

    if (data && data.length > 0) {
      console.log('\n📋 Sample question structure:');
      const question = data[0];
      console.log('ID:', question.id);
      console.log('Type:', question.type);
      console.log('Text:', question.text);
      console.log('Category:', question.category);
      console.log('Difficulty:', question.difficulty);
      console.log('Choices:', question.choices);
      console.log('Correct Answer:', question.correct_answer);
      console.log('Created At:', question.created_at);

      console.log('\n🔍 Field analysis:');
      console.log('All fields:', Object.keys(question));

      // Test the mapping logic from useQuestions
      const choices = Array.isArray(question.choices) ? question.choices : [];
      const correctAnswerIndex = choices.findIndex(choice => choice === question.correct_answer);

      console.log('\n🎯 Mapping test:');
      console.log('Choices array:', choices);
      console.log('Correct answer text:', question.correct_answer);
      console.log('Correct answer index:', correctAnswerIndex);

      console.log('\n✅ Mapped question:');
      console.log({
        id: question.id,
        statement: question.text,
        choices: choices,
        correctAnswer: correctAnswerIndex >= 0 ? correctAnswerIndex : 0,
        skill: question.category || 'Geral',
        timeLimit: getTimeLimitForDifficulty(question.difficulty)
      });
    } else {
      console.log('⚠️ No questions found in database');
      console.log('Checking if table exists...');

      // Try to get table info
      const { data: tableData, error: tableError } = await supabase
        .from('questions')
        .select('*')
        .limit(1);

      if (tableError) {
        console.error('❌ Table access error:', tableError);
      } else {
        console.log('Table exists but is empty');
      }
    }

  } catch (error) {
    console.error('❌ Unexpected error:', error);
  }
}

function getTimeLimitForDifficulty(difficulty) {
  switch (difficulty) {
    case 'easy': return 30;
    case 'medium': return 25;
    case 'hard': return 20;
    default: return 30;
  }
}

testQuestions();