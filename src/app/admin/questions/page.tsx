'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import { useSessionStore } from '@/state/useSessionStore';
import { useUserProfile } from '@/hooks/useUserProfile';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Plus, Search, Filter, Eye, Home, Settings } from 'lucide-react';
import LoadingSpinner from '@/components/LoadingSpinner';
import { QuestionFilters, Difficulty } from '@/lib/schemas/questionSchema';

// Interface baseada no schema da tabela questions
interface Question {
  id: string;
  statement: string;
  choices: unknown; // Json from Supabase
  difficulty: number;
  tags: unknown; // Json from Supabase
  skill: string | null;
  time_suggested_sec: number | null;
  image_url: string | null;
  created_at: string | null;
}

export default function AdminQuestionsPage() {
  const router = useRouter();
  const { user, isLoading } = useSessionStore();
  const { profile, loading: profileLoading } = useUserProfile(user?.id || null);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filters, setFilters] = useState<QuestionFilters>({ page: 1, limit: 20 });

  const loadQuestions = useCallback(async () => {
    try {
      setLoading(true);
      let query = supabase
        .from('questions')
        .select('*')
        .order('created_at', { ascending: false });

      // Aplicar filtros básicos (ajustar conforme schema)
      if (filters.search) {
        query = query.ilike('statement', `%${filters.search}%`);
      }

      const { data, error } = await query.range(
        (filters.page - 1) * filters.limit,
        filters.page * filters.limit - 1
      );

      if (error) throw error;
      setQuestions(data || []);
    } catch (err) {
      console.error('Erro ao carregar questões:', err);
      setError('Erro ao carregar questões');
    } finally {
      setLoading(false);
    }
  }, [filters.page, filters.limit, filters.search]);

  // Verificar permissões de acesso
  useEffect(() => {
    if (!isLoading && !user) {
      router.push('/signin');
      return;
    }

    if (!isLoading && !profileLoading && user && profile) {
      // Verificar se o usuário tem role admin ou professor
      if (profile.role !== 'admin' && profile.role !== 'professor') {
        router.push('/home');
        return;
      }
      loadQuestions();
    }
  }, [user, profile, router, isLoading, profileLoading, loadQuestions]);

  const getDifficultyLabel = (difficulty: number) => {
    switch (difficulty) {
      case 1: return 'Fácil';
      case 2: return 'Médio';
      case 3: return 'Difícil';
      default: return 'Desconhecido';
    }
  };

  const getDifficultyColor = (difficulty: number) => {
    switch (difficulty) {
      case 1: return 'default';
      case 2: return 'secondary';
      case 3: return 'destructive';
      default: return 'outline';
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 pb-8">
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Gerenciar Questões</h1>
            <p className="text-gray-700 mt-1">Visualize e gerencie questões do sistema</p>
          </div>
          <div className="flex gap-3">
            <Button
              onClick={() => router.push('/home')}
              variant="outline"
              className="flex items-center gap-2 border-gray-300 text-gray-700 hover:bg-gray-50 hover:border-gray-400"
            >
              <Home className="h-4 w-4" />
              <span className="hidden sm:inline">Voltar ao Início</span>
            </Button>
            <Button
              onClick={() => router.push('/admin/game-config')}
              variant="outline"
              className="flex items-center gap-2 border-purple-300 text-purple-700 hover:bg-purple-50 hover:border-purple-400"
            >
              <Settings className="h-4 w-4" />
              <span className="hidden sm:inline">Configurar Solo Game</span>
            </Button>
            <Button
              onClick={() => router.push('/admin/questions/new')}
              className="bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white shadow-lg"
            >
              <Plus className="h-4 w-4 mr-2" />
              Nova Questão
            </Button>
          </div>
        </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-800 px-4 py-3 rounded-lg mb-6">
          {error}
        </div>
      )}

      {/* Filtros */}
      <Card className="mb-6 bg-white shadow-md">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-gray-900">
            <Filter className="h-5 w-5" />
            Filtros
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <Label htmlFor="search">Buscar</Label>
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-foreground/60" />
                <Input
                  id="search"
                  placeholder="Buscar por enunciado..."
                  className="pl-9"
                  value={filters.search || ''}
                  onChange={(e) => setFilters(prev => ({ ...prev, search: e.target.value }))}
                />
              </div>
            </div>
            <div>
              <Label>Dificuldade</Label>
              <Select value={filters.difficulty?.toString()} onValueChange={(value) => setFilters(prev => ({ ...prev, difficulty: parseInt(value) as unknown as Difficulty }))}>
                <SelectTrigger>
                  <SelectValue placeholder="Todas" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1">Fácil</SelectItem>
                  <SelectItem value="2">Médio</SelectItem>
                  <SelectItem value="3">Difícil</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex items-end">
              <Button 
                onClick={loadQuestions} 
                className="w-full bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white"
              >
                Aplicar Filtros
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Lista de Questões */}
      <div className="space-y-4">
        {questions.map((question) => (
          <Card key={question.id} className="hover:shadow-lg transition-shadow bg-white">
            <CardContent className="p-6">
              <div className="flex flex-col lg:flex-row lg:justify-between lg:items-start gap-4">
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-lg mb-3 line-clamp-2 leading-tight">
                    {question.statement}
                  </h3>
                  <div className="flex flex-wrap gap-2 mb-3">
                    <Badge variant={getDifficultyColor(question.difficulty) as "default" | "secondary" | "destructive" | "outline"}>
                      {getDifficultyLabel(question.difficulty)}
                    </Badge>
                    {question.skill && (
                      <Badge variant="outline" className="text-foreground/70 border-foreground/20">
                        {question.skill}
                      </Badge>
                    )}
                  </div>
                  <div className="text-sm text-foreground/60">
                    Criada em {new Date(question.created_at || '').toLocaleDateString('pt-BR')}
                  </div>
                </div>
                <div className="flex gap-2 lg:flex-shrink-0">
                  <Button variant="outline" size="sm" className="flex items-center gap-2 border-foreground/20 text-foreground hover:bg-accent hover:text-accent-foreground">
                    <Eye className="h-4 w-4" />
                    <span className="hidden sm:inline">Visualizar</span>
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {questions.length === 0 && !loading && (
        <Card className="border-dashed bg-white">
          <CardContent className="flex flex-col items-center justify-center py-12 px-6 text-center">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
              <Plus className="h-8 w-8 text-gray-500" />
            </div>
            <h3 className="text-lg font-semibold mb-2 text-gray-900">Nenhuma questão encontrada</h3>
            <p className="text-gray-600 mb-6 max-w-sm">
              Comece criando a primeira questão para o seu sistema educacional.
            </p>
            <Button 
              onClick={() => router.push('/admin/questions/new')} 
              className="flex items-center gap-2 bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white"
            >
              <Plus className="h-4 w-4" />
              Criar Primeira Questão
            </Button>
          </CardContent>
        </Card>
      )}
      </div>
    </div>
  );
}