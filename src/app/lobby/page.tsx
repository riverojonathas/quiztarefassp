'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '../../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../components/ui/select';

export default function LobbyPage() {
  const [roomCode, setRoomCode] = useState('');
  const [mode, setMode] = useState<'solo' | 'dupla'>('solo');
  const router = useRouter();

  const handleCreateRoom = () => {
    const roomId = Math.random().toString(36).substring(2, 8).toUpperCase();
    router.push(`/room/${roomId}?mode=${mode}`);
  };

  const handleJoinRoom = () => {
    if (roomCode) {
      router.push(`/room/${roomCode}?mode=${mode}`);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-500 to-blue-600 p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-center">Lobby</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="mode">Modo de Jogo</Label>
            <Select value={mode} onValueChange={(value: 'solo' | 'dupla') => setMode(value)}>
              <SelectTrigger>
                <SelectValue placeholder="Selecione o modo" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="solo">Solo (vs Bot)</SelectItem>
                <SelectItem value="dupla">Dupla (vs 2 Bots)</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <Button onClick={handleCreateRoom} className="w-full">
            Criar Sala
          </Button>
          <div>
            <Label htmlFor="roomCode">Código da Sala</Label>
            <Input
              id="roomCode"
              value={roomCode}
              onChange={(e) => setRoomCode(e.target.value.toUpperCase())}
              placeholder="AB12"
            />
          </div>
          <Button onClick={handleJoinRoom} className="w-full" disabled={!roomCode}>
            Entrar na Sala
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}