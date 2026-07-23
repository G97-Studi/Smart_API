import express from "express";
import cors from "cors";
import dotenv from "dotenv";

// Import route files
import customerRoutes from "./routes/customerRoutes";
import deviceRoutes from "./routes/deviceRoutes";
import ticketRoutes from "./routes/ticketRoutes";

dotenv.config();

const app = express();
const port = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());

// Register routes
app.use("/customers", customerRoutes);
app.use("/devices", deviceRoutes);
app.use("/tickets", ticketRoutes);

// Root route
app.get("/", (_req, res) => {
    res.json({ message: "SmartRepair API is running!" });
});

// Start server
app.listen(port, () => {
    console.log(`✅ SmartRepair API running on http://localhost:${port}`);
    console.log(`\n📋 Available endpoints:`);
    console.log(`  GET  /customers`);
    console.log(`  POST /customers (bonus)`);
    console.log(`  GET  /devices`);
    console.log(`  POST /devices (bonus)`);
    console.log(`  GET  /tickets`);
    console.log(`  POST /tickets (bonus)`);
});