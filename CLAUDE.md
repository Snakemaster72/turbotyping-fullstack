# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

### Development (from repo root)
```bash
npm run dev          # Start both client and server concurrently
npm run server       # Server only (nodemon, loads server/.env)
npm run client       # Client only (Vite dev server)
```

### Client (from `client/`)
```bash
npm run dev          # Vite dev server on :5173
npm run build        # Production build
npm run lint         # ESLint
npm run preview      # Preview production build
```

### Server (from `server/`)
```bash
npm run dev          # nodemon server.js with .env
```

There are no tests in this project (`npm test` exits with an error by design).

## Environment Setup

**`server/.env`** — required variables (see `server/.env.example`):
- `PORT` (default: 5000)
- `MONGO_URI` — MongoDB Atlas connection string
- `JWT_SECRET`
- `FRONTEND_URL` — used in email verification links
- `EMAIL_USER`, `EMAIL_PASS`, `EMAIL_HOST`, `EMAIL_PORT`, `EMAIL_FROM`, `EMAIL_FROM_NAME` — Gmail SMTP

**`client/.env`**:
- `VITE_API_URL` — in dev, leave empty; Vite proxies `/api/*` → `http://localhost:5000`

## Architecture

This is a React + Express fullstack typing game ("TurboTyping") with single-player and (in-progress) multiplayer modes.

### Frontend (`client/src/`)

- **Entry:** `App.jsx` defines all React Router v7 routes; `main.jsx` mounts the Redux store and React app.
- **State:** Redux Toolkit — `authSlice` (user session) and `multiplayer` slice. On app load, if a JWT token exists in `localStorage` but Redux has no user, `getUserData()` is dispatched to rehydrate from `GET /api/users/me`.
- **HTTP:** All REST calls go through `utils/axiosConfig.js` which sets the base URL and attaches `Authorization: Bearer <token>` from `localStorage` on every request.
- **Socket:** `socket/socket.js` holds the singleton Socket.io client (connects to `:5000`, `autoConnect: false`). `useMultiplayerSocket.js` is the hook that connects on mount, registers server→client listeners, and dispatches to Redux.
- **Routing:** Single-player game lives at `/play/singleplayer`; multiplayer flow: `/play/multiplayer/choice` → create/join → `/play/multiplayer/waiting/:roomId` → `/play/multiplayer/game/:roomId`.

### Backend (`server/`)

- **Entry:** `server.js` — mounts Express middleware, routes, Socket.io server, and starts `httpServer`. `setupSocketHandlers(io)` is **commented out** — the socket handler files are empty stubs.
- **Auth:** Stateless JWT (30-day expiry). `protect` middleware requires a valid Bearer token; `optionalAuth` allows unauthenticated access (sets `req.user = null`). Registration triggers email verification via Gmail SMTP; login is blocked until `isVerified: true`.
- **Routes:** `POST/GET /api/users/*` (auth), `GET/POST /api/test/*` (prompts + submission), `GET /api/games/*` (history + leaderboard).

### Data Flow — Single-player Test

1. `GET /api/test/prompt?type=classic&count=50` → space-joined random words from `utils/wordData.js`
2. Frontend records each keystroke as `{ char, type, time }` in a `rawText` array
3. On finish: `POST /api/test` with `{ testType, testData: rawText, prompt }`
4. `calculateWPM.js` replays keystrokes to reconstruct typed text, then computes `wpm`, `rawWpm`, `accuracy`
5. Result saved to `GameResult` (always) and `TypingTest` (authenticated only); `userStatsService.updateUserStats` updates rolling averages in `user.categoryStats`
6. Response `{ wpm, rawWpm, accuracy, totalTime }` displayed on `ResultPage`

### MongoDB Models

- **`User`** — auth fields + `categoryStats` map (per test mode: `wpmAvg`, `accuracyAvg`, `totalTests`, `bestWPM`, `bestAccuracy`)
- **`GameResult`** — primary result record for every test (guests and users)
- **`TypingTest`** — secondary result record (authenticated users only)
- **`MultiplayerMatch`** — one document per completed multiplayer game

### Multiplayer Status

Socket infrastructure is wired on the client (event constants in `socket/events.js`, hook in `useMultiplayerSocket.js`, Redux slice in `features/multiplayer/multiplayer.js`) but the **server-side handlers are empty stubs** — `server/socket/roomHander.js` and `server/socket/utils/createRoomObject.js` need to be implemented and `setupSocketHandlers(io)` uncommented in `server.js`.

### Test Mode Types

`"classic"` | `"time15"` | `"time30"` | `"time60"` | `"quote"` | `"snippets"` — these strings are the canonical keys used across routes, `categoryStats`, and Redux state.
