# SmartRepair API

Computer Repair Booking and Ticket Management System — a REST backend for
tracking customers, their devices, and repair tickets.

## Project Description

SmartRepair API lets a repair shop manage customer records, the devices
customers bring in, and repair tickets tracking each job's status. Built with
Node.js, Express, TypeScript, and MySQL.

## Group Members

* Gurnoor Singh — Database Design (tables, ER diagram)
* Muhammad Noaman Mushtaq — Backend Planning (API route/architecture planning, initial routes)
* Sona Jasmin — Frontend Design (Milestone 2 wireframes/UI planning); Express/TypeScript setup, database connection, Milestone 4 CRUD endpoints

## Technologies

* Backend: Node.js, Express, TypeScript
* Database: MySQL (`mysql2/promise` connection pool)
* Tools: GitHub

## Project Structure

```
src/
├── db.ts                    # MySQL connection pool
├── index.ts                 # Express app setup, middleware, route registration, server start
├── middleware/
│   ├── auth.ts               # JWT verification (authenticateToken)
│   └── rateLimiter.ts         # Login attempt rate limiting
├── routes/                   # Defines endpoints, delegates to controllers
│   ├── authRoutes.ts
│   ├── customerRoutes.ts
│   ├── deviceRoutes.ts
│   ├── ticketRoutes.ts
│   └── aiRoutes.ts
├── controllers/              # Request/response handling, validation, status codes
│   ├── authController.ts
│   ├── customerController.ts
│   ├── deviceController.ts
│   ├── ticketController.ts
│   └── aiController.ts
└── models/                   # SQL queries, one function per operation
    ├── userModel.ts
    ├── customerModel.ts
    ├── deviceModel.ts
    └── ticketModel.ts
frontend/                     # React + TypeScript SPA (Milestone 5)
├── src/
│   ├── api/client.ts          # fetch wrapper, attaches JWT to requests
│   ├── context/AuthContext.tsx
│   ├── components/            # ProtectedRoute, Navbar, AIDescriptionAssistant
│   └── pages/                 # LoginPage, CustomersPage, DevicesPage, TicketsPage
docs/
├── schema.sql                # Standalone DB setup script (tables + sample data)
├── project-description.md
├── database-design.md
├── architecture.md
└── api-routes.md
```

## Setup Instructions

### 1. Prerequisites

* Node.js and npm
* MySQL Server 8.x running locally

### 2. Install dependencies

```
npm install
```

### 3. Set up the database

```
mysql -u root -p < docs/schema.sql
```

This creates the `smartrepair_db` database, all tables, and a small set of
sample rows for testing.

### 4. Environment variables

Create a `.env` file in the project root (never commit this file):

```
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_mysql_password
DB_NAME=smartrepair_db
PORT=3001
JWT_SECRET=a_long_random_string
# Optional — omit to use a rule-based fallback instead of a real AI call
# ANTHROPIC_API_KEY=
```

### 5. Run the backend

```
npm run dev
```

Server starts at `http://localhost:3001`.

Create your first login account (no seed user is inserted by `schema.sql`
on purpose — passwords must be hashed by the app, not typed into SQL):

```
curl -X POST http://localhost:3001/auth/register \
  -H "Content-Type: application/json" \
  -d '{"full_name":"Your Name","email":"you@example.com","password":"changeme123"}'
```

### 6. Run the frontend

```
cd frontend
npm install
npm run dev
```

Opens at `http://localhost:5173`, proxying API calls to the backend on
`:3001` (see `frontend/vite.config.ts`). Log in with the account you just
registered.

## API Endpoints

| Method | Path | Auth | Description |
|---|---|---|---|
| GET | `/` | — | Health check |
| POST | `/auth/register` | — | Create a login account |
| POST | `/auth/login` | — | Log in, returns a JWT |
| POST | `/auth/logout` | — | Client-side token discard confirmation |
| GET/POST/PUT/DELETE | `/customers`, `/customers/:id` | JWT | Full CRUD on customers |
| GET/POST/PUT/DELETE | `/devices`, `/devices/:id` | JWT | Full CRUD on devices (joined with customer) |
| GET/POST/PUT/DELETE | `/tickets`, `/tickets/:id` | JWT | Full CRUD on repair tickets (joined with customer + device) |
| POST | `/ai/suggest` | JWT | AI-generated issue description from informal text |

Full request/response details in `docs/api-routes.md`.

## Milestones

* **Milestone 1** — Repository setup, project idea, group members, GitHub planning
* **Milestone 2** — Database design, ERD, wireframes, backend route planning
* **Milestone 3** — Backend implementation: Express/TypeScript setup, MySQL connection, GET routes
* **Milestone 4** — Full CRUD (POST, PUT, DELETE) across customers, devices, and tickets; routes/controllers/models structure
* **Milestone 5** — JWT auth (register/login/logout), bcrypt password hashing, login rate limiting, protected routes; React SPA (`frontend/`) with login, route guards, and CRUD forms for every resource; AI-powered issue description assistant
