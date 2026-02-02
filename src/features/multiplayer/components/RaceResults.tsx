import React from 'react';
import { useTheme } from '../../../providers/ThemeProvider';
import type { PlayerState } from '../roomSlice';

interface RaceResultsProps {
  players: PlayerState[];
  finishedPlayerIds: string[];
  onPlayAgain: () => void;
  onLeave: () => void;
}

export default function RaceResults({ players, finishedPlayerIds, onPlayAgain, onLeave }: RaceResultsProps) {
  const { theme } = useTheme();

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
    <div className={`min-h-[81vh] p-4 ${
      theme === 'dark' ? 'bg-gray-900' : 'bg-gray-50'
    }`}>
      <div className={`container mx-auto rounded-lg shadow-lg p-6 ${
        theme === 'dark'
          ? 'bg-gradient-to-b from-gray-800 to-gray-700'
          : 'bg-gradient-to-b from-white to-gray-50 border border-gray-300'
      }`}>
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className={`text-4xl font-bold mb-2 ${
            theme === 'dark' ? 'text-white' : 'text-gray-900'
          }`}>
            🏁 Race Complete!
          </h1>
          <p className={`${
            theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
          }`}>
            Final Standings
          </p>
        </div>

        {/* Results */}
        <div className="space-y-3 mb-8">
          {results.map((player, index) => (
            <div
              key={player.id}
              className={`p-4 rounded-lg border-2 transition-all ${
                index === 0
                  ? theme === 'dark'
                    ? 'bg-yellow-900/30 border-yellow-600'
                    : 'bg-yellow-50 border-yellow-300'
                  : index === 1
                  ? theme === 'dark'
                    ? 'bg-gray-700/50 border-gray-600'
                    : 'bg-gray-100 border-gray-300'
                  : index === 2
                  ? theme === 'dark'
                    ? 'bg-orange-900/30 border-orange-600'
                    : 'bg-orange-50 border-orange-300'
                  : theme === 'dark'
                  ? 'bg-gray-700 border-gray-600'
                  : 'bg-gray-100 border-gray-300'
              }`}
            >
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-4">
                  <span className="text-3xl font-bold">{getMedalEmoji(index + 1)}</span>
                  <div>
                    <p className={`text-lg font-bold ${
                      theme === 'dark' ? 'text-white' : 'text-gray-900'
                    }`}>
                      {player.name}
                    </p>
                    <p className={`text-sm ${
                      theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
                    }`}>
                      {index === 0 ? '1st Place' : index === 1 ? '2nd Place' : index === 2 ? '3rd Place' : `${index + 1}th Place`}
                    </p>
                  </div>
                </div>
              </div>

              {/* Stats Grid */}
              <div className="grid grid-cols-3 gap-2">
                <div className={`p-2 rounded text-center ${
                  theme === 'dark' ? 'bg-gray-800' : 'bg-gray-50'
                }`}>
                  <p className={`text-xs ${
                    theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
                  }`}>
                    Speed
                  </p>
                  <p className={`text-lg font-bold ${
                    theme === 'dark' ? 'text-blue-400' : 'text-blue-600'
                  }`}>
                    {Math.round(player.wpm || 0)}
                  </p>
                  <p className={`text-xs ${
                    theme === 'dark' ? 'text-gray-500' : 'text-gray-500'
                  }`}>
                    WPM
                  </p>
                </div>

                <div className={`p-2 rounded text-center ${
                  theme === 'dark' ? 'bg-gray-800' : 'bg-gray-50'
                }`}>
                  <p className={`text-xs ${
                    theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
                  }`}>
                    Accuracy
                  </p>
                  <p className={`text-lg font-bold ${
                    theme === 'dark' ? 'text-green-400' : 'text-green-600'
                  }`}>
                    {Math.round((player.accuracy || 0) * 100)}%
                  </p>
                </div>

                <div className={`p-2 rounded text-center ${
                  theme === 'dark' ? 'bg-gray-800' : 'bg-gray-50'
                }`}>
                  <p className={`text-xs ${
                    theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
                  }`}>
                    Progress
                  </p>
                  <p className={`text-lg font-bold ${
                    theme === 'dark' ? 'text-purple-400' : 'text-purple-600'
                  }`}>
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
            className={`w-full py-3 rounded-lg font-semibold transition-all duration-200 text-lg ${
              theme === 'dark'
                ? 'bg-green-600 hover:bg-green-700 text-white'
                : 'bg-green-600 hover:bg-green-700 text-white'
            }`}
          >
            🔄 Play Again
          </button>

          <button
            onClick={onLeave}
            className={`w-full py-3 rounded-lg font-semibold transition-all duration-200 ${
              theme === 'dark'
                ? 'bg-gray-700 hover:bg-gray-600 text-gray-300'
                : 'bg-gray-200 hover:bg-gray-300 text-gray-700'
            }`}
          >
            Leave Battleground
          </button>
        </div>
      </div>
    </div>
  );
}
