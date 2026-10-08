import { z } from "zod";
import { MetricDefinitionSchema } from "@/lib/metrics/schema";

/**
 * Typed contract for the EvalSuite FastAPI service (`/api/v1`).
 * None of these endpoints exist yet. The schemas let the frontend validate
 * responses from day one, so switching from the mock client is a config change.
 *
 * Endpoints:
 *   GET  /api/v1/health
 *   GET  /api/v1/metrics
 *   GET  /api/v1/metrics/{metric_id}
 *   POST /api/v1/evaluate
 *   POST /api/v1/plot        (planned)
 *   POST /api/v1/report      (planned)
 *   POST /api/v1/bootstrap   (planned)
 *   GET  /api/v1/benchmarks  (planned)
 */

export const TASKS = ["binary-classification", "regression"] as const;
export type EvaluationTask = (typeof TASKS)[number];

export const CI_METHODS = ["none", "wilson", "bootstrap-percentile"] as const;
export type CiMethod = (typeof CI_METHODS)[number];

/** Hard limits shared by client-side validation and the future backend. */
export const LIMITS = {
  maxObservations: 5000,
  maxBootstrap: 2000,
  minBootstrap: 100,
} as const;

export const EvaluationRequestSchema = z
  .object({
    task: z.enum(TASKS),
    yTrue: z.array(z.number().finite()).min(2).max(LIMITS.maxObservations),
    yPred: z.array(z.number().finite()).min(2).max(LIMITS.maxObservations),
    yProb: z.array(z.number().min(0).max(1)).max(LIMITS.maxObservations).optional(),
    metrics: z.array(z.string()).min(1),
    confidence: z.object({
      method: z.enum(CI_METHODS),
      level: z.number().gt(0.5).lt(1),
      nBootstrap: z.number().int().min(LIMITS.minBootstrap).max(LIMITS.maxBootstrap),
      randomState: z
        .number()
        .int()
        .min(0)
        .max(2 ** 31 - 1),
    }),
  })
  .superRefine((req, ctx) => {
    if (req.yTrue.length !== req.yPred.length) {
      ctx.addIssue({
        code: "custom",
        path: ["yPred"],
        message: `y_true and y_pred must contain the same number of observations. Received ${req.yTrue.length} and ${req.yPred.length}.`,
      });
    }
    if (req.yProb && req.yProb.length !== req.yTrue.length) {
      ctx.addIssue({
        code: "custom",
        path: ["yProb"],
        message: `y_prob must contain one probability per observation. Received ${req.yProb.length} for ${req.yTrue.length} observations.`,
      });
    }
    if (req.task === "binary-classification") {
      for (const [key, values] of [
        ["yTrue", req.yTrue],
        ["yPred", req.yPred],
      ] as const) {
        if (values.some((v) => v !== 0 && v !== 1)) {
          ctx.addIssue({
            code: "custom",
            path: [key],
            message: "Binary classification labels must be 0 or 1.",
          });
        }
      }
    }
  });

export type EvaluationRequest = z.infer<typeof EvaluationRequestSchema>;

export const ConfidenceIntervalSchema = z.object({
  lower: z.number(),
  upper: z.number(),
  level: z.number(),
  method: z.string(),
});
export type ConfidenceInterval = z.infer<typeof ConfidenceIntervalSchema>;

export const MetricResultSchema = z.object({
  id: z.string(),
  name: z.string(),
  /** null when the metric is undefined for this input (e.g. zero denominator). */
  value: z.number().nullable(),
  note: z.string().optional(),
  interval: ConfidenceIntervalSchema.optional(),
});
export type MetricResult = z.infer<typeof MetricResultSchema>;

export const CurvePointSchema = z.object({ x: z.number(), y: z.number() });

export const EvaluationResultSchema = z.object({
  task: z.enum(TASKS),
  nObservations: z.number().int(),
  metrics: z.array(MetricResultSchema),
  confusionMatrix: z
    .object({ tp: z.number(), fp: z.number(), tn: z.number(), fn: z.number() })
    .optional(),
  rocCurve: z.array(CurvePointSchema).optional(),
  engine: z.object({
    kind: z.enum(["mock", "api", "browser"]),
    label: z.string(),
    version: z.string().nullable(),
  }),
  warnings: z.array(z.string()),
});
export type EvaluationResult = z.infer<typeof EvaluationResultSchema>;

export const HealthSchema = z.object({
  status: z.enum(["ok", "degraded"]),
  version: z.string().nullable(),
});
export type Health = z.infer<typeof HealthSchema>;

export const MetricListSchema = z.array(MetricDefinitionSchema);

export const ApiErrorSchema = z.object({
  error: z.object({ code: z.string(), message: z.string() }),
});
export type ApiErrorBody = z.infer<typeof ApiErrorSchema>;

export class EvaluationClientError extends Error {
  constructor(
    message: string,
    readonly code: "validation" | "unavailable" | "server" | "invalid-response",
  ) {
    super(message);
    this.name = "EvaluationClientError";
  }
}
