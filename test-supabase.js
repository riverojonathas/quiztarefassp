import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://ntiadxsvduowjvxuahzy.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im50aWFkeHN2ZHVvd2p2eHVhaHp5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjAxMTczNTIsImV4cCI6MjA3NTY5MzM1Mn0.SItaxMOqKWgO7lQfy2rMwdariy9vzIWGvZU_CmKFqxo';

const supabase = createClient(supabaseUrl, supabaseKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false,
  },
});

async function testConnection() {
  try {
    console.log('Testing Supabase connection...');
    console.log('URL:', supabaseUrl);
    console.log('Key starts with:', supabaseKey.substring(0, 20) + '...');

    // Test basic connection with auth header
    const response = await fetch(`${supabaseUrl}/rest/v1/users?select=count`, {
      method: 'HEAD',
      headers: {
        'apikey': supabaseKey,
        'Authorization': `Bearer ${supabaseKey}`,
      },
    });

    console.log('Response status:', response.status);
    console.log('Response headers:', Object.fromEntries(response.headers.entries()));

    if (response.ok) {
      console.log('✅ Basic connectivity test passed!');
    } else {
      console.log('⚠️ Response not OK, but connection works');
    }

    // Test Supabase client
    console.log('\nTesting Supabase client...');
    const { data, error } = await supabase.from('users').select('count').limit(1);

    if (error) {
      console.error('❌ Supabase client error:', error);
      return;
    }

    console.log('✅ Supabase client connection successful!');
    console.log('Data:', data);

  } catch (error) {
    console.error('❌ Unexpected error:', error);
    console.error('Error name:', error.name);
    console.error('Error message:', error.message);
    if (error.cause) {
      console.error('Error cause:', error.cause);
    }
  }
}

testConnection();