# Typing AI - Typing Practice App

Lightweight, production-ready starter for an AI-powered typing practice app with single-player and multiplayer modes.

Quick features
- AI text generation via `/api/ai/generate`
- Real-time multiplayer races using Socket.IO
- Auth (JWT) + user profile and saved test results (MongoDB)
- Metrics: WPM, CPM, accuracy, errors
- React + Vite + TypeScript + Redux Toolkit + Tailwind CSS

Repository layout
- server/: Node.js + Express + TypeScript backend
- client/: Vite + React + TypeScript frontend

Getting started
1. Clone the repo

2. Backend
```bash
cd server
npm install
# copy .env.example → .env and set values (MONGO_URI, OPENAI_API_KEY, JWT_SECRET)
npm run dev
```

3. Frontend
```bash
cd client
npm install
npm run dev
```

Environment variables (.env)
- `MONGO_URI` — MongoDB connection string
- `OPENAI_API_KEY` — OpenAI API key for text generation
- `JWT_SECRET` — secret for signing JWTs

API Endpoints (server)
- POST `/api/ai/generate` — body: `{ topic, length, difficulty? }` → `{ text }`
- POST `/api/auth/register` — register user
- POST `/api/auth/login` — login user
- GET `/api/users/me` — get profile (requires Authorization: Bearer token)
- POST `/api/results` — save a test result (requires auth)
- GET `/api/results/me` — list user's results

Socket events (client ↔ server)
- `room:create` — create a room `{ room, text, name }`
- `room:join` — join a room `{ room, name }`
- `room:state` — server → broadcast room state (players, host, raceStart)
- `room:progress` — send progress `{ room, progress, wpm, accuracy }`
- `player:ready` — toggle ready `{ room, ready }`
- `race:start` — host → server, server schedules start and broadcasts `{ room, startAt }`
- `time:request` / `time:response` — simple time sync for clock offset

Testing and linting
- Frontend tests (Vitest): `cd client && npm run test`
- Lint frontend: `cd client && npm run lint`
- Format: `npm run format` at repo root (Prettier)

Notes and next steps
- Time synchronization uses a simple request/response to compute a client offset; for higher precision consider increasing samples or using an NTP-style exchange.
- Rooms are currently in-memory on the server; for multi-instance scaling, persist rooms to Redis or another store.

Thank you — open an issue or request further additions (CI, more tests, deployment scripts).
