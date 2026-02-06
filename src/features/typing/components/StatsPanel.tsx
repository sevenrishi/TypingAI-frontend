import React from 'react';
import { useTheme } from '../../../providers/ThemeProvider';

export default function StatsPanel({ wpm, cpm, accuracy, errors, elapsed }: { wpm: number; cpm: number; accuracy: number; errors: number; elapsed: number }) {
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  const surfaceSoft = isDark
    ? 'bg-slate-900/45 border-slate-700/50 text-slate-100'
    : 'bg-white/60 border-slate-200/80 text-slate-900';
  const labelText = isDark ? 'text-slate-400' : 'text-slate-500';

  return (
    <div className="grid grid-cols-2 md:grid-cols-5 gap-3 mt-4 text-sm">
      {[
        { label: 'WPM', value: Math.round(wpm) },
        { label: 'CPM', value: Math.round(cpm) },
        { label: 'Accuracy', value: `${Math.round(accuracy)}%` },
        { label: 'Errors', value: errors },
        { label: 'Time', value: `${Math.ceil(elapsed / 1000)}s` },
      ].map((stat) => (
        <div
          key={stat.label}
          className={`p-3 rounded-2xl text-center border transition-colors duration-300 ${surfaceSoft}`}
        >
          <div
            className={`text-[10px] uppercase tracking-[0.28em] ${labelText}`}
            style={{ fontFamily: "'JetBrains Mono', monospace" }}
          >
            {stat.label}
          </div>
          <div className="mt-2 text-xl font-bold">{stat.value}</div>
        </div>
      ))}
    </div>
  );
}
