'use client';

import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';

// Interface para questões do jogo (formato esperado pelo componente)
export interface GameQuestion {
  id: string;
  statement: string;
  choices: string[];
  correctAnswer: number; // Índice da resposta correta
  skill: string; // Mapeado de category
  timeLimit: number; // Valor padrão
}

export function useQuestions(limit: number = 10) {
  const [questions, setQuestions] = useState<GameQuestion[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        setLoading(true);
        console.log('useQuestions: Fetching questions from Supabase');

        const { data, error } = await supabase
          .from('questions')
          .select('*')
          .eq('type', 'multiple_choice') // Apenas questões de múltipla escolha por enquanto
          .order('created_at', { ascending: false })
          .limit(limit);

        if (error) {
          console.error('useQuestions: Supabase error:', error);
          throw error;
        }

        console.log('useQuestions: Raw data from Supabase:', data);
        console.log('useQuestions: Data length:', data?.length || 0);

        // Converter dados do banco para o formato do jogo
        // Nota: Os tipos do Supabase estão desatualizados após migração
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const gameQuestions: GameQuestion[] = (data as any[] || []).map((dbQuestion) => {
          // No novo schema, choices é um array JSONB de strings
          const choices = Array.isArray(dbQuestion.choices)
            ? (dbQuestion.choices as string[])
            : [];

          // Encontrar o índice da resposta correta baseada no texto
          const correctAnswerIndex = choices.findIndex(choice => choice === dbQuestion.correct_answer);

          return {
            id: dbQuestion.id,
            statement: dbQuestion.text, // Campo 'text' (convertido de 'statement')
            choices: choices,
            correctAnswer: correctAnswerIndex >= 0 ? correctAnswerIndex : 0,
            skill: dbQuestion.category || 'Geral', // Campo 'category' (convertido de 'skill')
            timeLimit: getTimeLimitForDifficulty(dbQuestion.difficulty)
          };
        });

        console.log('useQuestions: Converted questions:', gameQuestions);
        setQuestions(gameQuestions);
        setError(null);
      } catch (err) {
        console.error('Erro ao carregar questões:', err);
        // Fallback para questões mockadas em caso de erro
        const mockQuestions: GameQuestion[] = [
          {
            id: '1',
            statement: 'Qual é a capital do Brasil?',
            choices: ['São Paulo', 'Rio de Janeiro', 'Brasília', 'Salvador'],
            correctAnswer: 2,
            skill: 'Geografia',
            timeLimit: 30
          },
          {
            id: '2',
            statement: 'Quanto é 15 + 27?',
            choices: ['42', '41', '43', '40'],
            correctAnswer: 0,
            skill: 'Matemática',
            timeLimit: 20
          },
          {
            id: '3',
            statement: 'Quem escreveu "Dom Quixote"?',
            choices: ['Machado de Assis', 'Miguel de Cervantes', 'José Saramago', 'Gabriel García Márquez'],
            correctAnswer: 1,
            skill: 'Literatura',
            timeLimit: 25
          }
        ];
        console.log('useQuestions: Using fallback mock questions');
        setQuestions(mockQuestions);
        setError('Erro ao carregar questões em tempo real');
      } finally {
        setLoading(false);
      }
    };

    fetchQuestions();
  }, [limit]);

  return { questions, loading, error };
}

// Função auxiliar para determinar o tempo limite baseado na dificuldade
function getTimeLimitForDifficulty(difficulty: string): number {
  switch (difficulty) {
    case 'easy':
      return 30;
    case 'medium':
      return 25;
    case 'hard':
      return 20;
    default:
      return 30;
  }
}