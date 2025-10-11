'use client';

import { useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';

interface BackGestureConfig {
  enabled?: boolean;
  edgeThreshold?: number; // Distance from left edge to trigger gesture
  minSwipeDistance?: number;
  maxSwipeTime?: number;
}

export function useBackGesture({
  enabled = true,
  edgeThreshold = 50,
  minSwipeDistance = 100,
  maxSwipeTime = 300,
}: BackGestureConfig = {}) {
  const router = useRouter();

  const handleBackGesture = useCallback((startX: number, endX: number, deltaTime: number) => {
    const deltaX = endX - startX;

    // Check if swipe started from left edge and moved right
    if (startX <= edgeThreshold && deltaX >= minSwipeDistance && deltaTime <= maxSwipeTime) {
      // Provide haptic feedback if available
      if (navigator.vibrate) {
        navigator.vibrate(50);
      }

      // Go back in history
      if (window.history.length > 1) {
        router.back();
      }
    }
  }, [router, edgeThreshold, minSwipeDistance, maxSwipeTime]);

  useEffect(() => {
    if (!enabled) return;

    let touchStart: { x: number; y: number; time: number } | null = null;

    const handleTouchStart = (e: TouchEvent) => {
      const touch = e.touches[0];
      touchStart = {
        x: touch.clientX,
        y: touch.clientY,
        time: Date.now(),
      };
    };

    const handleTouchEnd = (e: TouchEvent) => {
      if (!touchStart) return;

      const touch = e.changedTouches[0];
      const touchEnd = {
        x: touch.clientX,
        y: touch.clientY,
        time: Date.now(),
      };

      const deltaTime = touchEnd.time - touchStart.time;
      handleBackGesture(touchStart.x, touchEnd.x, deltaTime);

      touchStart = null;
    };

    const handleTouchCancel = () => {
      touchStart = null;
    };

    document.addEventListener('touchstart', handleTouchStart, { passive: true });
    document.addEventListener('touchend', handleTouchEnd, { passive: true });
    document.addEventListener('touchcancel', handleTouchCancel, { passive: true });

    return () => {
      document.removeEventListener('touchstart', handleTouchStart);
      document.removeEventListener('touchend', handleTouchEnd);
      document.removeEventListener('touchcancel', handleTouchCancel);
    };
  }, [enabled, handleBackGesture]);

  return null;
}