import { Router, Request, Response } from "express";
import pool from "../db";

const router = Router();

// GET all devices
router.get("/", async (_req: Request, res: Response) => {
    try {
        const [rows] = await pool.promise().query(`
            SELECT d.*, c.full_name as customer_name 
            FROM Devices d
            LEFT JOIN Customers c ON d.customer_id = c.customer_id
        `);
        res.json(rows);
    } catch (error: any) {
        console.error("Error fetching devices:", error);
        res.status(500).json({ message: "Failed to retrieve devices", error: error.message });
    }
});


export default router;