export type MetricBenchmarkSize = {
  es: number | null;
  ref: number | null;
  speedup: number | null;
  esMb: number | null;
};

export type MetricBenchmarkRow = {
  metric: string;
  group: string;
  reference: string;
  kind: "library" | "formula" | "none";
  maxDiff: number | null;
  sizes: Record<string, MetricBenchmarkSize>;
};

export type MetricBenchmarkSummary = {
  group: string;
  metrics: number;
  library: number;
  formula: number;
  alone: number;
  matching: number;
  compared: number;
  faster: number;
  measured: number;
  geomean: number | null;
  min: number | null;
  max: number | null;
};

export type MetricBenchmarks = {
  environment: Record<string, string | number | null>;
  sizes: number[];
  summary: MetricBenchmarkSummary[];
  rows: MetricBenchmarkRow[];
};
