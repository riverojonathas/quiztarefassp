'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Confetti from 'react-confetti';
import { Question } from '../domain/models';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from './ui/tooltip';

interface QuestionCardProps {
  question: Question;
  onAnswer: (choiceId: string) => void;
  disabled?: boolean;
}

export function QuestionCard({ question, onAnswer, disabled }: QuestionCardProps) {
  const [selectedChoice, setSelectedChoice] = useState<string | null>(null);
  const [showConfetti, setShowConfetti] = useState(false);
  const [shake, setShake] = useState(false);

  const handleAnswer = (choiceId: string) => {
    if (disabled) return;
    setSelectedChoice(choiceId);
    const isCorrect = question.choices.find(c => c.id === choiceId)?.isCorrect;
    if (isCorrect) {
      setShowConfetti(true);
      setTimeout(() => setShowConfetti(false), 3000);
    } else {
      setShake(true);
      setTimeout(() => setShake(false), 500);
    }
    onAnswer(choiceId);
  };

  return (
    <TooltipProvider>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{
          opacity: 1,
          y: 0,
          x: shake ? [-10, 10, -10, 10, 0] : 0,
        }}
        transition={{
          duration: shake ? 0.5 : 0.5,
          ease: shake ? 'easeInOut' : 'easeOut',
        }}
        exit={{ opacity: 0, y: -20 }}
      >
        <Card className="w-full max-w-2xl mx-auto md:max-w-xl">
          <CardHeader>
            <CardTitle className="text-xl">{question.statement}</CardTitle>
            {question.imageUrl && (
              <img
                src={question.imageUrl}
                alt="Question illustration"
                className="w-full max-w-md mx-auto rounded-lg mt-4"
              />
            )}
          </CardHeader>
          <CardContent className="space-y-4">
            {question.choices.map((choice, index) => (
              <Tooltip key={choice.id}>
                <TooltipTrigger asChild>
                  <Button
                    onClick={() => handleAnswer(choice.id)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' || e.key === ' ') {
                        handleAnswer(choice.id);
                      }
                    }}
                    disabled={disabled}
                    className={`w-full text-left justify-start h-auto p-4 focus-visible:ring-2 focus-visible:ring-blue-500 ${
                      selectedChoice === choice.id ? 'ring-2 ring-blue-500' : ''
                    }`}
                    variant="outline"
                    aria-label={`Opção ${choice.id}: ${choice.text}`}
                    tabIndex={0}
                  >
                    {choice.text}
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Clique ou pressione Enter para selecionar esta resposta</p>
                </TooltipContent>
              </Tooltip>
            ))}
          </CardContent>
        </Card>
        <AnimatePresence>
          {showConfetti && (
            <Confetti
              width={window.innerWidth}
              height={window.innerHeight}
              recycle={false}
              numberOfPieces={200}
            />
          )}
        </AnimatePresence>
      </motion.div>
    </TooltipProvider>
  );
}