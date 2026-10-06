import { registry } from "@/lib/metrics/registry";
import type { MetricDefinition } from "@/lib/metrics/schema";
import { mulberry32 } from "@/lib/demo/random";
import {
  brierScore,
  confusion,
  countMetrics,
  logLoss,
  quantileSorted,
  regressionMetrics,
  rocCurve,
  trapezoid,
  wilsonInterval,
} from "@/lib/demo/stats";
import type { EvaluationClient } from "./client";
import {
  EvaluationClientError,
  EvaluationRequestSchema,
  type ConfidenceInterval,
  type EvaluationRequest,
  type EvaluationResult,
  type Health,
  type MetricResult,
} from "./types";

type Data = { yTrue: number[]; yPred: number[]; yProb?: number[] };
type MetricFn = (d: Data) => number | null;

interface DemoMetric {
  id: string;
  name: string;
  task: EvaluationRequest["task"];
  needsProb?: boolean;
  /** For Wilson intervals: successes and trials of the underlying proportion. */
  proportion?: (d: Data) => { k: number; n: number };
  compute: MetricFn;
}

const cm = (d: Data) => confusion(d.yTrue, d.yPred);

/** Metrics the demo can compute. Ids match the EvalSuite registry. */
export const DEMO_METRICS: readonly DemoMetric[] = [
  {
    id: "classification.accuracy",
    name: "Accuracy",
    task: "binary-classification",
    proportion: (d) => {
      const c = cm(d);
      return { k: c.tp + c.tn, n: d.yTrue.length };
    },
    compute: (d) => countMetrics(cm(d)).accuracy,
  },
  {
    id: "classification.precision",
    name: "Precision",
    task: "binary-classification",
    proportion: (d) => {
      const c = cm(d);
      return { k: c.tp, n: c.tp + c.fp };
    },
    compute: (d) => countMetrics(cm(d)).precision,
  },
  {
    id: "classification.recall",
    name: "Recall (sensitivity)",
    task: "binary-classification",
    proportion: (d) => {
      const c = cm(d);
      return { k: c.tp, n: c.tp + c.fn };
    },
    compute: (d) => countMetrics(cm(d)).recall,
  },
  {
    id: "clinical.specificity",
    name: "Specificity",
    task: "binary-classification",
    proportion: (d) => {
      const c = cm(d);
      return { k: c.tn, n: c.tn + c.fp };
    },
    compute: (d) => countMetrics(cm(d)).specificity,
  },
  {
    id: "clinical.npv",
    name: "Negative predictive value",
    task: "binary-classification",
    proportion: (d) => {
      const c = cm(d);
      return { k: c.tn, n: c.tn + c.fn };
    },
    compute: (d) => countMetrics(cm(d)).npv,
  },
  {
    id: "classification.f1",
    name: "F1 score",
    task: "binary-classification",
    compute: (d) => countMetrics(cm(d)).f1,
  },
  {
    id: "classification.balanced_accuracy",
    name: "Balanced accuracy",
    task: "binary-classification",
    compute: (d) => countMetrics(cm(d)).balanced,
  },
  {
    id: "classification.mcc",
    name: "Matthews correlation coefficient",
    task: "binary-classification",
    compute: (d) => countMetrics(cm(d)).mcc,
  },
  {
    id: "classification.roc_auc",
    name: "ROC AUC",
    task: "binary-classification",
    needsProb: true,
    compute: (d) => trapezoid(rocCurve(d.yTrue, d.yProb ?? [])),
  },
  {
    id: "calibration.brier_score",
    name: "Brier score",
    task: "binary-classification",
    needsProb: true,
    compute: (d) => brierScore(d.yTrue, d.yProb ?? []),
  },
  {
    id: "classification.log_loss",
    name: "Log loss",
    task: "binary-classification",
    needsProb: true,
    compute: (d) => logLoss(d.yTrue, d.yProb ?? []),
  },
  {
    id: "regression.mae",
    name: "Mean absolute error",
    task: "regression",
    compute: (d) => regressionMetrics(d.yTrue, d.yPred).mae,
  },
  {
    id: "regression.mse",
    name: "Mean squared error",
    task: "regression",
    compute: (d) => regressionMetrics(d.yTrue, d.yPred).mse,
  },
  {
    id: "regression.rmse",
    name: "Root mean squared error",
    task: "regression",
    compute: (d) => regressionMetrics(d.yTrue, d.yPred).rmse,
  },
  {
    id: "regression.r2",
    name: "R²",
    task: "regression",
    compute: (d) => regressionMetrics(d.yTrue, d.yPred).r2,
  },
  {
    id: "regression.median_absolute_error",
    name: "Median absolute error",
    task: "regression",
    compute: (d) => regressionMetrics(d.yTrue, d.yPred).medae,
  },
];

