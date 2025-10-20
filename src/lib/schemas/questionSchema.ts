import { z } from 'zod';

// Enum para tipos de questões
export const QuestionType = {
  MULTIPLE_CHOICE: 'multiple_choice',
  TRUE_FALSE: 'true_false',
  ESSAY: 'essay',
} as const;

export type QuestionType = typeof QuestionType[keyof typeof QuestionType];

// Enum para dificuldades
export const Difficulty = {
  EASY: 'easy',
  MEDIUM: 'medium',
  HARD: 'hard',
} as const;

export type Difficulty = typeof Difficulty[keyof typeof Difficulty];

// Categorias pré-definidas (baseadas em disciplinas escolares brasileiras)
export const Categories = [
  'Matemática',
  'História',
  'Geografia',
  'Ciências',
  'Língua Portuguesa',
  'Inglês',
  'Artes',
  'Educação Física',
  'Filosofia',
  'Sociologia',
] as const;

export type Category = typeof Categories[number];

// Schema base para questão
export const questionSchema = z
  .object({
    text: z
      .string()
      .min(10, 'Pergunta deve ter pelo menos 10 caracteres')
      .max(500, 'Pergunta deve ter no máximo 500 caracteres'),

    type: z.enum([QuestionType.MULTIPLE_CHOICE, QuestionType.TRUE_FALSE, QuestionType.ESSAY]),

    category: z.enum(Categories),

    difficulty: z.enum([Difficulty.EASY, Difficulty.MEDIUM, Difficulty.HARD]),

    // Opções dinâmicas baseadas no tipo
    options: z
      .array(z.string().min(1, 'Opção não pode estar vazia'))
      .min(2, 'Deve ter pelo menos 2 opções')
      .max(6, 'Máximo de 6 opções permitidas'),

    correctAnswer: z.string().min(1, 'Resposta correta é obrigatória'),

    // Campos opcionais
    tags: z.array(z.string()).optional(),
    imageUrl: z.string().url().optional(),
    explanation: z.string().max(1000, 'Explicação deve ter no máximo 1000 caracteres').optional(),
  })
  .refine(
    (data) => {
      // Validação baseada no tipo
      if (data.type === QuestionType.MULTIPLE_CHOICE) {
        return data.options.length >= 4; // Mínimo 4 para múltipla escolha
      }
      if (data.type === QuestionType.TRUE_FALSE) {
        return data.options.length === 2; // Exatamente 2 para V/F
      }
      return true; // Essay não precisa de opções
    },
    {
      message: 'Número de opções inválido para o tipo de questão',
      path: ['options'],
    }
  )
  .refine(
    (data) => {
      // Resposta correta deve estar entre as opções (exceto para essay)
      if (data.type === QuestionType.ESSAY) {
        return true; // Essay pode ter resposta livre
      }
      return data.options.includes(data.correctAnswer);
    },
    {
      message: 'Resposta correta deve estar entre as opções',
      path: ['correctAnswer'],
    }
  );

// Schema para criação (sem ID)
export const createQuestionSchema = questionSchema;

// Schema para atualização (com ID opcional)
export const updateQuestionSchema = questionSchema.safeExtend({
  id: z.string().uuid().optional(),
});

// Schema para filtros de busca
export const questionFiltersSchema = z.object({
  category: z.enum(Categories).optional(),
  difficulty: z.enum([Difficulty.EASY, Difficulty.MEDIUM, Difficulty.HARD]).optional(),
  type: z.enum([QuestionType.MULTIPLE_CHOICE, QuestionType.TRUE_FALSE, QuestionType.ESSAY]).optional(),
  search: z.string().optional(),
  page: z.number().min(1).default(1),
  limit: z.number().min(1).max(100).default(20),
});

// Tipos inferidos
export type CreateQuestionInput = z.infer<typeof createQuestionSchema>;
export type UpdateQuestionInput = z.infer<typeof updateQuestionSchema>;
export type QuestionFilters = z.infer<typeof questionFiltersSchema>;
export type Question = CreateQuestionInput & {
  id: string;
  createdBy: string;
  createdAt: Date;
  updatedAt?: Date;
};