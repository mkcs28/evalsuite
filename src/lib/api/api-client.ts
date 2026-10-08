import type { z } from "zod";
import type { MetricDefinition } from "@/lib/metrics/schema";
import { MetricDefinitionSchema } from "@/lib/metrics/schema";
import type { EvaluationClient } from "./client";
import {
  ApiErrorSchema,
  EvaluationClientError,
  EvaluationRequestSchema,
  EvaluationResultSchema,
  HealthSchema,
  MetricListSchema,
  type EvaluationRequest,
  type EvaluationResult,
  type Health,
} from "./types";

const TIMEOUT_MS = 30_000;

/**
 * Client for the EvalSuite FastAPI service.
 * Not used by default: the backend does not exist yet. Enable with
 * NEXT_PUBLIC_EVALUATION_BACKEND=api and NEXT_PUBLIC_API_BASE_URL.
 */
export class ApiEvaluationClient implements EvaluationClient {
  readonly kind = "api" as const;
  private readonly baseUrl: string;

  constructor(
    baseUrl: string,
    private readonly fetchImpl: typeof fetch = globalThis.fetch.bind(globalThis),
    /** Returns a dashboard session token or personal API key, if any. */
    private readonly getCredential: () => string | null = () => null,
  ) {
    const url = new URL(baseUrl);
    if (url.protocol !== "https:" && url.protocol !== "http:") {
      throw new EvaluationClientError("API base URL must use http or https.", "validation");
    }
    this.baseUrl = url.toString().replace(/\/$/, "");
  }

  private async request<S extends z.ZodType>(
    path: string,
    schema: S,
    init?: RequestInit,
  ): Promise<z.infer<S>> {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), TIMEOUT_MS);
    let response: Response;
    try {
      response = await this.fetchImpl(`${this.baseUrl}/api/v1${path}`, {
        ...init,
        signal: controller.signal,
        credentials: "omit",
        headers: {
          Accept: "application/json",
          ...(init?.body ? { "Content-Type": "application/json" } : {}),
          ...(this.getCredential() ? { Authorization: `Bearer ${this.getCredential()}` } : {}),
        },
      });
    } catch {
      throw new EvaluationClientError(
        "The EvalSuite API is unavailable. Check your connection or try again later.",
        "unavailable",
      );
    } finally {
      clearTimeout(timer);
    }

    let body: unknown;
    try {
      body = await response.json();
    } catch {
      throw new EvaluationClientError(
        "The EvalSuite API returned a response that is not JSON.",
        "invalid-response",
      );
    }

    if (!response.ok) {
      const parsed = ApiErrorSchema.safeParse(body);
      const message = parsed.success
        ? parsed.data.error.message
        : `Request failed with status ${response.status}.`;
      throw new EvaluationClientError(message, response.status < 500 ? "validation" : "server");
    }

    const parsed = schema.safeParse(body);
    if (!parsed.success) {
      throw new EvaluationClientError(
        "The EvalSuite API returned data in an unexpected format.",
        "invalid-response",
      );
    }
    return parsed.data;
  }

  health(): Promise<Health> {
    return this.request("/health", HealthSchema);
  }

  listMetrics(): Promise<MetricDefinition[]> {
    return this.request("/metrics", MetricListSchema);
  }

  async getMetric(id: string): Promise<MetricDefinition | null> {
    try {
      return await this.request(`/metrics/${encodeURIComponent(id)}`, MetricDefinitionSchema);
    } catch (error) {
      if (error instanceof EvaluationClientError && error.code === "validation") return null;
      throw error;
    }
  }

  evaluate(request: EvaluationRequest): Promise<EvaluationResult> {
    const valid = EvaluationRequestSchema.safeParse(request);
    if (!valid.success) {
      return Promise.reject(
        new EvaluationClientError(
          valid.error.issues[0]?.message ?? "Invalid request.",
          "validation",
        ),
      );
    }
    return this.request("/evaluate", EvaluationResultSchema, {
      method: "POST",
      body: JSON.stringify(valid.data),
    });
  }
}
