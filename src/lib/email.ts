// Thin wrapper over Resend's HTTP API (no SDK dependency, just fetch — keeps the
// project's dependency footprint as lean as it was after Task 1). If RESEND_API_KEY
// is unset, emails are logged instead of sent: the documented dry-run path TODO.md
// asks for, so tests/local dev work without a real provider account.
export interface EmailMessage {
  to: string;
  from: string;
  subject: string;
  html: string;
  replyTo?: string;
}

export interface SendResult {
  ok: boolean;
  dryRun: boolean;
  error?: string;
}

export async function sendEmail(message: EmailMessage, apiKey: string | undefined): Promise<SendResult> {
  if (!apiKey) {
    console.log("[email:dry-run] would send email:", JSON.stringify(message, null, 2));
    return { ok: true, dryRun: true };
  }

  try {
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: message.from,
        to: [message.to],
        subject: message.subject,
        html: message.html,
        reply_to: message.replyTo,
      }),
    });

    if (!res.ok) {
      const text = await res.text();
      console.error("[email] Resend API error:", res.status, text);
      return { ok: false, dryRun: false, error: `Resend API returned ${res.status}` };
    }

    return { ok: true, dryRun: false };
  } catch (err) {
    console.error("[email] send failed:", err);
    return { ok: false, dryRun: false, error: err instanceof Error ? err.message : "unknown error" };
  }
}

function escapeHtml(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

export function buildNotificationEmail(fields: { name: string; email: string; message: string }): string {
  return `
    <p>Nuovo messaggio ricevuto dal modulo di contatto di rigonivittorino.com/it/contatti/</p>
    <p><strong>Nome:</strong> ${escapeHtml(fields.name)}<br>
    <strong>Email:</strong> ${escapeHtml(fields.email)}</p>
    <p><strong>Messaggio:</strong><br>${escapeHtml(fields.message).replace(/\n/g, "<br>")}</p>
  `.trim();
}

export function buildConfirmationEmail(fields: { name: string }): string {
  return `
    <p>Gentile ${escapeHtml(fields.name)},</p>
    <p>Grazie per averci contattato. Abbiamo ricevuto il tuo messaggio e ti risponderemo al più presto.</p>
    <p>Cordiali saluti,<br>Rigoni Vittorino</p>
  `.trim();
}
