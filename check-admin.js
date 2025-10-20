import { createClient } from '@supabase/supabase-js';
import { config } from 'dotenv';

config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('Missing Supabase credentials');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function createAdminUser() {
  try {
    console.log('Creating admin user...');

    // Primeiro, tentar fazer signup do usuário admin
    const { data: authData, error: signupError } = await supabase.auth.signUp({
      email: 'admin@quiztarefas.com',
      password: 'admin123456'
    });

    if (signupError) {
      if (signupError.message.includes('already registered')) {
        console.log('Admin user already exists, checking profile...');
      } else {
        console.error('Error creating admin user:', signupError);
        return;
      }
    } else {
      console.log('Admin user created successfully:', authData.user?.email);
    }

    // Agora verificar se o perfil existe e tem a role correta
    const { data: existingProfile, error: profileCheckError } = await supabase
      .from('user_profiles')
      .select('*')
      .eq('user_id', authData.user?.id || (await getUserIdByEmail('admin@quiztarefas.com')));

    if (profileCheckError) {
      console.error('Error checking profile:', profileCheckError);
      return;
    }

    if (!existingProfile || existingProfile.length === 0) {
      console.log('Profile not found, creating admin profile...');

      // Criar perfil admin
      const userId = authData.user?.id || (await getUserIdByEmail('admin@quiztarefas.com'));
      if (!userId) {
        console.error('Could not get user ID');
        return;
      }

      const { error: profileError } = await supabase
        .from('user_profiles')
        .insert({
          user_id: userId,
          role: 'admin',
          nickname: 'Admin'
        });

      if (profileError) {
        console.error('Error creating admin profile:', profileError);
        return;
      }

      console.log('Admin profile created successfully');
    } else {
      console.log('Admin profile already exists:', existingProfile[0]);

      // Verificar se a role está correta
      if (existingProfile[0].role !== 'admin') {
        console.log('Updating role to admin...');
        const { error: updateError } = await supabase
          .from('user_profiles')
          .update({ role: 'admin' })
          .eq('user_id', existingProfile[0].user_id);

        if (updateError) {
          console.error('Error updating role:', updateError);
          return;
        }
        console.log('Role updated to admin successfully');
      }
    }

    console.log('Admin user setup complete!');

  } catch (error) {
    console.error('Unexpected error:', error);
  }
}

async function getUserIdByEmail() {
  // Como não temos acesso à API admin, vamos tentar uma abordagem diferente
  // Fazer login para obter o user ID
  try {
    const { data: signInData, error: signInError } = await supabase.auth.signInWithPassword({
      email: 'admin@quiztarefas.com',
      password: 'admin123456'
    });

    if (signInError) {
      console.error('Error signing in:', signInError);
      return null;
    }

    return signInData.user?.id;
  } catch (error) {
    console.error('Error getting user ID:', error);
    return null;
  }
}

createAdminUser();