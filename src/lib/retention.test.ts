import { describe, it, expect } from "vitest";
import { purgeOldSubmissions, RETENTION_DAYS } from "./retention";
import type { D1Like } from "./rate-limit";

function mockDb(): { db: D1Like; calls: { sql: string; args: unknown[] }[] } {
  const calls: { sql: string; args: unknown[] }[] = [];
  const db: D1Like = {
    prepare: (sql: string) => ({
      bind: (...args: unknown[]) => {
        calls.push({ sql, args });
        return {
          first: async <T,>() => null as T | null,
          run: async () => undefined,
        };
      },
    }),
  };
  return { db, calls };
}

describe("purgeOldSubmissions", () => {
  it("deletes rows older than the default retention window", async () => {
    const { db, calls } = mockDb();
    await purgeOldSubmissions(db);
    expect(calls).toHaveLength(1);
    expect(calls[0].sql).toContain("DELETE FROM contact_submissions");
    expect(calls[0].args).toEqual([`-${RETENTION_DAYS} days`]);
  });

  it("accepts a custom retention window", async () => {
    const { db, calls } = mockDb();
    await purgeOldSubmissions(db, 7);
    expect(calls[0].args).toEqual(["-7 days"]);
  });
});
