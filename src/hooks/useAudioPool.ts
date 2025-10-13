import { useState, useCallback, useRef } from 'react';

interface AudioPool {
  contexts: AudioContext[];
  currentIndex: number;
  maxContexts: number;
}

export const useAudioPool = (maxContexts: number = 3) => {
  const poolRef = useRef<AudioPool>({
    contexts: [],
    currentIndex: 0,
    maxContexts
  });

  const [isInitialized, setIsInitialized] = useState(false);

  const getAudioContext = useCallback(async (): Promise<AudioContext> => {
    const pool = poolRef.current;

    // Procurar por um contexto disponível (não suspenso e não fechado)
    for (let i = 0; i < pool.contexts.length; i++) {
      const ctx = pool.contexts[i];
      if (ctx && ctx.state !== 'closed') {
        if (ctx.state === 'suspended') {
          try {
            await ctx.resume();
          } catch (error) {
            console.warn('Failed to resume AudioContext:', error);
            continue;
          }
        }
        return ctx;
      }
    }

    // Criar novo contexto se não atingiu o limite
    if (pool.contexts.length < pool.maxContexts) {
      try {
        const AudioContextClass = window.AudioContext || (window as typeof window & { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
        const ctx = new AudioContextClass();

        // Tentar inicializar o contexto
        if (ctx.state === 'suspended') {
          await ctx.resume();
        }

        pool.contexts.push(ctx);
        setIsInitialized(true);
        return ctx;
      } catch (error) {
        console.warn('Failed to create AudioContext:', error);
        throw error;
      }
    }

    // Se atingiu o limite, tentar criar um novo contexto forçadamente
    // Isso pode acontecer se contextos anteriores foram fechados
    if (pool.contexts.length >= pool.maxContexts) {
      try {
        const AudioContextClass = window.AudioContext || (window as typeof window & { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
        const ctx = new AudioContextClass();

        if (ctx.state === 'suspended') {
          await ctx.resume();
        }

        // Substituir o contexto mais antigo
        pool.contexts[pool.currentIndex] = ctx;
        pool.currentIndex = (pool.currentIndex + 1) % pool.contexts.length;

        return ctx;
      } catch (error) {
        console.warn('Failed to create replacement AudioContext:', error);
        throw error;
      }
    }

    // Fallback: usar contexto round-robin se tudo falhar
    const ctx = pool.contexts[pool.currentIndex];
    pool.currentIndex = (pool.currentIndex + 1) % pool.contexts.length;

    if (ctx.state === 'suspended') {
      try {
        await ctx.resume();
      } catch (error) {
        console.warn('Failed to resume AudioContext:', error);
      }
    }

    return ctx;
  }, []);

  const playSound = useCallback(async (
    frequency: number,
    duration: number,
    type: OscillatorType = 'sine',
    volume: number = 0.3
  ): Promise<void> => {
    try {
      const ctx = await getAudioContext();

      const oscillator = ctx.createOscillator();
      const gainNode = ctx.createGain();

      oscillator.connect(gainNode);
      gainNode.connect(ctx.destination);

      oscillator.frequency.value = frequency;
      oscillator.type = type;

      gainNode.gain.setValueAtTime(volume, ctx.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + duration);

      oscillator.start(ctx.currentTime);
      oscillator.stop(ctx.currentTime + duration);
    } catch (error) {
      console.warn('Web Audio API not supported or failed:', error);
    }
  }, [getAudioContext]);

  const cleanup = useCallback(() => {
    const pool = poolRef.current;
    pool.contexts.forEach(ctx => {
      try {
        if (ctx.state !== 'closed') {
          ctx.close();
        }
      } catch (error) {
        console.warn('Failed to close AudioContext:', error);
      }
    });
    pool.contexts = [];
    pool.currentIndex = 0;
    setIsInitialized(false);
  }, []);

  return {
    playSound,
    isInitialized,
    cleanup
  };
};