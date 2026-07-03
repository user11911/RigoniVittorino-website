import { describe, it, expect, vi, afterEach } from "vitest";
import { sendEmail, buildNotificationEmail, buildConfirmationEmail } from "./email";

afterEach(() => {
  vi.unstubAllGlobals();
});

describe("sendEmail", () => {
  const message = { to: "a@example.com", from: "b@example.com", subject: "Hi", html: "<p>hi</p>" };

  it("dry-runs (logs, doesn't call fetch) when no API key is configured", async () => {
    const fetchSpy = vi.fn();
    vi.stubGlobal("fetch", fetchSpy);
    const result = await sendEmail(message, undefined);
    expect(result).toEqual({ ok: true, dryRun: true });
    expect(fetchSpy).not.toHaveBeenCalled();
  });

  it("calls the Resend API when a key is configured", async () => {
    const fetchSpy = vi.fn().mockResolvedValue({ ok: true });
    vi.stubGlobal("fetch", fetchSpy);
    const result = await sendEmail(message, "real-key");
    expect(result).toEqual({ ok: true, dryRun: false });
    expect(fetchSpy).toHaveBeenCalledWith(
      "https://api.resend.com/emails",
      expect.objectContaining({ method: "POST" }),
    );
  });

  it("reports failure without throwing when the API errors", async () => {
    vi.stubGlobal("fetch", vi.fn().mockResolvedValue({ ok: false, status: 500, text: async () => "boom" }));
    const result = await sendEmail(message, "real-key");
    expect(result.ok).toBe(false);
    expect(result.dryRun).toBe(false);
  });

  it("reports failure without throwing when fetch itself rejects", async () => {
    vi.stubGlobal("fetch", vi.fn().mockRejectedValue(new Error("network down")));
    const result = await sendEmail(message, "real-key");
    expect(result.ok).toBe(false);
    expect(result.error).toContain("network down");
  });
});

describe("email content builders", () => {
  it("escapes HTML in the notification email to prevent injection", () => {
    const html = buildNotificationEmail({ name: "<script>alert(1)</script>", email: "a@example.com", message: "hi" });
    expect(html).not.toContain("<script>");
    expect(html).toContain("&lt;script&gt;");
  });

  it("includes the submitted message with line breaks preserved", () => {
    const html = buildNotificationEmail({ name: "Mario", email: "a@example.com", message: "line one\nline two" });
    expect(html).toContain("line one<br>line two");
  });

  it("greets the sender by name in the confirmation email", () => {
    const html = buildConfirmationEmail({ name: "Mario" });
    expect(html).toContain("Mario");
  });
});
