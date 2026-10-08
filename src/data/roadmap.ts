import type { ReleaseTarget, Status } from "@/types/status";

export interface RoadmapItem {
  label: string;
  status: Status;
}

export interface RoadmapRelease {
  version: ReleaseTarget;
  title: string;
  summary: string;
  status: Status;
  groups: Array<{ title: string; items: RoadmapItem[] }>;
}

const p = (label: string): RoadmapItem => ({ label, status: "planned" });
const done = (label: string): RoadmapItem => ({ label, status: "implemented" });

/** Package roadmap. Statuses change only when work actually lands. */
export const ROADMAP: RoadmapRelease[] = [
  {
    version: "v0.1.0",
    title: "Core",
    summary:
      "Released 8 October 2026. The foundation every later module plugs into: result types, validation, the metric registry, and the first two task families.",
    status: "implemented",
    groups: [
      {
        title: "Foundation",
        items: ["Result system", "Input validation", "Metric registry", "Evaluation context"].map(
          done,
        ),
      },
      { title: "Metrics", items: ["Classification", "Regression", "Model comparison"].map(done) },
      { title: "Research output", items: ["Plots", "Reporting", "LaTeX export", "CLI"].map(done) },
      { title: "Engineering", items: ["Benchmarks", "CI/CD", "PyPI release pipeline"].map(done) },
    ],
  },
  {
    version: "v0.2.0",
    title: "Clinical and statistics",
    summary:
      "Released 8 October 2026. Diagnostic and calibration metrics, uncertainty quantification, and statistical testing.",
    status: "implemented",
    groups: [
      {
        title: "Clinical",
        items: [
          "Clinical metrics",
          "Calibration curve and ECE",
          "Hosmer–Lemeshow",
          "Decision curve analysis",
        ].map(done),
      },
      {
        title: "Uncertainty",
        items: ["Confidence intervals", "Bootstrap (percentile, BCa)"].map(done),
      },
      {
        title: "Statistics",
        items: [
          "Paired tests (McNemar, DeLong, paired bootstrap)",
          "Further statistical tests",
          "Effect sizes (Cohen's d, Hedges' g, Cliff's delta, Cramér's V)",
          "Multiple-testing corrections",
        ].map(done),
      },
    ],
  },
  {
    version: "v0.3.0",
    title: "Computer vision",
    summary:
      "Segmentation and detection evaluation, with comparison, plotting and reporting extended to every task.",
    status: "planned",
    groups: [
      {
        title: "Vision",
        items: [
          "Semantic segmentation",
          "Boundary and surface metrics",
          "Object detection (AP, mAP)",
        ].map(p),
      },
      { title: "Updated for all tasks", items: ["Model comparison", "Plots", "Reporting"].map(p) },
      { title: "Engineering", items: ["Benchmarks", "CI/CD"].map(p) },
    ],
  },
];

/** Website milestones, which are tracked separately from the package. */
export const WEBSITE_MILESTONES: RoadmapItem[] = [
  { label: "Website, documentation portal and metric reference", status: "implemented" },
  { label: "Playground with in-browser demo engine", status: "demo" },
  { label: "Accounts, personal API keys and usage dashboard", status: "implemented" },
  {
    label: "Authenticated evaluation API running on the released EvalSuite package",
    status: "implemented",
  },
  { label: "Playground can run on the API when signed in", status: "implemented" },
  { label: "Metric reference generated from the Python registry", status: "planned" },
  { label: "Browser-local execution with Pyodide (under evaluation)", status: "planned" },
];
