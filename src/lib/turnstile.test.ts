import { describe, it, expect, vi, afterEach } from "vitest";
import { verifyTurnstileToken } from "./turnstile";

afterEach(() => {
  vi.unstubAllGlobals();
});

describe("verifyTurnstileToken", () => {
  it("returns false immediately for an empty token, without calling the API", async () => {
    const fetchSpy = vi.fn();
    vi.stubGlobal("fetch", fetchSpy);
    const ok = await verifyTurnstileToken("", "secret");
    expect(ok).toBe(false);
    expect(fetchSpy).not.toHaveBeenCalled();
  });

  it("returns true when Cloudflare's siteverify API reports success", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue({ ok: true, json: async () => ({ success: true }) }),
    );
    const ok = await verifyTurnstileToken("valid-token", "secret");
    expect(ok).toBe(true);
  });

  it("returns false when Cloudflare's siteverify API reports failure", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue({ ok: true, json: async () => ({ success: false }) }),
    );
    const ok = await verifyTurnstileToken("invalid-token", "secret");
    expect(ok).toBe(false);
  });

  it("returns false if the siteverify request itself fails", async () => {
    vi.stubGlobal("fetch", vi.fn().mockResolvedValue({ ok: false }));
    const ok = await verifyTurnstileToken("some-token", "secret");
    expect(ok).toBe(false);
  });
});
