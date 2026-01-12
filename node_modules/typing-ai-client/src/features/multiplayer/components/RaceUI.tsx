import React, { useCallback, useState } from 'react';
import { useSocket } from '../hooks/useSocket';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../../store';
import { setRoom, setRoomState } from '../roomSlice';
import { generateText } from '../../ai/aiSlice';

function genCode() {
  return Math.random().toString(36).slice(2, 8).toUpperCase();
}

export default function RaceUI() {
  const dispatch = useDispatch();
  const room = useSelector((s: RootState) => s.room);
  const aiText = useSelector((s: RootState) => s.ai.text);
  const [code, setCode] = useState('');
  const [name, setName] = useState('Player');

  const onRoomState = useCallback((state: any) => {
    // convert players map to array for UI
    const players = Object.entries(state.players).map(([id, p]: any, i: number) => ({ id, name: p.name, progress: p.progress, wpm: p.wpm, accuracy: p.accuracy, ready: p.ready }));
    dispatch(setRoomState({ players, host: state.host, raceStart: state.raceStart }));
  }, [dispatch]);

  const { createRoom, joinRoom, socket } = useSocket(onRoomState);

  const handleCreate = async () => {
    const roomCode = genCode();
    // ensure text exists
    if (!aiText) await dispatch(generateText({ topic: 'General', length: 'short' }));
    const textToUse = aiText || '';
    createRoom(roomCode, textToUse, name);
    dispatch(setRoom({ roomId: roomCode, text: textToUse }));
    setCode(roomCode);
  };

  const handleJoin = () => {
    if (!code) return;
    joinRoom(code, name);
    dispatch(setRoom({ roomId: code, text: '' }));
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
    <div className="p-4 rounded-lg shadow-lg bg-gradient-to-b from-gray-800 to-gray-700">
      <h3 className="font-semibold mb-3 text-lg">Multiplayer Race</h3>

      <div className="flex flex-col gap-3">
        <input value={name} onChange={e => setName(e.target.value)} className="p-2 rounded-md bg-gray-800 border border-gray-600" placeholder="Display name" />
        <div className="flex gap-2">
          <input value={code} onChange={e => setCode(e.target.value)} className="flex-1 p-2 rounded-md bg-gray-800 border border-gray-600" placeholder="Room code" />
          <button onClick={handleCreate} className="px-3 py-2 bg-green-500 hover:bg-green-600 text-white rounded-md">Create</button>
          <button onClick={handleJoin} className="px-3 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-md">Join</button>
        </div>

        <div className="flex gap-2">
          <button onClick={toggleReady} className={`flex-1 px-3 py-2 rounded-md ${ready ? 'bg-green-500 text-white' : 'bg-gray-700 text-gray-200'}`}>{ready ? 'Ready' : "I'm Ready"}</button>
          <button onClick={() => {
            if (!room.roomId) return;
            const currentSocketId = socket?.id;
            if (!currentSocketId) return;
            if (room.host && room.host !== currentSocketId) return alert('Only the host can start the race');
            socket?.emit('race:start', { room: room.roomId });
          }} className="px-3 py-2 bg-red-500 hover:bg-red-600 text-white rounded-md">Start</button>
        </div>

        <div className="mt-2">
          {room.players.length === 0 && <div className="text-sm text-gray-400">No players yet</div>}
          {room.players.map(p => (
            <div key={p.id} className="mb-3 p-3 bg-gray-800 rounded-md border border-gray-700">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-indigo-600 flex items-center justify-center text-sm font-semibold">{(p.name||'P')[0]}</div>
                  <div>
                    <div className="text-sm font-medium">{p.name}</div>
                    <div className="text-xs text-gray-400">{p.wpm ? `${Math.round(p.wpm)} wpm` : '—'}</div>
                  </div>
                </div>
                <div className="text-sm font-semibold">{Math.round((p.progress||0)*100)}%</div>
              </div>
              <div className="h-2 bg-gray-700 rounded overflow-hidden mt-3">
                <div style={{ width: `${(p.progress||0)*100}%` }} className="h-full bg-indigo-500 transition-all" />
              </div>
              <div className="mt-2 flex gap-2">
                {room.host === p.id && <span className="text-xs px-2 py-0.5 bg-yellow-300 text-yellow-900 rounded">Host</span>}
                {p.ready && <span className="text-xs px-2 py-0.5 bg-green-200 text-green-900 rounded">Ready</span>}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
