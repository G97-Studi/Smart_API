import { Request, Response } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import * as UserModel from "../models/userModel";
import { JWT_SECRET } from "../middleware/auth";
import { resetRateLimit } from "../middleware/rateLimiter";

const SALT_ROUNDS = 10;
const TOKEN_EXPIRY = "2h";

// Very light input validation/sanitization: trims strings, checks a basic
// email shape, and enforces a minimum password length. Good enough for a
// class project; a production app would use a schema validator (zod/joi).
function isValidEmail(email: string): boolean {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

export async function register(req: Request, res: Response) {
    try {
        const full_name = String(req.body.full_name || "").trim();
        const email = String(req.body.email || "").trim().toLowerCase();
        const password = String(req.body.password || "");

        if (!full_name || !email || !password) {
            res.status(400).json({ error: "full_name, email, and password are required" });
            return;
        }
        if (!isValidEmail(email)) {
            res.status(400).json({ error: "Invalid email format" });
            return;
        }
        if (password.length < 8) {
            res.status(400).json({ error: "Password must be at least 8 characters" });
            return;
        }

        const existing = await UserModel.findUserByEmail(email);
        if (existing) {
            res.status(400).json({ error: "An account with this email already exists" });
            return;
        }

        // Never store the plain-text password — only the bcrypt hash.
        const password_hash = await bcrypt.hash(password, SALT_ROUNDS);
        const user_id = await UserModel.createUser(full_name, email, password_hash);

        res.status(201).json({ user_id, full_name, email });
    } catch (error: any) {
        console.error("Error registering user:", error);
        res.status(500).json({ message: "Failed to register user", error: error.message });
    }
}

export async function login(req: Request, res: Response) {
    try {
        const email = String(req.body.email || "").trim().toLowerCase();
        const password = String(req.body.password || "");

        if (!email || !password) {
            res.status(400).json({ error: "email and password are required" });
            return;
        }

        const user = await UserModel.findUserByEmail(email);

        // Same generic error whether the email doesn't exist or the
        // password is wrong — don't leak which one it was.
        if (!user) {
            res.status(401).json({ error: "Invalid email or password" });
            return;
        }

        const passwordMatches = await bcrypt.compare(password, user.password_hash);
        if (!passwordMatches) {
            res.status(401).json({ error: "Invalid email or password" });
            return;
        }

        const token = jwt.sign(
            { user_id: user.user_id, email: user.email },
            JWT_SECRET,
            { expiresIn: TOKEN_EXPIRY }
        );

        resetRateLimit(req);

        res.status(200).json({
            token,
            user: { user_id: user.user_id, full_name: user.full_name, email: user.email }
        });
    } catch (error: any) {
        console.error("Error logging in:", error);
        res.status(500).json({ message: "Failed to log in", error: error.message });
    }
}

// JWTs are stateless, so "logout" has no server-side session to destroy.
// This endpoint exists mainly for a clean, explainable client contract:
// the frontend calls it, then discards its token. (A production system
// wanting real server-side revocation would keep a short-lived token
// blacklist or use refresh tokens — noted here for the viva.)
export async function logout(_req: Request, res: Response) {
    res.status(200).json({ message: "Logged out. Discard the token on the client." });
}
