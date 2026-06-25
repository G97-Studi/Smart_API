import { Router, Request, Response } from "express";
import pool from "../db";

const router = Router();

// GET all customers
router.get("/", async (_req: Request, res: Response) => {
    try {
        const [rows] = await pool.query("SELECT * FROM Customers");
        res.json(rows);
    } catch (error: any) {
        console.error("Error fetching customers:", error);
        res.status(500).json({ message: "Failed to retrieve customers", error: error.message });
    }
});

// POST a new customer (BONUS)
router.post("/", async (req: Request, res: Response) => {
    try {
        const { full_name, email, phone, address } = req.body;
        
        if (!full_name || !email) {
            res.status(400).json({ error: "full_name and email are required" });
            return;
        }

        const [result]: any = await pool.query(
            "INSERT INTO Customers (full_name, email, phone, address) VALUES (?, ?, ?, ?)",
            [full_name, email, phone, address]
        );

        res.status(201).json({ 
            customer_id: result.insertId, 
            full_name, 
            email, 
            phone, 
            address 
        });
    } catch (error: any) {
        console.error("Error creating customer:", error);
        res.status(500).json({ message: "Failed to create customer", error: error.message });
    }
});

export default router;