import React from 'react';
import { useTheme } from '../../../providers/ThemeProvider';
import type { PlayerState } from '../roomSlice';

interface RaceProgressProps {
  players: PlayerState[];
  finishedPlayerIds: string[];
  raceActive: boolean;
}

export default function RaceProgress({ players, finishedPlayerIds, raceActive }: RaceProgressProps) {
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  const surface = isDark
    ? 'bg-slate-900/70 border-slate-700/60 text-slate-100 backdrop-blur-xl'
    : 'bg-white/80 border-slate-200 text-slate-900 backdrop-blur-xl';
  const surfaceSoft = isDark
    ? 'bg-slate-900/45 border-slate-700/50 text-slate-100'
    : 'bg-white/60 border-slate-200/80 text-slate-900';
  const mutedText = isDark ? 'text-slate-300' : 'text-slate-600';

  // Sort players: finished first, then by progress
  const sortedPlayers = [...players].sort((a, b) => {
    const aFinished = finishedPlayerIds.includes(a.id);
    const bFinished = finishedPlayerIds.includes(b.id);
    if (aFinished && !bFinished) return -1;
    if (!aFinished && bFinished) return 1;
    return (b.progress || 0) - (a.progress || 0);
  });

  return (
    <div className={`p-6 rounded-2xl border shadow-lg ${surface}`}>
      <h3 className="text-lg font-semibold mb-4">Race Progress</h3>

      <div className="space-y-3">
        {sortedPlayers.map((player, index) => {
          const isFinished = finishedPlayerIds.includes(player.id);
          const position = isFinished ? finishedPlayerIds.indexOf(player.id) + 1 : null;

          return (
            <div
              key={player.id}
              className={`p-3 rounded-xl transition-all duration-300 border ${
                isFinished
                  ? isDark
                    ? 'bg-emerald-500/10 border-emerald-400/40'
                    : 'bg-emerald-50 border-emerald-200'
                  : surfaceSoft
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-3">
                  {position && (
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm ${
                      position === 1
                        ? 'bg-amber-400 text-slate-900'
                        : position === 2
                        ? 'bg-slate-300 text-slate-900'
                        : position === 3
                        ? 'bg-orange-400 text-slate-900'
                        : isDark
                        ? 'bg-slate-700 text-slate-200'
                        : 'bg-slate-200 text-slate-700'
                    }`}>
                      {position}
                    </div>
                  )}
                  {!position && (
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm ${
                      isDark
                        ? 'bg-cyan-500 text-slate-900'
                        : 'bg-sky-500 text-white'
                    }`}>
                      {(player.name || 'P')[0].toUpperCase()}
                    </div>
                  )}
                  <div>
                    <div className="font-medium">
                      {player.name}
                    </div>
                    <div className={`text-xs ${mutedText}`}>
                      {player.wpm ? `${Math.round(player.wpm)} WPM` : 'Racing...'}
                    </div>
                  </div>
                </div>

                {isFinished && (
                  <div className={`text-sm font-bold px-3 py-1 rounded ${
                    isDark
                      ? 'bg-emerald-500/30 text-emerald-200'
                      : 'bg-emerald-100 text-emerald-700'
                  }`}>
                    ✓ Finished
                  </div>
                )}
              </div>

              {/* Progress Bar */}
              <div className={`h-2 rounded-full overflow-hidden ${isDark ? 'bg-slate-800' : 'bg-slate-200'}`}>
                <div
                  style={{ width: `${(player.progress || 0) * 100}%` }}
                  className={`h-full transition-all duration-300 ${
                    isFinished
                      ? 'bg-emerald-400'
                      : 'bg-gradient-to-r from-cyan-400 via-sky-400 to-emerald-400'
                  }`}
                />
              </div>

              {/* Stats */}
              <div className="mt-2 flex justify-between">
                <span className={`text-xs ${mutedText}`}>
                  {Math.round((player.progress || 0) * 100)}%
                </span>
                {player.accuracy !== undefined && (
                  <span className={`text-xs ${mutedText}`}>
                    Accuracy: {Math.round(player.accuracy * 100)}%
                  </span>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {finishedPlayerIds.length > 0 && finishedPlayerIds.length < players.length && (
        <div className={`mt-4 p-3 rounded-xl text-center border ${surfaceSoft}`}>
          <p className={`text-sm font-medium ${mutedText}`}>
            Waiting for {players.length - finishedPlayerIds.length} more player(s) to finish...
          </p>
        </div>
      )}
    </div>
  );
}
