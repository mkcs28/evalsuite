import {
  brierScore,
  confusion,
  countMetrics,
  normalQuantile,
  quantileSorted,
  regressionMetrics,
  rocCurve,
  trapezoid,
  wilsonInterval,
} from "@/lib/demo/stats";

describe("demo reference statistics", () => {
  const yTrue = [1, 1, 1, 0, 0, 0, 0, 1];
  const yPred = [1, 1, 0, 0, 0, 1, 0, 1];

  it("counts the confusion matrix", () => {
    expect(confusion(yTrue, yPred)).toEqual({ tp: 3, fp: 1, tn: 3, fn: 1 });
  });

  it("computes count metrics analytically", () => {
    const m = countMetrics(confusion(yTrue, yPred));
    expect(m.accuracy).toBeCloseTo(6 / 8);
    expect(m.precision).toBeCloseTo(3 / 4);
    expect(m.recall).toBeCloseTo(3 / 4);
    expect(m.f1).toBeCloseTo(0.75);
    expect(m.mcc).toBeCloseTo(0.5);
  });

  it("returns null, not zero, for undefined metrics", () => {
    const m = countMetrics(confusion([0, 0, 0], [0, 0, 0]));
    expect(m.precision).toBeNull();
    expect(m.recall).toBeNull();
    expect(m.mcc).toBeNull();
    expect(m.specificity).toBe(1);
  });

  it("computes ROC AUC with ties", () => {
    expect(trapezoid(rocCurve([0, 0, 1, 1], [0.1, 0.4, 0.35, 0.8]))).toBeCloseTo(0.75);
    expect(trapezoid(rocCurve([0, 1], [0.5, 0.5]))).toBeCloseTo(0.5);
    expect(rocCurve([1, 1], [0.2, 0.9])).toEqual([]);
  });

  it("computes the Brier score", () => {
    expect(brierScore([1, 0], [0.8, 0.4])).toBeCloseTo((0.04 + 0.16) / 2);
  });

  it("matches published Wilson interval values", () => {
    // 8 successes of 10 trials, 95%: (0.4902, 0.9433)
    const ci = wilsonInterval(8, 10, 0.95)!;
    expect(ci.lower).toBeCloseTo(0.4902, 3);
    expect(ci.upper).toBeCloseTo(0.9433, 3);
    expect(wilsonInterval(0, 0, 0.95)).toBeNull();
  });

  it("inverts the normal CDF", () => {
    expect(normalQuantile(0.975)).toBeCloseTo(1.959964, 5);
    expect(normalQuantile(0.5)).toBeCloseTo(0, 8);
    expect(normalQuantile(0.005)).toBeCloseTo(-2.575829, 5);
  });

  it("uses type-7 quantiles", () => {
    expect(quantileSorted([1, 2, 3, 4], 0.5)).toBe(2.5);
    expect(quantileSorted([1, 2, 3, 4], 0)).toBe(1);
  });

  it("computes regression metrics", () => {
    const r = regressionMetrics([1, 2, 3, 4], [1, 2, 3, 5]);
    expect(r.mae).toBeCloseTo(0.25);
    expect(r.mse).toBeCloseTo(0.25);
    expect(r.rmse).toBeCloseTo(0.5);
    expect(r.r2).toBeCloseTo(1 - 1 / 5);
    expect(regressionMetrics([2, 2], [1, 3]).r2).toBeNull();
  });
});
