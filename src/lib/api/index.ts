import { ApiEvaluationClient } from "./api-client";
import type { EvaluationClient } from "./client";
import { MockEvaluationClient } from "./mock-client";

export type { EvaluationClient } from "./client";

/**
 * Select the evaluation backend from public configuration.
 * Falls back to the demo client whenever the API is not fully configured.
 */
export function createEvaluationClient(
  env: { backend?: string; apiBaseUrl?: string } = {
    backend: process.env.NEXT_PUBLIC_EVALUATION_BACKEND,
    apiBaseUrl: process.env.NEXT_PUBLIC_API_BASE_URL,
  },
  getCredential: () => string | null = () => null,
): EvaluationClient {
  if (env.backend === "api" && env.apiBaseUrl) {
    return new ApiEvaluationClient(env.apiBaseUrl, undefined, getCredential);
  }
  return new MockEvaluationClient();
}

/** Base URL of the EvalSuite API, or null when the site runs without a backend. */
export function apiBaseUrl(
  value: string | undefined = process.env.NEXT_PUBLIC_API_BASE_URL,
): string | null {
  if (!value) return null;
  try {
    const url = new URL(value);
    return url.protocol === "https:" || url.protocol === "http:"
      ? url.toString().replace(/\/$/, "")
      : null;
  } catch {
    return null;
  }
}
