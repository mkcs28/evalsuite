import type { ReleaseTarget } from "@/types/status";

export type ChangeKind = "Added" | "Changed" | "Fixed" | "Deprecated" | "Removed" | "Security";

export interface ReleaseNote {
  version: ReleaseTarget;
  /** ISO date once published; null while unreleased. */
  date: string | null;
  changes: Array<{ kind: ChangeKind; items: string[] }>;
}

/**
 * Published releases only, mirroring the package's CHANGELOG.md.
 */
export const RELEASE_NOTES: ReleaseNote[] = [
  {
    version: "v0.5.5",
    date: "2026-11-09",
    changes: [
      {
        kind: "Changed",
        items: [
          "Every benchmark row is now faster than its reference library: 81 of 81 in the main benchmark (3.29× geometric mean) and 172 of 172 per-metric library comparisons (4.97×). Results are unchanged; every comparison still agrees with the reference.",
          "Latency percentiles: exact selection from a small sample-bracketed window instead of partitioning the whole array; bit-identical to np.percentile (0.69× → 1.1–2.0× NumPy).",
          "COCO detection: COCOeval's greedy matching runs across all images of a class at once (0.96× → 1.85× pycocotools, identical matches).",
          "Shapiro–Wilk: SciPy's algorithm with Royston's weights cached per sample size, bit-identical to SciPy (0.90× → 11×).",
          "MoverScore: cost matrix computed exactly as POT's ot.dist and POT's solver called without redundant checks (0.9× → 1.4× POT).",
          "Surface distances: boundary detection by array shifts and direct nearest-point search for small boundaries (average surface distance 0.75× → 1.2×, Hausdorff 1.1× → 1.9× SciPy).",
          "METEOR memoises Porter stems per word (0.74× → 3.5× NLTK); Krippendorff's alpha and CodeBLEU have lower fixed cost on tiny inputs.",
        ],
      },
    ],
  },
  {
    version: "v0.5.4",
    date: "2026-11-09",
    changes: [
      {
        kind: "Added",
        items: [
          "Dual licence: EvalSuite is available under MIT OR Apache-2.0, at your option. Both licence texts ship in the wheel and sdist.",
        ],
      },
      {
        kind: "Changed",
        items: [
          "Overall benchmark speed-up 2.06× → 3.07× (75 of 81 rows faster) and per-metric speed-up against reference libraries 2.80× → 4.67×, with every result unchanged.",
          "Classification: integer labels are found and encoded without sorting; binary evaluate() is about 98× faster than scikit-learn and 10-class macro F1 about 16×.",
          "Statistics: Wilcoxon, Mann–Whitney, Kruskal–Wallis and Friedman rank once (2–4× faster than SciPy); paired t-test, χ², Cramér's V, McNemar and proportion intervals compute directly; Fisher's exact test 5–7× faster.",
          "Text: TER reuses edit-distance rows across shifts (1.5× sacreBLEU); BLEU and ROUGE build n-grams in C and memoise tokenisation; Fleiss' kappa, Krippendorff's alpha and language-ID accuracy are vectorised.",
          "Regression evaluate() shares squared errors between MSE, RMSE and R² (1.8× scikit-learn).",
        ],
      },
    ],
  },
  {
    version: "v0.5.3",
    date: "2026-11-09",
    changes: [
      {
        kind: "Changed",
        items: [
          "t_test computes the statistic and its p-value directly from one pass over each sample: identical to SciPy and faster than it.",
          "Latency, step and token summaries take every percentile from a single partition (identical values, about 1.4× faster).",
          "README and benchmarks rerun on 0.5.3.",
        ],
      },
    ],
  },
  {
    version: "v0.5.2",
    date: "2026-11-07",
    changes: [
      {
        kind: "Security",
        items: [
          "The built-in PII e-mail detector runs in linear time: pii_leakage_rate on 60 kB of adversarial text went from about 6 s to about 10 ms.",
          "codebleu, code_complexity and syntax_validity_rate handle source nested too deeply for Python's parser instead of crashing.",
          "Internal assert checks replaced by explicit errors, so behaviour is the same under python -O.",
          "Release and CI workflows pin every GitHub Action to a commit SHA; Dependabot keeps them current.",
        ],
      },
      {
        kind: "Changed",
        items: [
          "import evalsuite no longer loads SciPy until it is needed (import time about 0.6 s → 0.07 s).",
          "CodeBLEU syntax match is linear in program size instead of quadratic.",
        ],
      },
    ],
  },
  {
    version: "v0.5.1",
    date: "2026-10-10",
    changes: [
      {
        kind: "Added",
        items: [
          "evalsuite benchmark --suite llmsys: LLM-systems workloads against radon, codebleu, scikit-learn, jsonschema, SciPy and NumPy; included in --suite all (27 cases, 81 measurements, all agreeing with their reference).",
        ],
      },
      {
        kind: "Changed",
        items: [
          "LLM-systems metrics accept NumPy arrays without converting them to Python lists first.",
        ],
      },
    ],
  },
  {
    version: "v0.5.0",
    date: "2026-10-10",
    changes: [
      {
        kind: "Added",
        items: [
          "LLM systems: all 85 items of the v0.5.0 roadmap across 8 areas, as 77 new metrics plus existing functions where they already measure the item.",
          "Safety: harmful-response and unsafe-compliance rate, refusal and over-refusal, jailbreak / prompt-injection and red-team success, expected maximum toxicity, CrowS-Pairs stereotype preference, WEAT, PII leakage with built-in detectors, memorization exposure, policy violations.",
          "Robustness: adversarial and typo-noise robustness (add_typos), OOD accuracy, distribution-shift drop, paraphrase and counterfactual consistency, response stability, contradiction rate, failure and recovery rates, prompt sensitivity, truncation sensitivity.",
          "Calibration and uncertainty: adaptive calibration error, risk-coverage curve, AURC / E-AURC, selective risk, risk at coverage, coverage at risk, confidence AUROC.",
          "Agents: task completion, invalid tool calls checked against JSON Schemas, tool-use efficiency, steps per task, plan adherence, state tracking, tool-failure recovery, loop rate, human intervention, cost per success.",
          "Multilingual: language-ID accuracy, bitext mining, language parity, code-switching robustness, z-normalised direct assessment, cultural appropriateness, language and cross-lingual consistency.",
          "Code: unit-test pass rate, syntax validity (never executed), static-analysis and security findings, execution success, coverage, patch acceptance, SWE-bench resolved rate, CodeBLEU, cyclomatic complexity and maintainability index (identical to radon), runtime efficiency.",
          "Long context and serving: accuracy by length, needle-in-a-haystack grid, position accuracy, lost-in-the-middle gap, summary coverage, compression ratio, citation coverage; TTFT, TPOT, latency percentiles, throughput, tokens, cost, resources, energy, requests per second, availability.",
          "SPICE (es.spice) from scene-graph tuples or any parser, with WordNet synonym matching; no Java needed.",
          "Per-metric benchmarks now cover all 225 metrics and statistics functions; all 204 comparisons with a reference agree.",
        ],
      },
    ],
  },
  {
    version: "v0.4.1",
    date: "2026-10-10",
    changes: [
      {
        kind: "Added",
        items: [
          "Benchmarks for every metric: evalsuite benchmark --suite metrics times each of the 147 registered metrics and statistics functions against a reference library (scikit-learn, SciPy, statsmodels, pycocotools, sacreBLEU, rouge-score, NLTK, pycocoevalcap, ranx, krippendorff, choix, POT, jsonschema) or an independent textbook formula; all 128 comparisons agree to 1e-9.",
        ],
      },
      {
        kind: "Changed",
        items: [
          "net_benefit at one threshold computes in a single pass (about 3× faster); perplexity and cross_entropy validate the pooled tokens once (5–9× faster for many short sequences).",
          "Benchmark cases whose optional dependency is missing (for example METEOR without nltk) are skipped instead of failing.",
        ],
      },
    ],
  },
  {
    version: "v0.4.0",
    date: "2026-10-09",
    changes: [
      {
        kind: "Added",
        items: [
          "LLM evaluation: 69 new metrics, each checked against its reference implementation where one exists (sacreBLEU, rouge-score, NLTK, pycocoevalcap, POT, mauve-text, ranx, choix, krippendorff, statsmodels, jsonschema).",
          "Text generation: BLEU, sentence BLEU, chrF/chrF++, TER, ROUGE-1/2/L/Lsum, METEOR, CIDEr-D, perplexity, cross-entropy, Distinct-n, Self-BLEU, MAUVE; text_report and the evalsuite text command.",
          "Semantic similarity from your own model: BERTScore, embedding cosine / Euclidean / Manhattan, MoverScore, and model_score for COMET, BLEURT, BARTScore, AlignScore or any judge.",
          "Factuality and QA: faithfulness, hallucination rate, groundedness, citation precision and recall, claim verification, knowledge consistency, answer correctness and relevance, abstention accuracy, exact match, token F1.",
          "LLM-as-a-judge: win rate, Bradley–Terry and Elo ratings, Krippendorff's alpha, Fleiss' kappa, judge–human agreement, position consistency, verbosity and self-preference bias, rubric scores.",
          "Reasoning (pass@k, majority vote, GSM8K / MATH / multiple-choice answer extraction), RAG (ranking metrics, context precision / recall / relevance, latency, task success, failure attribution) and structured output (JSON Schema, XML, required fields, tool calls, instruction following).",
          "Plots: ratings leaderboard with bootstrap intervals, pairwise win matrix, per-example text score distributions. Benchmark suite llm.",
        ],
      },
      {
        kind: "Changed",
        items: [
          "bootstrap_ci, compare and the paired tests resample whole examples for text, retrieval and other item-level metrics, so corpus metrics such as BLEU get proper intervals.",
        ],
      },
    ],
  },
  {
    version: "v0.3.1",
    date: "2026-10-09",
    changes: [
      {
        kind: "Fixed",
        items: [
          "Labels that mix numbers and strings now raise a clear error instead of being compared as text.",
          "RMSE no longer overflows to infinity for errors above about 1e154.",
          "Bootstrap intervals, paired bootstrap tests and compare() require at least two observations instead of returning a zero-width interval.",
          "A 2-D mask written as a nested Python list is read as one image, like a NumPy array.",
          "Release workflow: the GitHub release step attaches the files when the release already exists instead of failing.",
        ],
      },
      {
        kind: "Added",
        items: [
          "Overall benchmark summary first (per suite and in total: agreement with the reference, how many cases are faster, geometric-mean speed-up) and benchmark rows in alphabetical order; BenchmarkResult.overall().",
          "Release checks: the tag must match the package version, a version already on PyPI is refused, the built files are verified, and a manual run attaches a version's PyPI files to its GitHub release.",
          "CI installs the wheel and the sdist in clean environments with pip check and a smoke test, checks the distributions for stray or secret files, tests the oldest supported dependencies and runs the README examples.",
          "Quality-assurance tests against scikit-learn and statsmodels for edge cases, repository security checks and a security policy.",
        ],
      },
    ],
  },
  {
    version: "v0.3.0",
    date: "2026-10-09",
    changes: [
      {
        kind: "Added",
        items: [
          "Segmentation: Dice, IoU, mIoU, pixel accuracy, mean pixel accuracy, Boundary IoU, Hausdorff distance and HD95, average symmetric surface distance (with pixel spacing) and segmentation_report; 2-D and 3-D masks, ignore_index, dataset or per-image aggregation.",
          "Object detection: box IoU, detection_report with the 12 COCO numbers and AP per class, mean_average_precision, per-class AP (COCO or VOC interpolation), precision-recall curves and COCO file import; matches pycocotools exactly.",
          "Model comparison, bootstrap intervals and paired tests over images for segmentation and detection.",
          "Plots: segmentation overlay, per-class bars, detection precision-recall curves. CLI: evalsuite segmentation and evalsuite detection.",
          "Vision benchmark suite against scikit-learn, SciPy and pycocotools (evalsuite benchmark --suite vision).",
          "CITATION.cff and a vision extra for reading folders of mask images.",
        ],
      },
      {
        kind: "Changed",
        items: [
          "evaluate() points segmentation masks and detection annotations to the right functions.",
          "CI and release workflows use the Node 24 versions of the GitHub actions; the CLI is safe on non-UTF-8 consoles.",
        ],
      },
    ],
  },
  {
    version: "v0.2.1",
    date: "2026-10-09",
    changes: [
      {
        kind: "Added",
        items: [
          "Benchmarks for the v0.2.0 functions (evalsuite benchmark --suite clinical) against scikit-learn, statsmodels, SciPy and the textbook NumPy loop; every row names its reference.",
        ],
      },
      {
        kind: "Changed",
        items: [
          "Faster label handling: 8 label metrics at a million samples are now 34× faster than scikit-learn (from 10×), macro F1 5.8× (from 1.6×).",
          "Decision curves computed from cumulative sums instead of a samples × thresholds matrix.",
        ],
      },
    ],
  },
  {
    version: "v0.2.0",
    date: "2026-10-08",
    changes: [
      {
        kind: "Added",
        items: [
          "Clinical: sensitivity, PPV, positive and negative likelihood ratios, diagnostic odds ratio, Youden's J and net benefit; diagnostic_report with a confidence interval for every measure; decision_curve with treat-all and treat-none references.",
          "Calibration: maximum calibration error, calibration slope and intercept, Hosmer–Lemeshow test and calibration_report.",
          "Hypothesis tests with effect sizes: Welch, Student and paired t-tests, Mann–Whitney, Wilcoxon, Kruskal–Wallis, Friedman, Shapiro–Wilk, χ² and Fisher's exact; Cramér's V; Hochberg correction.",
          "Decision curve plot; CLI commands evalsuite diagnostic, evalsuite calibration and evalsuite plot decision.",
          "Validated against statsmodels and SciPy.",
        ],
      },
    ],
  },
  {
    version: "v0.1.2",
    date: "2026-10-08",
    changes: [
      {
        kind: "Changed",
        items: ["LICENSE: copyright held by Manoj Kumar C S and Nikhil D Bharadwaj."],
      },
    ],
  },
  {
    version: "v0.1.1",
    date: "2026-10-08",
    changes: [
      {
        kind: "Changed",
        items: [
          "Credits: Manoj Kumar C S and Nikhil D Bharadwaj listed as authors and maintainers in the README and package metadata.",
        ],
      },
    ],
  },
  {
    version: "v0.1.0",
    date: "2026-10-08",
    changes: [
      {
        kind: "Added",
        items: [
          "Classification metrics: binary, multiclass and multilabel, with micro, macro, weighted, samples and per-class averaging and sample weights.",
          "Regression metrics, single and multi-output, including MAPE, sMAPE, RMSLE, Huber and quantile loss.",
          "evaluate(): one call for every applicable metric, with inputs validated and the confusion matrix built once.",
          "Immutable, number-like results with JSON, pandas, Markdown, LaTeX, HTML and CSV export.",
          "Metric registry with definitions, formulas, ranges and references.",
          "Model comparison: compare() with confidence intervals (bootstrap BCa, Wilson, Clopper–Pearson, DeLong), paired tests (McNemar, DeLong, paired bootstrap), effect sizes and multiple-testing corrections.",
          "Calibration curve and expected calibration error.",
          "Plots: ROC, precision-recall, calibration, confusion matrix, residuals and model comparison (optional matplotlib extra).",
          "Classification report table matching scikit-learn.",
          "Command-line tool: evalsuite evaluate, report, compare, plot, metrics, info and benchmark.",
          "Benchmarks against scikit-learn: identical results, about 10x faster for many metrics at once.",
          "Tested on Python 3.9 to 3.14 on Linux, Windows and macOS; released to PyPI with Trusted Publishing.",
        ],
      },
    ],
  },
];
