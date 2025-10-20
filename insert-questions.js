import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://ntiadxsvduowjvxuahzy.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im50aWFkeHN2ZHVvd2p2eHVhaHp5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjAxMTczNTIsImV4cCI6MjA3NTY5MzM1Mn0.SItaxMOqKWgO7lQfy2rMwdariy9vzIWGvZU_CmKFqxo';

const supabase = createClient(supabaseUrl, supabaseKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false,
  },
});

async function insertSampleQuestions() {
  try {
    console.log('Creating admin user...');

    // Create admin user
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email: 'admin@quiztarefassp.com',
      password: 'admin123456',
    });

    if (authError && !authError.message.includes('already registered')) {
      console.error('❌ Error creating admin user:', authError);
      return;
    }

    console.log('✅ Admin user ready');

    if (authData?.user?.id) {
      // Create user profile
      const { error: profileError } = await supabase
        .from('user_profiles')
        .upsert({
          id: authData.user.id,
          username: 'admin',
          role: 'admin',
          onboarding_completed: true
        });

      if (profileError) {
        console.error('❌ Error creating admin profile:', profileError);
      } else {
        console.log('✅ Admin profile created');
      }

      // Sign in as admin
      const { error: signInError } = await supabase.auth.signInWithPassword({
        email: 'admin@quiztarefassp.com',
        password: 'admin123456',
      });

      if (signInError) {
        console.error('❌ Error signing in:', signInError);
      } else {
        console.log('✅ Signed in as admin');
      }
    }

    // Insert questions
    const sampleQuestions = [
      {
        text: 'Qual é a capital do Brasil?',
        type: 'multiple_choice',
        category: 'Geografia',
        difficulty: 'easy',
        choices: ['São Paulo', 'Rio de Janeiro', 'Brasília', 'Salvador'],
        correct_answer: 'Brasília',
        explanation: 'Brasília é a capital federal do Brasil.',
        tags: ['Geografia', 'Brasil']
      },
      {
        text: 'Quanto é 15 + 27?',
        type: 'multiple_choice',
        category: 'Matemática',
        difficulty: 'easy',
        choices: ['42', '41', '43', '40'],
        correct_answer: '42',
        explanation: '15 + 27 = 42.',
        tags: ['Matemática', 'Adição']
      }
    ];

    console.log('Inserting questions...');
    const { data, error } = await supabase
      .from('questions')
      .insert(sampleQuestions)
      .select();

    if (error) {
      console.error('❌ Error inserting questions:', error);
      return;
    }

    console.log('✅ Successfully inserted questions:', data?.length || 0);

  } catch (error) {
    console.error('❌ Unexpected error:', error);
  }
}

insertSampleQuestions();