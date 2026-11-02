import astro from "@astrojs/cloudflare/entrypoints/server";
import type { D1Like } from "./lib/rate-limit";
import { deleteExpiredSubmissions } from "./lib/retention";

// Astro's own handler serves every request unchanged; this only adds the daily cron
// (wrangler.toml [triggers]) that enforces the privacy policy's retention period.
export default {
  fetch: astro.fetch,
  async scheduled(_event: unknown, env: { DB: D1Like }, ctx: { waitUntil(promise: Promise<unknown>): void }) {
    ctx.waitUntil(deleteExpiredSubmissions(env.DB));
  },
};
