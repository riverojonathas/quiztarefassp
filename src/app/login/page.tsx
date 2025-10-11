'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useSessionStore } from '../../state/useSessionStore';
import { supabase } from '../../lib/supabase';
import { Button } from '../../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';
import { User } from '../../domain/models';

export default function LoginPage() {
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
        // Get or create user in our users table
        const { data: existingUser } = await supabase
          .from('users')
          .select('*')
          .eq('id', user.id)
          .single();

        if (existingUser) {
          setUser({ id: existingUser.id, name: existingUser.username });
          router.push('/home');
        } else {
          // Create user record
          const { error } = await supabase
            .from('users')
            .insert({
              id: user.id,
              username: user.user_metadata?.full_name || user.email?.split('@')[0] || 'User',
              email: user.email
            });

          if (!error) {
            setUser({ id: user.id, name: user.user_metadata?.full_name || user.email?.split('@')[0] || 'User' });
            router.push('/home');
          }
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

        if (!existingUser) {
          await supabase
            .from('users')
            .insert({
              id: user.id,
              username: user.user_metadata?.full_name || user.email?.split('@')[0] || 'User',
              email: user.email
            });
        }

        setUser({ id: user.id, name: user.user_metadata?.full_name || user.email?.split('@')[0] || 'User' });
        router.push('/home');
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
      } else if (data.user) {
        // User will be handled by the auth state change listener
      }
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

  const handleSignUp = async () => {
    if (!email || !password) {
      alert('Preencha email e senha');
      return;
    }

    setIsLoading(true);

    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
      });

      if (error) {
        alert('Erro no cadastro: ' + error.message);
      } else {
        alert('Cadastro realizado! Verifique seu email para confirmar.');
      }
    } catch (error) {
      alert('Erro inesperado: ' + error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-500 to-purple-600 p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-center">Entrar no Quiz</CardTitle>
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
            <div className="flex gap-2">
              <Button type="submit" className="flex-1" disabled={isLoading}>
                {isLoading ? 'Entrando...' : 'Entrar'}
              </Button>
              <Button type="button" variant="outline" onClick={handleSignUp} disabled={isLoading}>
                Cadastrar
              </Button>
            </div>
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
        </CardContent>
      </Card>
    </div>
  );
}