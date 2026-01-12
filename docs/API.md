# API Reference

This page documents the main HTTP endpoints provided by the backend.

POST /api/ai/generate
- Request body: `{ topic: string, length: 'short'|'medium'|'long', difficulty?: string }`
- Response: `{ text: string }` — single-paragraph generated passage for typing practice.

Auth
- POST /api/auth/register — `{ email?, password, displayName? }` → `{ token, user }`
- POST /api/auth/login — `{ email, password }` → `{ token, user }`
- Protected endpoints require `Authorization: Bearer <token>` header.

User
- GET /api/users/me — returns `{ user, bestWPM, averageAccuracy }`.

Results
- POST /api/results — save test result. Body: `{ wpm, cpm, accuracy, errors, duration, text, room? }` (requires auth)
- GET /api/results/me — list user's recent results (requires auth)

Socket events
- See docs/SocketEvents.md for full socket contract and sample payloads.
