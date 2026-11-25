import { describe, it, expect, vi, afterEach } from "vitest";
import { sendEmail, buildNotificationEmail, buildConfirmationEmail, describeSendResult } from "./email";

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

  it("calls the Resend API when a key is configured and returns Resend's email id", async () => {
    const fetchSpy = vi.fn().mockResolvedValue({ ok: true, json: async () => ({ id: "re_123" }) });
    vi.stubGlobal("fetch", fetchSpy);
    const result = await sendEmail(message, "real-key");
    expect(result).toEqual({ ok: true, dryRun: false, id: "re_123" });
    expect(fetchSpy).toHaveBeenCalledWith(
      "https://api.resend.com/emails",
      expect.objectContaining({ method: "POST" }),
    );
  });

  it("still reports success when the accepted response has no readable id", async () => {
    vi.stubGlobal("fetch", vi.fn().mockResolvedValue({ ok: true, json: async () => { throw new Error("bad json"); } }));
    const result = await sendEmail(message, "real-key");
    expect(result).toEqual({ ok: true, dryRun: false, id: undefined });
  });

  it("reports failure with Resend's own error text, without throwing", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue({ ok: false, status: 403, text: async () => '{"message":"domain is not verified"}' }),
    );
    const result = await sendEmail(message, "real-key");
    expect(result.ok).toBe(false);
    expect(result.dryRun).toBe(false);
    expect(result.error).toBe('Resend API returned 403: {"message":"domain is not verified"}');
  });

  it("reports failure without throwing when fetch itself rejects", async () => {
    vi.stubGlobal("fetch", vi.fn().mockRejectedValue(new Error("network down")));
    const result = await sendEmail(message, "real-key");
    expect(result.ok).toBe(false);
    expect(result.error).toContain("network down");
  });
});

describe("describeSendResult", () => {
  it("records Resend's id for a sent email", () => {
    expect(describeSendResult({ ok: true, dryRun: false, id: "re_123" })).toEqual({ status: "sent", detail: "re_123" });
  });
  it("records the error for a failed email", () => {
    expect(describeSendResult({ ok: false, dryRun: false, error: "Resend API returned 500: boom" })).toEqual({
      status: "failed",
      detail: "Resend API returned 500: boom",
    });
  });
  it("records dry-run when no API key is configured", () => {
    expect(describeSendResult({ ok: true, dryRun: true })).toEqual({ status: "dry-run", detail: null });
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
