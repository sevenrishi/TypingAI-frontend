import React, { useEffect, useRef } from 'react';

export default function TextDisplay({ text, typed }: { text: string; typed: string }) {
  const containerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    // auto-scroll to current char
    const el = containerRef.current;
    if (!el) return;
    const cursor = el.querySelector('.cursor');
    if (cursor) cursor.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }, [typed]);

  const chars = text.split('');

  return (
    <div ref={containerRef} className="border rounded p-4 h-40 overflow-auto bg-white dark:bg-gray-800" role="region" aria-label="Typing text">
      <p className="leading-7 text-lg" role="text" aria-live="polite">
        {chars.map((ch, i) => {
          const typedChar = typed[i];
          const isCurrent = i === typed.length;
          const correct = typedChar == null ? null : typedChar === ch;
          const className = correct == null ? (isCurrent ? 'underline bg-yellow-100 dark:bg-yellow-900/30' : '') : (correct ? 'text-green-600' : 'text-red-500');
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
