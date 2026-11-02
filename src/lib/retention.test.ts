import { readFileSync } from "node:fs";
import { DatabaseSync } from "node:sqlite";
import { describe, expect, it } from "vitest";
import type { D1Like } from "./rate-limit";
import { deleteExpiredSubmissions } from "./retention";

// Runs the real migration and query on real SQLite (the engine behind D1), not a mock.
function makeDb() {
  const sqlite = new DatabaseSync(":memory:");
  sqlite.exec(readFileSync("migrations/0001_contact_submissions.sql", "utf8"));
  const d1: D1Like = {
    prepare: (query) => ({
      bind: (...values) => ({
        first: async <T>() => (sqlite.prepare(query).get(...(values as never[])) as T) ?? null,
        run: async () => sqlite.prepare(query).run(...(values as never[])),
      }),
    }),
  };
  const insertAt = (name: string, ...modifiers: string[]) =>
    sqlite
      .prepare(
        `INSERT INTO contact_submissions (name, email, created_at) VALUES (?, 'a@b.it', datetime('now', ?, ?))`,
      )
      .run(name, modifiers[0] ?? "+0 days", modifiers[1] ?? "+0 days");
  const names = () =>
    (sqlite.prepare("SELECT name FROM contact_submissions ORDER BY name").all() as { name: string }[]).map(
      (r) => r.name,
    );
  return { d1, insertAt, names };
}

describe("deleteExpiredSubmissions", () => {
  it("deletes messages older than 24 months and keeps newer ones", async () => {
    const db = makeDb();
    db.insertAt("today");
    db.insertAt("23 months", "-23 months");
    db.insertAt("1 day before cutoff", "-24 months", "+1 day");
    db.insertAt("1 day after cutoff", "-24 months", "-1 day");
    db.insertAt("3 years", "-36 months");

    await deleteExpiredSubmissions(db.d1);

    expect(db.names()).toEqual(["1 day before cutoff", "23 months", "today"]);
  });
});
