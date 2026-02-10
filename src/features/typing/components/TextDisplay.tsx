import React, { useEffect, useRef } from 'react';
import { useTheme } from '../../../providers/ThemeProvider';

export default function TextDisplay({ text, typed }: { text: string; typed: string }) {
  const { theme } = useTheme();
  const containerRef = useRef<HTMLDivElement | null>(null);
  const isDark = theme === 'dark';

  useEffect(() => {
    // auto-scroll to current char
    const el = containerRef.current;
    if (!el) return;
    const cursor = el.querySelector('.cursor');
    if (cursor) cursor.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }, [typed]);

  const chars = text.split('');

  return (
    <div 
      ref={containerRef}
      className={`border rounded-2xl p-4 h-40 overflow-auto transition-colors duration-300 ${
        isDark
          ? 'bg-slate-900/70 border-slate-700/60 text-slate-100'
          : 'bg-white/80 border-slate-200 text-slate-900'
      }`}
      role="region"
      aria-label="Typing text"
    >
      <p
        className="leading-7 text-lg"
        style={{ fontFamily: "'JetBrains Mono', monospace" }}
        role="text"
        aria-live="polite"
      >
        {chars.map((ch, i) => {
          const typedChar = typed[i];
          const isCurrent = i === typed.length;
          const correct = typedChar == null ? null : typedChar === ch;
          const className = correct == null
            ? isCurrent
              ? isDark
                ? 'underline decoration-cyan-400/70 bg-cyan-500/15'
                : 'underline decoration-sky-400 bg-sky-100'
              : ''
            : correct
              ? isDark
                ? 'text-emerald-400'
                : 'text-emerald-600'
              : isDark
              ? 'text-rose-400'
              : 'text-rose-600';
          const ariaCurrent = isCurrent ? { 'aria-current': 'true' } : {};
          return (
            <span key={i} className={className + (isCurrent ? ' cursor' : '')} {...ariaCurrent}>
              {ch}
            </span>
          );
        })}
      </p>
    </div>
  );
}
