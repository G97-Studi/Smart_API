import pool from "../db";

export interface User {
    user_id: number;
    full_name: string;
    email: string;
    password_hash: string;
    created_at?: string;
}

export async function findUserByEmail(email: string): Promise<User | null> {
    const [rows]: any = await pool.query(
        "SELECT * FROM Users WHERE email = ?",
        [email]
    );
    return rows.length > 0 ? rows[0] : null;
}

export async function createUser(
    full_name: string,
    email: string,
    password_hash: string
): Promise<number> {
    const [result]: any = await pool.query(
        "INSERT INTO Users (full_name, email, password_hash) VALUES (?, ?, ?)",
        [full_name, email, password_hash]
    );
    return result.insertId;
}
