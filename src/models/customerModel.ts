import pool from "../db";

// Each function here does exactly one thing: run one SQL query and
// return the result. No request/response handling, no status codes —
// that belongs in the controller.

export async function getAllCustomers() {
    const [rows] = await pool.query("SELECT * FROM Customers");
    return rows;
}

export async function createCustomer(
    full_name: string,
    email: string,
    phone: string,
    address: string
): Promise<number> {
    const [result]: any = await pool.query(
        "INSERT INTO Customers (full_name, email, phone, address) VALUES (?, ?, ?, ?)",
        [full_name, email, phone, address]
    );
    return result.insertId;
}

export async function updateCustomer(
    id: string,
    full_name: string,
    email: string,
    phone: string,
    address: string
): Promise<number> {
    const [result]: any = await pool.query(
        "UPDATE Customers SET full_name = ?, email = ?, phone = ?, address = ? WHERE customer_id = ?",
        [full_name, email, phone, address, id]
    );
    return result.affectedRows;
}

export async function deleteCustomer(id: string): Promise<number> {
    const [result]: any = await pool.query(
        "DELETE FROM Customers WHERE customer_id = ?",
        [id]
    );
    return result.affectedRows;
}
