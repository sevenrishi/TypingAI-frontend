# Architecture Overview

High-level components

- Backend (server/)
  - Express API routes for AI, auth, users, and results.
  - MongoDB models: `User`, `TestResult`.
  - Socket.IO handlers in `src/sockets/rooms.ts` for multiplayer rooms, hosting, countdown, and time sync.

- Frontend (client/)
  - React + Vite + TypeScript app.
  - Redux Toolkit store with slices: `auth`, `ai`, `typing`, `room`, `profile`.
  - Reusable hooks: `useTyping`, `useSocket` and a `SocketProvider` that performs time sync.
  - Components: `TypingTest`, `TextDisplay`, `StatsPanel`, `ResultsModal`, and `RaceUI` for multiplayer.

Data flow
- AI generation: user requests topic → backend calls OpenAI → returns text → dispatched to store → typing component loads text.
- Typing metrics: typed text is compared client-side for errors and WPM; results can be saved to the backend.
- Multiplayer: host creates room and shares AI text; players join and send progress updates; host starts race, server schedules a start time, clients sync and begin concurrently.

Scaling notes
- Room state currently in-memory. For scaling across multiple server processes, persist rooms to an external store (Redis) and use Redis-based pub/sub for Socket.IO adapter.
