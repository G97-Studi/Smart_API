import { Router, Request, Response } from "express";
import pool from "../db";

const router = Router();

// GET all repair tickets
router.get("/", async (_req: Request, res: Response) => {
    try {
        const [rows] = await pool.query(`
            SELECT 
                t.*,
                c.full_name as customer_name,
                c.email as customer_email,
                d.device_type,
                d.brand,
                d.model
            FROM RepairTickets t
            LEFT JOIN Customers c ON t.customer_id = c.customer_id
            LEFT JOIN Devices d ON t.device_id = d.device_id
        `);
        res.json(rows);
    } catch (error: any) {
        console.error("Error fetching tickets:", error);
        res.status(500).json({ message: "Failed to retrieve tickets", error: error.message });
    }
});

// POST a new repair ticket (BONUS)
router.post("/", async (req: Request, res: Response) => {
    try {
        const { customer_id, device_id, issue, status, priority, estimated_cost } = req.body;
        
        if (!customer_id || !device_id || !issue) {
            res.status(400).json({ error: "customer_id, device_id, and issue are required" });
            return;
        }

        const [result]: any = await pool.query(
            `INSERT INTO RepairTickets (customer_id, device_id, issue, status, priority, estimated_cost) 
             VALUES (?, ?, ?, ?, ?, ?)`,
            [customer_id, device_id, issue, status || 'Pending', priority || 'Medium', estimated_cost || 0.00]
        );

        res.status(201).json({ 
            ticket_id: result.insertId, 
            customer_id, 
            device_id, 
            issue, 
            status, 
            priority, 
            estimated_cost 
        });
    } catch (error: any) {
        console.error("Error creating ticket:", error);
        res.status(500).json({ message: "Failed to create ticket", error: error.message });
    }
});

// PUT update an existing repair ticket by ID (e.g. change status/priority/cost)
router.put("/:id", async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const { customer_id, device_id, issue, status, priority, estimated_cost } = req.body;

        if (!customer_id || !device_id || !issue) {
            res.status(400).json({ error: "customer_id, device_id, and issue are required" });
            return;
        }

        const [result]: any = await pool.query(
            `UPDATE RepairTickets
             SET customer_id = ?, device_id = ?, issue = ?, status = ?, priority = ?, estimated_cost = ?
             WHERE ticket_id = ?`,
            [customer_id, device_id, issue, status || 'Pending', priority || 'Medium', estimated_cost || 0.00, id]
        );

        if (result.affectedRows === 0) {
            res.status(404).json({ error: `Ticket with id ${id} not found` });
            return;
        }

        res.status(200).json({ ticket_id: Number(id), customer_id, device_id, issue, status, priority, estimated_cost });
    } catch (error: any) {
        console.error("Error updating ticket:", error);
        res.status(500).json({ message: "Failed to update ticket", error: error.message });
    }
});

// DELETE a repair ticket by ID
router.delete("/:id", async (req: Request, res: Response) => {
    try {
        const { id } = req.params;

        const [result]: any = await pool.query(
            "DELETE FROM RepairTickets WHERE ticket_id = ?",
            [id]
        );

        if (result.affectedRows === 0) {
            res.status(404).json({ error: `Ticket with id ${id} not found` });
            return;
        }

        res.status(200).json({ message: `Ticket with id ${id} deleted` });
    } catch (error: any) {
        console.error("Error deleting ticket:", error);
        res.status(500).json({ message: "Failed to delete ticket", error: error.message });
    }
});

export default router;