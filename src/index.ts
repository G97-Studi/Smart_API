import express from "express";
import cors from "cors";
import dotenv from "dotenv";

// Import route files
import customerRoutes from "./routes/customerRoutes";
import deviceRoutes from "./routes/deviceRoutes";
import ticketRoutes from "./routes/ticketRoutes";
import authRoutes from "./routes/authRoutes";
import { authenticateToken } from "./middleware/auth";

dotenv.config();

const app = express();
const port = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());

// Public routes: no token required
app.use("/auth", authRoutes);

// Root route
app.get("/", (_req, res) => {
    res.json({ message: "SmartRepair API is running!" });
});

// Protected routes
app.use("/customers", authenticateToken, customerRoutes);
app.use("/devices", authenticateToken, deviceRoutes);
app.use("/tickets", authenticateToken, ticketRoutes);

// Start server
app.listen(port, () => {
    console.log(`SmartRepair API running on http://localhost:${port}`);
    console.log(`Available endpoints:`);
    console.log(`  POST /auth/register`);
    console.log(`  POST /auth/login`);
    console.log(`  POST /auth/logout`);
    console.log(`  GET/POST/PUT/DELETE /customers (auth required)`);
    console.log(`  GET/POST/PUT/DELETE /devices (auth required)`);
    console.log(`  GET/POST/PUT/DELETE /tickets (auth required)`);
});