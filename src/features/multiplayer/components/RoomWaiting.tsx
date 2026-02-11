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
  const isDark = theme === 'dark';
  const [copied, setCopied] = useState(false);
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
  const disabledButton = isDark
    ? 'bg-slate-800 text-slate-500 cursor-not-allowed'
    : 'bg-slate-200 text-slate-500 cursor-not-allowed';

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
    <div className="min-h-[75vh] p-4">
      <div className="container mx-auto">
        {/* Header */}
        <div className="mb-6 space-y-2">
          <div
            className={`text-[11px] uppercase tracking-[0.35em] ${mutedText}`}
            style={{ fontFamily: "'JetBrains Mono', monospace" }}
          >
            Battleground Lobby
          </div>
          <h1 className="text-3xl font-bold" style={{ fontFamily: "'Space Grotesk', 'Segoe UI', sans-serif" }}>
            {isHost ? 'Room created' : 'Joined room'}
          </h1>
          <p className={mutedText}>Waiting for players to lock in.</p>
        </div>

        {/* Two Column Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Left Column: Room Code and Script */}
          <div className="lg:col-span-1 space-y-4">
            
            {/* Room Code Section - Always visible */}
            <div className={`p-4 rounded-2xl border ${surfaceSoft}`}>
              <p
                className={`text-[11px] uppercase tracking-[0.28em] ${mutedText}`}
                style={{ fontFamily: "'JetBrains Mono', monospace" }}
              >
                Room Code
              </p>
              <div className="flex flex-col gap-2 mt-3">
                <div
                  className={`p-3 rounded-xl text-center text-2xl font-bold tracking-widest border ${
                    isDark
                      ? 'bg-slate-950/70 text-cyan-200 border-slate-800'
                      : 'bg-white text-sky-600 border-slate-200'
                  }`}
                  style={{ fontFamily: "'JetBrains Mono', monospace" }}
                >
                  {roomCode}
                </div>
                <button
                  onClick={handleCopyCode}
                  className={`px-4 py-2 rounded-xl font-semibold transition-all duration-200 text-sm ${
                    copied ? 'bg-emerald-400 text-slate-900' : primaryButton
                  }`}
                >
                  {copied ? '✓ Copied' : 'Copy Code'}
                </button>
              </div>
            </div>

            {/* Script Generation Section */}
            {isHost ? (
              <div className={`p-4 rounded-2xl border ${surfaceSoft}`}>
                <div className="flex items-center justify-between mb-3">
                  <p
                    className={`text-[11px] uppercase tracking-[0.28em] ${mutedText}`}
                    style={{ fontFamily: "'JetBrains Mono', monospace" }}
                  >
                    Typing Script
                  </p>
                  <span className={`text-xs px-2 py-1 rounded-full ${
                    textGenerated
                      ? isDark
                        ? 'bg-emerald-500/30 text-emerald-200'
                        : 'bg-emerald-100 text-emerald-700'
                      : isDark
                      ? 'bg-amber-500/30 text-amber-200'
                      : 'bg-amber-100 text-amber-700'
                  }`}>
                    {textGenerated ? 'Ready' : 'Not Ready'}
                  </span>
                </div>
                <p className={`text-xs mb-4 ${mutedText}`}>
                  Generate the script for this room. Everyone will race on the same text.
                </p>
                <button
                  onClick={onGenerateScript}
                  disabled={isGenerating || textGenerated}
                  className={`w-full py-2.5 rounded-xl font-semibold text-sm transition-all duration-200 ${
                    isGenerating || textGenerated ? disabledButton : primaryButton
                  }`}
                >
                  {isGenerating ? 'Generating...' : textGenerated ? 'Script Ready' : 'Generate Script'}
                </button>
              </div>
            ) : (
              <div className={`p-4 rounded-2xl border ${surfaceSoft}`}>
                <div className="flex items-center justify-between mb-3">
                  <p
                    className={`text-[11px] uppercase tracking-[0.28em] ${mutedText}`}
                    style={{ fontFamily: "'JetBrains Mono', monospace" }}
                  >
                    Typing Script
                  </p>
                  <span className={`text-xs px-2 py-1 rounded-full ${
                    textGenerated
                      ? isDark
                        ? 'bg-emerald-500/30 text-emerald-200'
                        : 'bg-emerald-100 text-emerald-700'
                      : isDark
                      ? 'bg-slate-800 text-slate-300'
                      : 'bg-slate-200 text-slate-600'
                  }`}>
                    {textGenerated ? 'Ready' : 'Pending'}
                  </span>
                </div>
                <div className={`w-full py-2.5 rounded-xl font-semibold text-sm text-center ${isDark ? 'bg-slate-800 text-slate-300' : 'bg-slate-100 text-slate-600'}`}>
                  {isGenerating ? 'Host is generating the script...' : textGenerated ? 'Script Ready' : 'Waiting for host to generate script'}
                </div>
                <p className={`text-xs mt-3 ${mutedText}`}>
                  You’ll start typing as soon as the host starts the race.
                </p>
              </div>
            )}

            {/* Ready Button - All Players */}
            <div className={`p-4 rounded-2xl border ${surfaceSoft}`}>
              <button
                onClick={handleToggleReady}
                className={`w-full py-3 rounded-xl font-semibold transition-all duration-200 ${
                  currentPlayerReady
                    ? 'bg-emerald-400 text-slate-900 hover:bg-emerald-300'
                    : ghostButton
                }`}
              >
                {currentPlayerReady ? 'Ready to Race' : 'Mark Ready'}
              </button>
            </div>
          </div>

          {/* Right Column: Players List and Actions */}
          <div className="lg:col-span-2 space-y-4">
            
            {/* Players Section */}
            <div className={`p-4 rounded-2xl border ${surface}`}>
              <h3 className="text-lg font-semibold mb-4">
                Players ({players.length})
              </h3>
              <div className="space-y-2 max-h-64 overflow-y-auto">
                {players.map((player) => (
                  <div
                    key={player.id}
                    className={`p-3 rounded-xl flex items-center justify-between border ${surfaceSoft}`}
                  >
                    <div className="flex items-center gap-3 flex-1">
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold ${
                        isDark ? 'bg-cyan-500 text-slate-900' : 'bg-sky-500 text-white'
                      }`}>
                        {(player.name || 'P')[0].toUpperCase()}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-medium truncate">
                          {player.name}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 ml-2 flex-shrink-0">
                      {/* Show Host badge only for the actual host player */}
                      {player.id === hostId && (
                        <span className={`text-xs px-2 py-1 rounded whitespace-nowrap ${
                          isDark
                            ? 'bg-amber-500/30 text-amber-200'
                            : 'bg-amber-100 text-amber-700'
                        }`}>
                          Host
                        </span>
                      )}
                      {player.ready ? (
                        <span className={`text-xs px-2 py-1 rounded whitespace-nowrap ${
                          isDark
                            ? 'bg-emerald-500/30 text-emerald-200'
                            : 'bg-emerald-100 text-emerald-700'
                        }`}>
                          ✓ Ready
                        </span>
                      ) : (
                        <span className={`text-xs px-2 py-1 rounded whitespace-nowrap ${
                          isDark
                            ? 'bg-slate-800 text-slate-300'
                            : 'bg-slate-200 text-slate-600'
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
                className={`w-full py-3 rounded-xl font-semibold transition-all duration-200 text-lg ${
                  (!isHost || !canStartRace) ? disabledButton : primaryButton
                }`}
              >
                {isHost ? '🚀 Start Race' : '🚀 Start Race'}
              </button>

              {/* Status Messages */}
              {!isHost && (
                <p className={`text-sm text-center ${mutedText}`}>
                  Waiting for the host to start the race
                </p>
              )}
              {isHost && !textGenerated && (
                <p className={`text-sm text-center ${isDark ? 'text-amber-300' : 'text-amber-700'}`}>
                  Generate script first
                </p>
              )}
              {isHost && textGenerated && !allPlayersReady && (
                <p className={`text-sm text-center ${isDark ? 'text-cyan-300' : 'text-sky-600'}`}>
                  Waiting for all players to be ready
                </p>
              )}

              {/* Leave Button */}
              <button
                onClick={onLeave}
                className={`w-full py-2 rounded-xl font-medium transition-colors duration-200 ${ghostButton}`}
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
          <div className="bg-slate-950/70 w-full h-full absolute" />
          <div className="relative text-center pointer-events-auto">
            <div className="mx-auto p-8 rounded-3xl border bg-slate-950/80 border-slate-800">
              <p className="text-6xl font-extrabold text-cyan-300">
                {countdown > 0 ? countdown : 'Go!'}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
