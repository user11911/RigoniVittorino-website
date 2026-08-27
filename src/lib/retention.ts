// Automatic cleanup of old contact-form submissions. Runs on a schedule (see
// src/worker.ts's `scheduled` handler + wrangler.toml's `[triggers]`), not on
// every request — keeps stored submissions bounded to a fixed retention window
// instead of accumulating forever. The window here must match what
// /it/privacy-policy/'s "Conservazione dei dati" section states.
import type { D1Like } from "./rate-limit";

export const RETENTION_DAYS = 30;

export async function purgeOldSubmissions(db: D1Like, days: number = RETENTION_DAYS): Promise<void> {
  await db
    .prepare(`DELETE FROM contact_submissions WHERE created_at < datetime('now', ?)`)
    .bind(`-${days} days`)
    .run();
}
