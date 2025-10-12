'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { useSessionStore } from '../../state/useSessionStore';
import { supabase } from '../../lib/supabase';
import { Button } from '../../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';
import { z } from 'zod';
import { Loader2, Check, X } from 'lucide-react';

const loginSchema = z.object({
  email: z.string().email('Email inválido – precisamos de um endereço real para missões futuras!'),
  password: z.string().min(1, 'Sua senha precisa ser forte para proteger seus pontos!'),
});

export default function SignInPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<{ email?: string; password?: string }>({});
  const [loginError, setLoginError] = useState<string>('');
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

  const handleEmailLogin = useCallback(async (e: React.FormEvent) => {
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
        setLoginError('Erro no login: ' + error.message);
      } else if (data.user) {
        // Login successful - let onboarding handle profile checks and redirects
        router.push('/onboarding');
      }
    } catch (error) {
      setLoginError('Erro inesperado: ' + error);
    } finally {
      setIsLoading(false);
    }
  }, [email, password, router]);

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
              <div className="relative">
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    if (errors.email) setErrors({ ...errors, email: undefined });
                    if (loginError) setLoginError('');
                  }}
                  placeholder="Seu email para dicas de tarefas futuras"
                  className={`h-11 text-base pr-10 ${errors.email ? 'border-red-500' : email && !errors.email ? 'border-green-500' : ''}`}
                  required
                  aria-describedby={errors.email ? "email-error" : undefined}
                  disabled={isLoading}
                />
                {email && (
                  <div className="absolute inset-y-0 right-0 flex items-center pr-3">
                    {errors.email ? (
                      <X className="h-4 w-4 text-red-500" />
                    ) : (
                      <Check className="h-4 w-4 text-green-500" />
                    )}
                  </div>
                )}
              </div>
              {errors.email && <p id="email-error" className="text-red-500 text-sm">{errors.email}</p>}
            </div>
            <div className="space-y-2">
              <Label htmlFor="password" className="text-sm font-medium">Senha</Label>
              <div className="relative">
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    if (errors.password) setErrors({ ...errors, password: undefined });
                    if (loginError) setLoginError('');
                  }}
                  placeholder="Sua senha"
                  className={`h-11 text-base pr-10 ${errors.password ? 'border-red-500' : password && !errors.password ? 'border-green-500' : ''}`}
                  required
                  aria-describedby={errors.password ? "password-error" : undefined}
                  disabled={isLoading}
                />
                {password && (
                  <div className="absolute inset-y-0 right-0 flex items-center pr-3">
                    {errors.password ? (
                      <X className="h-4 w-4 text-red-500" />
                    ) : (
                      <Check className="h-4 w-4 text-green-500" />
                    )}
                  </div>
                )}
              </div>
              {errors.password && <p id="password-error" className="text-red-500 text-sm">{errors.password}</p>}
            </div>
            {loginError && <p className="text-red-500 text-sm text-center">{loginError}</p>}
            <Button type="submit" className={`w-full h-11 text-base font-medium bg-gradient-to-r from-blue-500 to-purple-600 text-white hover:from-blue-600 hover:to-purple-700 transition-all duration-200 shadow-lg hover:shadow-xl ${isLoading ? 'animate-pulse' : ''}`} disabled={isLoading}>
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Entrando...
                </>
              ) : (
                'Entrar'
              )}
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
          <div className="text-center text-sm pt-1">
            <Button
              variant="link"
              className="p-0 h-auto font-medium text-blue-600 hover:text-blue-700"
              onClick={async () => {
                if (!email) {
                  setLoginError('Digite seu email primeiro para resetar a senha.');
                  return;
                }
                try {
                  const { error } = await supabase.auth.resetPasswordForEmail(email, {
                    redirectTo: `${window.location.origin}/reset-password`,
                  });
                  if (error) {
                    setLoginError('Erro ao enviar email de reset: ' + error.message);
                  } else {
                    setLoginError('Email de reset enviado! Verifique sua caixa de entrada.');
                  }
                } catch (err) {
                  setLoginError('Erro inesperado: ' + err);
                }
              }}
            >
              Esqueci minha senha
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}