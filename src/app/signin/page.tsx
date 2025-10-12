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

const loginSchema = z.object({
  email: z.string().email('Email inválido – precisamos de um endereço real para missões futuras!'),
  password: z.string().min(1, 'Sua senha precisa ser forte para proteger seus pontos!'),
});

export default function SignInPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<{ email?: string; password?: string }>({});
  const setUser = useSessionStore((state) => state.setUser);
  const router = useRouter();

  useEffect(() => {
    // Check if user is already logged in
    const checkUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        // User is authenticated, let onboarding handle the profile check
        router.push('/onboarding');
      }
    };

    checkUser();
  }, [router]);

  const handleEmailLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate form
    const result = loginSchema.safeParse({ email, password });
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
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        alert('Erro no login: ' + error.message);
      } else if (data.user) {
        // Login successful - let onboarding handle profile checks and redirects
        router.push('/onboarding');
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
          <CardTitle className="text-center text-xl sm:text-2xl">Entrar</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4 px-4 sm:px-6">
          <form onSubmit={handleEmailLogin} className="space-y-4">
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
                placeholder="Sua senha"
                className="h-11 text-base"
                required
              />
              {errors.password && <p className="text-red-500 text-sm">{errors.password}</p>}
            </div>
            <Button type="submit" className="w-full h-11 text-base font-medium" disabled={isLoading}>
              {isLoading ? 'Entrando...' : 'Entrar'}
            </Button>
          </form>

          <div className="text-center text-sm pt-2">
            <span className="text-gray-600 dark:text-gray-400">Não tem conta? </span>
            <Button
              variant="link"
              className="p-0 h-auto font-medium text-blue-600 hover:text-blue-700"
              onClick={() => router.push('/signup')}
            >
              Criar conta
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}