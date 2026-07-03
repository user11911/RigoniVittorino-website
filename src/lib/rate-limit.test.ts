import { describe, it, expect } from "vitest";
import { hashIp, isRateLimited, type D1Like } from "./rate-limit";

describe("hashIp", () => {
  it("is deterministic for the same ip/salt", async () => {
    const a = await hashIp("1.2.3.4", "salt");
    const b = await hashIp("1.2.3.4", "salt");
    expect(a).toBe(b);
  });

  it("differs for different IPs", async () => {
    const a = await hashIp("1.2.3.4", "salt");
    const b = await hashIp("5.6.7.8", "salt");
    expect(a).not.toBe(b);
  });

  it("differs for different salts (never trivially reversible without it)", async () => {
    const a = await hashIp("1.2.3.4", "salt-one");
    const b = await hashIp("1.2.3.4", "salt-two");
    expect(a).not.toBe(b);
  });

  it("never returns the raw IP", async () => {
    const hash = await hashIp("1.2.3.4", "salt");
    expect(hash).not.toContain("1.2.3.4");
  });
});

function mockDb(count: number): D1Like {
  return {
    prepare: () => ({
      bind: () => ({
        first: async <T,>() => ({ count }) as T,
        run: async () => undefined,
      }),
    }),
  };
}

describe("isRateLimited", () => {
  it("allows submissions under the threshold", async () => {
    expect(await isRateLimited(mockDb(0), "hash")).toBe(false);
    expect(await isRateLimited(mockDb(2), "hash")).toBe(false);
  });

  it("blocks once the threshold is reached", async () => {
    expect(await isRateLimited(mockDb(3), "hash")).toBe(true);
    expect(await isRateLimited(mockDb(10), "hash")).toBe(true);
  });
});
