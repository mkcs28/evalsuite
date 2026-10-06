import { createHmac, timingSafeEqual } from "node:crypto";

/**
 * Verifies download links signed by the API (backend/app/download_tokens.py).
 * Format: base64url(JSON {"exp","f","v"}) + "." + hex HMAC-SHA256(secret, encoded payload).
 * Server-only: imports node:crypto and needs DOWNLOAD_TOKEN_SECRET.
 */
export function verifyDownloadToken(
  token: string,
  version: string,
  filename: string,
  secret: string,
  nowSeconds: number = Date.now() / 1000,
): boolean {
  const dot = token.indexOf(".");
  if (dot <= 0 || !secret) return false;
  const encoded = token.slice(0, dot);
  const mac = token.slice(dot + 1);
  const expected = createHmac("sha256", secret).update(encoded).digest("hex");
  if (mac.length !== expected.length || !timingSafeEqual(Buffer.from(mac), Buffer.from(expected)))
    return false;
  let payload: unknown;
  try {
    payload = JSON.parse(Buffer.from(encoded, "base64url").toString("utf8"));
  } catch {
    return false;
  }
  if (!payload || typeof payload !== "object") return false;
  const p = payload as Record<string, unknown>;
  return p.v === version && p.f === filename && typeof p.exp === "number" && p.exp > nowSeconds;
}
