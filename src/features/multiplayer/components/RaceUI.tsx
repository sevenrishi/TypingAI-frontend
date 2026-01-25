import React, { useCallback, useState, useEffect } from 'react';
import { useSocket } from '../hooks/useSocket';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../../store';
import { setRoom, setRoomState } from '../roomSlice';
import { generateText } from '../../ai/aiSlice';
import { loadText as loadTextAction } from '../../typing/typingSlice';
import { useTheme } from '../../../providers/ThemeProvider';

function genCode() {
  return Math.random().toString(36).slice(2, 8).toUpperCase();
}

export default function RaceUI() {
  const dispatch = useDispatch();
  const { theme } = useTheme();
  const room = useSelector((s: RootState) => s.room);
  const aiText = useSelector((s: RootState) => s.ai.text);
  const [code, setCode] = useState('');
  const [name, setName] = useState('Player');

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
      const res: any = await dispatch(generateText({ topic: 'General', length: 'short' }));
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
    <div className={`p-4 rounded-lg shadow-lg transition-colors duration-300 ${
      theme === 'dark'
        ? 'bg-gradient-to-b from-gray-800 to-gray-700'
        : 'bg-gradient-to-b from-white to-gray-50 border border-gray-300'
    }`}>
      <h3 className={`font-semibold mb-3 text-lg ${
        theme === 'dark' ? 'text-gray-100' : 'text-gray-900'
      }`}>Typing Battleground</h3>

      <div className="flex flex-col gap-3">
        <input
          value={name}
          onChange={e => setName(e.target.value)}
          className={`p-2 rounded-md border transition-colors duration-200 ${
            theme === 'dark'
              ? 'bg-gray-800 border-gray-600 text-white placeholder-gray-400'
              : 'bg-gray-50 border-gray-300 text-gray-900 placeholder-gray-500'
          }`}
          placeholder="Display name"
        />
        <div className="flex gap-2">
          <input
            value={code}
            onChange={e => setCode(e.target.value)}
            className={`flex-1 p-2 rounded-md border transition-colors duration-200 ${
              theme === 'dark'
                ? 'bg-gray-800 border-gray-600 text-white placeholder-gray-400'
                : 'bg-gray-50 border-gray-300 text-gray-900 placeholder-gray-500'
            }`}
            placeholder="Room code"
          />
          <button
            onClick={handleCreate}
            className={`px-3 py-2 rounded-md transition-colors duration-200 ${
              theme === 'dark'
                ? 'bg-green-500 hover:bg-green-600 text-white'
                : 'bg-green-600 hover:bg-green-700 text-white'
            }`}
          >
            Create
          </button>
          <button
            onClick={handleJoin}
            className={`px-3 py-2 rounded-md transition-colors duration-200 ${
              theme === 'dark'
                ? 'bg-blue-500 hover:bg-blue-600 text-white'
                : 'bg-blue-600 hover:bg-blue-700 text-white'
            }`}
          >
            Join
          </button>
        </div>

        <div className="flex gap-2">
          <button
            onClick={toggleReady}
            className={`flex-1 px-3 py-2 rounded-md transition-colors duration-200 ${
              ready
                ? 'bg-green-500 text-white'
                : theme === 'dark'
                ? 'bg-gray-700 text-gray-200 hover:bg-gray-600'
                : 'bg-gray-300 text-gray-900 hover:bg-gray-400'
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
            className={`px-3 py-2 rounded-md transition-colors duration-200 ${
              theme === 'dark'
                ? 'bg-red-500 hover:bg-red-600 text-white'
                : 'bg-red-600 hover:bg-red-700 text-white'
            }`}
          >
            Start
          </button>
        </div>

        <div className="mt-2">
          {room.players.length === 0 && (
            <div className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
              No players yet
            </div>
          )}
          {room.players.map(p => (
            <div
              key={p.id}
              className={`mb-3 p-3 rounded-md border transition-colors duration-300 ${
                theme === 'dark'
                  ? 'bg-gray-800 border-gray-700'
                  : 'bg-gray-50 border-gray-300'
              }`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-indigo-600 flex items-center justify-center text-sm font-semibold text-white">
                    {(p.name||'P')[0]}
                  </div>
                  <div>
                    <div className={`text-sm font-medium ${theme === 'dark' ? 'text-gray-100' : 'text-gray-900'}`}>
                      {p.name}
                    </div>
                    <div className={`text-xs ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                      {p.wpm ? `${Math.round(p.wpm)} wpm` : '—'}
                    </div>
                  </div>
                </div>
                <div className={`text-sm font-semibold ${theme === 'dark' ? 'text-gray-100' : 'text-gray-900'}`}>
                  {Math.round((p.progress||0)*100)}%
                </div>
              </div>
              <div className={`h-2 rounded overflow-hidden mt-3 ${
                theme === 'dark' ? 'bg-gray-700' : 'bg-gray-300'
              }`}>
                <div style={{ width: `${(p.progress||0)*100}%` }} className="h-full bg-indigo-500 transition-all" />
              </div>
              <div className="mt-2 flex gap-2">
                {room.host === p.id && (
                  <span className={`text-xs px-2 py-0.5 rounded ${
                    theme === 'dark'
                      ? 'bg-yellow-600/50 text-yellow-300'
                      : 'bg-yellow-300 text-yellow-900'
                  }`}>
                    Host
                  </span>
                )}
                {p.ready && (
                  <span className={`text-xs px-2 py-0.5 rounded ${
                    theme === 'dark'
                      ? 'bg-green-600/50 text-green-300'
                      : 'bg-green-200 text-green-900'
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
