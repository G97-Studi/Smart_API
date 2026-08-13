import pool from "../db";

export async function getAllTickets() {
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
    return rows;
}

export async function createTicket(
    customer_id: number,
    device_id: number,
    issue: string,
    status: string,
    priority: string,
    estimated_cost: number
): Promise<number> {
    const [result]: any = await pool.query(
        `INSERT INTO RepairTickets (customer_id, device_id, issue, status, priority, estimated_cost)
         VALUES (?, ?, ?, ?, ?, ?)`,
        [customer_id, device_id, issue, status || "Pending", priority || "Medium", estimated_cost || 0.0]
    );
    return result.insertId;
}

export async function updateTicket(
    id: string,
    customer_id: number,
    device_id: number,
    issue: string,
    status: string,
    priority: string,
    estimated_cost: number
): Promise<number> {
    const [result]: any = await pool.query(
        `UPDATE RepairTickets
         SET customer_id = ?, device_id = ?, issue = ?, status = ?, priority = ?, estimated_cost = ?
         WHERE ticket_id = ?`,
        [customer_id, device_id, issue, status || "Pending", priority || "Medium", estimated_cost || 0.0, id]
    );
    return result.affectedRows;
}

export async function deleteTicket(id: string): Promise<number> {
    const [result]: any = await pool.query(
        "DELETE FROM RepairTickets WHERE ticket_id = ?",
        [id]
    );
    return result.affectedRows;
}
