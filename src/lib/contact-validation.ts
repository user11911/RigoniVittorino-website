// Pure validation logic for the /it/contatti/ form, kept separate from the API
// route so it's directly unit-testable (see src/lib/contact-validation.test.ts).
//
// Field set mirrors the live site's Contact Form 7 markup exactly (see
// src/content/main/contatti.html): your-name and your-email are required,
// your-message is optional (matches the live site — it has no
// "wpcf7-validates-as-required" class), acceptance-698 is a required consent
// checkbox. Error copy follows Contact Form 7's standard Italian default
// messages — the live site shows no evidence of customized validation strings
// (see IMPLEMENTATION_NOTES.md for how that was checked and why this is a
// documented assumption, not a verified fact).

export interface ContactFields {
  name: string;
  email: string;
  message: string;
  acceptance: boolean;
  honeypot: string;
}

export interface ValidationResult {
  valid: boolean;
  errors: Partial<Record<keyof ContactFields, string>>;
}

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function isHoneypotTripped(honeypot: string): boolean {
  return honeypot.trim() !== "";
}

export function validateContactFields(fields: ContactFields): ValidationResult {
  const errors: ValidationResult["errors"] = {};

  if (!fields.name.trim()) {
    errors.name = "Questo campo è obbligatorio.";
  }

  if (!fields.email.trim()) {
    errors.email = "Questo campo è obbligatorio.";
  } else if (!EMAIL_RE.test(fields.email.trim())) {
    errors.email = "Inserisci un indirizzo email valido.";
  }

  if (!fields.acceptance) {
    errors.acceptance = "Devi accettare il trattamento dei dati personali per procedere.";
  }

  return { valid: Object.keys(errors).length === 0, errors };
}

export function parseContactFormData(formData: FormData): ContactFields {
  return {
    name: String(formData.get("your-name") ?? "").trim(),
    email: String(formData.get("your-email") ?? "").trim(),
    message: String(formData.get("your-message") ?? "").trim(),
    acceptance: formData.get("acceptance-698") != null,
    honeypot: String(formData.get("mail-9") ?? ""),
  };
}
