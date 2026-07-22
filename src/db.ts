import mysql from "mysql2/promise";
import dotenv from "dotenv";

dotenv.config();

// Connection pool instead of a single connection: reuses connections
// across requests instead of opening a new one every time, and queues
// requests instead of failing if all connections are busy.
const pool = mysql.createPool({
    host: process.env.DB_HOST || "localhost",
    user: process.env.DB_USER || "root",
    password: process.env.DB_PASSWORD || "",
    database: process.env.DB_NAME || "smartrepair_db",
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

export default pool;
