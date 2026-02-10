import React, { useCallback, useState, useEffect } from 'react';
import { useSocket } from '../hooks/useSocket';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../../store';
import { setRoom, setRoomState } from '../roomSlice';
import { generateMultiplayerText } from '../../ai/aiMultiplayerSlice';
import { loadText as loadTextAction } from '../../typing/typingSlice';
import { useTheme } from '../../../providers/ThemeProvider';

function genCode() {
  return Math.random().toString(36).slice(2, 8).toUpperCase();
}

export default function RaceUI() {
  const dispatch = useDispatch();
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  const room = useSelector((s: RootState) => s.room);
  const aiText = useSelector((s: RootState) => s.aiMultiplayer.text);
  const [code, setCode] = useState('');
  const [name, setName] = useState('Player');
  const surface = isDark
    ? 'bg-slate-900/70 border-slate-700/60 text-slate-100 backdrop-blur-xl'
    : 'bg-white/80 border-slate-200 text-slate-900 backdrop-blur-xl';
  const surfaceSoft = isDark
    ? 'bg-slate-900/45 border-slate-700/50 text-slate-100'
    : 'bg-white/60 border-slate-200/80 text-slate-900';
  const inputBase = isDark
    ? 'bg-slate-900/60 border-slate-700 text-slate-100 placeholder-slate-500'
    : 'bg-white border-slate-200 text-slate-900 placeholder-slate-500';
  const primaryButton = isDark
    ? 'bg-gradient-to-r from-cyan-400 via-sky-400 to-emerald-400 text-slate-900'
    : 'bg-gradient-to-r from-sky-500 via-cyan-500 to-emerald-500 text-white';
  const ghostButton = isDark
    ? 'bg-slate-800 text-slate-200 hover:bg-slate-700'
    : 'bg-slate-200 text-slate-700 hover:bg-slate-300';

  const onRoomState = useCallback((state: any) => {
    // convert players map to array for UI
    const players = Object.entries(state.players).map(([id, p]: any, i: number) => ({ id, name: p.name, progress: p.progress, wpm: p.wpm, accuracy: p.accuracy, ready: p.ready }));
    dispatch(setRoomState({ players, host: state.host, raceStart: state.raceStart, text: state.text }));
    // Load the shared text into typing state so all players race on same text
    if (state.text) {
      dispatch(loadTextAction(state.text));
    }
  }, [dispatch]);

  const { createRoom, joinRoom, socket } = useSocket(onRoomState);

  // When joining a room, load the shared text
  useEffect(() => {
    if (room.text) {
      dispatch(loadTextAction(room.text));
    }
  }, [room.text, dispatch]);

  // Update room text when aiText changes (after generation)
  useEffect(() => {
    if (aiText && room.roomId && !room.text) {
      dispatch(setRoom({ roomId: room.roomId, text: aiText, isHost: room.isHost }));
      dispatch(loadTextAction(aiText));
    }
  }, [aiText, room.roomId, room.text, dispatch]);

  const handleCreate = async () => {
    const roomCode = genCode();
    let textToUse = aiText;
    
    // ensure text exists - if not, generate it
    if (!textToUse) {
      const res: any = await dispatch(generateMultiplayerText({ topic: 'General', length: 'short' }));
      textToUse = res.payload || '';
    }

    if (!textToUse) {
      alert('Failed to generate text');
      return;
    }
    
    createRoom(roomCode, textToUse, name);
    dispatch(setRoom({ roomId: roomCode, text: textToUse, isHost: true }));
    setCode(roomCode);
  };

  const handleJoin = () => {
    if (!code) {
      alert('Please enter a room code');
      return;
    }
    joinRoom(code, name);
    // Room text will be loaded via onRoomState callback
  };

  const [ready, setReady] = useState(false);

  const toggleReady = () => {
    setReady(r => {
      const next = !r;
      const sock = (window as any).__TYPING_SOCKET;
      if (room.roomId) sock?.emit('player:ready', { room: room.roomId, ready: next });
      return next;
    });
  };

  return (
    <div className={`p-4 rounded-2xl border shadow-lg transition-colors duration-300 ${surface}`}>
      <h3 className="font-semibold mb-3 text-lg">Typing Battleground</h3>

      <div className="flex flex-col gap-3">
        <input
          value={name}
          onChange={e => setName(e.target.value)}
          className={`p-2 rounded-xl border transition-colors duration-200 ${inputBase}`}
          placeholder="Display name"
        />
        <div className="flex gap-2">
          <input
            value={code}
            onChange={e => setCode(e.target.value)}
            className={`flex-1 p-2 rounded-xl border transition-colors duration-200 ${inputBase}`}
            placeholder="Room code"
          />
          <button
            onClick={handleCreate}
            className={`px-3 py-2 rounded-xl transition-colors duration-200 ${primaryButton}`}
          >
            Create
          </button>
          <button
            onClick={handleJoin}
            className={`px-3 py-2 rounded-xl transition-colors duration-200 ${ghostButton}`}
          >
            Join
          </button>
        </div>

        <div className="flex gap-2">
          <button
            onClick={toggleReady}
            className={`flex-1 px-3 py-2 rounded-xl transition-colors duration-200 ${
              ready ? 'bg-emerald-400 text-slate-900' : ghostButton
            }`}
          >
            {ready ? 'Ready' : "I'm Ready"}
          </button>
          <button
            onClick={() => {
              if (!room.roomId) {
                alert('Create or join a room first');
                return;
              }
              const currentSocketId = socket?.id;
              if (!currentSocketId) {
                alert('Socket connection not ready');
                return;
              }
              if (room.host && room.host !== currentSocketId) {
                alert('Only the host can start the race');
                return;
              }
              socket?.emit('race:start', { room: room.roomId });
            }}
            className={`px-3 py-2 rounded-xl transition-colors duration-200 ${primaryButton}`}
          >
            Start
          </button>
        </div>

        <div className="mt-2">
          {room.players.length === 0 && (
            <div className={`text-sm ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
              No players yet
            </div>
          )}
          {room.players.map(p => (
            <div
              key={p.id}
              className={`mb-3 p-3 rounded-xl border transition-colors duration-300 ${surfaceSoft}`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold ${
                    isDark ? 'bg-cyan-500 text-slate-900' : 'bg-sky-500 text-white'
                  }`}>
                    {(p.name||'P')[0]}
                  </div>
                  <div>
                    <div className="text-sm font-medium">
                      {p.name}
                    </div>
                    <div className={`text-xs ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                      {p.wpm ? `${Math.round(p.wpm)} wpm` : '—'}
                    </div>
                  </div>
                </div>
                <div className="text-sm font-semibold">
                  {Math.round((p.progress||0)*100)}%
                </div>
              </div>
              <div className={`h-2 rounded overflow-hidden mt-3 ${isDark ? 'bg-slate-800' : 'bg-slate-200'}`}>
                <div style={{ width: `${(p.progress||0)*100}%` }} className="h-full bg-gradient-to-r from-cyan-400 via-sky-400 to-emerald-400 transition-all" />
              </div>
              <div className="mt-2 flex gap-2">
                {room.host === p.id && (
                  <span className={`text-xs px-2 py-0.5 rounded ${
                    isDark
                      ? 'bg-amber-500/30 text-amber-200'
                      : 'bg-amber-100 text-amber-700'
                  }`}>
                    Host
                  </span>
                )}
                {p.ready && (
                  <span className={`text-xs px-2 py-0.5 rounded ${
                    isDark
                      ? 'bg-emerald-500/30 text-emerald-200'
                      : 'bg-emerald-100 text-emerald-700'
                  }`}>
                    Ready
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
