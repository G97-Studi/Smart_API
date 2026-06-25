<<<<<<< HEAD
import mysql from "mysql2/promise";
import dotenv from "dotenv";

dotenv.config();

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
=======
import mysql from "mysql2";

const connection = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "",
    database: "smartrepair_db"
});

connection.connect((err) => {
    if (err) {
        console.error("Database connection failed:", err);
        return;
    }
    console.log("Connected to MySQL!");
});

export default connection;
>>>>>>> b8d729a4e9603309bc306121a340c18a9c4ae9d6
