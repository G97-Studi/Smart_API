# SmartRepair API

SmartRepair is a computer repair management application. It helps a repair
shop manage customers, their devices, and repair tickets.

The project has a backend API and a frontend application.

## Project Description

SmartRepair allows users to manage information about customers, devices, and
repair tickets. Users can create, view, update, and delete customer records, device records,
and repair tickets. The application also has a login system. Users must log in before they can
access the main application features. 
The backend was created using Node.js, Express, and TypeScript. MySQL is used
for the database. The frontend was created using React and TypeScript.

## Group Members

Muhammad Noaman Mushtaq  
Backend development, API routes, CRUD operations, and backend planning

Gurnoor Singh  
Database design and database planning

Sona Jasmin  
Frontend design and frontend development

## Technologies Used

Backend

Node.js  
Express  
TypeScript

Database

MySQL  
mysql2

Authentication

JWT  
bcryptjs

Frontend

React  
TypeScript  
Vite

Tools

Git  
GitHub  
Postman

## Project Structure

```text
Smart_API/

src/
│
├── db.ts
├── index.ts
│
├── middleware/
│   ├── auth.ts
│   └── rateLimiter.ts
│
├── routes/
│   ├── authRoutes.ts
│   ├── customerRoutes.ts
│   ├── deviceRoutes.ts
│   └── ticketRoutes.ts
│
├── controllers/
│   ├── authController.ts
│   ├── customerController.ts
│   ├── deviceController.ts
│   └── ticketController.ts
│
└── models/
    ├── userModel.ts
    ├── customerModel.ts
    ├── deviceModel.ts
    └── ticketModel.ts

frontend/

├── src/
│   ├── api/
│   ├── components/
│   ├── context/
│   └── pages/

docs/

├── schema.sql
├── project-description.md
├── database-design.md
├── architecture.md
└── api-routes.md
````

## Main Features

### Login System

The application has a user login system.

Users can register an account and log in using their email and password.

Passwords are protected using bcrypt.

After login, the server gives the user a JWT token.

The token is required when accessing protected API routes.

The application also has login rate limiting to help prevent too many login
attempts.

### Customer Management

Users can:

View all customers

View one customer

Create a new customer

Update customer information

Delete a customer

### Device Management

Users can:

View all devices

View one device

Create a new device

Update device information

Delete a device

Each device is connected to a customer.

### Repair Ticket Management

Users can:

View all repair tickets

View one repair ticket

Create a repair ticket

Update a repair ticket

Delete a repair ticket

Change the ticket status

Change the ticket priority

Update the estimated repair cost

Each repair ticket is connected to a customer and a device.

## Database

The project uses MySQL.

The main tables are:

Users

Customers

Devices

RepairTickets

Appointments is also included in the database design, but it is not used by
the current application routes.

The database setup file is:

```text
docs/schema.sql
```

## How to Run the Project

### Step 1: Install the Requirements

You need:

Node.js

npm

MySQL Server

Git

Make sure MySQL is running before starting the application.

### Step 2: Install Backend Packages

Open PowerShell in the project folder and run:

```powershell
npm install
```

### Step 3: Set Up the Database

Run the database script using MySQL:

```powershell
mysql -u root -p < docs/schema.sql
```

You can also run the `schema.sql` file using MySQL Workbench.

This creates the `smartrepair_db` database and the required tables.

### Step 4: Create the Environment File

Create a file called `.env` in the main project folder.

Add:

```env
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_mysql_password
DB_NAME=smartrepair_db
PORT=3001
JWT_SECRET=your_secret_key
```

Do not upload the `.env` file to GitHub.

### Step 5: Start the Backend

Run:

```powershell
npm run dev
```

The backend will start at:

```text
http://localhost:3001
```

You should see:

```text
SmartRepair API running on http://localhost:3001

