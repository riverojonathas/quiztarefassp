'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useSessionStore } from '../../state/useSessionStore';
import { Button } from '../../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';

export default function LoginPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const setUser = useSessionStore((state) => state.setUser);
  const router = useRouter();

  const handleLogin = () => {
    if (['usuario1', 'usuario2', 'usuario3'].includes(username) && password === '123') {
      setUser({ id: username, name: username });
      router.push('/lobby');
    } else {
      alert('Credenciais inválidas');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-500 to-purple-600">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-center">Login de Demonstração</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="username">Usuário</Label>
            <Input
              id="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="usuario1, usuario2 ou usuario3"
            />
          </div>
          <div>
            <Label htmlFor="password">Senha</Label>
            <Input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="123"
            />
          </div>
          <Button onClick={handleLogin} className="w-full">
            Entrar
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}