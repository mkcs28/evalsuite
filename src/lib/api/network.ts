import { EvaluationClientError } from "./types";

/**
 * fetch() that retries once after a short pause when the request fails at the network level.
 * Free API hosts sleep when idle; the first request can fail while the server wakes up.
 * A browser CORS rejection also surfaces as a network failure, so the final message names the
 * API address and the two usual causes.
 */
export async function fetchApi(
  base: string,
  url: string,
  init: RequestInit,
  fetchImpl: typeof fetch = globalThis.fetch.bind(globalThis),
  retryDelayMs = 3000,
): Promise<Response> {
  for (let attempt = 0; ; attempt++) {
    try {
      return await fetchImpl(url, init);
    } catch {
      if (attempt >= 1) throw new EvaluationClientError(unreachableMessage(base), "unavailable");
      await new Promise((r) => setTimeout(r, retryDelayMs));
    }
  }
}

export function unreachableMessage(base: string): string {
  let host = base;
  try {
    host = new URL(base).host;
  } catch {
    // keep the raw value
  }
  return (
    `Could not reach the EvalSuite API (${host}). If the site has been idle, the free server may still be ` +
    "waking up: wait a minute and try again. If it keeps failing, the API may not be running or may not " +
    "allow requests from this website's address."
  );
}
