// Verifies a Cloudflare Turnstile token server-side. Cloudflare publishes
// well-known dummy site/secret key pairs specifically for automated testing
// without a real Cloudflare account (see .env.example) — this is what makes the
// "safe local/test mode" requirement possible without inventing a fake mock.
const VERIFY_URL = "https://challenges.cloudflare.com/turnstile/v0/siteverify";

export async function verifyTurnstileToken(token: string, secretKey: string, remoteIp?: string): Promise<boolean> {
  if (!token) return false;

  const body = new URLSearchParams({ secret: secretKey, response: token });
  if (remoteIp) body.set("remoteip", remoteIp);

  const res = await fetch(VERIFY_URL, { method: "POST", body });
  if (!res.ok) return false;

  const data = (await res.json()) as { success: boolean };
  return data.success === true;
}
