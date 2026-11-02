// Public by design (it's printed in the page HTML) — not a secret.
export const PRODUCTION_TURNSTILE_SITE_KEY = "0x4AAAAAAEXYOfUMl66qOXVG";

// Cloudflare's published "always passes" test key; the real key only works on the real domain.
export const TEST_TURNSTILE_SITE_KEY = "1x00000000000000000000AA";

// Production builds ignore .env on purpose: a copied .env.example (test key) on the deploy
// machine previously shipped the test widget to production.
export function resolveTurnstileSiteKey(env: { DEV: boolean; PUBLIC_TURNSTILE_SITE_KEY?: string }): string {
  if (env.DEV) return env.PUBLIC_TURNSTILE_SITE_KEY || TEST_TURNSTILE_SITE_KEY;
  return PRODUCTION_TURNSTILE_SITE_KEY;
}
