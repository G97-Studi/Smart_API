import pool from "../db";

export async function getAllDevices() {
    const [rows] = await pool.query(`
        SELECT d.*, c.full_name as customer_name
        FROM Devices d
        LEFT JOIN Customers c ON d.customer_id = c.customer_id
    `);
    return rows;
}

export async function createDevice(
    customer_id: number,
    device_type: string,
    brand: string,
    model: string,
    serial_number: string,
    issue_description: string
): Promise<number> {
    const [result]: any = await pool.query(
        `INSERT INTO Devices (customer_id, device_type, brand, model, serial_number, issue_description)
         VALUES (?, ?, ?, ?, ?, ?)`,
        [customer_id, device_type, brand, model, serial_number, issue_description]
    );
    return result.insertId;
}

export async function updateDevice(
    id: string,
    customer_id: number,
    device_type: string,
    brand: string,
    model: string,
    serial_number: string,
    issue_description: string
): Promise<number> {
    const [result]: any = await pool.query(
        `UPDATE Devices
         SET customer_id = ?, device_type = ?, brand = ?, model = ?, serial_number = ?, issue_description = ?
         WHERE device_id = ?`,
        [customer_id, device_type, brand, model, serial_number, issue_description, id]
    );
    return result.affectedRows;
}

export async function deleteDevice(id: string): Promise<number> {
    const [result]: any = await pool.query(
        "DELETE FROM Devices WHERE device_id = ?",
        [id]
    );
    return result.affectedRows;
}
