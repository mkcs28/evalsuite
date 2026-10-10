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
          .concat(["SPICE (es.spice, from scene-graph tuples or any parser; no Java needed)"])
          .map(done),
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
      "Released 10 October 2026. Safety and responsible AI, robustness, calibration and uncertainty for LLMs, agent and tool use, multilingual, code generation, long-context and summarization, and inference efficiency and cost.",
    status: "implemented",
    groups: [
      {
        title: "Safety, security, and responsible AI",
        items: [
          "Harmful response rate / unsafe compliance rate (harmful_response_rate)",
          "Refusal rate / appropriate refusal rate (refusal_rate)",
          "Over-refusal rate (over_refusal_rate)",
          "Jailbreak / prompt-injection attack success rate (attack_success_rate)",
          "Toxicity / hate-speech / harassment scores (toxicity_score)",
          "Bias and stereotype association scores (stereotype_preference, weat_effect_size)",
          "Sensitive-information / PII leakage rate (pii_leakage_rate)",
          "Memorization exposure (exposure)",
          "Policy violation rate (policy_violation_rate)",
          "Red-team attack success rate (red_team_success_rate)",
        ].map(done),
      },
      {
        title: "Robustness and reliability",
        items: [
          "Adversarial robustness (adversarial_robustness)",
          "Paraphrase consistency (paraphrase_consistency)",
          "Typographical-noise robustness (noise_robustness, add_typos)",
          "Out-of-distribution accuracy (ood_accuracy)",
          "Distribution-shift performance drop (distribution_shift_drop)",
          "Counterfactual consistency / invariance violation rate (invariance_violation_rate)",
          "Contradiction rate / response stability (contradiction_rate, response_stability)",
          "Failure / timeout / error rate (error_rate)",
          "Recovery success rate (recovery_success_rate)",
          "Prompt wording sensitivity (prompt_sensitivity)",
          "Long-context robustness / truncation sensitivity (truncation_sensitivity)",
        ].map(done),
      },
      {
        title: "Calibration and uncertainty",
        items: [
          "Expected Calibration Error (ECE) (expected_calibration_error)",
          "Adaptive Calibration Error (ACE) (adaptive_calibration_error)",
          "Maximum Calibration Error (MCE) (maximum_calibration_error)",
          "Brier score (brier_score)",
          "Log loss / Negative log-likelihood (log_loss)",
          "Selective risk / coverage-risk curve (selective_risk, risk_coverage_curve)",
          "Area under the risk-coverage curve (AURC) (aurc)",
          "Risk at fixed coverage / coverage at fixed risk (risk_at_coverage, coverage_at_risk)",
          "Confidence-accuracy correlation (confidence_accuracy_correlation)",
          "Abstention quality (abstention_accuracy, coverage_at_risk)",
        ].map(done),
      },
      {
        title: "Agent and tool-use evaluation",
        items: [
          "Task / goal completion rate (task_completion_rate)",
          "Tool-call precision / recall (tool_call_f1)",
          "Tool-selection / argument correctness (tool_selection_accuracy, tool_argument_accuracy)",
          "Invalid tool-call / execution failure rate (invalid_tool_call_rate)",
          "Tool-use efficiency (tool_use_efficiency)",
          "Steps / tool calls per task (steps_per_task)",
          "Planning accuracy / plan adherence (plan_adherence)",
          "State-tracking accuracy (state_tracking_accuracy)",
          "Recovery from tool failures (tool_failure_recovery_rate)",
          "Unnecessary tool-call / loop rate (unnecessary_tool_call_rate)",
          "Human intervention rate (human_intervention_rate)",
          "End-to-end execution time / cost per task (agent_cost_per_task)",
        ].map(done),
      },
      {
        title: "Multilingual and cross-lingual evaluation",
        items: [
          "Language identification accuracy (language_id_accuracy)",
          "Translation BLEU / chrF / COMET (bleu, chrf, model_score)",
          "Multilingual semantic similarity (bitext_mining_accuracy, embedding_similarity)",
          "Cross-lingual retrieval Recall@k / MRR (recall_at_k, mrr)",
          "Language-specific accuracy / performance parity (language_parity)",
          "Code-switching robustness (code_switching_robustness)",
          "Translation adequacy / fluency (direct_assessment)",
          "Cultural appropriateness (cultural_appropriateness)",
          "Language consistency / cross-lingual factual consistency (language_consistency, cross_lingual_consistency)",
        ].map(done),
      },
      {
        title: "Code generation and software engineering",
        items: [
          "Pass@k (pass_at_k)",
          "Unit-test pass rate (unit_test_pass_rate)",
          "Compilation / syntax validity rate (syntax_validity_rate)",
          "Static-analysis violation rate (static_analysis_violation_rate)",
          "Code execution success / functional correctness (execution_success_rate)",
          "Generated-code test coverage (coverage_rate)",
          "Bug reproduction rate / patch acceptance rate (patch_acceptance_rate)",
          "Repository task success / SWE-bench resolved rate (resolved_rate)",
          "CodeBLEU (codebleu)",
          "Cyclomatic complexity / maintainability index (code_complexity)",
          "Security vulnerability rate (security_vulnerability_rate)",
          "Runtime efficiency / memory consumption (runtime_efficiency)",
        ].map(done),
      },
      {
        title: "Long-context and summarization evaluation",
        items: [
          "Long-context retrieval accuracy (retrieval_accuracy_by_length)",
          "Needle-in-a-haystack accuracy (needle_in_haystack)",
          "Position-dependent retrieval accuracy (position_accuracy)",
          "Context utilization / retention (context_utilization)",
          "Summary factual consistency / coverage / completeness (summary_coverage, faithfulness)",
          "Summary compression ratio (compression_ratio)",
          "ROUGE-L / BERTScore (rouge_l, bertscore)",
          "Citation coverage (citation_coverage)",
          "Lost-in-the-middle sensitivity (lost_in_the_middle)",
          "Truncation robustness / cross-document consistency (truncation_sensitivity, cross_document_consistency)",
        ].map(done),
      },
      {
        title: "Inference efficiency and operational cost",
        items: [
          "Time to First Token (TTFT) (time_to_first_token)",
          "Time per Output Token (TPOT) (time_per_output_token)",
          "End-to-end latency (latency_percentiles, latency_summary)",
          "Throughput / tokens per second (throughput)",
          "Input / output token counts (token_usage)",
          "Cost per request / per 1,000 tokens (inference_cost)",
          "Peak memory / CPU / GPU utilization (resource_utilization)",
          "Energy per request (energy_per_request)",
          "Requests per second (requests_per_second)",
          "Error rate / availability (availability)",
          "p50 / p95 / p99 latency (latency_percentiles)",
        ].map(done),
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
  {
    label:
      "Metric reference generated from the Python registry (LLM, LLM-systems and extra entries)",
    status: "implemented",
  },
  { label: "API endpoints for reports, bootstrap intervals and plot data", status: "implemented" },
  { label: "Browser-local execution with Pyodide (under evaluation)", status: "planned" },
];
