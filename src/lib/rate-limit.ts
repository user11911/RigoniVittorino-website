// Minimal abuse throttle backed by D1 — no extra service (KV/Durable Objects)
// needed for a small business contact form's volume. IPs are hashed (never stored
// raw) per the project's data-minimization rule.

export async function hashIp(ip: string, salt: string): Promise<string> {
  const data = new TextEncoder().encode(`${salt}:${ip}`);
  const digest = await crypto.subtle.digest("SHA-256", data);
  return Array.from(new Uint8Array(digest))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

export interface D1Like {
  prepare(query: string): {
    bind(...values: unknown[]): {
      first<T = unknown>(): Promise<T | null>;
      run(): Promise<unknown>;
    };
  };
}

const WINDOW_MINUTES = 15;
const MAX_SUBMISSIONS_PER_WINDOW = 3;

export async function isRateLimited(db: D1Like, ipHash: string): Promise<boolean> {
  const row = await db
    .prepare(
      `SELECT COUNT(*) as count FROM contact_submissions
       WHERE ip_hash = ? AND created_at >= datetime('now', ?)`,
    )
    .bind(ipHash, `-${WINDOW_MINUTES} minutes`)
    .first<{ count: number }>();

  return (row?.count ?? 0) >= MAX_SUBMISSIONS_PER_WINDOW;
}
