import { describe, it, expect } from "vitest";
import { resolveLocaleFromCountry } from "./locale-routing";

describe("resolveLocaleFromCountry", () => {
  it("routes Italy to /it/", () => {
    expect(resolveLocaleFromCountry("IT")).toBe("it");
  });

  it("routes Germany to /de/", () => {
    expect(resolveLocaleFromCountry("DE")).toBe("de");
  });

  it("routes any other country to /en/", () => {
    expect(resolveLocaleFromCountry("US")).toBe("en");
    expect(resolveLocaleFromCountry("GB")).toBe("en");
  });

  it("falls back to /en/ when country is empty, null, or undefined", () => {
    expect(resolveLocaleFromCountry("")).toBe("en");
    expect(resolveLocaleFromCountry(null)).toBe("en");
    expect(resolveLocaleFromCountry(undefined)).toBe("en");
  });

  it("is case-insensitive and trims whitespace, defensively", () => {
    expect(resolveLocaleFromCountry("it")).toBe("it");
    expect(resolveLocaleFromCountry(" DE ")).toBe("de");
  });
});
