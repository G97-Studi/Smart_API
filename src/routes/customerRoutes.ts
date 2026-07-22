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

// PUT update an existing customer by ID
router.put("/:id", async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const { full_name, email, phone, address } = req.body;

        if (!full_name || !email) {
            res.status(400).json({ error: "full_name and email are required" });
            return;
        }

        const [result]: any = await pool.query(
            "UPDATE Customers SET full_name = ?, email = ?, phone = ?, address = ? WHERE customer_id = ?",
            [full_name, email, phone, address, id]
        );

        if (result.affectedRows === 0) {
            res.status(404).json({ error: `Customer with id ${id} not found` });
            return;
        }

        res.status(200).json({ customer_id: Number(id), full_name, email, phone, address });
    } catch (error: any) {
        console.error("Error updating customer:", error);
        res.status(500).json({ message: "Failed to update customer", error: error.message });
    }
});

// DELETE a customer by ID
router.delete("/:id", async (req: Request, res: Response) => {
    try {
        const { id } = req.params;

        const [result]: any = await pool.query(
            "DELETE FROM Customers WHERE customer_id = ?",
            [id]
        );

        if (result.affectedRows === 0) {
            res.status(404).json({ error: `Customer with id ${id} not found` });
            return;
        }

        res.status(200).json({ message: `Customer with id ${id} deleted` });
    } catch (error: any) {
        console.error("Error deleting customer:", error);
        res.status(500).json({ message: "Failed to delete customer", error: error.message });
    }
});

export default router;