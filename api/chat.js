// Serverless proxy: browser → this function → Anthropic.
// The API key lives ONLY here, as a Vercel env var (ANTHROPIC_API_KEY).
// It is never shipped to the browser.

const MODEL = "claude-haiku-4-5-20251001"; // cheap + fast; swap to claude-sonnet-4-6 for wittier replies

const ALLOWED_ORIGINS = new Set([
  "https://gobblr.org",
  "https://www.gobblr.org",
  "http://localhost:5280",
  "http://localhost:3000",
]);

export default async function handler(req, res) {
  const origin = req.headers.origin || "";
  if (ALLOWED_ORIGINS.has(origin)) {
    res.setHeader("Access-Control-Allow-Origin", origin);
    res.setHeader("Vary", "Origin");
  }
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "content-type");

  if (req.method === "OPTIONS") return res.status(204).end();
  if (req.method !== "POST") return res.status(405).json({ error: "POST only" });

  const key = process.env.ANTHROPIC_API_KEY;
  if (!key) return res.status(500).json({ error: "Server missing ANTHROPIC_API_KEY" });

  let body;
  try {
    body = typeof req.body === "string" ? JSON.parse(req.body) : req.body || {};
  } catch (_) {
    return res.status(400).json({ error: "Invalid JSON" });
  }

  const { system, messages } = body;
  if (!Array.isArray(messages) || messages.length === 0) {
    return res.status(400).json({ error: "messages[] required" });
  }

  try {
    const r = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "content-type": "application/json",
        "x-api-key": key,
        "anthropic-version": "2023-06-01",
      },
      body: JSON.stringify({
        model: MODEL,
        max_tokens: 220,
        system: system || "You are a friendly turkey on a dating app. Keep replies to 1-2 short, playful texts.",
        messages,
      }),
    });
    const data = await r.json();
    if (!r.ok) {
      return res.status(r.status).json({ error: data?.error?.message || "Anthropic error" });
    }
    const text = (data?.content?.[0]?.text || "").trim();
    return res.status(200).json({ text });
  } catch (_) {
    return res.status(502).json({ error: "Upstream request failed" });
  }
}