export function demoMetricsFor(task: EvaluationRequest["task"]): DemoMetric[] {
  return DEMO_METRICS.filter((m) => m.task === task);
}

function bootstrapInterval(
  metric: DemoMetric,
  data: Data,
  req: EvaluationRequest,
): ConfidenceInterval | undefined {
  const rand = mulberry32(req.confidence.randomState);
  const n = data.yTrue.length;
  const values: number[] = [];
  const idx = new Array<number>(n);
  for (let b = 0; b < req.confidence.nBootstrap; b++) {
    for (let i = 0; i < n; i++) idx[i] = Math.floor(rand() * n);
    const sample: Data = {
      yTrue: idx.map((i) => data.yTrue[i]!),
      yPred: idx.map((i) => data.yPred[i]!),
      yProb: data.yProb ? idx.map((i) => data.yProb![i]!) : undefined,
    };
    const v = metric.compute(sample);
    if (v !== null && Number.isFinite(v)) values.push(v);
  }
  if (values.length < req.confidence.nBootstrap * 0.9) return undefined;
  values.sort((a, b) => a - b);
  const alpha = 1 - req.confidence.level;
  return {
    lower: quantileSorted(values, alpha / 2),
    upper: quantileSorted(values, 1 - alpha / 2),
    level: req.confidence.level,
    method: `percentile bootstrap (${req.confidence.nBootstrap} resamples, seed ${req.confidence.randomState})`,
  };
}

/**
 * Demo implementation of EvaluationClient. Runs entirely in the browser and
 * sends no data anywhere. Results come from the TypeScript reference code in
 * lib/demo, NOT from the EvalSuite Python package.
 */
export class MockEvaluationClient implements EvaluationClient {
  readonly kind = "mock" as const;

  async health(): Promise<Health> {
    return { status: "ok", version: null };
  }

  async listMetrics(): Promise<MetricDefinition[]> {
    return [...registry];
  }

  async getMetric(id: string): Promise<MetricDefinition | null> {
    return registry.find((m) => m.id === id) ?? null;
  }

  async evaluate(request: EvaluationRequest): Promise<EvaluationResult> {
    const parsed = EvaluationRequestSchema.safeParse(request);
    if (!parsed.success) {
      throw new EvaluationClientError(
        parsed.error.issues[0]?.message ?? "Invalid request.",
        "validation",
      );
    }
    const req = parsed.data;
    const data: Data = { yTrue: req.yTrue, yPred: req.yPred, yProb: req.yProb };
    const warnings: string[] = [];
    const available = demoMetricsFor(req.task);

    if (req.task === "binary-classification") {
      const positives = req.yTrue.filter((v) => v === 1).length;
      if (positives === 0 || positives === req.yTrue.length) {
        warnings.push(
          "y_true contains a single class. Metrics that need both classes are reported as undefined.",
        );
      }
    }

    const metrics: MetricResult[] = [];
    for (const id of req.metrics) {
      const metric = available.find((m) => m.id === id);
      if (!metric) {
        warnings.push(`${id} is not available in demo mode for this task.`);
        continue;
      }
      if (metric.needsProb && !data.yProb) {
        metrics.push({
          id,
          name: metric.name,
          value: null,
          note: "Requires predicted probabilities (y_prob).",
        });
        continue;
      }
      const value = metric.compute(data);
      const result: MetricResult = {
        id,
        name: metric.name,
        value,
        note: value === null ? "Undefined for this input (zero denominator)." : undefined,
      };
      if (value !== null && req.confidence.method === "wilson") {
        if (metric.proportion) {
          const { k, n } = metric.proportion(data);
          const ci = wilsonInterval(k, n, req.confidence.level);
          if (ci) result.interval = { ...ci, level: req.confidence.level, method: "Wilson score" };
        } else {
          result.note = "Wilson intervals apply to proportions only.";
        }
      }
      if (value !== null && req.confidence.method === "bootstrap-percentile") {
        const ci = bootstrapInterval(metric, data, req);
        if (ci) result.interval = ci;
        else result.note = "Too many bootstrap resamples were undefined to report an interval.";
      }
      metrics.push(result);
    }

    return {
      task: req.task,
      nObservations: req.yTrue.length,
      metrics,
      confusionMatrix:
        req.task === "binary-classification" ? confusion(req.yTrue, req.yPred) : undefined,
      rocCurve:
        req.task === "binary-classification" && data.yProb
          ? rocCurve(data.yTrue, data.yProb)
          : undefined,
      engine: { kind: "mock", label: "In-browser TypeScript demo (not EvalSuite)", version: null },
      warnings,
    };
  }
}
