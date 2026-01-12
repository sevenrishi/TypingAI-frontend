# Socket Events

Client → Server
- `room:create` : { room: string, text: string, name?: string }
- `room:join` : { room: string, name?: string }
- `room:leave` : { room: string }
- `room:progress` : { room: string, progress: number (0-1), wpm?: number, accuracy?: number }
- `player:ready` : { room: string, ready: boolean }
- `race:start` : { room: string } (only host allowed)
- `time:request` : { clientSent: number }

Server → Client
- `room:state` : { text, players: Record<socketId, { name, progress, ready, wpm, accuracy }>, host?: socketId, raceStart?: timestamp }
- `room:error` : { error: string }
- `race:start` : { room, startAt: timestamp, host }
- `time:response` : { clientSent, serverTime }
- `room:host` : { host: socketId } — emitted when host transfers on disconnect

Notes
- `race:start.startAt` is a server timestamp (ms since epoch). Clients should compute local start = startAt - offset where `offset` is measured via `time:request`/`time:response`.
