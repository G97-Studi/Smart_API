import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

// Augment Express's Request type so req.user is recognized in controllers.
export interface AuthPayload {
    user_id: number;
    email: string;
}

declare global {
    namespace Express {
        interface Request {
            user?: AuthPayload;
        }
    }
}

const JWT_SECRET = process.env.JWT_SECRET || "dev_secret_change_me";

// Reads "Authorization: Bearer <token>", verifies it, and attaches the
// decoded payload to req.user. Any route using this middleware is
// considered protected — no valid token, no access.
export function authenticateToken(req: Request, res: Response, next: NextFunction) {
    const authHeader = req.headers["authorization"];
    const token = authHeader && authHeader.startsWith("Bearer ")
        ? authHeader.slice(7)
        : null;

    if (!token) {
        res.status(401).json({ error: "Missing or malformed Authorization header" });
        return;
    }

    try {
        const payload = jwt.verify(token, JWT_SECRET) as AuthPayload;
        req.user = payload;
        next();
    } catch (error) {
        res.status(403).json({ error: "Invalid or expired token" });
    }
}

export { JWT_SECRET };
