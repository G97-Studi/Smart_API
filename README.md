Milestone 1

Milestone 1 focused on the initial project setup and planning.

The team established:

Project idea
Group members
GitHub repository
Jira planning
Initial project requirements
Milestone 2

Milestone 2 focused on system and database planning.

The team worked on:

Database design
ER diagram
Frontend wireframes
Backend route planning
Project structure
Team responsibilities
Milestone 3

Milestone 3 focused on the initial REST API and backend implementation.

The project was developed using:

Node.js
TypeScript
Express
MySQL

The backend included:

Database connection using db.ts
Separate route files
GET API routes
MySQL database integration
Milestone 4

Milestone 4 extended the backend from basic GET functionality to RESTful CRUD operations.

Backend Improvements

The backend was extended to support:

GET – Retrieve records
POST – Create records
PUT – Update records
DELETE – Delete records

The project uses separate route files for different resources and parameterized SQL queries for database operations.

CRUD Resources

The frontend and backend support CRUD functionality for:

Customers
Devices
Repair Tickets

The API was tested using Postman to verify requests, responses, database changes, and error handling.

Milestone 5

Milestone 5 completed the full-stack SmartRepair application by connecting the React frontend to the backend REST API.

The application now includes a React Single Page Application, authentication, protected routes, CRUD interfaces, API integration, and an AI-assisted component.

React Frontend

The frontend was developed using React, TypeScript, Vite, and React Router.

Main Frontend Components
LoginPage

Provides the user login interface.

Users enter:

Email
Password

After successful authentication, the user is redirected to the application.

AuthContext

Manages authentication state throughout the React application.

It handles:

Login
Logout
JWT token
Authenticated user information
Session storage
ProtectedRoute

Prevents unauthenticated users from accessing protected pages.

If the user is not authenticated, they are redirected to:

/login
Navbar

Provides navigation between the main application sections.

The navigation includes:

Customers
Devices
Tickets
Logout
CustomersPage

Provides customer management functionality.

Users can:

Create customers
View customers
Update customers
Delete customers
DevicesPage

Provides device management functionality.

Users can:

Create devices
View devices
Update devices
Delete devices
Associate devices with customers
TicketsPage

Provides repair ticket management functionality.

Users can:

Create tickets
View tickets
Update tickets
Delete tickets
Select customers
Select devices
Set ticket status
Set ticket priority
Set estimated repair cost
API Client

The frontend uses a centralized API client to communicate with the backend.

The API client:

Sends HTTP requests
Attaches JWT tokens
Handles API errors
Processes API responses
Authentication and Security

SmartRepair uses JWT-based authentication.

Registration

A user can register using:

POST /auth/register

Example request:

{
  "full_name": "John Smith",
  "email": "john@example.com",
  "password": "Password123!"
}

Passwords are hashed using bcrypt before being stored in the database.

Login

Users log in using:

POST /auth/login

Example request:

{
  "email": "john@example.com",
  "password": "Password123!"
}

After successful authentication, the backend returns a JWT token and user information.

Authentication Flow
User enters email and password
             |
             v
       React Login Page
             |
             v
     POST /auth/login
             |
             v
      Express Backend
             |
             v
       MySQL Database
             |
             v
    bcrypt password check
             |
             v
       JWT is generated
             |
             v
    Token returned to React
             |
             v
      sessionStorage
             |
             v
      Protected Routes
             |
             v
    API requests include
       Authorization JWT

The frontend uses sessionStorage to keep the JWT during the browser session.

When the user logs out, the token is removed from sessionStorage.

Protected Routes

Protected routes prevent unauthenticated users from accessing application pages.

The authentication system checks whether a valid authentication token exists.

If the user is not authenticated:

Protected Page
      |
      v
Authenticated?
   /       \
 No         Yes
 |           |
 v           v
Login       Page

Unauthenticated users are redirected to:

/login
API Endpoints
Authentication
Register
POST /auth/register

Creates a new user account.

Login
POST /auth/login

Authenticates a user and returns a JWT token.

Customer Endpoints
GET /customers
POST /customers
PUT /customers/:id
DELETE /customers/:id

These endpoints allow authenticated users to manage customers.

Device Endpoints
GET /devices
POST /devices
PUT /devices/:id
DELETE /devices/:id

These endpoints allow authenticated users to manage customer devices.

Ticket Endpoints
GET /tickets
POST /tickets
PUT /tickets/:id
DELETE /tickets/:id

