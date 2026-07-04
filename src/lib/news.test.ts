import { describe, it, expect } from "vitest";
import { selectPublishedNews, type NewsEntry } from "./news";

function mockEntry(overrides: Partial<NewsEntry["data"]> & { id?: string }): NewsEntry {
  const { id = "post", ...data } = overrides;
  return {
    id,
    collection: "news",
    data: {
      title: "Post",
      date: new Date("2026-01-01"),
      draft: false,
      ...data,
    },
  } as NewsEntry;
}

describe("selectPublishedNews", () => {
  it("excludes draft posts", () => {
    const draft = mockEntry({ id: "draft", draft: true });
    const published = mockEntry({ id: "published", draft: false });
    const result = selectPublishedNews([draft, published]);
    expect(result.map((e) => e.id)).toEqual(["published"]);
  });

  it("sorts published posts newest first", () => {
    const older = mockEntry({ id: "older", date: new Date("2026-01-01") });
    const newer = mockEntry({ id: "newer", date: new Date("2026-06-01") });
    const result = selectPublishedNews([older, newer]);
    expect(result.map((e) => e.id)).toEqual(["newer", "older"]);
  });

  it("returns an empty array when every post is a draft (the current production state)", () => {
    const draft = mockEntry({ id: "esempio-bozza", draft: true });
    expect(selectPublishedNews([draft])).toEqual([]);
  });
});
