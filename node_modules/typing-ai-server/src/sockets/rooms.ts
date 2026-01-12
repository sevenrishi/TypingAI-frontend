import { Server, Socket } from 'socket.io';
type RoomState = {
  text: string;
  players: Record<
    string,
    { name: string; progress: number; wpm?: number; accuracy?: number; ready?: boolean }
  >;
  host?: string; // socket id of host
  raceStart?: number | null; // timestamp when race will start
};

const rooms: Record<string, RoomState> = {};

function emitRoomState(io: Server, room: string) {
  const state = rooms[room];
  if (!state) return;
  // send a sanitized state (players keyed by socket id, plus host)
  io.to(room).emit('room:state', {
    text: state.text,
    players: state.players,
    host: state.host,
    raceStart: state.raceStart || null
  });
}

export function attachRoomHandlers(io: Server) {
  io.on('connection', (socket: Socket) => {
    socket.on('room:create', ({ room, text, name }) => {
      rooms[room] = { text, players: {}, host: socket.id, raceStart: null };
      rooms[room].players[socket.id] = { name: name || 'Anon', progress: 0, ready: false } as any;
      socket.join(room);
      emitRoomState(io, room);
    });

    socket.on('room:join', ({ room, name }) => {
      const state = rooms[room];
      if (!state) return socket.emit('room:error', { error: 'Room not found' });
      state.players[socket.id] = { name: name || 'Anon', progress: 0, ready: false } as any;
      socket.join(room);
      emitRoomState(io, room);
    });

    socket.on('room:progress', ({ room, progress, wpm, accuracy }) => {
      const state = rooms[room];
      if (!state) return;
      const p = state.players[socket.id];
      if (p) {
        p.progress = progress;
        p.wpm = wpm;
        p.accuracy = accuracy;
      }
      emitRoomState(io, room);
    });

    socket.on('player:ready', ({ room, ready }) => {
      const state = rooms[room];
      if (!state) return socket.emit('room:error', { error: 'Room not found' });
      const p = state.players[socket.id];
      if (p) {
        p.ready = !!ready;
      }
      emitRoomState(io, room);
    });

    // simple time sync responder for clients to compute clock offset
    socket.on('time:request', ({ clientSent }) => {
      socket.emit('time:response', { clientSent, serverTime: Date.now() });
    });

    socket.on('room:leave', ({ room }) => {
      const state = rooms[room];
      if (!state) return;
      delete state.players[socket.id];
      socket.leave(room);
      // if host left, pick a new host
      if (state.host === socket.id) {
        const keys = Object.keys(state.players);
        state.host = keys.length ? keys[0] : undefined;
      }
      emitRoomState(io, room);
    });

    socket.on('race:start', ({ room }) => {
      const state = rooms[room];
      if (!state) return socket.emit('room:error', { error: 'Room not found' });
      // only host can start
      if (state.host !== socket.id) return socket.emit('room:error', { error: 'Only host can start the race' });
      // schedule race start a few seconds in the future for countdown sync
      const startAt = Date.now() + 5000; // 5s countdown
      state.raceStart = startAt;
      io.to(room).emit('race:start', { room, startAt, host: state.host });
      emitRoomState(io, room);
    });

    socket.on('disconnect', () => {
      for (const roomKey of Object.keys(rooms)) {
        const state = rooms[roomKey];
        if (state.players[socket.id]) {
          delete state.players[socket.id];
          // transfer host if needed
          if (state.host === socket.id) {
            const keys = Object.keys(state.players);
            state.host = keys.length ? keys[0] : undefined;
            io.to(roomKey).emit('room:host', { host: state.host });
          }
          emitRoomState(io, roomKey);
        }
      }
    });
  });
}

