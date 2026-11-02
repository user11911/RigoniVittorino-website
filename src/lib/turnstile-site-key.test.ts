import { describe, expect, it } from "vitest";
import { PRODUCTION_TURNSTILE_SITE_KEY, TEST_TURNSTILE_SITE_KEY, resolveTurnstileSiteKey } from "./turnstile-site-key";

describe("resolveTurnstileSiteKey", () => {
  it("always uses the real key in production builds", () => {
    expect(resolveTurnstileSiteKey({ DEV: false })).toBe(PRODUCTION_TURNSTILE_SITE_KEY);
  });

  it("ignores a test key left in .env for production builds", () => {
    expect(resolveTurnstileSiteKey({ DEV: false, PUBLIC_TURNSTILE_SITE_KEY: TEST_TURNSTILE_SITE_KEY })).toBe(
      PRODUCTION_TURNSTILE_SITE_KEY,
    );
  });

  it("uses the .env value in dev", () => {
    expect(resolveTurnstileSiteKey({ DEV: true, PUBLIC_TURNSTILE_SITE_KEY: "custom-key" })).toBe("custom-key");
  });

  it("falls back to the test key in dev when .env has none", () => {
    expect(resolveTurnstileSiteKey({ DEV: true })).toBe(TEST_TURNSTILE_SITE_KEY);
    expect(resolveTurnstileSiteKey({ DEV: true, PUBLIC_TURNSTILE_SITE_KEY: "" })).toBe(TEST_TURNSTILE_SITE_KEY);
  });
});
