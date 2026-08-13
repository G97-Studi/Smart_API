import express from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import db from "../db";

const router = express.Router();

const JWT_SECRET =
    process.env.JWT_SECRET || "smartrepair_secret_key";

// =========================
// REGISTER
// =========================
router.post("/register", async (req, res) => {
    try {
        const { full_name, email, password } = req.body;

        // Validate input
        if (!full_name || !email || !password) {
            return res.status(400).json({
                error: "Full name, email and password are required"
            });
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Insert user
        const sql = `
            INSERT INTO users (full_name, email, password)
            VALUES (?, ?, ?)
        `;

        db.query(
            sql,
            [full_name, email, hashedPassword],
            (err, result) => {
                if (err) {
                    // Duplicate email
                    if ((err as any).code === "ER_DUP_ENTRY") {
                        return res.status(409).json({
                            error: "Email already exists"
                        });
                    }

                    console.error(err);

                    return res.status(500).json({
                        error: "Database error"
                    });
                }

                return res.status(201).json({
                    message: "User registered successfully"
                });
            }
        );

    } catch (error) {
        console.error(error);

        return res.status(500).json({
            error: "Server error"
        });
    }
});


// =========================
// LOGIN
// =========================
router.post("/login", async (req, res) => {
    try {
        const { email, password } = req.body;

        // Validate input
        if (!email || !password) {
            return res.status(400).json({
                error: "Email and password are required"
            });
        }

        // Find user
        const sql = `
            SELECT user_id, full_name, email, password, role
            FROM users
            WHERE email = ?
        `;

        db.query(
            sql,
            [email],
            async (err, results: any[]) => {

                if (err) {
                    console.error(err);

                    return res.status(500).json({
                        error: "Database error"
                    });
                }

                // User doesn't exist
                if (results.length === 0) {
                    return res.status(401).json({
                        error: "Invalid email or password"
                    });
                }

                const user = results[0];

                // Compare password
                const passwordMatch = await bcrypt.compare(
                    password,
                    user.password
                );

                if (!passwordMatch) {
                    return res.status(401).json({
                        error: "Invalid email or password"
                    });
                }

                // Create JWT token
                const token = jwt.sign(
                    {
                        user_id: user.user_id,
                        email: user.email,
                        role: user.role
                    },
                    JWT_SECRET,
                    {
                        expiresIn: "2h"
                    }
                );

                // Successful login
                return res.status(200).json({
                    message: "Login successful",
                    token: token,
                    user: {
                        user_id: user.user_id,
                        full_name: user.full_name,
                        email: user.email,
                        role: user.role
                    }
                });
            }
        );

    } catch (error) {
        console.error(error);

        return res.status(500).json({
            error: "Server error"
        });
    }
});


// Export router
export default router;