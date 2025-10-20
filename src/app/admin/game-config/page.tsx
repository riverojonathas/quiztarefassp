'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useSessionStore } from '@/state/useSessionStore';
import { useUserProfile } from '@/hooks/useUserProfile';
import { useGameConfig, useSaveGameConfig } from '@/hooks/useGameConfig';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import {
  Settings,
  Save,
  RotateCcw,
  Home,
  Calculator,
  Trophy,
  Clock,
  Target,
  Zap,
  Info,
  CheckCircle,
  AlertTriangle
} from 'lucide-react';
import LoadingSpinner from '@/components/LoadingSpinner';
import { GameConfigSettings, GAME_CONFIG_TEMPLATES, ScoringMode } from '@/domain/models';

const QUESTION_CATEGORIES = [
  'Matemática',
  'Geografia',
  'Literatura',
  'Ciências',
  'História',
  'Química',
  'Arte',
  'Biologia',
  'Física',
  'Inglês',
  'Português'
] as const;

export default function GameConfigPage() {
  const router = useRouter();
  const { user, isLoading } = useSessionStore();
  const { profile, loading: profileLoading } = useUserProfile(user?.id || null);
  const { config, isLoading: configLoading, error: configError, mutate, hasCustomConfig } = useGameConfig();
  const { saveConfig } = useSaveGameConfig();

  const [settings, setSettings] = useState<GameConfigSettings>(GAME_CONFIG_TEMPLATES.relaxed);
  const [configName, setConfigName] = useState('Configuração Personalizada');
  const [isDirty, setIsDirty] = useState(false);
  const [saving, setSaving] = useState(false);

  // Carregar configurações atuais
  useEffect(() => {
    if (config?.config?.settings) {
      setSettings(config.config.settings);
      setConfigName(config.config.config_name);
    }
  }, [config]);

  // Verificar permissões de acesso
  useEffect(() => {
    if (!isLoading && !user) {
      router.push('/signin');
      return;
    }

    if (!isLoading && !profileLoading && user && profile) {
      if (profile.role !== 'admin') {
        router.push('/home');
        return;
      }
    }
  }, [user, profile, router, isLoading, profileLoading]);

  const handleSettingChange = (key: keyof GameConfigSettings, value: GameConfigSettings[keyof GameConfigSettings]) => {
    setSettings(prev => ({ ...prev, [key]: value }));
    setIsDirty(true);
  };

  const handleSave = async () => {
    try {
      setSaving(true);
      await saveConfig('solo_game', configName, settings);
      await mutate(); // Refresh the data
      setIsDirty(false);
    } catch (error) {
      console.error('Erro ao salvar configurações:', error);
    } finally {
      setSaving(false);
    }
  };

  const handleReset = () => {
    if (config?.config?.settings) {
      setSettings(config.config.settings);
      setConfigName(config.config.config_name);
      setIsDirty(false);
    }
  };

  const handleApplyTemplate = (templateKey: string) => {
    const template = GAME_CONFIG_TEMPLATES[templateKey as keyof typeof GAME_CONFIG_TEMPLATES];
    if (template) {
      setSettings(template);
      setIsDirty(true);
    }
  };

  // Cálculos automáticos para preview
  const totalPoints = 10; // Sempre 10 pontos totais
  const pointsPerQuestion = config?.pointsPerQuestion || (10 / settings.questionCount);
  const penaltyPoints = config?.penaltyPerError || (settings.penaltyEnabled ? pointsPerQuestion * 0.25 : 0);

  if (isLoading || profileLoading || configLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 pb-8">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
              <Settings className="h-8 w-8 text-purple-600" />
              Configuração do Solo Game
            </h1>
            <p className="text-gray-700 mt-1">
              Configure os parâmetros do jogo individual para uma experiência personalizada
            </p>
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
              onClick={() => router.push('/admin/questions')}
              variant="outline"
              className="flex items-center gap-2 border-blue-300 text-blue-700 hover:bg-blue-50 hover:border-blue-400"
            >
              <Settings className="h-4 w-4" />
              <span className="hidden sm:inline">Gerenciar Questões</span>
            </Button>
          </div>
        </div>

        {configError && (
          <Alert className="mb-6 border-red-200 bg-red-50">
            <AlertTriangle className="h-4 w-4 text-red-600" />
            <AlertDescription className="text-red-800">
              {configError}
            </AlertDescription>
          </Alert>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Configurações Principais */}
          <div className="lg:col-span-2 space-y-6">
            {/* Nome da Configuração */}
            <Card className="bg-white shadow-md">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-gray-900">
                  <Target className="h-5 w-5 text-blue-600" />
                  Nome da Configuração
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div>
                  <Label htmlFor="configName">Nome da Configuração</Label>
                  <Input
                    id="configName"
                    value={configName}
                    onChange={(e) => setConfigName(e.target.value)}
                    placeholder="Ex: Modo Desafiador"
                    className="mt-1"
                  />
                </div>
              </CardContent>
            </Card>

            {/* Controles de Tempo */}
            <Card className="bg-white shadow-md">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-gray-900">
                  <Clock className="h-5 w-5 text-green-600" />
                  Controles de Tempo
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center space-x-4">
                  <input
                    type="checkbox"
                    id="timeEnabled"
                    checked={settings.timeEnabled}
                    onChange={(e) => handleSettingChange('timeEnabled', e.target.checked)}
                    className="rounded"
                  />
                  <Label htmlFor="timeEnabled">Habilitar limite de tempo por questão</Label>
                </div>
                {settings.timeEnabled && (
                  <div>
                    <Label htmlFor="timePerQuestion">Tempo por Questão (segundos)</Label>
                    <Input
                      id="timePerQuestion"
                      type="number"
                      min="10"
                      max="120"
                      value={settings.timePerQuestion}
                      onChange={(e) => handleSettingChange('timePerQuestion', parseInt(e.target.value) || 30)}
                      className="mt-1"
                    />
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Seleção de Questões */}
            <Card className="bg-white shadow-md">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-gray-900">
                  <Target className="h-5 w-5 text-purple-600" />
                  Seleção de Questões
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="questionCount">Número de Questões</Label>
                  <Input
                    id="questionCount"
                    type="number"
                    min="5"
                    max="20"
                    value={settings.questionCount}
                    onChange={(e) => handleSettingChange('questionCount', parseInt(e.target.value) || 10)}
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label>Categorias Habilitadas</Label>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-2 mt-2">
                    {QUESTION_CATEGORIES.map((category) => (
                      <div key={category} className="flex items-center space-x-2">
                        <input
                          type="checkbox"
                          id={`category-${category}`}
                          checked={settings.selectedCategories.includes(category)}
                          onChange={(e) => {
                            const newCategories = e.target.checked
                              ? [...settings.selectedCategories, category]
                              : settings.selectedCategories.filter(c => c !== category);
                            handleSettingChange('selectedCategories', newCategories);
                          }}
                          className="rounded"
                        />
                        <Label htmlFor={`category-${category}`} className="text-sm">
                          {category}
                        </Label>
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Sistema de Pontuação */}
            <Card className="bg-white shadow-md">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-gray-900">
                  <Trophy className="h-5 w-5 text-yellow-600" />
                  Sistema de Pontuação
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="scoringMode">Modo de Pontuação</Label>
                  <Select
                    value={settings.scoringMode}
                    onValueChange={(value) => handleSettingChange('scoringMode', value as ScoringMode)}
                  >
                    <SelectTrigger className="mt-1">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="evaluation">Avaliação (pontuação rigorosa)</SelectItem>
                      <SelectItem value="practice">Prática (pontuação flexível)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex items-center space-x-4">
                  <input
                    type="checkbox"
                    id="penaltyEnabled"
                    checked={settings.penaltyEnabled}
                    onChange={(e) => handleSettingChange('penaltyEnabled', e.target.checked)}
                    className="rounded"
                  />
                  <Label htmlFor="penaltyEnabled">Aplicar penalidade por erro</Label>
                </div>
              </CardContent>
            </Card>

            {/* Mecânicas do Jogo */}
            <Card className="bg-white shadow-md">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-gray-900">
                  <Zap className="h-5 w-5 text-orange-600" />
                  Mecânicas do Jogo
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="maxAttempts">Máximo de Tentativas por Questão</Label>
                  <Input
                    id="maxAttempts"
                    type="number"
                    min="1"
                    max="3"
                    value={settings.maxAttempts}
                    onChange={(e) => handleSettingChange('maxAttempts', parseInt(e.target.value) || 1)}
                    className="mt-1"
                  />
                </div>
                <div className="space-y-2">
                  <div className="flex items-center space-x-4">
                    <input
                      type="checkbox"
                      id="shuffleAlternatives"
                      checked={settings.shuffleAlternatives}
                      onChange={(e) => handleSettingChange('shuffleAlternatives', e.target.checked)}
                      className="rounded"
                    />
                    <Label htmlFor="shuffleAlternatives">Embaralhar alternativas</Label>
                  </div>
                  <div className="flex items-center space-x-4">
                    <input
                      type="checkbox"
                      id="randomOrder"
                      checked={settings.randomOrder}
                      onChange={(e) => handleSettingChange('randomOrder', e.target.checked)}
                      className="rounded"
                    />
                    <Label htmlFor="randomOrder">Ordem aleatória das questões</Label>
                  </div>
                  <div className="flex items-center space-x-4">
                    <input
                      type="checkbox"
                      id="immediateFeedback"
                      checked={settings.immediateFeedback}
                      onChange={(e) => handleSettingChange('immediateFeedback', e.target.checked)}
                      className="rounded"
                    />
                    <Label htmlFor="immediateFeedback">Feedback imediato</Label>
                  </div>
                  <div className="flex items-center space-x-4">
                    <input
                      type="checkbox"
                      id="soundEnabled"
                      checked={settings.soundEnabled}
                      onChange={(e) => handleSettingChange('soundEnabled', e.target.checked)}
                      className="rounded"
                    />
                    <Label htmlFor="soundEnabled">Sons habilitados</Label>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Templates */}
            <Card className="bg-white shadow-md">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-gray-900">
                  <Info className="h-5 w-5 text-blue-600" />
                  Templates Pré-definidos
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {Object.entries(GAME_CONFIG_TEMPLATES).map(([key]) => (
                    <div key={key} className="border rounded-lg p-4 hover:bg-gray-50 cursor-pointer">
                      <h4 className="font-semibold capitalize mb-2">{key}</h4>
                      <p className="text-sm text-gray-600 mb-3">
                        {key === 'relaxed' && 'Modo relaxado sem pressão de tempo'}
                        {key === 'quickChallenge' && 'Desafio rápido de 5 minutos'}
                        {key === 'fullAssessment' && 'Avaliação completa e rigorosa'}
                      </p>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleApplyTemplate(key)}
                        className="w-full"
                      >
                        Aplicar
                      </Button>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Preview e Ações */}
          <div className="space-y-6">
            <Card className="bg-white shadow-md">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-gray-900">
                  <Calculator className="h-5 w-5 text-green-600" />
                  Preview da Pontuação
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Pontuação total possível:</span>
                    <Badge variant="default">{totalPoints} pts</Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Pontos por questão:</span>
                    <Badge variant="secondary">{pointsPerQuestion.toFixed(1)} pts</Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Penalidade por erro:</span>
                    <Badge variant="destructive">-{penaltyPoints.toFixed(1)} pts</Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Total de questões:</span>
                    <Badge variant="secondary">{settings.questionCount}</Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Tentativas máximas:</span>
                    <Badge variant="outline">{settings.maxAttempts}</Badge>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-white shadow-md">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-gray-900">
                  <Info className="h-5 w-5 text-blue-600" />
                  Resumo da Configuração
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="text-sm text-gray-600 space-y-2">
                  <p><strong>Tempo limite:</strong> {settings.timeEnabled ? `${settings.timePerQuestion}s por questão` : 'Sem limite'}</p>
                  <p><strong>Categorias:</strong> {settings.selectedCategories.length} selecionadas</p>
                  <p><strong>Modo:</strong> {settings.scoringMode === 'evaluation' ? 'Avaliação' : 'Prática'}</p>
                  <p><strong>Feedback:</strong> {settings.immediateFeedback ? 'Imediato' : 'Apenas final'}</p>
                  <p><strong>Ordem:</strong> {settings.randomOrder ? 'Aleatória' : 'Sequencial'}</p>
                </div>
              </CardContent>
            </Card>

            <div className="space-y-3">
              <Button
                onClick={handleSave}
                disabled={!isDirty || saving}
                className="w-full bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white"
              >
                <Save className="h-4 w-4 mr-2" />
                {saving ? 'Salvando...' : 'Salvar Configurações'}
              </Button>

              <Button
                onClick={handleReset}
                disabled={!isDirty}
                variant="outline"
                className="w-full"
              >
                <RotateCcw className="h-4 w-4 mr-2" />
                Resetar Alterações
              </Button>
            </div>

            {isDirty && (
              <Alert className="border-yellow-200 bg-yellow-50">
                <AlertTriangle className="h-4 w-4 text-yellow-600" />
                <AlertDescription className="text-yellow-800">
                  Você tem alterações não salvas. Clique em &quot;Salvar Configurações&quot; para aplicá-las.
                </AlertDescription>
              </Alert>
            )}

            {hasCustomConfig && (
              <Alert className="border-green-200 bg-green-50">
                <CheckCircle className="h-4 w-4 text-green-600" />
                <AlertDescription className="text-green-800">
                  Configuração personalizada ativa. As alterações serão aplicadas imediatamente após salvar.
                </AlertDescription>
              </Alert>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
