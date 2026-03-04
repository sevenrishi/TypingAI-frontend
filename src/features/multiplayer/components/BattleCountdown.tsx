import React, { useState, useEffect } from 'react';
import { useTheme } from '../../../providers/ThemeProvider';

interface BattleCountdownProps {
  startAt: number; // Unix timestamp when race starts
  onCountdownEnd?: () => void;
}

export default function BattleCountdown({ startAt, onCountdownEnd }: BattleCountdownProps) {
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  const [secondsLeft, setSecondsLeft] = useState(0);
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    // Calculate initial seconds left
    const now = Date.now();
    const remaining = Math.max(0, Math.ceil((startAt - now) / 1000));
    setSecondsLeft(remaining);

    if (remaining === 0) {
      setIsVisible(false);
      onCountdownEnd?.();
      return;
    }

    // Update countdown every 100ms for smooth countdown
    const interval = setInterval(() => {
      const now = Date.now();
      const remaining = Math.max(0, Math.ceil((startAt - now) / 1000));
      setSecondsLeft(remaining);

      if (remaining === 0) {
        setIsVisible(false);
        onCountdownEnd?.();
        clearInterval(interval);
      }
    }, 100);

    return () => clearInterval(interval);
  }, [startAt, onCountdownEnd]);

  if (!isVisible) {
    return null;
  }

  return (
    <div
      className={`fixed inset-0 flex items-center justify-center pointer-events-none z-50 ${
        isDark ? 'bg-slate-950/70' : 'bg-slate-900/20'
      }`}
    >
      <div className="flex flex-col items-center">
        <div className={`text-7xl font-bold tabular-nums ${
          isDark ? 'text-cyan-300' : 'text-sky-600'
        }`}>
          {secondsLeft}
        </div>
        <p className={`text-xl font-semibold mt-4 ${
          isDark ? 'text-slate-100' : 'text-slate-900'
        }`}>
          Battle Starting...
        </p>
      </div>
    </div>
  );
}
