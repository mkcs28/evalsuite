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

const done = (label: string): RoadmapItem => ({ label, status: "implemented" });
const planned = (label: string): RoadmapItem => ({ label, status: "planned" });

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
      "Released 9 October 2026. Segmentation and detection evaluation, with comparison, plotting and reporting extended to every task.",
    status: "implemented",
    groups: [
      {
        title: "Vision",
        items: [
          "Semantic segmentation",
          "Boundary and surface metrics",
          "Object detection (AP, mAP)",
        ].map(done),
      },
      {
        title: "Updated for all tasks",
        items: ["Model comparison", "Plots", "Reporting"].map(done),
      },
      { title: "Engineering", items: ["Benchmarks", "CI/CD"].map(done) },
    ],
  },
  {
    version: "v0.4.0",
    title: "LLM evaluation",
    summary:
      "Released 9 October 2026. Text generation, semantic similarity, factuality and hallucination, LLM-as-a-judge, reasoning benchmarks, retrieval-augmented generation and structured output, with the same intervals, comparison, plots and reports as every other task.",
    status: "implemented",
    groups: [
      {
        title: "Text generation and language quality",
        items: [
          "BLEU",
          "ROUGE-1 / ROUGE-2 / ROUGE-L / ROUGE-Lsum",
          "METEOR",
          "chrF / chrF++",
          "TER",
          "CIDEr-D",
          "Perplexity (PPL)",
          "Cross-entropy / Negative log-likelihood",
          "Distinct-1 / Distinct-2",
          "Self-BLEU",
          "MAUVE",
        ]
          .map(done)
          .concat([planned("SPICE (needs a Java scene-graph parser)")]),
      },
      {
        title: "Semantic similarity and learned text metrics",
        items: [
          "BERTScore Precision / Recall / F1",
          "Embedding cosine similarity",
          "Embedding Euclidean / Manhattan distance",
          "MoverScore",
          "BLEURT (via model_score)",
          "COMET (via model_score)",
          "BARTScore (via model_score)",
          "AlignScore (via model_score)",
          "MTEB task metrics (retrieval, classification and similarity metrics)",
        ].map(done),
      },
      {
        title: "Factuality, correctness, and hallucination",
        items: [
          "Exact Match (EM)",
          "Token-level Precision / Recall / F1",
          "Answer correctness",
          "Factual consistency / faithfulness",
          "Groundedness",
          "Hallucination / unsupported-claim rate",
          "Citation precision / recall / correctness",
          "Claim verification accuracy",
          "Knowledge consistency",
          "Answer relevance",
          "Abstention accuracy",
        ].map(done),
      },
      {
        title: "LLM-as-a-judge and preference evaluation",
        items: [
          "Correctness, helpfulness, relevance, coherence, fluency",
          "Completeness, clarity, conciseness, readability",
          "Instruction-following / context-adherence score",
          "Reasoning-quality score",
          "Tone and style adherence",
          "Pairwise preference win rate",
          "Elo / Bradley–Terry scores",
          "Inter-judge agreement / human agreement",
          "Judge calibration and bias sensitivity",
        ].map(done),
      },
      {
        title: "Reasoning, knowledge, and mathematical ability",
        items: [
          "Accuracy / Exact Match",
          "Pass@1 / Pass@k",
          "Majority-vote accuracy",
          "GSM8K / MATH benchmark accuracy",
          "GPQA / MMLU / BBH / ARC accuracy",
          "TruthfulQA score",
          "Constraint satisfaction rate",
          "Tool-assisted task success",
        ].map(done),
      },
      {
        title: "Retrieval-augmented generation (RAG)",
        items: [
          "Precision@k / Recall@k / Hit Rate@k",
          "MRR",
          "MAP",
          "NDCG@k",
          "Retrieval latency",
          "Context precision / recall / relevance",
          "Faithfulness / groundedness",
          "Answer correctness / relevancy / completeness",
          "Citation precision / recall",
          "Unsupported-claim rate",
          "End-to-end task success / query resolution",
          "Failure attribution",
        ].map(done),
      },
      {
        title: "Instruction following and structured output",
        items: [
          "Instruction compliance rate",
          "Constraint satisfaction rate",
          "Required-field accuracy",
          "JSON validity / JSON Schema compliance",
          "XML validity",
          "Function-call / tool-selection accuracy",
          "Tool-argument accuracy",
          "API-call success rate",
          "Format / refusal-format compliance",
          "Multi-turn instruction retention",
          "Unwanted extra-content rate",
        ].map(done),
      },
    ],
  },
  {
    version: "v0.5.0",
    title: "LLM systems: safety, agents and operations",
    summary:
      "Planned. Safety and responsible AI, robustness, calibration and uncertainty for LLMs, agent and tool use, multilingual, code generation, long-context and summarization, and inference efficiency and cost.",
    status: "planned",
    groups: [
      {
        title: "Safety, security, and responsible AI",
        items: [
          "Harmful response rate / unsafe compliance rate",
          "Refusal rate / appropriate refusal rate",
          "Over-refusal rate",
          "Jailbreak / prompt-injection attack success rate",
          "Toxicity / hate-speech / harassment scores",
          "Bias and stereotype association scores",
          "Sensitive-information / PII leakage rate",
          "Memorization exposure",
          "Policy violation rate",
          "Red-team attack success rate",
        ].map(planned),
      },
      {
        title: "Robustness and reliability",
        items: [
          "Adversarial robustness",
          "Paraphrase consistency",
          "Typographical-noise robustness",
          "Out-of-distribution accuracy",
          "Distribution-shift performance drop",
          "Counterfactual consistency / invariance violation rate",
          "Contradiction rate / response stability",
          "Failure / timeout / error rate",
          "Recovery success rate",
          "Prompt wording sensitivity",
          "Long-context robustness / truncation sensitivity",
        ].map(planned),
      },
      {
        title: "Calibration and uncertainty",
        items: [
          "Expected Calibration Error (ECE)",
          "Adaptive Calibration Error (ACE)",
          "Maximum Calibration Error (MCE)",
          "Brier score",
          "Log loss / Negative log-likelihood",
          "Selective risk / coverage-risk curve",
          "Area under the risk-coverage curve (AURC)",
          "Risk at fixed coverage / coverage at fixed risk",
          "Confidence-accuracy correlation",
          "Abstention quality",
        ].map(planned),
      },
      {
        title: "Agent and tool-use evaluation",
        items: [
          "Task / goal completion rate",
          "Tool-call precision / recall",
          "Tool-selection / argument correctness",
          "Invalid tool-call / execution failure rate",
          "Tool-use efficiency",
          "Steps / tool calls per task",
          "Planning accuracy / plan adherence",
          "State-tracking accuracy",
          "Recovery from tool failures",
          "Unnecessary tool-call / loop rate",
          "Human intervention rate",
          "End-to-end execution time / cost per task",
        ].map(planned),
      },
      {
        title: "Multilingual and cross-lingual evaluation",
        items: [
          "Language identification accuracy",
          "Translation BLEU / chrF / COMET",
          "Multilingual semantic similarity",
          "Cross-lingual retrieval Recall@k / MRR",
          "Language-specific accuracy / performance parity",
          "Code-switching robustness",
          "Translation adequacy / fluency",
          "Cultural appropriateness",
          "Language consistency / cross-lingual factual consistency",
        ].map(planned),
      },
      {
        title: "Code generation and software engineering",
        items: [
          "Pass@k",
          "Unit-test pass rate",
          "Compilation / syntax validity rate",
          "Static-analysis violation rate",
          "Code execution success / functional correctness",
          "Generated-code test coverage",
          "Bug reproduction rate / patch acceptance rate",
          "Repository task success / SWE-bench resolved rate",
          "CodeBLEU",
          "Cyclomatic complexity / maintainability index",
          "Security vulnerability rate",
          "Runtime efficiency / memory consumption",
        ].map(planned),
      },
      {
        title: "Long-context and summarization evaluation",
        items: [
          "Long-context retrieval accuracy",
          "Needle-in-a-haystack accuracy",
          "Position-dependent retrieval accuracy",
          "Context utilization / retention",
          "Summary factual consistency / coverage / completeness",
          "Summary compression ratio",
          "ROUGE-L / BERTScore",
          "Citation coverage",
          "Lost-in-the-middle sensitivity",
          "Truncation robustness / cross-document consistency",
        ].map(planned),
      },
      {
        title: "Inference efficiency and operational cost",
        items: [
          "Time to First Token (TTFT)",
          "Time per Output Token (TPOT)",
          "End-to-end latency",
          "Throughput / tokens per second",
          "Input / output token counts",
          "Cost per request / per 1,000 tokens",
          "Peak memory / CPU / GPU utilization",
          "Energy per request",
          "Requests per second",
          "Error rate / availability",
          "p50 / p95 / p99 latency",
        ].map(planned),
      },
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
