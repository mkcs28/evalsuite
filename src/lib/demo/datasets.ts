import { mulberry32, normal } from "./random";

/**
 * Synthetic demo datasets, generated from fixed seeds so they are identical
 * on every render, build and test run. They carry no real-world meaning.
 */
export interface DemoDataset {
  id: string;
  label: string;
  task: "binary-classification" | "regression";
  yTrue: number[];
  yPred: number[];
  yProb?: number[];
}

const round = (v: number, d: number) => Math.round(v * 10 ** d) / 10 ** d;

function classificationDemo(): DemoDataset {
  const rand = mulberry32(20260101);
  const yTrue: number[] = [];
  const yProb: number[] = [];
  for (let i = 0; i < 80; i++) {
    const y = rand() < 0.35 ? 1 : 0;
    const logit = 1.4 * (2 * y - 1) + 1.1 * normal(rand) - 0.2;
    yTrue.push(y);
    yProb.push(round(1 / (1 + Math.exp(-logit)), 3));
  }
  return {
    id: "synthetic-binary",
    label: "Synthetic binary classification (n = 80)",
    task: "binary-classification",
    yTrue,
    yProb,
    yPred: yProb.map((p) => (p >= 0.5 ? 1 : 0)),
  };
}

function regressionDemo(): DemoDataset {
  const rand = mulberry32(20260202);
  const yTrue: number[] = [];
  const yPred: number[] = [];
  for (let i = 0; i < 60; i++) {
    const x = rand() * 10;
    yTrue.push(round(3 * x + 2 + 1.5 * normal(rand), 2));
    yPred.push(round(2.9 * x + 2.4 + 0.6 * normal(rand), 2));
  }
  return {
    id: "synthetic-regression",
    label: "Synthetic regression (n = 60)",
    task: "regression",
    yTrue,
    yPred,
  };
}

export const DEMO_DATASETS: readonly DemoDataset[] = [classificationDemo(), regressionDemo()];
