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

  // Sort players: finished first, then by progress
  const sortedPlayers = [...players].sort((a, b) => {
    const aFinished = finishedPlayerIds.includes(a.id);
    const bFinished = finishedPlayerIds.includes(b.id);
    if (aFinished && !bFinished) return -1;
    if (!aFinished && bFinished) return 1;
    return (b.progress || 0) - (a.progress || 0);
  });

  return (
    <div className={`p-6 rounded-lg shadow-lg ${
      theme === 'dark'
        ? 'bg-gradient-to-b from-gray-800 to-gray-700'
        : 'bg-gradient-to-b from-white to-gray-50 border border-gray-300'
    }`}>
      <h3 className={`text-lg font-semibold mb-4 ${
        theme === 'dark' ? 'text-white' : 'text-gray-900'
      }`}>
        Race Progress
      </h3>

      <div className="space-y-3">
        {sortedPlayers.map((player, index) => {
          const isFinished = finishedPlayerIds.includes(player.id);
          const position = isFinished ? finishedPlayerIds.indexOf(player.id) + 1 : null;

          return (
            <div
              key={player.id}
              className={`p-3 rounded-lg transition-all duration-300 ${
                isFinished
                  ? theme === 'dark'
                    ? 'bg-green-900/30 border border-green-700'
                    : 'bg-green-50 border border-green-300'
                  : theme === 'dark'
                  ? 'bg-gray-700 border border-gray-600'
                  : 'bg-gray-100 border border-gray-300'
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-3">
                  {position && (
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm ${
                      position === 1
                        ? 'bg-yellow-500 text-white'
                        : position === 2
                        ? 'bg-gray-400 text-white'
                        : position === 3
                        ? 'bg-orange-600 text-white'
                        : theme === 'dark'
                        ? 'bg-gray-600 text-gray-300'
                        : 'bg-gray-300 text-gray-700'
                    }`}>
                      {position}
                    </div>
                  )}
                  {!position && (
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm ${
                      theme === 'dark'
                        ? 'bg-indigo-600 text-white'
                        : 'bg-indigo-500 text-white'
                    }`}>
                      {(player.name || 'P')[0].toUpperCase()}
                    </div>
                  )}
                  <div>
                    <div className={`font-medium ${
                      theme === 'dark' ? 'text-white' : 'text-gray-900'
                    }`}>
                      {player.name}
                    </div>
                    <div className={`text-xs ${
                      theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
                    }`}>
                      {player.wpm ? `${Math.round(player.wpm)} WPM` : 'Racing...'}
                    </div>
                  </div>
                </div>

                {isFinished && (
                  <div className={`text-sm font-bold px-3 py-1 rounded ${
                    theme === 'dark'
                      ? 'bg-green-600/50 text-green-300'
                      : 'bg-green-200 text-green-900'
                  }`}>
                    ✓ Finished
                  </div>
                )}
              </div>

              {/* Progress Bar */}
              <div className={`h-2 rounded-full overflow-hidden ${
                theme === 'dark' ? 'bg-gray-600' : 'bg-gray-300'
              }`}>
                <div
                  style={{ width: `${(player.progress || 0) * 100}%` }}
                  className={`h-full transition-all duration-300 ${
                    isFinished
                      ? 'bg-green-500'
                      : 'bg-blue-500'
                  }`}
                />
              </div>

              {/* Stats */}
              <div className="mt-2 flex justify-between">
                <span className={`text-xs ${
                  theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
                }`}>
                  {Math.round((player.progress || 0) * 100)}%
                </span>
                {player.accuracy !== undefined && (
                  <span className={`text-xs ${
                    theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
                  }`}>
                    Accuracy: {Math.round(player.accuracy * 100)}%
                  </span>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {finishedPlayerIds.length > 0 && finishedPlayerIds.length < players.length && (
        <div className={`mt-4 p-3 rounded-lg text-center ${
          theme === 'dark'
            ? 'bg-blue-900/30 border border-blue-700'
            : 'bg-blue-50 border border-blue-300'
        }`}>
          <p className={`text-sm font-medium ${
            theme === 'dark' ? 'text-blue-300' : 'text-blue-700'
          }`}>
            ⏳ Waiting for {players.length - finishedPlayerIds.length} more player(s) to finish...
          </p>
        </div>
      )}
    </div>
  );
}
