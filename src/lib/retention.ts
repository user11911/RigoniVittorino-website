import type { D1Like } from "./rate-limit";

// Must match the period stated in the privacy policy (src/content/main/privacy-policy.html).
export const RETENTION_MONTHS = 24;

export async function deleteExpiredSubmissions(db: D1Like): Promise<void> {
  await db
    .prepare(`DELETE FROM contact_submissions WHERE created_at < datetime('now', ?)`)
    .bind(`-${RETENTION_MONTHS} months`)
    .run();
}