Available endpoints:
POST /auth/register
POST /auth/login
POST /auth/logout
GET/POST/PUT/DELETE /customers
GET/POST/PUT/DELETE /devices
GET/POST/PUT/DELETE /tickets
```

### Step 6: Start the Frontend

Open another PowerShell window.

Go to the frontend folder:

```powershell
cd frontend
```

Install the frontend packages:

```powershell
npm install
```

Start the frontend:

```powershell
npm run dev
```

The frontend will normally be available at:

```text
http://localhost:5173
```

## API Endpoints

| Method | Endpoint         | Login Required | Description                 |
| ------ | ---------------- | -------------- | --------------------------- |
| GET    | `/`              | No             | Check if the API is running |
| POST   | `/auth/register` | No             | Create a new user           |
| POST   | `/auth/login`    | No             | Log in and receive a token  |
| POST   | `/auth/logout`   | No             | Log out                     |
| GET    | `/customers`     | Yes            | Get all customers           |
| GET    | `/customers/:id` | Yes            | Get one customer            |
| POST   | `/customers`     | Yes            | Create a customer           |
| PUT    | `/customers/:id` | Yes            | Update a customer           |
| DELETE | `/customers/:id` | Yes            | Delete a customer           |
| GET    | `/devices`       | Yes            | Get all devices             |
| GET    | `/devices/:id`   | Yes            | Get one device              |
| POST   | `/devices`       | Yes            | Create a device             |
| PUT    | `/devices/:id`   | Yes            | Update a device             |
| DELETE | `/devices/:id`   | Yes            | Delete a device             |
| GET    | `/tickets`       | Yes            | Get all repair tickets      |
| GET    | `/tickets/:id`   | Yes            | Get one repair ticket       |
| POST   | `/tickets`       | Yes            | Create a repair ticket      |
| PUT    | `/tickets/:id`   | Yes            | Update a repair ticket      |
| DELETE | `/tickets/:id`   | Yes            | Delete a repair ticket      |

More API information can be found in:

```text
docs/api-routes.md
```

## Authentication

The login system uses JWT.

First, register a user:

```text
POST /auth/register
```

Example:

```json
{
  "full_name": "Test User",
  "email": "test@example.com",
  "password": "Test1234"
}
```

Then log in:

```text
POST /auth/login
```

Example:

```json
{
  "email": "test@example.com",
  "password": "Test1234"
}
```

The server returns a token.

For protected requests, send the token in the Authorization header:

```text
Authorization: Bearer YOUR_TOKEN
```

Without a valid token, the protected routes will return an authentication
error.

## Testing with Postman

Postman can be used to test the API.

The recommended order is:

1. Register a user

```text
POST /auth/register
```

2. Login

```text
POST /auth/login
```

3. Copy the JWT token

4. Add the token to the Authorization header

```text
Bearer YOUR_TOKEN
```

5. Test the customer routes

```text
GET
POST
PUT
DELETE
```

6. Test the device routes

```text
GET
POST
PUT
DELETE
```

7. Test the repair ticket routes

```text
GET
POST
PUT
DELETE
```

## Milestones

### Milestone 1

Project setup

Project idea

GitHub repository

Group planning

### Milestone 2

Database design

ER diagram

Wireframes

API planning

### Milestone 3

Backend setup

Express and TypeScript

MySQL connection

Initial GET routes

### Milestone 4

Full CRUD operations

Customer CRUD

Device CRUD

Repair ticket CRUD

POST requests

PUT requests

DELETE requests

Controllers

Models

API testing with Postman

### Milestone 5

User registration

User login

JWT authentication

Password hashing

Login rate limiting

Protected API routes

React frontend

Login page

Protected pages

Customer management

Device management

Repair ticket management

## Final Project Status

The SmartRepair project is completed with the main backend, database,
authentication system, CRUD operations, and frontend application.

The backend can manage customers, devices, and repair tickets.

The application can be run locally by starting the backend and frontend.

The API can also be tested using Postman.

```
```