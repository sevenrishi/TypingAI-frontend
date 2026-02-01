import React, { useState, useEffect } from 'react';
import { useTheme } from '../../../providers/ThemeProvider';
import type { PlayerState } from '../roomSlice';

interface RoomWaitingProps {
  roomCode: string;
  playerName: string;
  isHost: boolean;
  hostId: string;                 // ID of the actual host (new)
  currentPlayerId: string;        // current client's player id (new)
  players: PlayerState[];
  textGenerated: boolean;
  isGenerating: boolean;
  raceStart?: number | null;      // server-provided start timestamp (ms) (new, optional)
  onGenerateScript: () => void;
  onStartRace: () => void;
  onReady: (ready: boolean) => void;
  onLeave: () => void;
}

export default function RoomWaiting({
  roomCode,
  playerName,
  isHost,
  hostId,
  currentPlayerId,
  players,
  textGenerated,
  isGenerating,
  raceStart,
  onGenerateScript,
  onStartRace,
  onReady,
  onLeave,
}: RoomWaitingProps) {
  const { theme } = useTheme();
  const [copied, setCopied] = useState(false);

  // derive current player's ready flag from players prop (keep single source of truth)
  const currentPlayer = players.find(p => p.id === currentPlayerId);
  const currentPlayerReady = !!(currentPlayer && currentPlayer.ready);

  const handleCopyCode = () => {
    navigator.clipboard.writeText(roomCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleToggleReady = () => {
    onReady(!currentPlayerReady);
  };

  // Check if all players are ready (including host)
  const allPlayersReady = players.length > 0 && players.every(p => p.ready);
  const canStartRace = isHost && textGenerated && allPlayersReady;

  // Countdown overlay state (shows when raceStart provided)
  const [countdown, setCountdown] = useState<number | null>(null);
  useEffect(() => {
    if (!raceStart) {
      setCountdown(null);
      return;
    }
    const update = () => {
      const msLeft = raceStart - Date.now();
      const secs = Math.ceil(msLeft / 1000);
      setCountdown(secs > 0 ? secs : 0);
    };
    update();
    const t = setInterval(update, 250);
    const clearIfZero = () => {
      if ((raceStart - Date.now()) <= 0) {
        setTimeout(() => setCountdown(null), 500); // hide shortly after 0
      }
    };
    const ck = setInterval(clearIfZero, 500);
    return () => {
      clearInterval(t);
      clearInterval(ck);
    };
  }, [raceStart]);

  return (
    <div className={`min-h-screen p-4 ${
      theme === 'dark' ? 'bg-gray-900' : 'bg-gray-50'
    }`}>
      <div className="container mx-auto">
        {/* Header */}
        <div className="mb-6">
          <h1 className={`text-3xl font-bold mb-2 ${
            theme === 'dark' ? 'text-white' : 'text-gray-900'
          }`}>
            {isHost ? 'Room Created' : 'Joined Room'}
          </h1>
          <p className={`${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
            Waiting for players...
          </p>
        </div>

        {/* Two Column Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Left Column: Room Code and Script */}
          <div className="lg:col-span-1 space-y-4">
            
            {/* Room Code Section - Always visible */}
            <div className={`p-4 rounded-lg ${
              theme === 'dark' ? 'bg-gray-700' : 'bg-gray-100'
            }`}>
              <p className={`text-sm font-semibold mb-3 ${
                theme === 'dark' ? 'text-gray-300' : 'text-gray-600'
              }`}>
                Room Code
              </p>
              <div className="flex flex-col gap-2">
                <div className={`p-3 rounded-md text-center text-2xl font-bold tracking-widest ${
                  theme === 'dark'
                    ? 'bg-gray-800 text-blue-400'
                    : 'bg-gray-50 text-blue-600 border border-gray-300'
                }`}>
                  {roomCode}
                </div>
                <button
                  onClick={handleCopyCode}
                  className={`px-4 py-2 rounded-md font-semibold transition-all duration-200 text-sm ${
                    copied
                      ? 'bg-green-600 text-white'
                      : 'bg-blue-600 hover:bg-blue-700 text-white'
                  }`}
                >
                  {copied ? '✓ Copied' : '📋 Copy'}
                </button>
              </div>
            </div>

            {/* Script Generation Section */}
            {isHost ? (
              <div className={`p-4 rounded-lg border-2 ${
                theme === 'dark'
                  ? 'bg-gray-800 border-indigo-600'
                  : 'bg-indigo-50 border-indigo-200'
              }`}>
                <div className="flex items-center justify-between mb-3">
                  <p className={`text-sm font-semibold ${
                    theme === 'dark' ? 'text-indigo-300' : 'text-indigo-700'
                  }`}>
                    Typing Script
                  </p>
                  <span className={`text-xs px-2 py-1 rounded-full ${
                    textGenerated
                      ? theme === 'dark'
                        ? 'bg-green-600/30 text-green-300'
                        : 'bg-green-200 text-green-800'
                      : theme === 'dark'
                      ? 'bg-yellow-600/30 text-yellow-300'
                      : 'bg-yellow-200 text-yellow-800'
                  }`}>
                    {textGenerated ? 'Ready' : 'Not Ready'}
                  </span>
                </div>
                <p className={`text-xs mb-4 ${
                  theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
                }`}>
                  Generated the script for this room. All players will receive the same text.
                </p>
                <button
                  onClick={onGenerateScript}
                  disabled={isGenerating || textGenerated}
                  className={`w-full py-2.5 rounded-md font-semibold text-sm transition-all duration-200 ${
                    isGenerating || textGenerated
                      ? theme === 'dark'
                        ? 'bg-gray-700 text-gray-500 cursor-not-allowed'
                        : 'bg-gray-300 text-gray-600 cursor-not-allowed'
                      : 'bg-indigo-600 hover:bg-indigo-700 text-white'
                  }`}
                >
                  {isGenerating ? '⏳ Generating...' : textGenerated ? '✓ Script Ready' : 'Generate Script'}
                </button>
              </div>
            ) : (
              <div className={`p-4 rounded-lg border-2 ${
                theme === 'dark'
                  ? 'bg-gray-800 border-gray-600'
                  : 'bg-white border border-gray-200'
              }`}>
                <div className="flex items-center justify-between mb-3">
                  <p className={`text-sm font-semibold ${
                    theme === 'dark' ? 'text-indigo-300' : 'text-indigo-700'
                  }`}>
                    Typing Script
                  </p>
                  <span className={`text-xs px-2 py-1 rounded-full ${
                    textGenerated
                      ? theme === 'dark'
                        ? 'bg-green-600/30 text-green-300'
                        : 'bg-green-200 text-green-800'
                      : theme === 'dark'
                      ? 'bg-gray-700 text-gray-300'
                      : 'bg-gray-200 text-gray-700'
                  }`}>
                    {textGenerated ? 'Ready' : 'Pending'}
                  </span>
                </div>
                <div className={`w-full py-2.5 rounded-md font-semibold text-sm text-center ${
                  theme === 'dark' ? 'bg-gray-700 text-gray-300' : 'bg-gray-50 text-gray-600'
                }`}>
                  {isGenerating ? 'Host is generating the script...' : textGenerated ? '✓ Script Ready' : 'Waiting for host to generate script'}
                </div>
                <p className={`text-xs mt-3 ${
                  theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
                }`}>
                  You’ll start typing as soon as the host starts the race.
                </p>
              </div>
            )}

            {/* Ready Button - All Players */}
            <div className={`p-4 rounded-lg ${
              theme === 'dark' ? 'bg-gray-800' : 'bg-blue-50 border border-blue-200'
            }`}>
              <button
                onClick={handleToggleReady}
                className={`w-full py-3 rounded-lg font-semibold transition-all duration-200 ${
                  currentPlayerReady
                    ? 'bg-green-600 hover:bg-green-700 text-white'
                    : theme === 'dark'
                    ? 'bg-gray-700 hover:bg-gray-600 text-gray-300'
                    : 'bg-gray-300 hover:bg-gray-400 text-gray-700'
                }`}
              >
                {currentPlayerReady ? '✓ Ready to Race' : '❓ Ready?'}
              </button>
            </div>
          </div>

          {/* Right Column: Players List and Actions */}
          <div className="lg:col-span-2 space-y-4">
            
            {/* Players Section */}
            <div className={`p-4 rounded-lg ${
              theme === 'dark'
                ? 'bg-gradient-to-b from-gray-800 to-gray-700'
                : 'bg-gradient-to-b from-white to-gray-50 border border-gray-300'
            }`}>
              <h3 className={`text-lg font-semibold mb-4 ${
                theme === 'dark' ? 'text-white' : 'text-gray-900'
              }`}>
                Players ({players.length})
              </h3>
              <div className="space-y-2 max-h-64 overflow-y-auto">
                {players.map((player) => (
                  <div
                    key={player.id}
                    className={`p-3 rounded-lg flex items-center justify-between ${
                      theme === 'dark'
                        ? 'bg-gray-700 border border-gray-600'
                        : 'bg-gray-100 border border-gray-300'
                    }`}
                  >
                    <div className="flex items-center gap-3 flex-1">
                      <div className="w-10 h-10 rounded-full bg-indigo-600 flex items-center justify-center text-sm font-bold text-white">
                        {(player.name || 'P')[0].toUpperCase()}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className={`font-medium truncate ${
                          theme === 'dark' ? 'text-white' : 'text-gray-900'
                        }`}>
                          {player.name}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 ml-2 flex-shrink-0">
                      {/* Show Host badge only for the actual host player */}
                      {player.id === hostId && (
                        <span className={`text-xs px-2 py-1 rounded whitespace-nowrap ${
                          theme === 'dark'
                            ? 'bg-yellow-600/50 text-yellow-300'
                            : 'bg-yellow-200 text-yellow-900'
                        }`}>
                          Host
                        </span>
                      )}
                      {player.ready ? (
                        <span className={`text-xs px-2 py-1 rounded whitespace-nowrap ${
                          theme === 'dark'
                            ? 'bg-green-600/50 text-green-300'
                            : 'bg-green-200 text-green-900'
                        }`}>
                          ✓ Ready
                        </span>
                      ) : (
                        <span className={`text-xs px-2 py-1 rounded whitespace-nowrap ${
                          theme === 'dark'
                            ? 'bg-gray-600 text-gray-300'
                            : 'bg-gray-300 text-gray-700'
                        }`}>
                          Waiting
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="space-y-3">
              {/* Start Race Button - show for host; show disabled placeholder for non-hosts so layout matches */}
              <button
                onClick={isHost ? onStartRace : undefined}
                disabled={!isHost || !canStartRace}
                className={`w-full py-3 rounded-lg font-semibold transition-all duration-200 text-lg ${
                  (!isHost || !canStartRace)
                    ? theme === 'dark'
                      ? 'bg-gray-700 text-gray-500 cursor-not-allowed'
                      : 'bg-gray-300 text-gray-600 cursor-not-allowed'
                    : 'bg-red-600 hover:bg-red-700 text-white'
                }`}
              >
                {isHost ? '🚀 Start Race' : '🚀 Start Race'}
              </button>

              {/* Status Messages */}
              {!isHost && (
                <p className={`text-sm text-center ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                  Waiting for the host to start the race
                </p>
              )}
              {isHost && !textGenerated && (
                <p className={`text-sm text-center ${theme === 'dark' ? 'text-yellow-400' : 'text-yellow-700'}`}>
                  Generate script first
                </p>
              )}
              {isHost && textGenerated && !allPlayersReady && (
                <p className={`text-sm text-center ${theme === 'dark' ? 'text-blue-400' : 'text-blue-700'}`}>
                  Waiting for all players to be ready
                </p>
              )}

              {/* Leave Button */}
              <button
                onClick={onLeave}
                className={`w-full py-2 rounded-lg font-medium transition-colors duration-200 ${
                  theme === 'dark'
                    ? 'bg-gray-700 hover:bg-gray-600 text-gray-300'
                    : 'bg-gray-300 hover:bg-gray-400 text-gray-700'
                }`}
              >
                Leave Room
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Countdown overlay for race start (visible to all when raceStart is set) */}
      {countdown !== null && (
        <div className="fixed inset-0 z-50 flex items-center justify-center pointer-events-none">
          <div className="bg-black/60 w-full h-full absolute" />
          <div className="relative text-center pointer-events-auto">
            <div className="mx-auto p-8 rounded-lg bg-white/90 dark:bg-gray-900/90">
              <p className="text-6xl font-extrabold text-gray-900 dark:text-white">
                {countdown > 0 ? countdown : 'Go!'}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
