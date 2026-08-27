// Custom Worker entrypoint (see wrangler.toml's `main`), replacing the adapter's
// own auto-generated one. @astrojs/cloudflare's generated entry only ever exports
// `fetch` — this file wraps that same logic via the documented `handle()` helper
// (https://docs.astro.build/en/guides/integrations-guide/cloudflare/, "Custom
// worker entrypoint") so the Worker can also export a `scheduled` handler, which
// the adapter itself has no way to generate.
//
// `scheduled` runs the daily contact-submission retention cleanup declared in
// wrangler.toml's `[triggers]` — see src/lib/retention.ts for the actual query,
// and /it/privacy-policy/'s "Conservazione dei dati" section for the retention
// period this implements (must be kept in sync with RETENTION_DAYS).
import { handle } from "@astrojs/cloudflare/handler";
import { purgeOldSubmissions } from "./lib/retention";

export default {
  async fetch(request, env, ctx) {
    return handle(request, env, ctx);
  },
  async scheduled(_event, env, ctx) {
    ctx.waitUntil(purgeOldSubmissions(env.DB));
  },
} satisfies ExportedHandler<Env>;
