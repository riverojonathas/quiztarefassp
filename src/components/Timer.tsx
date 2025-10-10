'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

interface TimerProps {
  duration: number; // in seconds
  onTimeUp: () => void;
}

export function Timer({ duration, onTimeUp }: TimerProps) {
  const [timeLeft, setTimeLeft] = useState(duration);

  useEffect(() => {
    if (timeLeft <= 0) {
      onTimeUp();
      return;
    }
    const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
    return () => clearTimeout(timer);
  }, [timeLeft, onTimeUp]);

  const progress = (timeLeft / duration) * 100;

  return (
    <div className="flex items-center justify-center">
      <div className="relative w-20 h-20">
        <svg className="w-20 h-20 transform -rotate-90" viewBox="0 0 100 100">
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
            className="text-blue-500"
            strokeDasharray={`${2 * Math.PI * 45}`}
            strokeDashoffset={`${2 * Math.PI * 45 * (1 - progress / 100)}`}
            initial={{ strokeDashoffset: 0 }}
            animate={{ strokeDashoffset: `${2 * Math.PI * 45 * (1 - progress / 100)}` }}
            transition={{ duration: 1, ease: 'linear' }}
          />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-xl font-bold">{timeLeft}</span>
        </div>
      </div>
    </div>
  );
}