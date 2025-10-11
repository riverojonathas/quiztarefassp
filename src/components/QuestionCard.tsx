'use client';

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Confetti from 'react-confetti';
import Image from 'next/image';
import { Question } from '../domain/models';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';

interface QuestionCardProps {
  question: Question;
  onAnswer: (choiceId: string) => void;
  disabled?: boolean;
}

export function QuestionCard({ question, onAnswer, disabled }: QuestionCardProps) {
  const [selectedChoice, setSelectedChoice] = useState<string | null>(null);
  const [showConfetti, setShowConfetti] = useState(false);
  const [shake, setShake] = useState(false);
  const questionRef = useRef<HTMLDivElement>(null);

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

  // Announce question to screen readers when it changes
  useEffect(() => {
    if (questionRef.current) {
      const announcement = `Pergunta: ${question.statement}. ${question.choices.length} opções disponíveis.`;
      // Use ARIA live region for screen reader announcements
      const liveRegion = document.createElement('div');
      liveRegion.setAttribute('aria-live', 'polite');
      liveRegion.setAttribute('aria-atomic', 'true');
      liveRegion.className = 'sr-only';
      liveRegion.textContent = announcement;
      document.body.appendChild(liveRegion);

      setTimeout(() => {
        document.body.removeChild(liveRegion);
      }, 1000);
    }
  }, [question.id]);

  return (
    <motion.div
      ref={questionRef}
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
      role="region"
      aria-label="Pergunta do quiz"
      aria-live="polite"
    >
        <Card className="w-full max-w-2xl mx-auto md:max-w-xl">
          <CardHeader>
            <CardTitle
              className="text-xl md:text-2xl"
              id={`question-${question.id}`}
              role="heading"
              aria-level={2}
            >
              {question.statement}
            </CardTitle>
            {question.imageUrl && (
              <Image
                src={question.imageUrl}
                alt={`Ilustração para a pergunta: ${question.statement}`}
                width={400}
                height={300}
                className="w-full max-w-md mx-auto rounded-lg mt-4"
                role="img"
              />
            )}
          </CardHeader>
          <CardContent className="space-y-4 md:space-y-6">
            <div
              role="radiogroup"
              aria-labelledby={`question-${question.id}`}
              aria-describedby="question-instructions"
            >
              <div id="question-instructions" className="sr-only">
                Selecione uma resposta usando as teclas de seta ou Tab para navegar, e Enter ou Espaço para selecionar.
              </div>
              {question.choices.map((choice, index) => (
                <Button
                  key={choice.id}
                  onClick={() => handleAnswer(choice.id)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.preventDefault();
                      handleAnswer(choice.id);
                    }
                  }}
                  disabled={disabled}
                  className={`w-full text-left justify-start h-auto p-4 md:p-4 focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 min-h-[44px] md:min-h-[auto] ${
                    selectedChoice === choice.id ? 'ring-2 ring-blue-500 bg-blue-50' : ''
                  }`}
                  variant="outline"
                  aria-label={`Opção ${String.fromCharCode(65 + index)}: ${choice.text}`}
                  aria-checked={selectedChoice === choice.id}
                  role="radio"
                  tabIndex={selectedChoice === choice.id || (!selectedChoice && index === 0) ? 0 : -1}
                >
                  <span className="font-semibold mr-2 text-base md:text-sm" aria-hidden="true">
                    {String.fromCharCode(65 + index)}.
                  </span>
                  <span className="text-base md:text-sm">{choice.text}</span>
                </Button>
              ))}
            </div>
          </CardContent>
        </Card>
        <AnimatePresence>
          {showConfetti && (
            <Confetti
              width={typeof window !== 'undefined' ? window.innerWidth : 1920}
              height={typeof window !== 'undefined' ? window.innerHeight : 1080}
              recycle={false}
              numberOfPieces={200}
              aria-hidden="true"
            />
          )}
        </AnimatePresence>
      </motion.div>
  );
}