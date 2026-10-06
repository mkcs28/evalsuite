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

/** Package roadmap. Statuses change only when work actually lands. */
export const ROADMAP: RoadmapRelease[] = [
  {
    version: "v0.1.0",
    title: "Core",
    summary:
      "The foundation every later module plugs into: result types, validation, the metric registry, and the first two task families.",
    status: "planned",
    groups: [
      {
        title: "Foundation",
        items: ["Result system", "Input validation", "Metric registry", "Evaluation context"].map(
          p,
        ),
      },
      { title: "Metrics", items: ["Classification", "Regression", "Model comparison"].map(p) },
      { title: "Research output", items: ["Plots", "Reporting", "LaTeX export", "CLI"].map(p) },
      { title: "Engineering", items: ["Benchmarks", "CI/CD", "PyPI release pipeline"].map(p) },
    ],
  },
  {
    version: "v0.2.0",
    title: "Clinical and statistics",
    summary:
      "Diagnostic and calibration metrics, uncertainty quantification, and statistical testing.",
    status: "planned",
    groups: [
      {
        title: "Clinical",
        items: [
          "Clinical metrics",
          "Calibration",
          "Hosmer–Lemeshow",
          "Decision curve analysis",
        ].map(p),
      },
      {
        title: "Uncertainty",
        items: ["Confidence intervals", "Bootstrap (percentile, BCa)"].map(p),
      },
      {
        title: "Statistics",
        items: ["Statistical tests", "Effect sizes", "Multiple-testing corrections"].map(p),
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
  {
    label: "Accounts, personal API keys and usage dashboard (built, not yet deployed)",
    status: "in-development",
  },
  {
    label: "Authenticated evaluation API with an interim engine (built, not yet deployed)",
    status: "in-development",
  },
  {
    label: "Playground can run on the API when signed in (built, not yet deployed)",
    status: "in-development",
  },
  { label: "Metric reference generated from the Python registry", status: "planned" },
  { label: "Browser-local execution with Pyodide (under evaluation)", status: "planned" },
];
