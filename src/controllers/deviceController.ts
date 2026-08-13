import { Request, Response } from "express";
import * as DeviceModel from "../models/deviceModel";

export async function getDevices(_req: Request, res: Response) {
    try {
        const devices = await DeviceModel.getAllDevices();
        res.json(devices);
    } catch (error: any) {
        console.error("Error fetching devices:", error);
        res.status(500).json({ message: "Failed to retrieve devices", error: error.message });
    }
}

export async function createDevice(req: Request, res: Response) {
    try {
        const { customer_id, device_type, brand, model, serial_number, issue_description } = req.body;

        if (!customer_id || !device_type) {
            res.status(400).json({ error: "customer_id and device_type are required" });
            return;
        }

        const device_id = await DeviceModel.createDevice(
            customer_id, device_type, brand, model, serial_number, issue_description
        );
        res.status(201).json({ device_id, customer_id, device_type, brand, model, serial_number, issue_description });
    } catch (error: any) {
        console.error("Error creating device:", error);
        res.status(500).json({ message: "Failed to create device", error: error.message });
    }
}

export async function updateDevice(req: Request, res: Response) {
    try {
        const id = String(req.params.id);
        const { customer_id, device_type, brand, model, serial_number, issue_description } = req.body;

        if (!customer_id || !device_type) {
            res.status(400).json({ error: "customer_id and device_type are required" });
            return;
        }

        const affectedRows = await DeviceModel.updateDevice(
            id, customer_id, device_type, brand, model, serial_number, issue_description
        );

        if (affectedRows === 0) {
            res.status(404).json({ error: `Device with id ${id} not found` });
            return;
        }

        res.status(200).json({ device_id: Number(id), customer_id, device_type, brand, model, serial_number, issue_description });
    } catch (error: any) {
        console.error("Error updating device:", error);
        res.status(500).json({ message: "Failed to update device", error: error.message });
    }
}

export async function deleteDevice(req: Request, res: Response) {
    try {
        const id = String(req.params.id);
        const affectedRows = await DeviceModel.deleteDevice(id);

        if (affectedRows === 0) {
            res.status(404).json({ error: `Device with id ${id} not found` });
            return;
        }

        res.status(200).json({ message: `Device with id ${id} deleted` });
    } catch (error: any) {
        console.error("Error deleting device:", error);
        res.status(500).json({ message: "Failed to delete device", error: error.message });
    }
}
