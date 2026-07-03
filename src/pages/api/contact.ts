// The only server-rendered route in the site — every other page is prerendered
// static HTML (see each page's `export const prerender = true`). Handles
// /it/contatti/'s form submission: honeypot check, server-side validation,
// Turnstile verification, basic rate-limiting, D1 storage, and the two required
// emails (notification to the business, confirmation to the sender).
import type { APIRoute } from "astro";
import { env } from "cloudflare:workers";
import { isHoneypotTripped, parseContactFormData, validateContactFields } from "../../lib/contact-validation";
import { verifyTurnstileToken } from "../../lib/turnstile";
import { hashIp, isRateLimited } from "../../lib/rate-limit";
import { sendEmail, buildNotificationEmail, buildConfirmationEmail } from "../../lib/email";

export const prerender = false;

function json(body: unknown, status: number) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { "content-type": "application/json" },
  });
}

export const POST: APIRoute = async ({ request }) => {

  let formData: FormData;
  try {
    formData = await request.formData();
  } catch {
    return json({ success: false, error: "Richiesta non valida." }, 400);
  }

  const fields = parseContactFormData(formData);

  // Honeypot: real users never fill this in (CSS-hidden field, same one the live
  // site's Contact Form 7 already used). Pretend success so bots don't learn to
  // avoid it.
  if (isHoneypotTripped(fields.honeypot)) {
    return json({ success: true }, 200);
  }

  const { valid, errors } = validateContactFields(fields);
  if (!valid) {
    return json({ success: false, errors }, 400);
  }

  const turnstileToken = String(formData.get("cf-turnstile-response") ?? "");
  const remoteIp = request.headers.get("cf-connecting-ip") ?? undefined;
  const captchaOk = await verifyTurnstileToken(turnstileToken, env.TURNSTILE_SECRET_KEY, remoteIp);
  if (!captchaOk) {
    return json({ success: false, error: "Verifica captcha non riuscita. Riprova." }, 400);
  }

  const ipHash = remoteIp ? await hashIp(remoteIp, env.CONTACT_IP_HASH_SALT) : null;
  if (ipHash && (await isRateLimited(env.DB, ipHash))) {
    return json({ success: false, error: "Troppe richieste. Riprova più tardi." }, 429);
  }

  try {
    await env.DB.prepare(
      `INSERT INTO contact_submissions (name, email, message, ip_hash, status) VALUES (?, ?, ?, ?, 'received')`,
    )
      .bind(fields.name, fields.email, fields.message, ipHash)
      .run();
  } catch (err) {
    console.error("[contact] failed to store submission:", err);
    return json({ success: false, error: "Errore del server. Riprova più tardi." }, 500);
  }

  const [notification, confirmation] = await Promise.all([
    sendEmail(
      {
        to: env.CONTACT_RECIPIENT_EMAIL,
        from: env.CONTACT_FROM_EMAIL,
        subject: `Nuovo messaggio da ${fields.name} - rigonivittorino.com`,
        html: buildNotificationEmail(fields),
        replyTo: fields.email,
      },
      env.RESEND_API_KEY,
    ),
    sendEmail(
      {
        to: fields.email,
        from: env.CONTACT_FROM_EMAIL,
        subject: "Abbiamo ricevuto il tuo messaggio - Rigoni Vittorino",
        html: buildConfirmationEmail(fields),
      },
      env.RESEND_API_KEY,
    ),
  ]);

  if (!notification.ok || !confirmation.ok) {
    // The submission is already safely stored in D1 even if an email failed —
    // don't lose the lead, just tell the operator via logs so it isn't silent.
    console.error("[contact] email send issue:", { notification, confirmation });
  }

  return json({ success: true }, 200);
};
