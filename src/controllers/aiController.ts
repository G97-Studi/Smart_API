import { Request, Response } from "express";

// Small AI-powered feature (Milestone 5, Section A): given a short,
// informal description of a device problem, ask an AI API to turn it into
// a clear, structured issue description a technician can act on.
//
// Uses the Anthropic API if ANTHROPIC_API_KEY is set in .env. If it's not
// set (e.g. during a live demo without exposing a real key), falls back to
// a canned transformation so the feature still works end-to-end and the
// UI/UX can still be demonstrated and explained.
export async function suggestIssueDescription(req: Request, res: Response) {
    try {
        const rawInput = String(req.body.rawInput || "").trim();

        if (!rawInput) {
            res.status(400).json({ error: "rawInput is required" });
            return;
        }
        if (rawInput.length > 500) {
            res.status(400).json({ error: "rawInput must be 500 characters or fewer" });
            return;
        }

        const apiKey = process.env.ANTHROPIC_API_KEY;

        if (!apiKey) {
            res.status(200).json({
                suggestion: fallbackSuggestion(rawInput),
                source: "fallback",
                note: "ANTHROPIC_API_KEY not set — returning a rule-based suggestion instead of calling the AI API."
            });
            return;
        }

        const response = await fetch("https://api.anthropic.com/v1/messages", {
            method: "POST",
            headers: {
                "content-type": "application/json",
                "x-api-key": apiKey,
                "anthropic-version": "2023-06-01"
            },
            body: JSON.stringify({
                model: "claude-haiku-4-5-20251001",
                max_tokens: 150,
                messages: [{
                    role: "user",
                    content: `A customer described a device problem informally. Rewrite it as one clear, ` +
                        `professional issue description (1-2 sentences) a repair technician can log on a ticket. ` +
                        `Only return the rewritten description, nothing else.\n\nCustomer's words: "${rawInput}"`
                }]
            })
        });

        if (!response.ok) {
            const errText = await response.text();
            console.error("AI API error:", response.status, errText);
            res.status(200).json({
                suggestion: fallbackSuggestion(rawInput),
                source: "fallback",
                note: "AI API call failed — returning a rule-based suggestion instead."
            });
            return;
        }

        const data: any = await response.json();
        const suggestion = data?.content?.[0]?.text?.trim() || fallbackSuggestion(rawInput);

        res.status(200).json({ suggestion, source: "ai" });
    } catch (error: any) {
        console.error("Error generating AI suggestion:", error);
        res.status(500).json({ message: "Failed to generate suggestion", error: error.message });
    }
}

function fallbackSuggestion(rawInput: string): string {
    const cleaned = rawInput.trim().replace(/\s+/g, " ");
    const capitalized = cleaned.charAt(0).toUpperCase() + cleaned.slice(1);
    return `Reported issue: ${capitalized}${capitalized.endsWith(".") ? "" : "."}`;
}
