import React, { useEffect } from 'react';
import { RotateCcw } from 'lucide-react';
import { useTheme } from '../../../providers/ThemeProvider';
import type { PlayerState } from '../roomSlice';
import { recordStreakActivity } from '../../../utils/streaks';

interface BattleResultsProps {
  players: PlayerState[];
  finishedPlayerIds: string[];
  onPlayAgain: () => void;
  onLeave: () => void;
}

export default function BattleResults({ players, finishedPlayerIds, onPlayAgain, onLeave }: BattleResultsProps) {
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  const surface = isDark
    ? 'bg-slate-900/70 border-slate-700/60 text-slate-100 backdrop-blur-xl'
    : 'bg-white/80 border-slate-200 text-slate-900 backdrop-blur-xl';
  const surfaceSoft = isDark
    ? 'bg-slate-900/45 border-slate-700/50 text-slate-100'
    : 'bg-white/60 border-slate-200/80 text-slate-900';
  const mutedText = isDark ? 'text-slate-300' : 'text-slate-600';
  const primaryButton = isDark
    ? 'bg-gradient-to-r from-cyan-400 via-sky-400 to-emerald-400 text-slate-900'
    : 'bg-gradient-to-r from-sky-500 via-cyan-500 to-emerald-500 text-white';
  const ghostButton = isDark
    ? 'bg-slate-800 hover:bg-slate-700 text-slate-200'
    : 'bg-slate-200 hover:bg-slate-300 text-slate-700';

  useEffect(() => {
    void recordStreakActivity();
  }, []);

  // Sort players by finish order
  const results = finishedPlayerIds
    .map((id) => players.find((p) => p.id === id))
    .filter((p) => p !== undefined) as PlayerState[];

  const getMedalEmoji = (position: number) => {
    switch (position) {
      case 1:
        return '🥇';
      case 2:
        return '🥈';
      case 3:
        return '🥉';
      default:
        return `#${position}`;
    }
  };

  return (
    <div className="min-h-[75vh] p-4">
      <div className={`container mx-auto rounded-[28px] border shadow-lg p-6 ${surface}`}>
        {/* Header */}
        <div className="text-center mb-8 space-y-2">
          <div
            className={`text-[11px] uppercase tracking-[0.35em] ${mutedText}`}
            style={{ fontFamily: "'JetBrains Mono', monospace" }}
          >
            Battle Complete
          </div>
          <h1 className="text-4xl font-bold" style={{ fontFamily: "'Space Grotesk', 'Segoe UI', sans-serif" }}>
            Final standings
          </h1>
        </div>

        {/* Results */}
        <div className="space-y-3 mb-8">
          {results.map((player, index) => (
            <div
              key={player.id}
              className={`p-4 rounded-2xl border transition-all ${
                index === 0
                  ? isDark
                    ? 'bg-amber-500/10 border-amber-400/40'
                    : 'bg-amber-50 border-amber-200'
                  : index === 1
                  ? isDark
                    ? 'bg-slate-800/60 border-slate-700'
                    : 'bg-slate-100 border-slate-200'
                  : index === 2
                  ? isDark
                    ? 'bg-orange-500/10 border-orange-400/40'
                    : 'bg-orange-50 border-orange-200'
                  : surfaceSoft
              }`}
            >
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-4">
                  <span className="text-3xl font-bold">{getMedalEmoji(index + 1)}</span>
                  <div>
                    <p className="text-lg font-bold">
                      {player.name}
                    </p>
                    <p className={`text-sm ${mutedText}`}>
                      {index === 0 ? '1st Place' : index === 1 ? '2nd Place' : index === 2 ? '3rd Place' : `${index + 1}th Place`}
                    </p>
                  </div>
                </div>
              </div>

              {/* Stats Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                <div className={`p-2 rounded-xl text-center ${surfaceSoft}`}>
                  <p className={`text-xs ${mutedText}`}>
                    Speed
                  </p>
                  <p className={`text-lg font-bold ${isDark ? 'text-cyan-300' : 'text-sky-600'}`}>
                    {Math.round(player.wpm || 0)}
                  </p>
                  <p className={`text-xs ${mutedText}`}>
                    WPM
                  </p>
                </div>

                <div className={`p-2 rounded-xl text-center ${surfaceSoft}`}>
                  <p className={`text-xs ${mutedText}`}>
                    Accuracy
                  </p>
                  <p className={`text-lg font-bold ${isDark ? 'text-emerald-300' : 'text-emerald-600'}`}>
                    {Math.round((player.accuracy || 0) * 100)}%
                  </p>
                </div>

                <div className={`p-2 rounded-xl text-center ${surfaceSoft}`}>
                  <p className={`text-xs ${mutedText}`}>
                    Progress
                  </p>
                  <p className={`text-lg font-bold ${isDark ? 'text-cyan-300' : 'text-sky-600'}`}>
                    100%
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Actions */}
        <div className="space-y-3">
          <button
            onClick={onPlayAgain}
            className={`w-full py-3 rounded-xl font-semibold transition-all duration-200 text-lg ${primaryButton}`}
          >
            <span className="inline-flex items-center justify-center gap-2">
              <RotateCcw className="h-5 w-5" aria-hidden="true" />
              Play Again
            </span>
          </button>

          <button
            onClick={onLeave}
            className={`w-full py-3 rounded-xl font-semibold transition-all duration-200 ${ghostButton}`}
          >
            Leave Battleground
          </button>
        </div>
      </div>
    </div>
  );
}
