/**
 * Reference TypeScript implementations used ONLY by the playground demo.
 * They are not EvalSuite and are not a substitute for the Python package.
 * Undefined values (zero denominators) are returned as null, never as 0.
 */

export interface Confusion {
  tp: number;
  fp: number;
  tn: number;
  fn: number;
}

export function safeDivide(num: number, den: number): number | null {
  return den === 0 ? null : num / den;
}

export function confusion(yTrue: readonly number[], yPred: readonly number[]): Confusion {
  const c: Confusion = { tp: 0, fp: 0, tn: 0, fn: 0 };
  for (let i = 0; i < yTrue.length; i++) {
    const t = yTrue[i] === 1;
    const p = yPred[i] === 1;
    if (t && p) c.tp++;
    else if (!t && p) c.fp++;
    else if (!t && !p) c.tn++;
    else c.fn++;
  }
  return c;
}

/** Count-based binary metrics computed from one shared confusion matrix. */
export function countMetrics(c: Confusion) {
  const n = c.tp + c.fp + c.tn + c.fn;
  const precision = safeDivide(c.tp, c.tp + c.fp);
  const recall = safeDivide(c.tp, c.tp + c.fn);
  const specificity = safeDivide(c.tn, c.tn + c.fp);
  const npv = safeDivide(c.tn, c.tn + c.fn);
  const f1 = safeDivide(2 * c.tp, 2 * c.tp + c.fp + c.fn);
  const balanced = recall !== null && specificity !== null ? (recall + specificity) / 2 : null;
  const den = Math.sqrt((c.tp + c.fp) * (c.tp + c.fn) * (c.tn + c.fp) * (c.tn + c.fn));
  const mcc = safeDivide(c.tp * c.tn - c.fp * c.fn, den);
  return {
    accuracy: safeDivide(c.tp + c.tn, n),
    precision,
    recall,
    specificity,
    npv,
    f1,
    balanced,
    mcc,
  };
}

/** ROC curve with tie handling: one point per distinct score threshold. */
export function rocCurve(
  yTrue: readonly number[],
  scores: readonly number[],
): Array<{ x: number; y: number }> {
  const order = scores.map((s, i) => [s, yTrue[i] ?? 0] as const).sort((a, b) => b[0] - a[0]);
  const pos = order.filter(([, y]) => y === 1).length;
  const neg = order.length - pos;
  if (pos === 0 || neg === 0) return [];
  const points = [{ x: 0, y: 0 }];
  let tp = 0;
  let fp = 0;
  for (let i = 0; i < order.length; i++) {
    const entry = order[i]!;
    if (entry[1] === 1) tp++;
    else fp++;
    const next = order[i + 1];
    if (!next || next[0] !== entry[0]) points.push({ x: fp / neg, y: tp / pos });
  }
  return points;
}

/** Trapezoidal area under a curve given as ordered points. */
export function trapezoid(points: ReadonlyArray<{ x: number; y: number }>): number | null {
  if (points.length < 2) return null;
  let area = 0;
  for (let i = 1; i < points.length; i++) {
    const a = points[i - 1]!;
    const b = points[i]!;
    area += ((b.x - a.x) * (a.y + b.y)) / 2;
  }
  return area;
}

export function brierScore(yTrue: readonly number[], prob: readonly number[]): number {
  let s = 0;
  for (let i = 0; i < yTrue.length; i++) s += (prob[i]! - yTrue[i]!) ** 2;
  return s / yTrue.length;
}

export const LOG_LOSS_EPS = 1e-15;
export function logLoss(yTrue: readonly number[], prob: readonly number[]): number {
  let s = 0;
  for (let i = 0; i < yTrue.length; i++) {
    const p = Math.min(Math.max(prob[i]!, LOG_LOSS_EPS), 1 - LOG_LOSS_EPS);
    s += yTrue[i] === 1 ? Math.log(p) : Math.log(1 - p);
  }
  return -s / yTrue.length;
}

export function regressionMetrics(yTrue: readonly number[], yPred: readonly number[]) {
  const n = yTrue.length;
  const errors = yTrue.map((t, i) => t - yPred[i]!);
  const mae = errors.reduce((s, e) => s + Math.abs(e), 0) / n;
  const mse = errors.reduce((s, e) => s + e * e, 0) / n;
  const mean = yTrue.reduce((s, v) => s + v, 0) / n;
  const ssTot = yTrue.reduce((s, v) => s + (v - mean) ** 2, 0);
  const sorted = errors.map(Math.abs).sort((a, b) => a - b);
  const mid = Math.floor(n / 2);
  const medae = n % 2 ? sorted[mid]! : (sorted[mid - 1]! + sorted[mid]!) / 2;
  return { mae, mse, rmse: Math.sqrt(mse), r2: ssTot === 0 ? null : 1 - (mse * n) / ssTot, medae };
}

/** Inverse standard normal CDF (Acklam's rational approximation, |error| < 1.2e-9 after refinement-free use). */
export function normalQuantile(p: number): number {
  if (p <= 0 || p >= 1) throw new RangeError("p must be in (0, 1)");
  const a = [
    -3.969683028665376e1, 2.209460984245205e2, -2.759285104469687e2, 1.38357751867269e2,
    -3.066479806614716e1, 2.506628277459239,
  ];
  const b = [
    -5.447609879822406e1, 1.615858368580409e2, -1.556989798598866e2, 6.680131188771972e1,
    -1.328068155288572e1,
  ];
  const c = [
    -7.784894002430293e-3, -3.223964580411365e-1, -2.400758277161838, -2.549732539343734,
    4.374664141464968, 2.938163982698783,
  ];
  const d = [7.784695709041462e-3, 3.224671290700398e-1, 2.445134137142996, 3.754408661907416];
  const pl = 0.02425;
  const poly = (coef: number[], x: number) => coef.reduce((acc, k) => acc * x + k, 0);
  if (p < pl) {
    const q = Math.sqrt(-2 * Math.log(p));
    return poly(c, q) / (poly(d, q) * q + 1);
  }
  if (p > 1 - pl) {
    const q = Math.sqrt(-2 * Math.log(1 - p));
    return -poly(c, q) / (poly(d, q) * q + 1);
  }
  const q = p - 0.5;
  const r = q * q;
  return (poly(a, r) * q) / (poly(b, r) * r + 1);
}

/** Wilson score interval for k successes in n trials. */
export function wilsonInterval(
  k: number,
  n: number,
  level: number,
): { lower: number; upper: number } | null {
  if (n === 0) return null;
  const z = normalQuantile(1 - (1 - level) / 2);
  const p = k / n;
  const denom = 1 + (z * z) / n;
  const centre = (p + (z * z) / (2 * n)) / denom;
  const half = (z * Math.sqrt((p * (1 - p)) / n + (z * z) / (4 * n * n))) / denom;
  return { lower: Math.max(0, centre - half), upper: Math.min(1, centre + half) };
}

/** Linear-interpolation quantile (Hyndman–Fan type 7) of a sorted array. */
export function quantileSorted(sorted: readonly number[], q: number): number {
  const pos = (sorted.length - 1) * q;
  const lo = Math.floor(pos);
  const hi = Math.ceil(pos);
  return sorted[lo]! + (sorted[hi]! - sorted[lo]!) * (pos - lo);
}
