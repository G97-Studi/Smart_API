import { Request, Response } from "express";
import * as CustomerModel from "../models/customerModel";

export async function getCustomers(_req: Request, res: Response) {
    try {
        const customers = await CustomerModel.getAllCustomers();
        res.json(customers);
    } catch (error: any) {
        console.error("Error fetching customers:", error);
        res.status(500).json({ message: "Failed to retrieve customers", error: error.message });
    }
}

export async function createCustomer(req: Request, res: Response) {
    try {
        const { full_name, email, phone, address } = req.body;

        if (!full_name || !email) {
            res.status(400).json({ error: "full_name and email are required" });
            return;
        }

        const customer_id = await CustomerModel.createCustomer(full_name, email, phone, address);
        res.status(201).json({ customer_id, full_name, email, phone, address });
    } catch (error: any) {
        console.error("Error creating customer:", error);
        res.status(500).json({ message: "Failed to create customer", error: error.message });
    }
}

export async function updateCustomer(req: Request, res: Response) {
    try {
        const id = String(req.params.id);
        const { full_name, email, phone, address } = req.body;

        if (!full_name || !email) {
            res.status(400).json({ error: "full_name and email are required" });
            return;
        }

        const affectedRows = await CustomerModel.updateCustomer(id, full_name, email, phone, address);

        if (affectedRows === 0) {
            res.status(404).json({ error: `Customer with id ${id} not found` });
            return;
        }

        res.status(200).json({ customer_id: Number(id), full_name, email, phone, address });
    } catch (error: any) {
        console.error("Error updating customer:", error);
        res.status(500).json({ message: "Failed to update customer", error: error.message });
    }
}

export async function deleteCustomer(req: Request, res: Response) {
    try {
        const id = String(req.params.id);
        const affectedRows = await CustomerModel.deleteCustomer(id);

        if (affectedRows === 0) {
            res.status(404).json({ error: `Customer with id ${id} not found` });
            return;
        }

        res.status(200).json({ message: `Customer with id ${id} deleted` });
    } catch (error: any) {
        console.error("Error deleting customer:", error);
        res.status(500).json({ message: "Failed to delete customer", error: error.message });
    }
}
