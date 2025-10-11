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
  const [mode, setMode] = useState<'solo' | 'multiplayer'>('multiplayer');
  const [gameMode, setGameMode] = useState<'solo' | 'dupla'>('solo');
  const router = useRouter();

  const handleCreateRoom = () => {
    if (mode === 'solo') {
      // Modo solo - vai direto para uma sala individual
      const roomId = `SOLO_${Math.random().toString(36).substring(2, 8).toUpperCase()}`;
      router.push(`/room/${roomId}?mode=solo`);
    } else {
      // Modo multiplayer
      const roomId = Math.random().toString(36).substring(2, 8).toUpperCase();
      router.push(`/room/${roomId}?mode=${gameMode}`);
    }
  };

  const handleJoinRoom = () => {
    if (roomCode) {
      router.push(`/room/${roomCode}?mode=${gameMode}`);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-500 to-blue-600 p-3 sm:p-4">
      <div className="container mx-auto max-w-md flex items-center justify-center min-h-screen py-4">
        <Card className="w-full mx-2 sm:mx-0">
          <CardHeader className="pb-4 sm:pb-6">
            <CardTitle className="text-center text-xl sm:text-2xl">Lobby</CardTitle>
          </CardHeader>
        <CardContent className="space-y-4 sm:space-y-6">
          <div>
            <Label htmlFor="mode" className="text-sm sm:text-base">Tipo de Jogo</Label>
            <Select value={mode} onValueChange={(value: 'solo' | 'multiplayer') => setMode(value)}>
              <SelectTrigger className="h-12 sm:h-10 mt-1">
                <SelectValue placeholder="Selecione o tipo" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="solo" className="text-sm sm:text-base">🎯 Jogar Solo (Prática)</SelectItem>
                <SelectItem value="multiplayer" className="text-sm sm:text-base">👥 Jogar com Outros</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {mode === 'multiplayer' && (
            <div>
              <Label htmlFor="gameMode" className="text-sm sm:text-base">Modo Multiplayer</Label>
              <Select value={gameMode} onValueChange={(value: 'solo' | 'dupla') => setGameMode(value)}>
                <SelectTrigger className="h-12 sm:h-10 mt-1">
                  <SelectValue placeholder="Selecione o modo" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="solo" className="text-sm sm:text-base">Solo (vs Bot)</SelectItem>
                  <SelectItem value="dupla" className="text-sm sm:text-base">Dupla (vs 2 Bots)</SelectItem>
                </SelectContent>
              </Select>
            </div>
          )}

          <Button onClick={handleCreateRoom} className="w-full h-12 sm:h-11 text-base sm:text-sm font-semibold">
            {mode === 'solo' ? '🎯 Começar Jogo Solo' : 'Criar Sala'}
          </Button>

          {mode === 'multiplayer' && (
            <>
              <div className="relative py-2">
                <div className="absolute inset-0 flex items-center">
                  <span className="w-full border-t" />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-background px-2 text-muted-foreground">Ou</span>
                </div>
              </div>

              <div>
                <Label htmlFor="roomCode" className="text-sm sm:text-base">Código da Sala</Label>
                <Input
                  id="roomCode"
                  value={roomCode}
                  onChange={(e) => setRoomCode(e.target.value.toUpperCase())}
                  placeholder="AB12"
                  className="h-12 sm:h-10 mt-1 text-base sm:text-sm"
                />
              </div>
              <Button onClick={handleJoinRoom} className="w-full h-12 sm:h-11 text-base sm:text-sm font-semibold" disabled={!roomCode}>
                Entrar na Sala
              </Button>
            </>
          )}
        </CardContent>
      </Card>
      </div>
    </div>
  );
}