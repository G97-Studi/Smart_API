import { Request, Response } from "express";
import * as TicketModel from "../models/ticketModel";

export async function getTickets(_req: Request, res: Response) {
    try {
        const tickets = await TicketModel.getAllTickets();
        res.json(tickets);
    } catch (error: any) {
        console.error("Error fetching tickets:", error);
        res.status(500).json({ message: "Failed to retrieve tickets", error: error.message });
    }
}

export async function createTicket(req: Request, res: Response) {
    try {
        const { customer_id, device_id, issue, status, priority, estimated_cost } = req.body;

        if (!customer_id || !device_id || !issue) {
            res.status(400).json({ error: "customer_id, device_id, and issue are required" });
            return;
        }

        const ticket_id = await TicketModel.createTicket(
            customer_id, device_id, issue, status, priority, estimated_cost
        );
        res.status(201).json({ ticket_id, customer_id, device_id, issue, status, priority, estimated_cost });
    } catch (error: any) {
        console.error("Error creating ticket:", error);
        res.status(500).json({ message: "Failed to create ticket", error: error.message });
    }
}

export async function updateTicket(req: Request, res: Response) {
    try {
        const id = String(req.params.id);
        const { customer_id, device_id, issue, status, priority, estimated_cost } = req.body;

        if (!customer_id || !device_id || !issue) {
            res.status(400).json({ error: "customer_id, device_id, and issue are required" });
            return;
        }

        const affectedRows = await TicketModel.updateTicket(
            id, customer_id, device_id, issue, status, priority, estimated_cost
        );

        if (affectedRows === 0) {
            res.status(404).json({ error: `Ticket with id ${id} not found` });
            return;
        }

        res.status(200).json({ ticket_id: Number(id), customer_id, device_id, issue, status, priority, estimated_cost });
    } catch (error: any) {
        console.error("Error updating ticket:", error);
        res.status(500).json({ message: "Failed to update ticket", error: error.message });
    }
}

export async function deleteTicket(req: Request, res: Response) {
    try {
        const id = String(req.params.id);
        const affectedRows = await TicketModel.deleteTicket(id);

        if (affectedRows === 0) {
            res.status(404).json({ error: `Ticket with id ${id} not found` });
            return;
        }

        res.status(200).json({ message: `Ticket with id ${id} deleted` });
    } catch (error: any) {
        console.error("Error deleting ticket:", error);
        res.status(500).json({ message: "Failed to delete ticket", error: error.message });
    }
}
