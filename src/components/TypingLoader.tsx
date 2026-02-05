import React from 'react';
import { useTheme } from '../providers/ThemeProvider';

interface TypingLoaderProps {
  isLoading: boolean;
  duration?: number;
}

export default function TypingLoader({ isLoading, duration = 3000 }: TypingLoaderProps) {
  const { theme } = useTheme();

  if (!isLoading) return null;

  const keyboardRows = ['QWERTYUIOP', 'ASDFGHJKL', 'ZXCVBNM'];
  const rowOffsets = [0, 0.8, 1.6];

  return (
    <div
      className={`fixed inset-0 z-50 flex items-center justify-center overflow-hidden transition-opacity duration-500 ${
        isLoading ? 'opacity-100' : 'opacity-0 pointer-events-none'
      } ${
        theme === 'dark'
          ? 'bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950'
          : 'bg-gradient-to-br from-slate-50 via-white to-slate-100'
      }`}
      role="status"
      aria-live="polite"
      aria-label="Loading TypingAI"
    >
      <div className="absolute inset-0 pointer-events-none">
        <div
          className={`absolute -top-40 -right-24 h-[520px] w-[520px] rounded-full blur-3xl ${
            theme === 'dark' ? 'bg-cyan-700/20' : 'bg-cyan-300/40'
          }`}
        />
        <div
          className={`absolute -bottom-48 -left-28 h-[520px] w-[520px] rounded-full blur-3xl ${
            theme === 'dark' ? 'bg-purple-700/20' : 'bg-purple-300/40'
          }`}
        />
        <div
          className="absolute inset-0 opacity-40"
          style={{
            backgroundImage:
              theme === 'dark'
                ? 'linear-gradient(rgba(255,255,255,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.04) 1px, transparent 1px)'
                : 'linear-gradient(rgba(15,23,42,0.06) 1px, transparent 1px), linear-gradient(90deg, rgba(15,23,42,0.06) 1px, transparent 1px)',
            backgroundSize: '48px 48px',
          }}
        />
      </div>

      <div className="relative w-full max-w-2xl px-6">
        <div
          className={`relative overflow-hidden rounded-[32px] border shadow-2xl ${
            theme === 'dark'
              ? 'border-slate-700/60 bg-slate-900/70'
              : 'border-slate-200/80 bg-white/80'
          }`}
        >
          <div
            className={`absolute inset-0 ${
              theme === 'dark'
                ? 'bg-gradient-to-br from-slate-900/80 via-slate-900/40 to-slate-950/80'
                : 'bg-gradient-to-br from-white via-slate-50 to-slate-100'
            }`}
          />
          <div className="relative px-8 py-12 text-center sm:px-12">
            <div className="flex flex-wrap items-end justify-center gap-3">
              <span
                className={`text-4xl font-bold tracking-tight sm:text-6xl ${
                  theme === 'dark' ? 'text-slate-100' : 'text-slate-900'
                }`}
                style={{ fontFamily: "'Space Grotesk', 'Segoe UI', sans-serif" }}
              >
                Typing
              </span>
              <span
                className="text-4xl font-black tracking-tight text-transparent sm:text-6xl bg-clip-text bg-gradient-to-r from-cyan-400 to-purple-600"
                style={{ fontFamily: "'Space Grotesk', 'Segoe UI', sans-serif" }}
              >
                AI
              </span>
            </div>
            <div
              className={`mt-2 text-[11px] uppercase tracking-[0.5em] ${
                theme === 'dark' ? 'text-slate-400' : 'text-slate-500'
              }`}
              style={{ fontFamily: "'JetBrains Mono', 'Courier New', monospace" }}
            >
              Initializing
            </div>

            <div className="mt-10 space-y-3" aria-hidden="true">
              {keyboardRows.map((row, rowIdx) => (
                <div
                  key={row}
                  className="flex justify-center gap-2"
                  style={{ paddingLeft: `${rowOffsets[rowIdx]}rem` }}
                >
                  {row.split('').map((letter, keyIdx) => (
                    <div
                      key={`${rowIdx}-${letter}`}
                      className={`loader-key h-8 w-8 sm:h-9 sm:w-9 ${
                        theme === 'dark'
                          ? 'border-slate-700/60 text-slate-100'
                          : 'border-slate-200/80 text-slate-700'
                      }`}
                      style={{ animationDelay: `${(rowIdx * 0.5 + keyIdx * 0.08).toFixed(2)}s` }}
                    >
                      <span>{letter}</span>
                    </div>
                  ))}
                </div>
              ))}
            </div>

            <div className="mt-8 flex items-center justify-center gap-2 text-sm">
              <span
                className={theme === 'dark' ? 'text-slate-300' : 'text-slate-600'}
                style={{ fontFamily: "'JetBrains Mono', 'Courier New', monospace" }}
              >
                Loading
              </span>
              <span
                className={`inline-flex w-6 justify-start ${
                  theme === 'dark' ? 'text-slate-300' : 'text-slate-600'
                }`}
                style={{ fontFamily: "'JetBrains Mono', 'Courier New', monospace" }}
              >
                <span className="loader-dot">.</span>
                <span className="loader-dot loader-dot-delay">.</span>
                <span className="loader-dot loader-dot-delay-2">.</span>
              </span>
              <span className="loader-caret" aria-hidden="true">
                |
              </span>
            </div>

            <div
              className={`mt-6 h-2 w-full overflow-hidden rounded-full ${
                theme === 'dark' ? 'bg-slate-800/80' : 'bg-slate-200/80'
              }`}
            >
              <div
                className="h-full rounded-full bg-gradient-to-r from-cyan-400 via-indigo-500 to-purple-500"
                style={{
                  animation: `loader-progress ${duration / 1000}s ease-in-out forwards`,
                }}
              />
            </div>
          </div>
        </div>
      </div>

      <style>{`
        .loader-key {
          position: relative;
          display: flex;
          align-items: center;
          justify-content: center;
          font-family: 'JetBrains Mono', 'Courier New', monospace;
          font-size: 0.85rem;
          font-weight: 600;
          letter-spacing: 0.04em;
          border-radius: 0.75rem;
          border-width: 1px;
          background: linear-gradient(160deg, rgba(248,250,252,0.9), rgba(226,232,240,0.7));
          box-shadow: inset 0 1px 0 rgba(255,255,255,0.6), 0 12px 30px rgba(15,23,42,0.18);
          animation: key-wave 1.8s ease-in-out infinite;
        }

        .dark .loader-key {
          background: linear-gradient(160deg, rgba(30,41,59,0.95), rgba(15,23,42,0.7));
          box-shadow: inset 0 1px 0 rgba(148,163,184,0.25), 0 14px 32px rgba(15,23,42,0.6);
        }

        .loader-key::after {
          content: '';
          position: absolute;
          inset: 2px;
          border-radius: 0.6rem;
          background: linear-gradient(180deg, rgba(255,255,255,0.6), rgba(255,255,255,0.08));
          opacity: 0.55;
          z-index: 0;
        }

        .loader-key span {
          position: relative;
          z-index: 1;
          text-shadow: 0 1px 2px rgba(15, 23, 42, 0.25);
        }

        .dark .loader-key::after {
          background: linear-gradient(180deg, rgba(226,232,240,0.18), rgba(148,163,184,0.05));
          opacity: 0.6;
        }

        .loader-dot {
          animation: loader-dot 1.3s infinite;
        }

        .loader-dot-delay {
          animation-delay: 0.2s;
        }

        .loader-dot-delay-2 {
          animation-delay: 0.4s;
        }

        .loader-caret {
          color: ${theme === 'dark' ? '#38bdf8' : '#4f46e5'};
          animation: loader-caret 1.1s steps(2) infinite;
        }

        @keyframes loader-progress {
          0% { width: 0%; }
          100% { width: 100%; }
        }

        @keyframes loader-dot {
          0%, 40%, 100% { opacity: 0.2; }
          50%, 90% { opacity: 1; }
        }

        @keyframes loader-caret {
          0%, 49% { opacity: 0; }
          50%, 100% { opacity: 1; }
        }

        @keyframes key-wave {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-6px); }
        }
      `}</style>
    </div>
  );
}
