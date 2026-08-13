import express from "express";
import customerRoutes from "./routes/customerRoutes";
import ticketRoutes from "./routes/ticketRoutes";
import serviceRoutes from "./routes/serviceRoutes";
import appointmentRoutes from "./routes/appointmentRoutes";
import authRoutes from "./routes/authRoutes";
import deviceRoutes from "./routes/deviceRoutes";

const app = express();



app.use(express.json());

app.use("/auth", authRoutes);
app.use("/customers", customerRoutes);
app.use("/tickets", ticketRoutes);
app.use("/services", serviceRoutes);
app.use("/appointments", appointmentRoutes);
app.use("/devices", deviceRoutes);
const PORT = 3001;

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});

export default app;
