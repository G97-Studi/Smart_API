# Backend Architecture

## Technology Stack

Node.js, Express, TypeScript, MySQL (`mysql2/promise`), `jsonwebtoken`,
`bcryptjs`.

## Current Folder Structure

```
src/
├── db.ts                     # MySQL connection pool
├── index.ts                  # Express app setup, middleware, route registration, server start
├── middleware/
│   ├── auth.ts                # authenticateToken — verifies JWT, attaches req.user
│   └── rateLimiter.ts          # loginRateLimiter — caps login attempts per IP
├── routes/
│   ├── authRoutes.ts           # /auth/register, /auth/login, /auth/logout (public)
│   ├── customerRoutes.ts       # protected by authenticateToken
│   ├── deviceRoutes.ts         # protected by authenticateToken
│   ├── ticketRoutes.ts         # protected by authenticateToken
│   └── aiRoutes.ts             # /ai/suggest (protected)
├── controllers/
│   ├── authController.ts
│   ├── customerController.ts
│   ├── deviceController.ts
│   ├── ticketController.ts
│   └── aiController.ts
└── models/
    ├── userModel.ts
    ├── customerModel.ts
    ├── deviceModel.ts
    └── ticketModel.ts
```

`index.ts` currently does the job of what's often split into `app.ts`
(Express app + middleware) and `server.ts` (starting the listener). For a
project this size that's a reasonable, explainable choice — it was kept as
one file instead of two empty placeholder files that did nothing.

## Request Flow

1. Client sends an HTTP request (e.g. `GET /customers`)
2. Express matches the route in the relevant file under `src/routes/`
3. The route handler runs a parameterized query against the MySQL pool
   (`src/db.ts`)
4. The handler returns JSON and an appropriate HTTP status code
5. Errors are caught and returned as `{ message, error }` with a `500` (or
   `400`/`404` where applicable) instead of crashing the server

## Database Connection

`src/db.ts` creates a `mysql2/promise` connection **pool** (not a single
connection):

- `waitForConnections: true` — new requests wait for a free connection
  instead of failing immediately
- `connectionLimit: 10` — max simultaneous connections, reasonable for a
  small class project
- `queueLimit: 0` — unlimited queueing while waiting for a free connection

A pool is used instead of a single `createConnection()` because routes run
concurrently under load; a pool reuses and shares connections across
requests instead of opening/closing one connection per query.

## Milestone 4 (complete)

Each resource (`customers`, `devices`, `tickets`) has:

- `PUT /:id` — update by ID, `404` if the ID doesn't exist
- `DELETE /:id` — delete by ID, `404` if the ID doesn't exist

All queries use parameterized `?` placeholders — no string concatenation of
user input into SQL.

## Milestone 5: Authentication & Security

**Password storage.** `Users.password_hash` never stores a plain-text
password. `authController.register` hashes with `bcryptjs` (`bcrypt.hash`,
10 salt rounds) before insert; `authController.login` compares with
`bcrypt.compare`. The plain password is never logged or persisted.

**Login.** `POST /auth/login` looks up the user by email, compares the
password hash, and — on success — signs a JWT (`jsonwebtoken`, `HS256`,
2 hour expiry) containing `{ user_id, email }`, signed with `JWT_SECRET`
from `.env`. On failure it returns the *same* generic `401` message whether
the email doesn't exist or the password is wrong, so the API doesn't leak
which one was incorrect.

**Protecting routes.** `src/middleware/auth.ts` exports
`authenticateToken`, an Express middleware that reads the
`Authorization: Bearer <token>` header, verifies it with `jwt.verify`, and
attaches the decoded payload to `req.user`. `index.ts` applies it to every
`/customers`, `/devices`, `/tickets`, and `/ai` route:

```ts
app.use("/customers", authenticateToken, customerRoutes);
```

No valid token → `401` (missing) or `403` (invalid/expired) before the
request ever reaches a controller.

**Rate limiting.** `src/middleware/rateLimiter.ts` implements a simple
in-memory limiter keyed by IP: after 5 failed attempts in a 15-minute
window, further login attempts get `429` until the window resets. It's
explicitly documented as not production-grade (resets on server restart,
doesn't share state across instances) — that trade-off is intentional for a
class project and is good material for the "what would you improve"
question.

**Input validation.** `authController.ts` trims strings, checks a basic
email regex, and enforces an 8-character minimum password length before
touching the database.

**Logout.** JWTs are stateless — the server issues no session to destroy.
`POST /auth/logout` exists as a clean, documented endpoint the frontend
calls before discarding its token client-side. A production system wanting
real server-side revocation would need a token blacklist or refresh-token
scheme.

## Milestone 5: AI Feature

`POST /ai/suggest` (`src/controllers/aiController.ts`) takes a customer's
informal problem description and asks the Anthropic API to rewrite it as a
clear issue description. If `ANTHROPIC_API_KEY` isn't set in `.env` (e.g.
during a demo without exposing a real key), it falls back to a simple
rule-based rewrite so the feature still works end-to-end. The API key lives
only on the backend — the frontend never sees or calls the AI API directly.

## Milestone 5: Frontend Architecture

See `frontend/` — a Vite + React + TypeScript SPA. Summary (full detail in
the Milestone 5 Word document):

- `AuthContext` (`frontend/src/context/AuthContext.tsx`) holds the JWT and
  current user in React state, backed by `sessionStorage` so a page refresh
  doesn't log the user out mid-session.
- `ProtectedRoute` (`frontend/src/components/ProtectedRoute.tsx`) wraps
  every CRUD page; if there's no token, it redirects to `/login` instead of
  rendering.
- One page per resource (`CustomersPage`, `DevicesPage`, `TicketsPage`),
  each with a list view, create form, inline edit, and delete — all calling
  the matching backend endpoints via `frontend/src/api/client.ts`, which
  attaches the JWT to every request.
- `AIDescriptionAssistant` is a small reusable component embedded in the
  Devices and Tickets forms that calls `POST /ai/suggest`.
