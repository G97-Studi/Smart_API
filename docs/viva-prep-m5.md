# Milestone 5 — Viva / Live Demo Prep (Sona's section: auth + frontend + AI)

Quick-reference for questions the instructor is likely to ask about the
work covered in Milestone 5. Answer in your own words in class — this is
prep material, not a script to read.

## Auth basics

**What is JWT and why use it?**
A JSON Web Token is a signed, self-contained token: it carries the user's
identity (`user_id`, `email`) and an expiry, and the server can verify it's
authentic just by checking the signature — no database lookup needed on
every request. That's why it's called "stateless" auth.

**Why hash passwords instead of storing them directly?**
If the database is ever leaked, plain-text passwords compromise every user
immediately (and any other site where they reused that password). A bcrypt
hash is one-way — you can check a password against it, but can't reverse
it back to the original.

**What are salt rounds / why 10?**
bcrypt adds a random "salt" to each password before hashing, so two users
with the same password get different hashes. "Rounds" control how many
times the hashing algorithm repeats — higher is slower to compute (harder
to brute-force) but slower to hash on login too. 10 is a common default
balance for a project this size.

**Where does authenticateToken run, and what does it check?**
`src/middleware/auth.ts`. It runs before the route handler on every
protected route. It reads the `Authorization: Bearer <token>` header,
verifies the JWT signature and expiry with `jwt.verify()`, and either
attaches the decoded payload to `req.user` and calls `next()`, or responds
`401` (no token) / `403` (invalid/expired) and stops the request there.

**What's the difference between 401 and 403 here?**
401 = you didn't send a token at all. 403 = you sent one, but it's invalid
or expired. (Not a hard rule everywhere, but that's the convention used
in this API.)

**Why does login return the same error for "wrong email" and "wrong
password"?**
So the API doesn't tell an attacker which part was wrong — that would let
them enumerate valid emails one at a time.

**How does logout work if JWTs are stateless?**
There's no server-side session to destroy. The client just deletes the
token (from `sessionStorage` and React state) so it stops sending it. The
`POST /auth/logout` endpoint exists mainly as a clean, explicit contract
for the frontend to call.

**What's the rate limiter doing, and what are its limits?**
`src/middleware/rateLimiter.ts` counts failed... actually counts *attempts*
per IP in a 15-minute window and blocks with `429` after 5. It's in-memory,
so it resets on server restart and wouldn't work correctly across multiple
server instances — good production version would use Redis or similar.
Mentioning that limitation unprompted is a strong answer if asked "is this
production ready?"

## Token storage

**Why sessionStorage instead of localStorage?**
Both are readable by any JavaScript running on the page, so both are
exposed if the app has an XSS vulnerability. sessionStorage is scoped to
one tab and clears when the tab closes, which is a smaller window of risk
than localStorage (which persists indefinitely). Neither is as safe as an
httpOnly cookie, which JS can't read at all — that's the "right" answer in
production, traded off here for a simpler, more explainable flow.

## Frontend

**How does the SPA avoid full page reloads?**
React Router (`BrowserRouter`, `Routes`, `Route`) swaps components on the
client side instead of requesting a new HTML page from the server.

**How does route protection work?**
`ProtectedRoute` (`frontend/src/components/ProtectedRoute.tsx`) checks
`isAuthenticated` from `AuthContext`. If false, it renders `<Navigate
to="/login" />` instead of the page. It wraps the Customers/Devices/Tickets
routes in `App.tsx`.

**Where does the JWT get attached to API calls?**
`frontend/src/api/client.ts` — every call goes through `apiRequest()`,
which adds `Authorization: Bearer <token>` if a token was passed in.

**How are errors shown to the user (not silently failing)?**
`apiRequest` throws an `ApiError` with the backend's message on any
non-2xx response; each page's `try/catch` catches it and renders it in an
`error-banner` div.

## AI feature

**What does the AI component actually do?**
Takes an informal description of a device problem and asks an AI model to
rewrite it as one clear, professional issue description for a technician's
ticket.

**Where does the AI call actually happen — frontend or backend?**
Backend (`src/controllers/aiController.ts`). The frontend never talks to
the AI API directly or sees the API key — it only calls the backend's
`POST /ai/suggest`, which holds the key server-side.

**What happens if there's no API key configured?**
The endpoint falls back to a simple rule-based rewrite (capitalize, add a
period) instead of failing, so the feature still demos end-to-end.

## Likely "why did you..." questions

- Why Express + TypeScript? Type safety catches mistakes (wrong field
  names, wrong types) at compile time instead of at runtime in production.
- Why a connection pool, not `createConnection()`? Reused across
  concurrent requests instead of opening/closing a connection per query.
- Why parameterized queries everywhere? Prevents SQL injection — user
  input is never concatenated directly into a SQL string.
- Why Vite over Create React App? Faster dev server / build, and CRA is
  effectively unmaintained at this point.
