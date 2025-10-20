'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import Image from 'next/image';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { QuestionType, Difficulty, Categories } from '@/lib/schemas/questionSchema';

interface QuestionPreviewProps {
  text: string;
  type: QuestionType;
  category: string;
  difficulty: Difficulty;
  options: string[];
  correctAnswer: string;
  imageUrl?: string;
  explanation?: string;
  showCorrect?: boolean;
  compact?: boolean;
}

export function QuestionPreview({
  text,
  type,
  category,
  difficulty,
  options,
  correctAnswer,
  imageUrl,
  explanation,
  showCorrect = false,
  compact = false
}: QuestionPreviewProps) {
  const [selectedOption, setSelectedOption] = useState<string | null>(null);

  const getDifficultyColor = (diff: Difficulty) => {
    switch (diff) {
      case Difficulty.EASY: return 'bg-green-50 text-green-700 border-green-200';
      case Difficulty.MEDIUM: return 'bg-yellow-50 text-yellow-700 border-yellow-200';
      case Difficulty.HARD: return 'bg-red-50 text-red-700 border-red-200';
      default: return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  const getCategoryLabel = (cat: string) => {
    return (Categories as readonly string[]).includes(cat) ? cat : 'Categoria';
  };

  const handleOptionClick = (option: string) => {
    if (compact) return; // No interaction in compact mode
    setSelectedOption(option);
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3 }}
    >
      <Card className={`w-full ${compact ? 'max-w-md' : 'max-w-2xl'} mx-auto shadow-md border-gray-200 bg-white`}>
        <CardHeader className={`${compact ? 'pb-3' : 'pb-4'}`}>
          <div className="flex flex-wrap gap-2 mb-4">
            <Badge variant="outline" className={`${getDifficultyColor(difficulty)} font-medium border`}>
              {difficulty === Difficulty.EASY ? 'Fácil' :
               difficulty === Difficulty.MEDIUM ? 'Médio' : 'Difícil'}
            </Badge>
            <Badge variant="secondary" className="font-medium bg-blue-100 text-blue-700">
              {getCategoryLabel(category)}
            </Badge>
            <Badge variant="outline" className="text-gray-600 border-gray-300">
              {type === QuestionType.MULTIPLE_CHOICE ? 'Múltipla Escolha' :
               type === QuestionType.TRUE_FALSE ? 'Verdadeiro/Falso' : 'Dissertativa'}
            </Badge>
          </div>

          <CardTitle className={`${compact ? 'text-lg' : 'text-xl'} leading-relaxed text-gray-900`}>
            {text}
          </CardTitle>

          {imageUrl && (
            <div className="mt-4">
              <Image
                src={imageUrl}
                alt="Ilustração da questão"
                width={compact ? 300 : 400}
                height={compact ? 200 : 300}
                className={`w-full ${compact ? 'max-w-sm' : 'max-w-md'} mx-auto rounded-lg object-cover border shadow-sm`}
                priority={false}
              />
            </div>
          )}
        </CardHeader>

        <CardContent className={compact ? 'pt-0' : ''}>
          {type === QuestionType.ESSAY ? (
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-600">
                Resposta dissertativa:
              </label>
              <div className={`border border-gray-200 rounded-lg p-3 ${compact ? 'min-h-[80px]' : 'min-h-[120px]'} bg-gray-50`}>
                <p className="text-sm text-gray-500 italic">
                  Campo para resposta livre do aluno
                </p>
              </div>
              {showCorrect && correctAnswer && (
                <div className="mt-4 p-4 bg-green-50 border border-green-200 rounded-lg">
                  <p className="text-sm font-medium text-green-700 mb-2 flex items-center gap-2">
                    <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                    Resposta esperada:
                  </p>
                  <p className="text-sm text-green-700">{correctAnswer}</p>
                </div>
              )}
            </div>
          ) : (
            <div className="space-y-3">
              <div className="text-sm font-medium text-gray-600 mb-2">
                Selecione uma opção:
              </div>

              {options.map((option, index) => {
                const isSelected = selectedOption === option;
                const isCorrect = showCorrect && option === correctAnswer;
                const isIncorrect = showCorrect && isSelected && option !== correctAnswer;

                return (
                  <Button
                    key={index}
                    onClick={() => handleOptionClick(option)}
                    disabled={compact}
                    variant="outline"
                    className={`w-full text-left justify-start h-auto p-4 transition-all border-gray-200 ${
                      compact ? 'cursor-default hover:bg-transparent' : 'hover:bg-gray-50 hover:border-gray-300'
                    } ${
                      isCorrect ? 'bg-green-50 border-green-300 text-green-700 hover:bg-green-100' :
                      isIncorrect ? 'bg-red-50 border-red-300 text-red-700 hover:bg-red-100' :
                      isSelected ? 'bg-blue-50 border-blue-300 text-blue-700' : ''
                    }`}
                  >
                    <span className="font-semibold mr-3 text-base text-gray-600" aria-hidden="true">
                      {String.fromCharCode(65 + index)}.
                    </span>
                    <span className="text-base">{option}</span>
                    {isCorrect && (
                      <span className="ml-auto text-green-600 font-semibold" aria-label="Resposta correta">
                        ✓
                      </span>
                    )}
                    {isIncorrect && (
                      <span className="ml-auto text-red-600 font-semibold" aria-label="Resposta incorreta">
                        ✗
                      </span>
                    )}
                  </Button>
                );
              })}
            </div>
          )}

          {showCorrect && explanation && (
            <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <p className="text-sm font-medium text-blue-700 mb-2 flex items-center gap-2">
                <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
                Explicação:
              </p>
              <p className="text-sm text-gray-700">{explanation}</p>
            </div>
          )}

          {compact && (
            <div className="mt-4 text-xs text-muted-foreground text-center">
              Preview da questão no jogo
            </div>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
}