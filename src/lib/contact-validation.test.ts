import { describe, it, expect } from "vitest";
import { isHoneypotTripped, validateContactFields, type ContactFields } from "./contact-validation";

function fields(overrides: Partial<ContactFields> = {}): ContactFields {
  return {
    name: "Mario Rossi",
    email: "mario@example.com",
    message: "Ciao, vorrei informazioni.",
    acceptance: true,
    honeypot: "",
    ...overrides,
  };
}

describe("isHoneypotTripped", () => {
  it("is false when the honeypot field is empty", () => {
    expect(isHoneypotTripped("")).toBe(false);
  });

  it("is false when the honeypot field is only whitespace", () => {
    expect(isHoneypotTripped("   ")).toBe(false);
  });

  it("is true when a bot fills in the honeypot field", () => {
    expect(isHoneypotTripped("http://spam.example")).toBe(true);
  });
});

describe("validateContactFields", () => {
  it("accepts a fully valid submission", () => {
    const result = validateContactFields(fields());
    expect(result.valid).toBe(true);
    expect(result.errors).toEqual({});
  });

  it("accepts an empty message (optional field, matching the live site)", () => {
    const result = validateContactFields(fields({ message: "" }));
    expect(result.valid).toBe(true);
  });

  it("rejects a missing name", () => {
    const result = validateContactFields(fields({ name: "" }));
    expect(result.valid).toBe(false);
    expect(result.errors.name).toBeDefined();
  });

  it("rejects a whitespace-only name", () => {
    const result = validateContactFields(fields({ name: "   " }));
    expect(result.valid).toBe(false);
    expect(result.errors.name).toBeDefined();
  });

  it("rejects a missing email", () => {
    const result = validateContactFields(fields({ email: "" }));
    expect(result.valid).toBe(false);
    expect(result.errors.email).toBeDefined();
  });

  it("rejects a malformed email", () => {
    const result = validateContactFields(fields({ email: "not-an-email" }));
    expect(result.valid).toBe(false);
    expect(result.errors.email).toBeDefined();
  });

  it("rejects an unchecked consent checkbox", () => {
    const result = validateContactFields(fields({ acceptance: false }));
    expect(result.valid).toBe(false);
    expect(result.errors.acceptance).toBeDefined();
  });

  it("reports all invalid fields at once, not just the first", () => {
    const result = validateContactFields(fields({ name: "", email: "bad", acceptance: false }));
    expect(result.valid).toBe(false);
    expect(Object.keys(result.errors).sort()).toEqual(["acceptance", "email", "name"]);
  });
});
