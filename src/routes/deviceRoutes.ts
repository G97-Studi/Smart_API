import { Router, Request, Response } from "express";
import pool from "../db";

const router = Router();

// GET all devices
router.get("/", async (_req: Request, res: Response) => {
    try {
        const [rows] = await pool.query(`
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

// POST a new device (BONUS)
router.post("/", async (req: Request, res: Response) => {
    try {
        const { customer_id, device_type, brand, model, serial_number, issue_description } = req.body;
        
        if (!customer_id || !device_type) {
            res.status(400).json({ error: "customer_id and device_type are required" });
            return;
        }

        const [result]: any = await pool.query(
            `INSERT INTO Devices (customer_id, device_type, brand, model, serial_number, issue_description) 
             VALUES (?, ?, ?, ?, ?, ?)`,
            [customer_id, device_type, brand, model, serial_number, issue_description]
        );

        res.status(201).json({ 
            device_id: result.insertId, 
            customer_id, 
            device_type, 
            brand, 
            model, 
            serial_number, 
            issue_description 
        });
    } catch (error: any) {
        console.error("Error creating device:", error);
        res.status(500).json({ message: "Failed to create device", error: error.message });
    }
});

// PUT update an existing device by ID
router.put("/:id", async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const { customer_id, device_type, brand, model, serial_number, issue_description } = req.body;

        if (!customer_id || !device_type) {
            res.status(400).json({ error: "customer_id and device_type are required" });
            return;
        }

        const [result]: any = await pool.query(
            `UPDATE Devices
             SET customer_id = ?, device_type = ?, brand = ?, model = ?, serial_number = ?, issue_description = ?
             WHERE device_id = ?`,
            [customer_id, device_type, brand, model, serial_number, issue_description, id]
        );

        if (result.affectedRows === 0) {
            res.status(404).json({ error: `Device with id ${id} not found` });
            return;
        }

        res.status(200).json({ device_id: Number(id), customer_id, device_type, brand, model, serial_number, issue_description });
    } catch (error: any) {
        console.error("Error updating device:", error);
        res.status(500).json({ message: "Failed to update device", error: error.message });
    }
});

// DELETE a device by ID
router.delete("/:id", async (req: Request, res: Response) => {
    try {
        const { id } = req.params;

        const [result]: any = await pool.query(
            "DELETE FROM Devices WHERE device_id = ?",
            [id]
        );

        if (result.affectedRows === 0) {
            res.status(404).json({ error: `Device with id ${id} not found` });
            return;
        }

        res.status(200).json({ message: `Device with id ${id} deleted` });
    } catch (error: any) {
        console.error("Error deleting device:", error);
        res.status(500).json({ message: "Failed to delete device", error: error.message });
    }
});

export default router;