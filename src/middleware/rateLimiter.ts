import { Request, Response, NextFunction } from "express";

// Simple in-memory rate limiter for the login route. Not distributed /
// production-grade (a restart clears it, and it won't scale across
// multiple server instances) but it's enough to demonstrate the concept
// and stop naive brute-force attempts for a class project.
const attempts = new Map<string, { count: number; firstAttempt: number }>();

const WINDOW_MS = 15 * 60 * 1000; // 15 minutes
const MAX_ATTEMPTS = 5;

export function loginRateLimiter(req: Request, res: Response, next: NextFunction) {
    const key = req.ip || "unknown";
    const now = Date.now();
    const record = attempts.get(key);

    if (!record || now - record.firstAttempt > WINDOW_MS) {
        attempts.set(key, { count: 1, firstAttempt: now });
        next();
        return;
    }

    if (record.count >= MAX_ATTEMPTS) {
        const retryAfterMs = WINDOW_MS - (now - record.firstAttempt);
        res.status(429).json({
            error: "Too many login attempts. Try again later.",
            retryAfterSeconds: Math.ceil(retryAfterMs / 1000)
        });
        return;
    }

    record.count += 1;
    next();
}

// Call this after a successful login to reset the counter for that IP.
export function resetRateLimit(req: Request) {
    const key = req.ip || "unknown";
    attempts.delete(key);
}
