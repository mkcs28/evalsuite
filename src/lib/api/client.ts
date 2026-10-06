import type { MetricDefinition } from "@/lib/metrics/schema";
import type { EvaluationRequest, EvaluationResult, Health } from "./types";

/**
 * The only interface UI components depend on.
 *
 * Implementations:
 *   MockEvaluationClient     in-browser TypeScript demo (current default)
 *   ApiEvaluationClient      future FastAPI backend
 *   BrowserEvaluationClient  possible future Pyodide runtime (not implemented)
 */
export interface EvaluationClient {
  readonly kind: "mock" | "api" | "browser";
  health(): Promise<Health>;
  listMetrics(): Promise<MetricDefinition[]>;
  getMetric(id: string): Promise<MetricDefinition | null>;
  evaluate(request: EvaluationRequest): Promise<EvaluationResult>;
}
