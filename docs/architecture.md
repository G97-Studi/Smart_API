# Backend Architecture

## Technology Stack

Node.js, Express, TypeScript, MySQL (`mysql2/promise`).

## Current Folder Structure

```
src/
├── db.ts              # MySQL connection pool
├── index.ts           # Express app setup, middleware, route registration, server start
└── routes/
    ├── customerRoutes.ts
    ├── deviceRoutes.ts
    └── ticketRoutes.ts
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

## Milestone 4 Additions (in progress)

Each resource (`customers`, `devices`, `tickets`) is being extended with:

- `PUT`/`PATCH /:id` — update by ID, `404` if the ID doesn't exist
- `DELETE /:id` — delete by ID, `404` if the ID doesn't exist

All queries use parameterized `?` placeholders — no string concatenation of
user input into SQL.
