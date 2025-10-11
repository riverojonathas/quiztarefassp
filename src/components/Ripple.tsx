'use client';

import { useState, useEffect, useRef } from 'react';

interface RippleProps {
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
  disabled?: boolean;
}

export function Ripple({ children, className = '', onClick, disabled = false }: RippleProps) {
  const [ripples, setRipples] = useState<Array<{ id: number; x: number; y: number }>>([]);
  const containerRef = useRef<HTMLDivElement>(null);

  const handleClick = (event: React.MouseEvent<HTMLDivElement>) => {
    if (disabled) return;

    const rect = containerRef.current?.getBoundingClientRect();
    if (!rect) return;

    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;
    const newRipple = { id: Date.now(), x, y };

    setRipples(prev => [...prev, newRipple]);

    // Add haptic feedback simulation
    if (navigator.vibrate) {
      navigator.vibrate(50);
    }

    onClick?.();
  };

  useEffect(() => {
    const timer = setInterval(() => {
      setRipples(prev => prev.filter(ripple => Date.now() - ripple.id < 600));
    }, 100);

    return () => clearInterval(timer);
  }, []);

  return (
    <div
      ref={containerRef}
      className={`relative overflow-hidden cursor-pointer select-none ${className}`}
      onClick={handleClick}
      style={{ touchAction: 'manipulation' }}
    >
      {children}
      {ripples.map(ripple => (
        <span
          key={ripple.id}
          className="absolute bg-white/40 rounded-full pointer-events-none"
          style={{
            left: ripple.x - 15,
            top: ripple.y - 15,
            width: 30,
            height: 30,
            animation: 'ripple 0.6s ease-out forwards',
          }}
        />
      ))}
      <style jsx>{`
        @keyframes ripple {
          0% {
            transform: scale(0);
            opacity: 1;
          }
          50% {
            opacity: 0.8;
          }
          100% {
            transform: scale(3);
            opacity: 0;
          }
        }
      `}</style>
    </div>
  );
}