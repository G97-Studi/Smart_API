# Database Design

## Choice: MySQL

MySQL was chosen because the data is inherently relational — customers own
devices, devices generate repair tickets — and MySQL gives clean support for
primary keys, foreign keys, and joins, plus straightforward integration with
`mysql2`/Node/TypeScript.

## Tables

### Customers

| Field | Type | Notes |
|---|---|---|
| customer_id | INT, PK, AUTO_INCREMENT | |
| full_name | VARCHAR | |
| email | VARCHAR | |
| phone | VARCHAR | |
| address | VARCHAR | |
| created_at | DATETIME | defaults to current timestamp |

### Devices

| Field | Type | Notes |
|---|---|---|
| device_id | INT, PK, AUTO_INCREMENT | |
| customer_id | INT, FK → Customers.customer_id | |
| device_type | VARCHAR | Laptop, Desktop, Phone, Tablet |
| brand | VARCHAR | |
| model | VARCHAR | |
| serial_number | VARCHAR | |
| issue_description | TEXT | |

### RepairTickets

| Field | Type | Notes |
|---|---|---|
| ticket_id | INT, PK, AUTO_INCREMENT | |
| customer_id | INT, FK → Customers.customer_id | |
| device_id | INT, FK → Devices.device_id | |
| issue | TEXT | |
| status | VARCHAR | e.g. Pending, In Progress, Completed |
| priority | VARCHAR | e.g. Low, Medium, High |
| estimated_cost | DECIMAL | |
| created_at | DATETIME | |
| updated_at | DATETIME | |

### Appointments (planned, not yet implemented in the API)

| Field | Type | Notes |
|---|---|---|
| appointment_id | INT, PK, AUTO_INCREMENT | |
| customer_id | INT, FK → Customers.customer_id | |
| ticket_id | INT, FK → RepairTickets.ticket_id | |
| appointment_date | DATE | |
| appointment_time | TIME | |
| notes | TEXT | |
| status | VARCHAR | |

## Relationships

- One customer → many devices
- One customer → many repair tickets
- One device → many repair tickets
- One customer → many appointments (planned)
- One repair ticket → many appointments (planned)

All foreign key relationships are one-to-many, enforced at the application
level in current routes via `LEFT JOIN` queries (see `docs/api-routes.md`).
Formal `FOREIGN KEY` constraints should be added in the schema/migration
script if not already present.
