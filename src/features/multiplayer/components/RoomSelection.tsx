import React from 'react';
import { useTheme } from '../../../providers/ThemeProvider';

interface RoomSelectionProps {
  playerName: string;
  onCreateRoom: () => void;
  onJoinRoom: () => void;
  onBack: () => void;
}

export default function RoomSelection({ playerName, onCreateRoom, onJoinRoom, onBack }: RoomSelectionProps) {
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  const surface = isDark
    ? 'bg-slate-900/70 border-slate-700/60 text-slate-100 backdrop-blur-xl'
    : 'bg-white/80 border-slate-200 text-slate-900 backdrop-blur-xl';
  const mutedText = isDark ? 'text-slate-300' : 'text-slate-600';
  const primaryButton = isDark
    ? 'bg-gradient-to-r from-cyan-400 via-sky-400 to-emerald-400 text-slate-900'
    : 'bg-gradient-to-r from-sky-500 via-cyan-500 to-emerald-500 text-white';
  const secondaryButton = isDark
    ? 'border-slate-700 bg-slate-900/60 text-slate-200 hover:border-cyan-400/60 hover:text-cyan-200'
    : 'border-slate-200 bg-white text-slate-700 hover:border-sky-300 hover:text-sky-700';
  const ghostButton = isDark
    ? 'bg-slate-800 hover:bg-slate-700 text-slate-200'
    : 'bg-slate-200 hover:bg-slate-300 text-slate-700';

  return (
    <div className="min-h-[75vh] flex items-center justify-center p-4">
      <div className={`w-full max-w-md rounded-[28px] border shadow-lg p-8 ${surface}`}>
        <div className="text-center space-y-2">
          <div
            className={`text-[11px] uppercase tracking-[0.35em] ${mutedText}`}
            style={{ fontFamily: "'JetBrains Mono', monospace" }}
          >
            Battleground
          </div>
          <h1 className="text-3xl font-bold" style={{ fontFamily: "'Space Grotesk', 'Segoe UI', sans-serif" }}>
            Choose a lobby
          </h1>
          <p className={mutedText}>Playing as</p>
          <p className={`text-lg font-semibold ${isDark ? 'text-cyan-300' : 'text-sky-600'}`}>{playerName}</p>
        </div>

        <div className="space-y-4 mt-6">
          <button
            onClick={onCreateRoom}
            className={`w-full py-4 rounded-xl font-semibold text-lg transition-all duration-200 ${primaryButton}`}
          >
            + Create Room
          </button>

          <button
            onClick={onJoinRoom}
            className={`w-full py-4 rounded-xl font-semibold text-lg transition-all duration-200 border ${secondaryButton}`}
          >
            Join Room
          </button>
        </div>

        <button
          onClick={onBack}
          className={`w-full mt-6 py-2 rounded-xl font-medium transition-colors duration-200 ${ghostButton}`}
        >
          Back
        </button>
      </div>
    </div>
  );
}
