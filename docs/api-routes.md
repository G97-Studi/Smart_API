# API Routes

Base URL (local dev): `http://localhost:3001`

All routes below except `/auth/*` and `GET /` require a valid JWT:
`Authorization: Bearer <token>`, obtained from `POST /auth/login`. Requests
without a valid token get `401`/`403` (see Authentication section below).

## Authentication — `src/routes/authRoutes.ts` (public)

| Method | Path | Body | Response |
|---|---|---|---|
| POST | `/auth/register` | `{ full_name, email, password }` | `201` `{ user_id, full_name, email }`, `400` on missing/invalid fields or duplicate email |
| POST | `/auth/login` | `{ email, password }` | `200` `{ token, user }`, `401` on bad credentials, `429` after 5 failed attempts in 15 min |
| POST | `/auth/logout` | — | `200` confirmation (JWTs are stateless — this just documents client-side token discard) |

## Customers — `src/routes/customerRoutes.ts` (protected)

| Method | Path | Body | Response |
|---|---|---|---|
| GET | `/customers` | — | `200` array of customers |
| POST | `/customers` | `{ full_name, email, phone, address }` | `201` created customer, `400` if `full_name`/`email` missing |
| PUT | `/customers/:id` | `{ full_name, email, phone, address }` | `200` updated customer, `404` if ID not found |
| DELETE | `/customers/:id` | — | `200` confirmation, `404` if ID not found |

## Devices — `src/routes/deviceRoutes.ts` (protected)

| Method | Path | Body | Response |
|---|---|---|---|
| GET | `/devices` | — | `200` array of devices, LEFT JOINed with customer name |
| POST | `/devices` | `{ customer_id, device_type, brand, model, serial_number, issue_description }` | `201` created device, `400` if `customer_id`/`device_type` missing |
| PUT | `/devices/:id` | same as POST | `200` updated device, `404` if ID not found |
| DELETE | `/devices/:id` | — | `200` confirmation, `404` if ID not found |

## Repair Tickets — `src/routes/ticketRoutes.ts` (protected)

| Method | Path | Body | Response |
|---|---|---|---|
| GET | `/tickets` | — | `200` array of tickets, LEFT JOINed with customer + device info |
| POST | `/tickets` | `{ customer_id, device_id, issue, status, priority, estimated_cost }` | `201` created ticket, `400` if `customer_id`/`device_id`/`issue` missing |
| PUT | `/tickets/:id` | same as POST | `200` updated ticket, `404` if ID not found |
| DELETE | `/tickets/:id` | — | `200` confirmation, `404` if ID not found |

## AI Assistant — `src/routes/aiRoutes.ts` (protected)

| Method | Path | Body | Response |
|---|---|---|---|
| POST | `/ai/suggest` | `{ rawInput }` (informal problem description, ≤500 chars) | `200 { suggestion, source }` — `source` is `"ai"` if `ANTHROPIC_API_KEY` is set, `"fallback"` (rule-based) otherwise |

## Root

| Method | Path | Response |
|---|---|---|
| GET | `/` | `200 { message: "SmartRepair API is running!" }` — health check, no auth required |

## Milestone Status

- **Milestone 4**: complete — full CRUD (GET/POST/PUT/DELETE) on customers, devices, tickets.
- **Milestone 5**: complete — `/auth` routes, JWT middleware protecting all CRUD + AI routes, login rate limiting, React SPA frontend (`frontend/`), AI-powered issue description assistant.

## Planned, Not Yet Built

- `/appointments` (table designed in schema.sql, routes not built — out of current scope)
