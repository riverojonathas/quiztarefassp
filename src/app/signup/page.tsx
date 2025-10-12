'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useSessionStore } from '../../state/useSessionStore';
import { supabase } from '../../lib/supabase';
import { Button } from '../../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';
import { z } from 'zod';

const signupSchema = z.object({
  email: z.string().email('Email inválido – precisamos de um endereço real para missões futuras!'),
  password: z.string().min(1, 'Sua senha precisa ser forte para proteger seus pontos!'),
});

export default function SignUpPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [username, setUsername] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<{ email?: string; password?: string }>({});
  const setUser = useSessionStore((state) => state.setUser);
  const router = useRouter();

  useEffect(() => {
    // Check if user is already logged in
    const checkUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        // Get user from our user_profiles table
        const { data: existingUser } = await supabase
          .from('user_profiles')
          .select('user_id, nickname')
          .eq('user_id', user.id)
          .single();

        if (existingUser) {
          setUser({ id: existingUser.user_id, name: existingUser.nickname || user.email || 'Usuário' });
          router.push('/home');
        } else {
          // User logged in but no profile - redirect to onboarding
          router.push('/onboarding');
        }
      }
    };

    checkUser();

    // Remove automatic auth state listener - we'll handle redirects manually
  }, [setUser, router]);

  const handleEmailSignUp = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validate form
    const result = signupSchema.safeParse({ email, password });
    if (!result.success) {
      const fieldErrors: { email?: string; password?: string } = {};
      result.error.issues.forEach((issue) => {
        if (issue.path[0] === 'email') fieldErrors.email = issue.message;
        if (issue.path[0] === 'password') fieldErrors.password = issue.message;
      });
      setErrors(fieldErrors);
      return;
    }

    setErrors({});
    setIsLoading(true);

    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            username: username || email.split('@')[0]
          }
        }
      });

      if (error) {
        alert('Erro no cadastro: ' + error.message);
        return;
      }

      if (data.user) {
        // Check if user is already confirmed (email confirmation disabled)
        if (data.user.email_confirmed_at) {
          // User is confirmed, try auto-login
          const { data: loginData, error: loginError } = await supabase.auth.signInWithPassword({
            email,
            password,
          });

          if (loginError) {
            alert('Conta criada, mas erro no login automático: ' + loginError.message);
            router.push('/signin');
          } else {
            // Auto-login successful - set user in store and redirect to onboarding
            setUser({ id: loginData.user.id, name: loginData.user.email || 'Usuário' });
            router.push('/onboarding');
          }
        } else {
          // User needs email confirmation
          alert('Conta criada! Verifique seu email para confirmar a conta antes de fazer login.');
          router.push('/signin');
        }
      }
    } catch (error) {
      alert('Erro inesperado: ' + error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-500 to-purple-600 px-4 py-8 sm:px-6 lg:px-8">
      <Card className="w-full max-w-sm sm:max-w-md mx-auto">
        <CardHeader className="pb-4">
          <h1 className="text-center text-2xl font-bold text-gray-900 dark:text-white mb-2">
            Tarefas do Futuro
          </h1>
          <p className="text-center text-sm text-gray-600 dark:text-gray-400 mb-4">
            Construa seu futuro com tarefas inteligentes!
          </p>
          <CardTitle className="text-center text-xl sm:text-2xl">Criar Conta</CardTitle>
          {/* Progress Bar */}
          <div className="mt-4">
            <div className="flex justify-between text-xs text-gray-500 mb-1">
              <span>Passo 1 de 2: Crie sua conta</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div className="bg-blue-600 h-2 rounded-full transition-all duration-300" style={{ width: '100%' }}></div>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4 px-4 sm:px-6">
          <form onSubmit={handleEmailSignUp} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="username" className="text-sm font-medium">Nome de usuário (opcional)</Label>
              <Input
                id="username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Seu nome"
                className="h-11 text-base"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email" className="text-sm font-medium">Email</Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  if (errors.email) setErrors({ ...errors, email: undefined });
                }}
                placeholder="Seu email para dicas de tarefas futuras"
                className="h-11 text-base"
                required
              />
              {errors.email && <p className="text-red-500 text-sm">{errors.email}</p>}
            </div>
            <div className="space-y-2">
              <Label htmlFor="password" className="text-sm font-medium">Senha</Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  if (errors.password) setErrors({ ...errors, password: undefined });
                }}
                placeholder="Crie uma senha forte para proteger seus pontos!"
                className="h-11 text-base"
                required
              />
              {errors.password && <p className="text-red-500 text-sm">{errors.password}</p>}
            </div>
            <Button type="submit" className="w-full h-11 text-base font-medium" disabled={isLoading}>
              {isLoading ? 'Criando conta...' : 'Criar Conta'}
            </Button>
          </form>

          <div className="text-center text-sm pt-2">
            <span className="text-gray-600 dark:text-gray-400">Já tem conta? </span>
            <Button
              variant="link"
              className="p-0 h-auto font-medium text-blue-600 hover:text-blue-700"
              onClick={() => router.push('/signin')}
            >
              Fazer login
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}