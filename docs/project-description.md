# SmartRepair API – Project Description

## Overview

SmartRepair API is a REST backend for a computer repair shop. It lets staff
manage customers, the devices customers bring in for repair, and the repair
tickets tracking each job's status.

The system stores customer information, device details, and repair ticket
records in a MySQL database. Staff can view repair requests, create new
tickets, and (as of Milestone 4) update and delete existing records. As of
Milestone 5, staff access the system through a login-protected React
single-page application rather than calling the API directly.

## Goals

- Simplify repair request intake and tracking for a small repair shop
- Keep a clear, queryable history of customers, their devices, and repair work
- Provide a REST API that a future frontend (Milestone 5) can consume

## Key Features

- Customer registration and lookup
- Device tracking, linked to the owning customer
- Repair ticket creation and status tracking
- Full CRUD (Milestone 4) on customers, devices, and tickets
- JWT-based login, protected routes, and hashed passwords (Milestone 5)
- React SPA with forms for every CRUD operation (Milestone 5)
- Small AI-powered assistant that turns an informal complaint into a clean
  issue description (Milestone 5)

## Technology Stack

- Backend: Node.js, Express, TypeScript
- Database: MySQL (via `mysql2/promise` connection pool)
- Auth: JSON Web Tokens (`jsonwebtoken`), password hashing (`bcryptjs`)
- Frontend: React + TypeScript SPA (Vite, React Router)

## Current Status

- Database connection (`src/db.ts`): working, uses a connection pool
- Milestone 3: `GET` routes for customers, devices, tickets — complete
- Milestone 4: full CRUD (`GET`/`POST`/`PUT`/`DELETE`) on all three
  resources — complete
- Milestone 5: `/auth` routes, JWT-protected CRUD/AI routes, login rate
  limiting, React SPA (`frontend/`) with login, protected routes, and
  CRUD forms, AI issue-description assistant — complete
