# SmartRepair API – Project Description

## Overview

SmartRepair API is a REST backend for a computer repair shop. It lets staff
manage customers, the devices customers bring in for repair, and the repair
tickets tracking each job's status.

The system stores customer information, device details, and repair ticket
records in a MySQL database. Staff can view repair requests, create new
tickets, and (as of Milestone 4) update and delete existing records.

## Goals

- Simplify repair request intake and tracking for a small repair shop
- Keep a clear, queryable history of customers, their devices, and repair work
- Provide a REST API that a future frontend (Milestone 5) can consume

## Key Features

- Customer registration and lookup
- Device tracking, linked to the owning customer
- Repair ticket creation and status tracking
- Full CRUD (Milestone 4) on customers, devices, and tickets

## Technology Stack

- Backend: Node.js, Express, TypeScript
- Database: MySQL (via `mysql2/promise` connection pool)
- Frontend (Milestone 5): React SPA

## Current Status

- Database connection (`src/db.ts`): working, uses a connection pool
- Routes implemented: `GET/POST /customers`, `GET/POST /devices`,
  `GET/POST /tickets`
- Milestone 4 in progress: adding `PUT`/`PATCH` and `DELETE` for each resource
