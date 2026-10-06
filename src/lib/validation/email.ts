import data from "@/data/personal-email-domains.json";

/** Same allowlist and message as the API (backend/app/personal_email.py). */
const DOMAINS = new Set(data.domains.map((d) => d.toLowerCase()));

export const PERSONAL_EMAIL_MESSAGE =
  "Use a personal email address (for example Gmail, Outlook, Yahoo, iCloud or Proton). Organisation and institutional email addresses are not accepted.";

export const PERSONAL_EMAIL_HINT =
  "Personal email only: Gmail, Outlook, Yahoo, iCloud, Proton and similar.";

const SHAPE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function isValidEmail(email: string): boolean {
  return SHAPE.test(email.trim());
}

export function isPersonalEmail(email: string): boolean {
  const value = email.trim().toLowerCase();
  if (!SHAPE.test(value)) return false;
  return DOMAINS.has(value.slice(value.lastIndexOf("@") + 1));
}

/** Returns an error message, or null when the address is acceptable. */
export function personalEmailError(email: string): string | null {
  if (!isValidEmail(email)) return "Enter a valid email address.";
  return isPersonalEmail(email) ? null : PERSONAL_EMAIL_MESSAGE;
}
