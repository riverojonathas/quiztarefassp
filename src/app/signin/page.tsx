'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useSessionStore } from '../../state/useSessionStore';
import { supabase } from '../../lib/supabase';
import { Button } from '../../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';

export default function SignInPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);
  const setUser = useSessionStore((state) => state.setUser);
  const router = useRouter();

  useEffect(() => {
    // Check if user is already logged in
    const checkUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        // Get user from our users table
        const { data: existingUser } = await supabase
          .from('users')
          .select('*')
          .eq('id', user.id)
          .single();

        if (existingUser) {
          setUser({ id: existingUser.id, name: existingUser.username });
          router.push('/home');
        }
      }
    };

    checkUser();

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (event === 'SIGNED_IN' && session?.user) {
        const user = session.user;
        const { data: existingUser } = await supabase
          .from('users')
          .select('*')
          .eq('id', user.id)
          .single();

        if (existingUser) {
          setUser({ id: existingUser.id, name: existingUser.username });
          router.push('/home');
        }
      }
    });

    return () => subscription.unsubscribe();
  }, [setUser, router]);

  const handleEmailLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        alert('Erro no login: ' + error.message);
      }
      // Success will be handled by the auth state change listener
    } catch (error) {
      alert('Erro inesperado: ' + error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setIsGoogleLoading(true);

    try {
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/home`
        }
      });

      if (error) {
        alert('Erro no login com Google: ' + error.message);
      }
    } catch (error) {
      alert('Erro inesperado: ' + error);
    } finally {
      setIsGoogleLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-500 to-purple-600 p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-center">Entrar</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <form onSubmit={handleEmailLogin} className="space-y-4">
            <div>
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="seu@email.com"
                required
              />
            </div>
            <div>
              <Label htmlFor="password">Senha</Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Sua senha"
                required
              />
            </div>
            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? 'Entrando...' : 'Entrar'}
            </Button>
          </form>

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-background px-2 text-muted-foreground">Ou</span>
            </div>
          </div>

          <Button
            onClick={handleGoogleLogin}
            variant="outline"
            className="w-full"
            disabled={isGoogleLoading}
          >
            {isGoogleLoading ? 'Conectando...' : 'Continuar com Google'}
          </Button>

          <div className="text-center text-sm">
            <span className="text-muted-foreground">Não tem conta? </span>
            <Button
              variant="link"
              className="p-0 h-auto font-normal"
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