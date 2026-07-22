# API Routes

Base URL (local dev): `http://localhost:3001`

## Customers — `src/routes/customerRoutes.ts`

| Method | Path | Body | Response |
|---|---|---|---|
| GET | `/customers` | — | `200` array of customers |
| POST | `/customers` | `{ full_name, email, phone, address }` | `201` created customer, `400` if `full_name`/`email` missing |

## Devices — `src/routes/deviceRoutes.ts`

| Method | Path | Body | Response |
|---|---|---|---|
| GET | `/devices` | — | `200` array of devices, LEFT JOINed with customer name |
| POST | `/devices` | `{ customer_id, device_type, brand, model, serial_number, issue_description }` | `201` created device, `400` if `customer_id`/`device_type` missing |

## Repair Tickets — `src/routes/ticketRoutes.ts`

| Method | Path | Body | Response |
|---|---|---|---|
| GET | `/tickets` | — | `200` array of tickets, LEFT JOINed with customer + device info |
| POST | `/tickets` | `{ customer_id, device_id, issue, status, priority, estimated_cost }` | `201` created ticket, `400` if `customer_id`/`device_id`/`issue` missing |

## Root

| Method | Path | Response |
|---|---|---|
| GET | `/` | `200 { message: "SmartRepair API is running!" }` — health check |

## Milestone 4 (in progress)

Adding to each of the three resources above:

| Method | Path | Response |
|---|---|---|
| PUT/PATCH | `/customers/:id`, `/devices/:id`, `/tickets/:id` | `200` updated record, `404` if ID not found |
| DELETE | `/customers/:id`, `/devices/:id`, `/tickets/:id` | `200`/`204` on success, `404` if ID not found |

## Planned, Not Yet Built

These appeared in Milestone 2 planning but aren't implemented in code yet —
listed here for transparency, not as claimed functionality:

- `/users/register`, `/users/login`, `/users/:id` (Milestone 5 auth)
- `/assignments` (technician assignment — out of current scope)
- `/appointments` (table designed, routes not built)
