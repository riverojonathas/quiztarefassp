'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { supabase } from '@/lib/supabase';
import { useSessionStore } from '@/state/useSessionStore';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Loader2, Plus, Trash2, Save, Upload, Eye, EyeOff } from 'lucide-react';
import { DragDropContext, Droppable, Draggable, DropResult } from '@hello-pangea/dnd';
import { createQuestionSchema, CreateQuestionInput, QuestionType, Difficulty, Categories } from '@/lib/schemas/questionSchema';
import { useImageUpload } from '@/hooks/useImageUpload';
import { QuestionPreview } from '@/components/QuestionPreview';

export default function NewQuestionPage() {
  const router = useRouter();
  const { user, isLoading } = useSessionStore();
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [showPreview, setShowPreview] = useState(false);

  const { uploadImage, uploading: imageUploading, error: imageError, progress: imageProgress, reset: resetImageUpload } = useImageUpload();

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    getValues,
    formState: { errors },
  } = useForm<CreateQuestionInput>({
    resolver: zodResolver(createQuestionSchema),
    defaultValues: {
      text: '',
      type: QuestionType.MULTIPLE_CHOICE,
      category: Categories[0],
      difficulty: Difficulty.MEDIUM,
      options: ['', '', '', ''],
      correctAnswer: '',
      tags: [],
    },
  });

  const watchedValues = watch();

  const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const imageUrl = await uploadImage(file);
    if (imageUrl) {
      setValue('imageUrl', imageUrl);
    }
  };

  const addOption = () => {
    const currentOptions = getValues('options');
    if (currentOptions.length < 6) {
      setValue('options', [...currentOptions, '']);
    }
  };

  const removeOption = (index: number) => {
    const currentOptions = getValues('options');
    if (currentOptions.length > 2) {
      const newOptions = currentOptions.filter((_, i) => i !== index);
      setValue('options', newOptions);

      // If the removed option was the correct answer, clear it
      const currentCorrect = getValues('correctAnswer');
      if (currentCorrect === currentOptions[index]) {
        setValue('correctAnswer', '');
      }
    }
  };

  const updateOption = (index: number, value: string) => {
    const currentOptions = getValues('options');
    const newOptions = [...currentOptions];
    newOptions[index] = value;
    setValue('options', newOptions);
  };

  const handleDragEnd = (result: DropResult<string>) => {
    if (!result.destination) return;

    const currentOptions = getValues('options');
    const items = Array.from(currentOptions);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);

    setValue('options', items);
  };

  const onSubmit = async (data: CreateQuestionInput) => {
    if (isLoading || !user) {
      router.push('/signin');
      return;
    }

    try {
      setSubmitting(true);
      setError(null);

      // Filter out empty options
      const filteredOptions = data.options.filter(option => option.trim());
      if (filteredOptions.length < 2) {
        throw new Error('São necessárias pelo menos 2 opções válidas');
      }

      // Validate correct answer exists in options
      if (data.type !== 'essay' && !filteredOptions.includes(data.correctAnswer)) {
        throw new Error('A resposta correta deve estar entre as opções');
      }

      const questionData = {
        statement: data.text.trim(),
        choices: filteredOptions,
        difficulty: data.difficulty === 'easy' ? 1 : data.difficulty === 'medium' ? 2 : 3,
        tags: data.tags?.filter(tag => tag.trim()) || [],
        skill: data.category,
        time_suggested_sec: 30, // Default for now
        image_url: data.imageUrl || null,
        text: data.text.trim(), // New field
        type: data.type,
        category: data.category,
        correct_answer: data.correctAnswer,
        explanation: data.explanation?.trim() || null,
        created_by: user.id,
      };

      const { error: submitError } = await supabase
        .from('questions')
        .insert([questionData])
        .select()
        .single();

      if (submitError) throw submitError;

      setSuccess('Questão criada com sucesso!');
      setTimeout(() => {
        router.push('/admin/questions');
      }, 2000);
    } catch (err: unknown) {
      console.error('Erro ao criar questão:', err);
      setError(err instanceof Error ? err.message : 'Erro ao criar questão');
    } finally {
      setSubmitting(false);
    }
  };

  const isFormValid = () => {
    const values = getValues();
    return values.text.trim() &&
           values.options.filter(o => o.trim()).length >= 2 &&
           (values.type === 'essay' || values.correctAnswer);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 pb-8">
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Nova Questão</h1>
            <p className="text-gray-700 mt-1">Crie uma nova questão para o sistema</p>
          </div>
          <div className="flex gap-2">
            <Button
              variant="outline"
              onClick={() => setShowPreview(!showPreview)}
              disabled={!isFormValid()}
              className="border-gray-300 text-gray-700 hover:bg-gray-100"
            >
              {showPreview ? <EyeOff className="h-4 w-4 mr-2" /> : <Eye className="h-4 w-4 mr-2" />}
              {showPreview ? 'Ocultar' : 'Preview'}
            </Button>
            <Button 
              variant="outline" 
              onClick={() => router.push('/admin/questions')}
              className="border-gray-300 text-gray-700 hover:bg-gray-100"
            >
              Voltar
            </Button>
          </div>
        </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Form */}
        <div className="space-y-6">
          {error && (
            <Alert variant="destructive" className="bg-red-50 border-red-200">
              <AlertDescription className="text-red-800">
                {error}
              </AlertDescription>
            </Alert>
          )}

          {imageError && (
            <Alert variant="destructive" className="bg-red-50 border-red-200">
              <AlertDescription className="text-red-800">
                {imageError}
              </AlertDescription>
            </Alert>
          )}

          {success && (
            <Alert className="bg-green-50 border-green-200">
              <AlertDescription className="text-green-800">
                {success}
              </AlertDescription>
            </Alert>
          )}

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <Card className="bg-white shadow-md">
              <CardHeader>
                <CardTitle className="text-gray-900">Informações Básicas</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="text" className="text-sm font-medium mb-2 block">
                    Pergunta *
                  </Label>
                  <Textarea
                    id="text"
                    {...register('text')}
                    placeholder="Digite a pergunta completa..."
                    rows={4}
                    className={`resize-none ${errors.text ? 'border-destructive focus:border-destructive' : ''}`}
                  />
                  {errors.text && (
                    <p className="text-sm text-red-600 mt-1 flex items-center gap-1">
                      <span className="text-xs">⚠</span>
                      {errors.text.message}
                    </p>
                  )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="type" className="text-sm font-medium">
                      Tipo de Questão *
                    </Label>
                    <Select
                      value={watchedValues.type}
                      onValueChange={(value) => setValue('type', value as QuestionType)}
                    >
                      <SelectTrigger className="h-10">
                        <SelectValue placeholder="Selecione o tipo" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value={QuestionType.MULTIPLE_CHOICE}>Múltipla Escolha</SelectItem>
                        <SelectItem value={QuestionType.TRUE_FALSE}>Verdadeiro/Falso</SelectItem>
                        <SelectItem value={QuestionType.ESSAY}>Dissertativa</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="category" className="text-sm font-medium">
                      Categoria *
                    </Label>
                    <Select
                      value={watchedValues.category}
                      onValueChange={(value) => setValue('category', value as typeof Categories[number])}
                    >
                      <SelectTrigger className="h-10">
                        <SelectValue placeholder="Selecione a categoria" />
                      </SelectTrigger>
                      <SelectContent>
                        {Categories.map((category) => (
                          <SelectItem key={category} value={category}>
                            {category}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="difficulty" className="text-sm font-medium">
                      Dificuldade *
                    </Label>
                    <Select
                      value={watchedValues.difficulty}
                      onValueChange={(value) => setValue('difficulty', value as Difficulty)}
                    >
                      <SelectTrigger className="h-10">
                        <SelectValue placeholder="Selecione a dificuldade" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value={Difficulty.EASY}>Fácil</SelectItem>
                        <SelectItem value={Difficulty.MEDIUM}>Médio</SelectItem>
                        <SelectItem value={Difficulty.HARD}>Difícil</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                {/* Image Upload */}
                <div className="space-y-3">
                  <Label htmlFor="image" className="text-sm font-medium">
                    Imagem (opcional)
                  </Label>
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 transition-colors hover:border-gray-400">
                    <input
                      type="file"
                      id="image"
                      accept="image/*"
                      onChange={handleImageUpload}
                      className="hidden"
                      disabled={imageUploading}
                    />
                    <div className="text-center">
                      <Upload className="h-8 w-8 text-gray-500 mx-auto mb-3" />
                      <div className="space-y-2">
                        <label htmlFor="image">
                          <Button
                            type="button"
                            variant="outline"
                            className="cursor-pointer border-gray-300 text-gray-700 hover:bg-blue-500 hover:text-white hover:border-blue-500"
                            disabled={imageUploading}
                            asChild
                          >
                            <span className="flex items-center gap-2">
                              <Upload className="h-4 w-4" />
                              {imageUploading ? `Enviando... ${imageProgress}%` : 'Escolher imagem'}
                            </span>
                          </Button>
                        </label>
                        <p className="text-xs text-gray-500">
                          PNG, JPG ou WebP até 2MB
                        </p>
                      </div>
                    </div>
                    {watchedValues.imageUrl && (
                      <div className="mt-4 flex items-center justify-center gap-3 p-3 bg-green-50 border border-green-200 rounded-md">
                        <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                        <span className="text-sm text-green-700 font-medium">Imagem enviada com sucesso!</span>
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => {
                            setValue('imageUrl', undefined);
                            resetImageUpload();
                          }}
                          className="h-6 w-6 p-0 hover:bg-red-100 text-red-600"
                        >
                          ×
                        </Button>
                      </div>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>

            {watchedValues.type !== QuestionType.ESSAY && (
              <Card className="bg-white shadow-md">
                <CardHeader className="pb-4">
                  <CardTitle className="flex items-center gap-2 text-lg text-gray-900">
                    <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                    Opções de Resposta
                  </CardTitle>
                  <p className="text-sm text-gray-600">
                    Arraste para reordenar • Clique ✓ para marcar como correta
                  </p>
                </CardHeader>
                <CardContent className="space-y-4">
                  <DragDropContext onDragEnd={handleDragEnd}>
                    <Droppable droppableId="options">
                      {(provided) => (
                        <div {...provided.droppableProps} ref={provided.innerRef} className="space-y-3">
                          {watchedValues.options.map((option, index) => (
                            <Draggable key={index} draggableId={`option-${index}`} index={index}>
                              {(provided, snapshot) => (
                                <div
                                  ref={provided.innerRef}
                                  {...provided.draggableProps}
                                  className={`flex gap-3 p-3 rounded-lg border transition-all ${
                                    snapshot.isDragging
                                      ? 'shadow-lg bg-muted/50'
                                      : 'bg-card hover:bg-muted/30'
                                  }`}
                                >
                                  <div {...provided.dragHandleProps} className="flex items-center">
                                    <div className="w-5 h-5 text-gray-500 hover:text-gray-700 cursor-grab active:cursor-grabbing">
                                      ⋮⋮
                                    </div>
                                  </div>
                                  <div className="flex-1">
                                    <Input
                                      value={option}
                                      onChange={(e) => updateOption(index, e.target.value)}
                                      placeholder={`Opção ${index + 1}...`}
                                      className="border-0 bg-transparent focus:bg-background px-0"
                                    />
                                  </div>
                                  <div className="flex gap-2">
                                    <Button
                                      type="button"
                                      variant={watchedValues.correctAnswer === option ? "default" : "outline"}
                                      size="sm"
                                      onClick={() => setValue('correctAnswer', option)}
                                      disabled={!option.trim()}
                                      className={`min-w-[2.5rem] ${
                                        watchedValues.correctAnswer === option
                                          ? 'bg-green-500 hover:bg-green-600 text-white'
                                          : 'border-gray-300'
                                      }`}
                                    >
                                      ✓
                                    </Button>
                                    {watchedValues.options.length > 2 && (
                                      <Button
                                        type="button"
                                        variant="outline"
                                        size="sm"
                                        onClick={() => removeOption(index)}
                                        className="min-w-[2.5rem] hover:bg-red-50 hover:border-red-300 border-gray-300"
                                      >
                                        <Trash2 className="h-4 w-4 text-red-600" />
                                      </Button>
                                    )}
                                  </div>
                                </div>
                              )}
                            </Draggable>
                          ))}
                          {provided.placeholder}
                        </div>
                      )}
                    </Droppable>
                  </DragDropContext>

                  {watchedValues.options.length < 6 && (
                    <Button
                      type="button"
                      variant="outline"
                      onClick={addOption}
                      className="w-full border-dashed border-gray-300 hover:border-blue-500 hover:bg-blue-50 text-gray-700"
                    >
                      <Plus className="h-4 w-4 mr-2" />
                      Adicionar Opção
                    </Button>
                  )}

                  {errors.options && (
                    <div className="flex items-center gap-2 p-3 bg-red-50 border border-red-200 rounded-md">
                      <span className="text-xs text-red-600">⚠</span>
                      <p className="text-sm text-red-600">{errors.options.message}</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            )}

            {watchedValues.type === QuestionType.ESSAY && (
              <Card className="bg-white shadow-md">
                <CardHeader className="pb-4">
                  <CardTitle className="flex items-center gap-2 text-lg text-gray-900">
                    <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                    Resposta Esperada
                  </CardTitle>
                  <p className="text-sm text-gray-600">
                    Defina a resposta modelo para questões dissertativas
                  </p>
                </CardHeader>
                <CardContent>
                  <Textarea
                    {...register('correctAnswer')}
                    placeholder="Digite a resposta esperada para questões dissertativas..."
                    rows={4}
                    className="resize-none"
                  />
                </CardContent>
              </Card>
            )}

            <Card className="bg-white shadow-md">
              <CardHeader className="pb-4">
                <CardTitle className="flex items-center gap-2 text-lg text-gray-900">
                  <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                  Explicação (Opcional)
                </CardTitle>
                <p className="text-sm text-gray-600">
                  Ajude os alunos a entenderem por que esta é a resposta correta
                </p>
              </CardHeader>
              <CardContent>
                <Textarea
                  {...register('explanation')}
                  placeholder="Explique por que esta é a resposta correta..."
                  rows={4}
                  className="resize-none"
                />
              </CardContent>
            </Card>

            <div className="flex flex-col sm:flex-row justify-end gap-3 pt-6 border-t border-gray-200">
              <Button
                type="button"
                variant="outline"
                onClick={() => router.push('/admin/questions')}
                className="flex items-center gap-2 border-gray-300 text-gray-700 hover:bg-gray-100"
              >
                <span>Voltar</span>
              </Button>
              <Button
                type="submit"
                disabled={submitting || !isFormValid()}
                className="flex items-center gap-2 min-w-[140px] bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white"
              >
                {submitting && <Loader2 className="h-4 w-4 animate-spin" />}
                <Save className="h-4 w-4" />
                {submitting ? 'Criando...' : 'Criar Questão'}
              </Button>
            </div>
          </form>
        </div>

        {/* Preview */}
        {showPreview && isFormValid() && (
          <div className="space-y-6">
            <Card className="bg-white shadow-md">
              <CardHeader>
                <CardTitle className="text-gray-900">Preview da Questão</CardTitle>
              </CardHeader>
              <CardContent>
                <QuestionPreview
                  text={watchedValues.text}
                  type={watchedValues.type}
                  category={watchedValues.category}
                  difficulty={watchedValues.difficulty}
                  options={watchedValues.options.filter(o => o.trim())}
                  correctAnswer={watchedValues.correctAnswer}
                  imageUrl={watchedValues.imageUrl}
                  explanation={watchedValues.explanation}
                  showCorrect={true}
                  compact={true}
                />
              </CardContent>
            </Card>
          </div>
        )}
      </div>
      </div>
    </div>
  );
}