These endpoints allow authenticated users to manage repair tickets.

Appointment Endpoints
GET /appointments

The appointment endpoint provides appointment information.

Additional appointment operations should only be listed here if they are implemented in the final backend version.

AI Feature

SmartRepair includes an AI-assisted repair description feature.

The AI Description Assistant is integrated directly into the React frontend.

It helps users generate a clearer description of a computer repair issue.

The generated description can be applied directly to the device or repair ticket form without leaving the application.

Error Handling

The application provides meaningful error messages to users.

Examples include:

Invalid login
Missing required fields
Database errors
Duplicate email
Failed API requests
Failed CRUD operations

The frontend displays API errors instead of silently failing.

Database

SmartRepair uses MySQL for persistent data storage.

The database stores application information such as:

Users
Customers
Devices
Repair Tickets
Appointments
Services
Other project-related records

The database schema is provided in the project documentation/schema files.

Database Security

Database queries use parameterized values instead of directly concatenating user input.

This helps reduce SQL injection risks.

Passwords are never stored as plain text.

Passwords are hashed using bcrypt before being inserted into the database.

Environment Variables

Sensitive configuration values should be stored in a local .env file.

Example:

DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_mysql_password
DB_NAME=smartrepair_db
JWT_SECRET=your_secret_key

Do not commit .env to GitHub.

Each team member should configure their own local environment variables.

Use the exact variable names and database name from the final backend configuration.

Installation and Setup
Requirements

Install the following before running the project:

Node.js
npm
MySQL
Git
Clone the Repository
git clone https://github.com/G97-Studi/Smart_API.git

Enter the project directory:

cd Smart_API
Backend Setup

Install backend dependencies:

npm install

Configure the MySQL database and .env file.

Start the backend:

npm run dev

The backend runs on:

http://localhost:3001
Frontend Setup

Open another terminal.

Navigate to the frontend:

cd frontend

Install frontend dependencies:

npm install

Start the React/Vite application:

npm run dev

The frontend normally runs on:

http://localhost:5173
Running the Complete Application

Two terminals should be used.

Terminal 1 – Backend
npm run dev

Backend:

http://localhost:3001
Terminal 2 – Frontend
cd frontend
npm run dev

Frontend:

http://localhost:5173

The architecture is:

React Frontend
localhost:5173
       |
       | HTTP Requests
       v
Express REST API
localhost:3001
       |
       v
MySQL Database
smartrepair_db
Testing

The API was tested using Postman.

Testing included:

User registration
User login
Customer GET
Customer POST
Customer PUT
Customer DELETE
Device GET
Device POST
Device PUT
Device DELETE
Ticket GET
Ticket POST
Ticket PUT
Ticket DELETE

The React frontend was also tested by performing CRUD operations through the user interface.

GitHub Repository
https://github.com/G97-Studi/Smart_API
GitHub Branch

Final individual work was committed to:

gurnoor

The main project repository is:

https://github.com/G97-Studi/Smart_API
Team Contributions

The project was completed as a team with responsibilities divided across database, backend/API, frontend, documentation, testing, and presentation.

Database Work
MySQL database design
Database tables and relationships
Database connection
SQL queries
Database testing
Backend/API Work
Express REST API
TypeScript backend
Route implementation
Authentication
JWT
Password hashing
API testing
Frontend/API integration
Frontend Work
React application
React Router
Login page
Protected routes
Navigation
Customer management
Device management
Ticket management
API client
AI description component
Documentation and Presentation
Project documentation
README
Wireframes
Testing documentation
Presentation preparation
Live demonstration

All members contributed to integration, testing, debugging, and final project preparation.

Update the contribution descriptions with the actual names of the team members before submission.

Future Improvements

Possible future improvements include:

Technician management
Role-based access control
Email notifications
Appointment reminders
Advanced ticket filtering
Improved AI repair assistance
Technician dashboard
Production deployment
Additional security measures
Automated testing
Conclusion

SmartRepair provides a full-stack computer repair booking and ticket management solution.

The project demonstrates:

RESTful API development
MySQL database integration
React SPA development
TypeScript
Express
CRUD operations
JWT authentication
Password hashing
Protected routes
API integration
AI-assisted functionality
GitHub collaboration
Full-stack application development

The final application connects the React frontend with the Express backend and MySQL database to provide an integrated computer repair management system.










\\
