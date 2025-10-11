'use client';

import { useEffect, useState, useRef } from 'react';
import { motion } from 'framer-motion';

interface TimerProps {
  duration: number; // in seconds
  onTimeUp: () => void;
  timeRemaining?: number; // Add this prop for external control
  showTimer?: boolean; // Control whether to show the timer visually
}

export function Timer({ duration, onTimeUp, timeRemaining, showTimer = true }: TimerProps) {
  const [timeLeft, setTimeLeft] = useState(timeRemaining ?? duration);
  const liveRegionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (timeRemaining !== undefined) {
      setTimeLeft(timeRemaining);
    }
  }, [timeRemaining]);

  useEffect(() => {
    if (timeLeft <= 0) {
      onTimeUp();
      return;
    }
    const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
    return () => clearTimeout(timer);
  }, [timeLeft, onTimeUp]);

  // Announce time updates to screen readers
  useEffect(() => {
    if (liveRegionRef.current) {
      const announcement = timeLeft > 0
        ? `Tempo restante: ${timeLeft} segundos`
        : 'Tempo esgotado!';
      liveRegionRef.current.textContent = announcement;
    }
  }, [timeLeft]);

  const progress = (timeLeft / duration) * 100;
  const isUrgent = timeLeft <= 10; // Last 10 seconds

  // Don't render anything if timer should not be shown
  if (!showTimer) {
    return null;
  }

  return (
    <div className="flex items-center justify-center">
      <div
        className="relative w-24 h-24 md:w-20 md:h-20"
        role="timer"
        aria-label="Cronômetro da pergunta"
        aria-live="polite"
        aria-atomic="true"
      >
        <svg
          className="w-24 h-24 md:w-20 md:h-20 transform -rotate-90"
          viewBox="0 0 100 100"
          role="img"
          aria-hidden="true"
        >
          <circle
            cx="50"
            cy="50"
            r="45"
            stroke="currentColor"
            strokeWidth="10"
            fill="transparent"
            className="text-gray-200"
          />
          <motion.circle
            cx="50"
            cy="50"
            r="45"
            stroke="currentColor"
            strokeWidth="10"
            fill="transparent"
            className={`transition-colors ${isUrgent ? 'text-red-500' : 'text-blue-500'}`}
            strokeDasharray={`${2 * Math.PI * 45}`}
            strokeDashoffset={`${2 * Math.PI * 45 * (1 - progress / 100)}`}
            initial={{ strokeDashoffset: 0 }}
            animate={{ strokeDashoffset: `${2 * Math.PI * 45 * (1 - progress / 100)}` }}
            transition={{ duration: 1, ease: 'linear' }}
          />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center">
          <span
            className={`text-2xl md:text-xl font-bold ${isUrgent ? 'text-red-600' : 'text-gray-800'}`}
            aria-hidden="true"
          >
            {timeLeft}
          </span>
        </div>
      </div>
      {/* Hidden live region for screen readers */}
      <div
        ref={liveRegionRef}
        aria-live="assertive"
        aria-atomic="true"
        className="sr-only"
      />
    </div>
  );
}