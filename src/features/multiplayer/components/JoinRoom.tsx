import React, { useState } from 'react';
import { useTheme } from '../../../providers/ThemeProvider';

interface JoinRoomProps {
  playerName: string;
  isLoading: boolean;
  error?: string | null;
  onJoin: (roomCode: string) => void;
  onBack: () => void;
}

export default function JoinRoom({ playerName, isLoading, error, onJoin, onBack }: JoinRoomProps) {
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  const [roomCode, setRoomCode] = useState('');
  const surface = isDark
    ? 'bg-slate-900/70 border-slate-700/60 text-slate-100 backdrop-blur-xl'
    : 'bg-white/80 border-slate-200 text-slate-900 backdrop-blur-xl';
  const mutedText = isDark ? 'text-slate-300' : 'text-slate-600';
  const inputBase = isDark
    ? 'bg-slate-900/60 border-slate-700 text-slate-100 placeholder-slate-500'
    : 'bg-white border-slate-200 text-slate-900 placeholder-slate-500';
  const primaryButton = isDark
    ? 'bg-gradient-to-r from-cyan-400 via-sky-400 to-emerald-400 text-slate-900'
    : 'bg-gradient-to-r from-sky-500 via-cyan-500 to-emerald-500 text-white';
  const ghostButton = isDark
    ? 'bg-slate-800 hover:bg-slate-700 text-slate-200'
    : 'bg-slate-200 hover:bg-slate-300 text-slate-700';

  const handleSubmit = () => {
    if (roomCode.trim()) {
      onJoin(roomCode.trim().toUpperCase());
    }
  };

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
            Join a room
          </h1>
          <p className={mutedText}>
            Playing as <span className="font-semibold">{playerName}</span>
          </p>
        </div>

        <div className="space-y-4 mt-6">
          {error && (
            <div className="p-3 rounded-xl text-sm font-medium text-center border border-rose-500/30 bg-rose-500/10 text-rose-300">
              {error}
            </div>
          )}
          <input
            type="text"
            value={roomCode}
            onChange={(e) => setRoomCode(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSubmit()}
            placeholder="Enter room code"
            disabled={isLoading}
            maxLength={6}
            className={`w-full p-3 rounded-xl border text-center text-lg font-semibold tracking-widest transition-colors duration-200 uppercase ${inputBase} focus:outline-none focus:ring-2 focus:ring-cyan-400/50 disabled:opacity-60`}
          />
          
          <button
            onClick={handleSubmit}
            disabled={!roomCode.trim() || isLoading}
            className={`w-full py-3 rounded-xl font-semibold transition-colors duration-200 ${
              !roomCode.trim() || isLoading
                ? isDark
                  ? 'bg-slate-800 text-slate-500 cursor-not-allowed'
                  : 'bg-slate-200 text-slate-500 cursor-not-allowed'
                : primaryButton
            }`}
          >
            {isLoading ? 'Joining...' : 'Join'}
          </button>
        </div>

        <button
          onClick={onBack}
          disabled={isLoading}
          className={`w-full mt-6 py-2 rounded-xl font-medium transition-colors duration-200 disabled:opacity-50 ${ghostButton}`}
        >
          Back
        </button>
      </div>
    </div>
  );
}
