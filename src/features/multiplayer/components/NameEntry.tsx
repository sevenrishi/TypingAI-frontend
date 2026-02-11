import React, { useState } from 'react';
import { useTheme } from '../../../providers/ThemeProvider';

interface NameEntryProps {
  onNext: (name: string) => void;
}

export default function NameEntry({ onNext }: NameEntryProps) {
  const { theme } = useTheme();
  const [name, setName] = useState('');
  const isDark = theme === 'dark';
  const surface = isDark
    ? 'bg-slate-900/70 border-slate-700/60 text-slate-100 backdrop-blur-xl'
    : 'bg-white/80 border-slate-200 text-slate-900 backdrop-blur-xl';
  const inputBase = isDark
    ? 'bg-slate-900/60 border-slate-700 text-slate-100 placeholder-slate-500'
    : 'bg-white border-slate-200 text-slate-900 placeholder-slate-500';
  const primaryButton = isDark
    ? 'bg-gradient-to-r from-cyan-400 via-sky-400 to-emerald-400 text-slate-900'
    : 'bg-gradient-to-r from-sky-500 via-cyan-500 to-emerald-500 text-white';

  const handleSubmit = () => {
    if (name.trim()) {
      onNext(name.trim());
    }
  };

  return (
    <div className={`min-h-[81vh] flex items-center justify-center p-4 ${
      theme === 'dark' ? 'bg-gray-900' : 'bg-gray-50'
    }`}>
      <div className={`w-full max-w-md rounded-lg shadow-lg p-6 ${
        theme === 'dark'
          ? 'bg-gradient-to-b from-gray-800 to-gray-700'
          : 'bg-gradient-to-b from-white to-gray-50 border border-gray-300'
      }`}>
        <h1 className={`text-3xl font-bold mb-2 text-center ${
          theme === 'dark' ? 'text-white' : 'text-gray-900'
        }`}>
          Typing Battleground
        </h1>
        <p className={`text-center mb-6 ${
          theme === 'dark' ? 'text-gray-300' : 'text-gray-600'
        }`}>
          Enter your name to get started
        </p>
    <div className="min-h-[75vh] flex items-center justify-center p-4">
      <div className={`w-full max-w-md rounded-[28px] border shadow-lg p-6 ${surface}`}>
        <div className="text-center space-y-2">
          <div
            className={`text-[11px] uppercase tracking-[0.35em] ${isDark ? 'text-slate-400' : 'text-slate-500'}`}
            style={{ fontFamily: "'JetBrains Mono', monospace" }}
          >
            Battleground
          </div>
          <h1 className="text-3xl font-bold" style={{ fontFamily: "'Space Grotesk', 'Segoe UI', sans-serif" }}>
            Enter your call sign
          </h1>
          <p className={isDark ? 'text-slate-300' : 'text-slate-600'}>
            Choose a name that will appear on the live leaderboard.
          </p>
        </div>

        <div className="space-y-4 mt-6">
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSubmit()}
            placeholder="Your display name"
            autoFocus
            maxLength={20}
            className={`w-full p-3 rounded-xl border text-center text-lg transition-colors duration-200 ${inputBase} focus:outline-none focus:ring-2 focus:ring-cyan-400/50`}
          />
          
          <button
            onClick={handleSubmit}
            disabled={!name.trim()}
            className={`w-full py-3 rounded-xl font-semibold transition-colors duration-200 ${
              !name.trim()
                ? isDark
                  ? 'bg-slate-800 text-slate-500 cursor-not-allowed'
                  : 'bg-slate-200 text-slate-500 cursor-not-allowed'
                : primaryButton
            }`}
          >
            Continue
          </button>
        </div>
      </div>
    </div>
  );
}
