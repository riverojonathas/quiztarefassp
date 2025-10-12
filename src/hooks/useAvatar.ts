'use client';

import { useMemo } from 'react';
import { createAvatar } from '@dicebear/core';
import { adventurer } from '@dicebear/collection';

// Cache para avatares gerados
const avatarCache = new Map<string, string>();

export function useAvatar(seed?: string, size: number = 64) {
  const avatarUrl = useMemo(() => {
    if (!seed || seed.trim() === '') {
      return '/avatar-default.svg';
    }

    // Validar e limpar seed
    const cleanSeed = seed.replace(/[^a-zA-Z0-9]/g, '').substring(0, 32);

    if (!cleanSeed) {
      return '/avatar-default.svg';
    }

    // Verificar se já está em cache
    if (avatarCache.has(cleanSeed)) {
      return avatarCache.get(cleanSeed)!;
    }

    try {
      const avatar = createAvatar(adventurer, {
        seed: cleanSeed,
        size: Math.max(32, Math.min(256, size)), // Limitar tamanho entre 32 e 256
        backgroundColor: ['transparent'],
        radius: 50,
      });

      const dataUri = avatar.toDataUri();

      // Validar se o Data URI foi gerado corretamente
      if (dataUri && dataUri.startsWith('data:image/svg+xml')) {
        avatarCache.set(cleanSeed, dataUri);
        return dataUri;
      } else {
        console.warn('Avatar gerado inválido para seed:', cleanSeed);
        return '/avatar-default.svg';
      }
    } catch (error) {
      console.warn('Erro ao gerar avatar para seed:', cleanSeed, error);
      return '/avatar-default.svg';
    }
  }, [seed, size]);

  const getAltText = (nickname?: string) => {
    if (nickname) {
      return `Avatar de ${nickname}`;
    }
    return 'Avatar do usuário';
  };

  const generateNewSeed = () => {
    return Math.random().toString(36).substring(2, 15);
  };

  return {
    avatarUrl,
    getAltText,
    generateNewSeed,
  };
}