// Generated from the evalsuite-python metric registry by scripts/gen_llm_metrics.py.
// Every example call was executed against the package. Do not edit by hand.
import type { MetricDefinition } from "@/lib/metrics/schema";

export const LLM_METRICS: MetricDefinition[] = [
  {
    id: "factuality.abstention_accuracy",
    name: "Abstention accuracy",
    category: "factuality",
    subcategory: "Answers",
    description:
      "Whether a system abstains exactly when it should (the evidence is insufficient or it would otherwise be wrong): accuracy of the abstain / answer decision; abstention precision, recall and the accuracy on answered questions are reported alongside.",
    formula: "mean[abstained_i = should_abstain_i]",
    inputs: [
      "should_abstain: whether each question should be declined",
      "abstained: whether the system declined",
    ],
    outputs: "MetricResult (float, or per-example array with average=None)",
    range: "[0, 1]",
    assumptions: [],
    limitations: [],
    references: [
      {
        citation:
          "Feng S, Shi W, Wang Y, Ding W, Balachandran V, Tsvetkov Y. Don't hallucinate, abstain: identifying LLM knowledge gaps via multi-LLM collaboration. ACL. 2024:14664-14690.",
      },
    ],
    version: "v0.4.0",
    status: "implemented",
    apiPath: "es.abstention_accuracy",
    example: "es.abstention_accuracy(should_abstain, abstained, correct=correct)",
  },
  {
    id: "factuality.answer_correctness",
    name: "Answer correctness",
    category: "factuality",
    subcategory: "Answers",
    description:
      "Agreement of an answer with the reference at the level of statements: F1 over true-positive (in both), false-positive (only in the answer) and false-negative (only in the reference) statements, optionally blended with a semantic similarity score (RAGAS answer correctness).",
    formula: "w_f · TP/(TP + ½(FP + FN)) + w_s · similarity",
    inputs: ["tp, fp, fn: statement counts per answer"],
    outputs: "MetricResult (float, or per-example array with average=None)",
    range: "[0, 1]",
    assumptions: [],
    limitations: [],
    references: [
      {
        citation:
          "Es S, James J, Espinosa-Anke L, Schockaert S. RAGAS: automated evaluation of retrieval augmented generation. EACL (demos). 2024:150-158.",
      },
    ],
    version: "v0.4.0",
    status: "implemented",
    apiPath: "es.answer_correctness",
    example: "es.answer_correctness(tp, fp, fn, similarity=similarity)",
  },
  {
    id: "factuality.answer_relevance",
    name: "Answer relevance",
    category: "factuality",
    subcategory: "Answers",
    description:
      "How directly an answer addresses the question: mean cosine similarity between the question's embedding and embeddings of questions regenerated from the answer (RAGAS answer relevancy).",
    formula: "mean_k cos(e(question), e(regenerated question_k))",
    inputs: [
      "question_embeddings: (n, dim)",
      "generated_question_embeddings: per question, embeddings of regenerated questions",
    ],
    outputs: "MetricResult (float, or per-example array with average=None)",
    range: "[-1, 1]",
    assumptions: [],
    limitations: [],
    references: [
      {
        citation:
          "Es S, James J, Espinosa-Anke L, Schockaert S. RAGAS: automated evaluation of retrieval augmented generation. EACL (demos). 2024:150-158.",
      },
    ],
    version: "v0.4.0",
    status: "implemented",
    apiPath: "es.answer_relevance",
    example: "es.answer_relevance(question_embeddings, regenerated_embeddings)",
  },
  {
    id: "factuality.citation_precision",
    name: "Citation precision",
    category: "factuality",
    subcategory: "Claims and citations",
    description:
      "Share of citations that are relevant to the statement they are attached to (ALCE: a citation counts if it supports, or is needed to support, the statement).",
    formula: "relevant citations / citations",
    inputs: ["citations: per answer, statements with 'supported' and per-citation relevance"],
    outputs: "MetricResult (float, or per-example array with average=None)",
    range: "[0, 1]",
    assumptions: [],
    limitations: [],
    references: [
      {
        citation:
          "Gao T, Yen H, Yu J, Chen D. Enabling large language models to generate text with citations. EMNLP. 2023:6465-6488.",
      },
    ],
    version: "v0.4.0",
    status: "implemented",
    apiPath: "es.citation_precision",
    example: "es.citation_precision(citations)",
  },
  {
    id: "factuality.citation_recall",
    name: "Citation recall",
    category: "factuality",
    subcategory: "Claims and citations",
    description:
      "Share of statements whose cited passages, taken together, support them (statements without citations count as unsupported); ALCE citation recall.",
    formula: "statements fully supported by their citations / statements",
    inputs: ["citations: per answer, statements with 'supported' and per-citation relevance"],
    outputs: "MetricResult (float, or per-example array with average=None)",
    range: "[0, 1]",
    assumptions: [],
    limitations: [],
    references: [
      {
        citation:
          "Gao T, Yen H, Yu J, Chen D. Enabling large language models to generate text with citations. EMNLP. 2023:6465-6488.",
      },
    ],
    version: "v0.4.0",
    status: "implemented",
    apiPath: "es.citation_recall",
    example: "es.citation_recall(citations)",
  },
  {
    id: "factuality.claim_verification_accuracy",
    name: "Claim verification accuracy",
    category: "factuality",
    subcategory: "Claims and citations",
    description:
      "Accuracy of supported / contradicted / not-enough-info verdicts against gold labels (FEVER label accuracy); macro F1 is reported alongside because the classes are often imbalanced.",
    formula: "correct verdicts / claims",
    inputs: ["gold_verdicts: gold claim labels", "predicted_verdicts: predicted claim labels"],
    outputs: "MetricResult (float, or per-example array with average=None)",
    range: "[0, 1]",
    assumptions: [],
    limitations: [],
    references: [
      {
        citation:
          "Thorne J, Vlachos A, Christodoulopoulos C, Mittal A. FEVER: a large-scale dataset for fact extraction and VERification. NAACL. 2018:809-819.",
      },
    ],
    version: "v0.4.0",
    status: "implemented",
    apiPath: "es.claim_verification_accuracy",
    example: "es.claim_verification_accuracy(gold_verdicts, predicted_verdicts)",
  },
  {
    id: "factuality.exact_match",
    name: "Exact match",
    category: "factuality",
    subcategory: "Answers",
    description:
      "Share of predictions identical to a reference after normalization (SQuAD: lowercase, no punctuation or articles, single spaces); with several references, any match counts.",
    formula: "mean_i max_r [norm(prediction_i) = norm(reference_ir)]",
    inputs: [
      "references: one reference string (or a list of references) per example",
      "predictions: one model output per example",
    ],
    outputs: "MetricResult (float, or per-example array with average=None)",
    range: "[0, 1]",
    assumptions: [],
    limitations: [],
    references: [
      {
        citation:
          "Rajpurkar P, Zhang J, Lopyrev K, Liang P. SQuAD: 100,000+ questions for machine comprehension of text. EMNLP. 2016:2383-2392.",
      },
    ],
    version: "v0.4.0",
    status: "implemented",
    apiPath: "es.exact_match",
    example: "es.exact_match(references, predictions)      # SQuAD normalisation",
  },
  {
    id: "factuality.faithfulness",
    name: "Faithfulness",
    category: "factuality",
    subcategory: "Claims and citations",
    description:
      "Share of an answer's claims that the evidence supports (FActScore factual precision; RAGAS faithfulness when the evidence is the retrieved context).",
    formula: "supported claims / claims",
    inputs: [
      "claim_verdicts: per answer, the verdict of each claim (supported / contradicted / unsupported)",
    ],
    outputs: "MetricResult (float, or per-example array with average=None)",
    range: "[0, 1]",
    assumptions: [],
    limitations: [],
    references: [
      {
        citation:
          "Min S, Krishna K, Lyu X, et al. FActScore: fine-grained atomic evaluation of factual precision in long form text generation. EMNLP. 2023:12076-12100.",
      },
      {
        citation:
          "Es S, James J, Espinosa-Anke L, Schockaert S. RAGAS: automated evaluation of retrieval augmented generation. EACL (demos). 2024:150-158.",
      },
    ],
    version: "v0.4.0",
    status: "implemented",
    apiPath: "es.faithfulness",
    example: "es.faithfulness(claim_verdicts)",
  },
  {
    id: "factuality.groundedness",
    name: "Groundedness",
    category: "factuality",
    subcategory: "Claims and citations",
    description:
      "Average support score of an answer's content given the supplied context, from graded scores in [0, 1] (e.g. NLI entailment probabilities or judge ratings) rather than binary verdicts.",
    formula: "mean over claims (or sentences) of support score",
    inputs: ["support_scores: per answer, support scores in [0, 1]"],
    outputs: "MetricResult (float, or per-example array with average=None)",
    range: "[0, 1]",
    assumptions: [],
    limitations: [],
    references: [
      {
        citation:
          "Es S, James J, Espinosa-Anke L, Schockaert S. RAGAS: automated evaluation of retrieval augmented generation. EACL (demos). 2024:150-158.",
      },
    ],
    version: "v0.4.0",
    status: "implemented",
    apiPath: "es.groundedness",
    example: "es.groundedness(support_scores)",
  },
  {
    id: "factuality.hallucination_rate",
    name: "Hallucination rate (unsupported-claim rate)",
    category: "factuality",
    subcategory: "Claims and citations",
    description:
      "Share of an answer's claims that the evidence does not support, i.e. contradicted or unverifiable claims, under the stated verification protocol.",
    formula: "(contradicted + unsupported claims) / claims",
    inputs: [
      "claim_verdicts: per answer, the verdict of each claim (supported / contradicted / unsupported)",
    ],
    outputs: "MetricResult (float, or per-example array with average=None)",
    range: "[0, 1]",
    assumptions: [],
    limitations: [],
    references: [
      {
        citation:
          "Min S, Krishna K, Lyu X, et al. FActScore: fine-grained atomic evaluation of factual precision in long form text generation. EMNLP. 2023:12076-12100.",
      },
    ],
    version: "v0.4.0",
    status: "implemented",
    apiPath: "es.hallucination_rate",
    example: "es.hallucination_rate(claim_verdicts)",
  },
  {
    id: "factuality.knowledge_consistency",
    name: "Knowledge consistency",
    category: "factuality",
    subcategory: "Claims and citations",
    description:
      "Share of facts extracted from the outputs (e.g. subject–relation–object triples) that are present in a specified trusted knowledge source.",
    formula: "|extracted facts ∩ knowledge base| / |extracted facts|",
    inputs: [
      "extracted_facts: facts extracted from each output",
      "knowledge_base: set of trusted facts",
    ],
    outputs: "MetricResult (float, or per-example array with average=None)",
    range: "[0, 1]",
    assumptions: [],
    limitations: [],
    references: [
      {
        citation:
          "Min S, Krishna K, Lyu X, et al. FActScore: fine-grained atomic evaluation of factual precision in long form text generation. EMNLP. 2023:12076-12100.",
      },
    ],
    version: "v0.4.0",
    status: "implemented",
    apiPath: "es.knowledge_consistency",
    example: "es.knowledge_consistency(extracted_facts, knowledge_base)",
  },
  {
    id: "factuality.token_f1",
    name: "Token F1",
    category: "factuality",
    subcategory: "Answers",
    description:
      "Harmonic mean of token precision and recall between the normalized prediction and reference (bag of words, SQuAD); best reference per example, averaged over examples.",
    formula: "F1 = 2·P·R/(P + R), P = |common|/|pred tokens|, R = |common|/|ref tokens|",
    inputs: [
      "references: one reference string (or a list of references) per example",
      "predictions: one model output per example",
    ],
    outputs: "MetricResult (float, or per-example array with average=None)",
    range: "[0, 1]",
    assumptions: [],
    limitations: [],
    references: [
      {
        citation:
          "Rajpurkar P, Zhang J, Lopyrev K, Liang P. SQuAD: 100,000+ questions for machine comprehension of text. EMNLP. 2016:2383-2392.",
      },
    ],
    version: "v0.4.0",
    status: "implemented",
    apiPath: "es.token_f1",
    example: "es.token_f1(references, predictions)",
  },
  {
    id: "llm-judge.bradley_terry",
    name: "Bradley–Terry scores",
    category: "llm-judge",
    subcategory: "Pairwise preferences",
    description:
      "Maximum-likelihood strengths of a Bradley–Terry model fitted to pairwise preferences (ties as half a win for each side), by Hunter's MM algorithm; reported as log-strengths centred at 0 or on the Elo-like Chatbot Arena scale.",
    formula: "P(i beats j) = π_i / (π_i + π_j)",
    inputs: ["comparisons: (model_a, model_b, outcome) rows"],
    outputs: "MetricResult (float, or per-example array with average=None)",
    range: "(−∞, ∞)",
    assumptions: [],
    limitations: [],
    references: [
      {
        citation:
          "Bradley RA, Terry ME. Rank analysis of incomplete block designs. Biometrika. 1952;39(3/4):324-345.",
      },
      {
        citation:
          "Hunter DR. MM algorithms for generalized Bradley-Terry models. Ann Stat. 2004;32(1):384-406.",
      },
      {
        citation:
          "Chiang WL, Zheng L, Sheng Y, et al. Chatbot Arena: an open platform for evaluating LLMs by human preference. ICML. 2024.",
      },
    ],
    version: "v0.4.0",
    status: "implemented",
    apiPath: "es.bradley_terry",
    example: 'es.bradley_terry(comparisons, scale="elo")',
  },
  {
    id: "llm-judge.elo_ratings",
    name: "Elo ratings",
    category: "llm-judge",
    subcategory: "Pairwise preferences",
    description:
      "Sequential Elo ratings from pairwise outcomes in the given order (expected score 1/(1 + 10^((R_b − R_a)/400)), update K·(outcome − expected)); order-dependent, unlike Bradley–Terry.",
    formula: "R_a ← R_a + K (S_a − E_a)",
    inputs: ["comparisons: (model_a, model_b, outcome) rows"],
    outputs: "MetricResult (float, or per-example array with average=None)",
    range: "(−∞, ∞), starting at the initial rating",
    assumptions: [],
    limitations: [],
    references: [
      {
        citation: "Elo AE. The Rating of Chessplayers, Past and Present. Arco; 1978.",
      },
      {
        citation:
          "Chiang WL, Zheng L, Sheng Y, et al. Chatbot Arena: an open platform for evaluating LLMs by human preference. ICML. 2024.",
      },
    ],
    version: "v0.4.0",
    status: "implemented",
    apiPath: "es.elo_ratings",
    example: "es.elo_ratings(comparisons)",
  },
  {
    id: "llm-judge.fleiss_kappa",
    name: "Fleiss' kappa",
    category: "llm-judge",
    subcategory: "Agreement",
    description:
      "Chance-corrected agreement of a fixed number of raters assigning items to nominal categories.",
    formula: "κ = (P̄ − P̄_e) / (1 − P̄_e)",
    inputs: ["ratings: raters × items matrix (NaN = missing) or items × raters labels"],
    outputs: "MetricResult (float, or per-example array with average=None)",
    range: "(−∞, 1]",
    assumptions: [],
    limitations: [],
    references: [
      {
        citation:
          "Fleiss JL. Measuring nominal scale agreement among many raters. Psychol Bull. 1971;76(5):378-382.",
      },
    ],
    version: "v0.4.0",
    status: "implemented",
    apiPath: "es.fleiss_kappa",
    example: "es.fleiss_kappa(item_ratings)",
  },
  {
    id: "llm-judge.judge_agreement",
    name: "Judge–human agreement",
    category: "llm-judge",
    subcategory: "Agreement",
    description:
      "Agreement between an automatic judge and human ratings: Cohen's kappa for categories, quadratic-weighted kappa for ordinal scores (with Spearman's ρ), Pearson / Spearman correlation for continuous scores; raw agreement is reported alongside.",
    formula: "kappa or correlation, by data type",
    inputs: ["judge: judge labels or scores", "human: human labels or scores"],
    outputs: "MetricResult (float, or per-example array with average=None)",
    range: "[-1, 1]",
    assumptions: [],
    limitations: [],
    references: [
      {
        citation:
          "Zheng L, Chiang WL, Sheng Y, et al. Judging LLM-as-a-judge with MT-Bench and Chatbot Arena. NeurIPS Datasets and Benchmarks. 2023.",
      },
    ],
    version: "v0.4.0",
    status: "implemented",
    apiPath: "es.judge_agreement",
    example: 'es.judge_agreement(judge_scores, human_scores, kind="ordinal")',
  },
  {
    id: "llm-judge.krippendorff_alpha",
    name: "Krippendorff's alpha",
    category: "llm-judge",
    subcategory: "Agreement",
    description:
      "Chance-corrected agreement among any number of raters with missing ratings, for nominal, ordinal, interval or ratio data.",
    formula: "α = 1 − D_observed / D_expected",
    inputs: ["ratings: raters × items matrix (NaN = missing) or items × raters labels"],
    outputs: "MetricResult (float, or per-example array with average=None)",
    range: "(−∞, 1]",
    assumptions: [],
    limitations: [],
    references: [
      {
        citation:
          "Krippendorff K. Content Analysis: An Introduction to Its Methodology. 4th ed. Sage; 2018.",
      },
    ],
    version: "v0.4.0",
    status: "implemented",
    apiPath: "es.krippendorff_alpha",
    example: 'es.krippendorff_alpha(rater_matrix, level="ordinal")',
  },
  {
    id: "llm-judge.win_rate",
    name: "Pairwise win rate",
    category: "llm-judge",
    subcategory: "Pairwise preferences",
    description:
      "Share of pairwise comparisons in which a system's response is preferred to the baseline; ties count half (or are excluded). A Wilson interval is reported.",
    formula: "(wins + ½ ties) / comparisons",
    inputs: ["outcomes: win / loss / tie against the baseline"],
    outputs: "MetricResult (float, or per-example array with average=None)",
    range: "[0, 1]",
    assumptions: [],
    limitations: [],
    references: [
      {
        citation:
          "Zheng L, Chiang WL, Sheng Y, et al. Judging LLM-as-a-judge with MT-Bench and Chatbot Arena. NeurIPS Datasets and Benchmarks. 2023.",
      },
      {
        citation:
          "Wilson EB. Probable inference, the law of succession, and statistical inference. JASA. 1927;22:209-212.",
      },
    ],
    version: "v0.4.0",
    status: "implemented",
    apiPath: "es.win_rate",
    example: "es.win_rate(outcomes)",
  },
  {
    id: "llm-judge.position_consistency",
    name: "Position consistency",
    category: "llm-judge",
    subcategory: "Judge reliability",
    description:
      "Share of pairwise judgements that stay the same when the two responses are presented in swapped order; the inconsistent cases that favour whichever response was shown first measure position bias.",
    formula: "mean[verdict(A, B) = verdict(B, A)]",
    inputs: [
      "verdicts_original: winner with the original order",
      "verdicts_swapped: winner with the order swapped",
    ],
    outputs: "MetricResult (float, or per-example array with average=None)",
    range: "[0, 1]",
    assumptions: [],
    limitations: [],
    references: [
      {
        citation:
          "Zheng L, Chiang WL, Sheng Y, et al. Judging LLM-as-a-judge with MT-Bench and Chatbot Arena. NeurIPS Datasets and Benchmarks. 2023.",
      },
    ],
    version: "v0.4.0",
    status: "implemented",
    apiPath: "es.position_consistency",
    example: "es.position_consistency(verdicts_original, verdicts_swapped)",
  },
  {
    id: "llm-judge.rubric_score",
    name: "Rubric score",
    category: "llm-judge",
    subcategory: "Rubric scoring",
    description:
      "Mean of rubric ratings (correctness, helpfulness, relevance, coherence, fluency, completeness, clarity, conciseness, tone, instruction adherence, reasoning quality, ...) rescaled to [0, 1], with the mean per criterion.",
    formula: "mean((score − min) / (max − min))",
    inputs: ["scores: rubric ratings, (n, n_criteria)"],
    outputs: "MetricResult (float, or per-example array with average=None)",
    range: "[0, 1]",
    assumptions: [],
    limitations: [],
    references: [
      {
        citation:
          "Zheng L, Chiang WL, Sheng Y, et al. Judging LLM-as-a-judge with MT-Bench and Chatbot Arena. NeurIPS Datasets and Benchmarks. 2023.",
      },
    ],
    version: "v0.4.0",
    status: "implemented",
    apiPath: "es.rubric_score",
    example: 'es.rubric_score(rubric, criteria=["helpfulness", "fluency"])',
  },
  {
    id: "llm-judge.self_preference_bias",
    name: "Self-preference bias",
    category: "llm-judge",
    subcategory: "Judge reliability",
    description:
      "How much more often a judge prefers its own model's outputs than human raters do on the same comparisons.",
    formula: "judge win rate of own outputs − human win rate of own outputs",
    inputs: [
      "judge_prefers_own: judge preferred its own model's output",
      "human_prefers_own: humans preferred the same output",
    ],
    outputs: "MetricResult (float, or per-example array with average=None)",
    range: "[-1, 1]",
    assumptions: [],
    limitations: [],
    references: [
      {
        citation:
          "Panickssery A, Bowman SR, Feng S. LLM evaluators recognize and favor their own generations. NeurIPS. 2024.",
      },
    ],
    version: "v0.4.0",
    status: "implemented",
    apiPath: "es.self_preference_bias",
    example: "es.self_preference_bias(judge_prefers_own, human_prefers_own)",
  },
  {
    id: "llm-judge.verbosity_bias",
    name: "Verbosity bias",
    category: "llm-judge",
    subcategory: "Judge reliability",
    description:
      "Share of decisive judgements (no ties, different lengths) won by the longer response, with a two-sided binomial test against 0.5; well above 0.5 suggests a preference for length.",
    formula: "wins of longer response / decisive comparisons",
    inputs: ["winners: A / B / tie per comparison", "length_a, length_b: response lengths"],
    outputs: "MetricResult (float, or per-example array with average=None)",
    range: "[0, 1]",
    assumptions: [],
    limitations: [],
    references: [
      {
        citation:
          "Zheng L, Chiang WL, Sheng Y, et al. Judging LLM-as-a-judge with MT-Bench and Chatbot Arena. NeurIPS Datasets and Benchmarks. 2023.",
      },
    ],
    version: "v0.4.0",
    status: "implemented",
    apiPath: "es.verbosity_bias",
    example: "es.verbosity_bias(winners, length_a, length_b)",
  },
  {
    id: "rag.context_precision",
    name: "Context precision",
    category: "rag",
    subcategory: "Context and end-to-end",
    description:
      "How well the retriever ranks useful chunks first: the mean of precision@k at the rank of each relevant chunk, over the retrieved list (RAGAS context precision; average precision over retrieved chunks).",
    formula: "Σ_k (precision@k · rel_k) / Σ_k rel_k",
    inputs: ["chunk_relevance: per query, relevance of each retrieved chunk in rank order"],
    outputs: "MetricResult (float, or per-example array with average=None)",
    range: "[0, 1]",
    assumptions: [],
    limitations: [],
    references: [
      {
        citation:
          "Es S, James J, Espinosa-Anke L, Schockaert S. RAGAS: automated evaluation of retrieval augmented generation. EACL (demos). 2024:150-158.",
      },
    ],
    version: "v0.4.0",
    status: "implemented",
    apiPath: "es.context_precision",
    example: "es.context_precision(chunk_relevance)",
  },
  {
    id: "rag.context_recall",
    name: "Context recall",
    category: "rag",
    subcategory: "Context and end-to-end",
    description:
      "Share of the reference answer's claims that can be attributed to the retrieved context (RAGAS context recall): did retrieval find the evidence needed?",
    formula: "reference claims supported by the context / reference claims",
    inputs: ["claim_attributed: per query, whether each reference claim is in the context"],
    outputs: "MetricResult (float, or per-example array with average=None)",
    range: "[0, 1]",
    assumptions: [],
    limitations: [],
    references: [
      {
        citation:
          "Es S, James J, Espinosa-Anke L, Schockaert S. RAGAS: automated evaluation of retrieval augmented generation. EACL (demos). 2024:150-158.",
      },
      {
        citation:
          "Ru D, Qiu L, Hu X, et al. RAGChecker: a fine-grained framework for diagnosing retrieval-augmented generation. NeurIPS Datasets and Benchmarks. 2024.",
      },
    ],
    version: "v0.4.0",
    status: "implemented",
    apiPath: "es.context_recall",
    example: "es.context_recall(claim_attributed)",
  },
  {
    id: "rag.context_relevance",
    name: "Context relevance",
    category: "rag",
    subcategory: "Context and end-to-end",
    description:
      "Share of the retrieved context that is relevant to the question (per chunk or per sentence), a measure of retrieval noise (ARES context relevance).",
    formula: "relevant units / retrieved units",
    inputs: ["unit_relevance: per query, relevance of each retrieved chunk or sentence"],
    outputs: "MetricResult (float, or per-example array with average=None)",
    range: "[0, 1]",
    assumptions: [],
    limitations: [],
    references: [
      {
        citation:
          "Saad-Falcon J, Khattab O, Potts C, Zaharia M. ARES: an automated evaluation framework for retrieval-augmented generation systems. NAACL. 2024:338-354.",
      },
    ],
    version: "v0.4.0",
    status: "implemented",
    apiPath: "es.context_relevance",
    example: "es.context_relevance(chunk_relevance)",
  },
  {
    id: "rag.failure_attribution",
    name: "Failure attribution",
    category: "rag",
    subcategory: "Context and end-to-end",
    description:
      "Distribution of failed requests over the stage that caused them: retrieval (evidence not found), evidence (found but insufficient or conflicting), generation (evidence ignored or misused), orchestration (tools, timeouts, routing) or other.",
    formula: "failures attributed to the stage / failures",
    inputs: ["stages: failing stage per request (None for successes)"],
    outputs: "MetricResult (float, or per-example array with average=None)",
    range: "[0, 1] per stage",
    assumptions: [],
    limitations: [],
    references: [
      {
        citation:
          "Ru D, Qiu L, Hu X, et al. RAGChecker: a fine-grained framework for diagnosing retrieval-augmented generation. NeurIPS Datasets and Benchmarks. 2024.",
      },
    ],
    version: "v0.4.0",
    status: "implemented",
    apiPath: "es.failure_attribution",
    example: "es.failure_attribution(stages)",
  },
  {
    id: "rag.hit_rate_at_k",
    name: "Hit rate@k",
    category: "rag",
    subcategory: "Ranked retrieval",
    description: "Share of queries with at least one relevant document in the top k.",
    formula: "mean_q [|relevant ∩ top_k| > 0]",
    inputs: [
      "relevant: per query, relevant ids or id -> grade",
      "retrieved: per query, ranked ids",
    ],
    outputs: "MetricResult (float, or per-example array with average=None)",
    range: "[0, 1]",
    assumptions: [],
    limitations: [],
    references: [
      {
        citation:
          "Manning CD, Raghavan P, Schütze H. Introduction to Information Retrieval. Cambridge University Press; 2008. Chapter 8.",
      },
    ],
    version: "v0.4.0",
    status: "implemented",
    apiPath: "es.hit_rate_at_k",
    example: "es.hit_rate_at_k(relevant, retrieved, k=5)",
  },
  {
    id: "rag.latency_summary",
    name: "Latency summary",
    category: "rag",
    subcategory: "Operations",
    description:
      "Distribution of a latency (retrieval, time to first token, end-to-end): mean and the 50th, 90th, 95th and 99th percentiles (linear interpolation), in the input's unit.",
    formula: "mean and percentiles of the observed latencies",
    inputs: ["latencies: one latency per request"],
    outputs: "MetricResult (float, or per-example array with average=None)",
    range: "[0, ∞)",
    assumptions: [],
    limitations: [],
    references: [
      {
        citation: "Dean J, Barroso LA. The tail at scale. Commun ACM. 2013;56(2):74-80.",
      },
    ],
    version: "v0.4.0",
    status: "implemented",
    apiPath: "es.latency_summary",
    example: 'es.latency_summary(latencies_ms, statistic="p95")',
  },
  {
    id: "rag.mean_average_precision_at_k",
    name: "Mean average precision",
    category: "rag",
    subcategory: "Ranked retrieval",
    description:
      "For each query, the mean of Precision@i over the ranks i of relevant retrieved documents, divided by the number of relevant documents (unretrieved ones count as 0); averaged over queries (trec_eval convention).",
    formula: "AP = (1/|R|) Σ_i P@i · rel_i ; MAP = mean_q AP_q",
    inputs: [
      "relevant: per query, relevant ids or id -> grade",
      "retrieved: per query, ranked ids",
    ],
    outputs: "MetricResult (float, or per-example array with average=None)",
    range: "[0, 1]",
    assumptions: [],
    limitations: [],
    references: [
      {
        citation:
          "Manning CD, Raghavan P, Schütze H. Introduction to Information Retrieval. Cambridge University Press; 2008. Chapter 8.",
      },
    ],
    version: "v0.4.0",
    status: "implemented",
    apiPath: "es.mean_average_precision_at_k",
    example: "es.mean_average_precision_at_k(relevant, retrieved, k=10)",
  },
  {
    id: "rag.mrr",
    name: "Mean reciprocal rank",
    category: "rag",
    subcategory: "Ranked retrieval",
    description:
      "Average over queries of 1 / rank of the first relevant document (0 when none is retrieved within the cutoff).",
    formula: "MRR = mean_q 1 / rank_q",
    inputs: [
      "relevant: per query, relevant ids or id -> grade",
      "retrieved: per query, ranked ids",
    ],
    outputs: "MetricResult (float, or per-example array with average=None)",
    range: "[0, 1]",
    assumptions: [],
    limitations: [],
    references: [
      {
        citation: "Voorhees EM. The TREC-8 question answering track report. TREC. 1999.",
      },
    ],
    version: "v0.4.0",
    status: "implemented",
    apiPath: "es.mrr",
    example: "es.mrr(relevant, retrieved)",
  },
  {
    id: "rag.ndcg_at_k",
    name: "NDCG@k",
    category: "rag",
    subcategory: "Ranked retrieval",
    description:
      "Discounted cumulative gain of the top k (graded relevance, log2 rank discount) divided by the best possible DCG for the query; linear gains (Järvelin & Kekäläinen, trec_eval) or exponential 2^rel − 1 (Burges).",
    formula: "DCG@k = Σ_{i≤k} gain(rel_i) / log2(i + 1); NDCG@k = DCG@k / IDCG@k",
    inputs: [
      "relevant: per query, relevant ids or id -> grade",
      "retrieved: per query, ranked ids",
    ],
    outputs: "MetricResult (float, or per-example array with average=None)",
    range: "[0, 1]",
    assumptions: [],
    limitations: [],
    references: [
      {
        citation:
          "Järvelin K, Kekäläinen J. Cumulated gain-based evaluation of IR techniques. ACM TOIS. 2002;20(4):422-446.",
      },
      {
        citation: "Burges C, et al. Learning to rank using gradient descent. ICML. 2005:89-96.",
      },
    ],
    version: "v0.4.0",
    status: "implemented",
    apiPath: "es.ndcg_at_k",
    example: "es.ndcg_at_k(graded, retrieved, k=10)",
  },
  {
    id: "rag.precision_at_k",
    name: "Precision@k",
    category: "rag",
    subcategory: "Ranked retrieval",
    description:
      "Share of the top k retrieved documents that are relevant (k in the denominator even when fewer are returned), averaged over queries.",
    formula: "|relevant ∩ top_k| / k",
    inputs: [
      "relevant: per query, relevant ids or id -> grade",
      "retrieved: per query, ranked ids",
    ],
    outputs: "MetricResult (float, or per-example array with average=None)",
    range: "[0, 1]",
    assumptions: [],
    limitations: [],
    references: [
      {
        citation:
          "Manning CD, Raghavan P, Schütze H. Introduction to Information Retrieval. Cambridge University Press; 2008. Chapter 8.",
      },
    ],
    version: "v0.4.0",
    status: "implemented",
    apiPath: "es.precision_at_k",
    example: "es.precision_at_k(relevant, retrieved, k=5)",
  },
  {
    id: "rag.recall_at_k",
    name: "Recall@k",
    category: "rag",
    subcategory: "Ranked retrieval",
    description: "Share of all relevant documents that appear in the top k, averaged over queries.",
    formula: "|relevant ∩ top_k| / |relevant|",
    inputs: [
      "relevant: per query, relevant ids or id -> grade",
      "retrieved: per query, ranked ids",
    ],
    outputs: "MetricResult (float, or per-example array with average=None)",
    range: "[0, 1]",
    assumptions: [],
    limitations: [],
    references: [
      {
        citation:
          "Manning CD, Raghavan P, Schütze H. Introduction to Information Retrieval. Cambridge University Press; 2008. Chapter 8.",
      },
    ],
    version: "v0.4.0",
    status: "implemented",
    apiPath: "es.recall_at_k",
    example: "es.recall_at_k(relevant, retrieved, k=5)",
  },
  {
    id: "rag.task_success_rate",
    name: "Task success rate",
    category: "rag",
    subcategory: "Context and end-to-end",
    description:
      "Share of requests the whole system resolved to specification (end-to-end query resolution, tool-assisted task success), with a Wilson 95% interval.",
    formula: "successful tasks / tasks",
    inputs: ["success: one boolean per task"],
    outputs: "MetricResult (float, or per-example array with average=None)",
    range: "[0, 1]",
    assumptions: [],
    limitations: [],
    references: [
      {
        citation:
          "Wilson EB. Probable inference, the law of succession, and statistical inference. JASA. 1927;22:209-212.",
      },
    ],
    version: "v0.4.0",
    status: "implemented",
    apiPath: "es.task_success_rate",
    example: "es.task_success_rate(success)",
  },
  {
    id: "reasoning.benchmark_accuracy",
    name: "Benchmark accuracy",
    category: "reasoning",
    subcategory: "Benchmarks",
    description:
      "Share of benchmark questions answered correctly after extracting the final answer with the benchmark's convention (GSM8K '####' or last number, MATH \\boxed{}, multiple-choice letter) and comparing with the gold answer.",
    formula: "mean_i [extract(output_i) = gold_i]",
    inputs: [
      "references: one reference string (or a list of references) per example",
      "outputs: model outputs (strings)",
    ],
    outputs: "MetricResult (float, or per-example array with average=None)",
    range: "[0, 1]",
    assumptions: [],
    limitations: [],
    references: [
      {
        citation:
          "Cobbe K, Kosaraju V, Bavarian M, et al. Training verifiers to solve math word problems. arXiv:2110.14168. 2021.",
      },
      {
        citation:
          "Hendrycks D, Burns C, Kadavath S, et al. Measuring mathematical problem solving with the MATH dataset. NeurIPS Datasets and Benchmarks. 2021.",
      },
    ],
    version: "v0.4.0",
    status: "implemented",
    apiPath: "es.benchmark_accuracy",
    example: 'es.benchmark_accuracy(gsm8k_solutions, outputs, style="gsm8k")',
  },
  {
    id: "reasoning.majority_vote_accuracy",
    name: "Majority-vote accuracy",
    category: "reasoning",
    subcategory: "Sampling",
    description:
      "Accuracy of the most frequent answer among several samples per question (self-consistency); ties go to the answer seen first.",
    formula: "mean_i [mode(samples_i) matches a reference]",
    inputs: [
      "references: one reference string (or a list of references) per example",
      "samples: sampled answers per question",
    ],
    outputs: "MetricResult (float, or per-example array with average=None)",
    range: "[0, 1]",
    assumptions: [],
    limitations: [],
    references: [
      {
        citation:
          "Wang X, Wei J, Schuurmans D, et al. Self-consistency improves chain of thought reasoning in language models. ICLR. 2023.",
      },
    ],
    version: "v0.4.0",
    status: "implemented",
    apiPath: "es.majority_vote_accuracy",
    example: "es.majority_vote_accuracy(answers, samples)",
  },
  {
    id: "reasoning.pass_at_k",
    name: "pass@k",
    category: "reasoning",
    subcategory: "Sampling",
    description:
      "Probability that at least one of k samples drawn without replacement from the n generated for a problem passes its tests, estimated without bias from the c passing samples and averaged over problems.",
    formula: "pass@k = mean_problems [1 − C(n − c, k) / C(n, k)]",
    inputs: ["n_samples: samples per problem", "n_correct: passing samples per problem"],
    outputs: "MetricResult (float, or per-example array with average=None)",
    range: "[0, 1]",
    assumptions: [],
    limitations: [],
    references: [
      {
        citation:
          "Chen M, et al. Evaluating large language models trained on code. arXiv:2107.03374. 2021.",
      },
    ],
    version: "v0.4.0",
    status: "implemented",
    apiPath: "es.pass_at_k",
    example: "es.pass_at_k(n_samples, n_correct, k=10)",
  },
  {
    id: "semantic.bertscore",
    name: "BERTScore",
    category: "semantic",
    subcategory: "Embedding-based",
    description:
      "Greedy matching of contextual token embeddings by cosine similarity: precision averages, over prediction tokens, the best similarity to any reference token; recall does the reverse; F1 combines them. Optional IDF weights and baseline rescaling as in the original implementation.",
    formula:
      "P = Σ_j w_j max_i cos(r_i, p_j) / Σ_j w_j;  R = Σ_i w_i max_j cos(r_i, p_j) / Σ_i w_i;  F1 = 2PR/(P+R)",
    inputs: [
      "reference_embeddings: embeddings from your encoder",
      "prediction_embeddings: embeddings with the same dimension",
    ],
    outputs: "MetricResult (float, or per-example array with average=None)",
    range: "[-1, 1] ([0, 1] in practice)",
    assumptions: [],
    limitations: [],
    references: [
      {
        citation:
          "Zhang T, Kishore V, Wu F, Weinberger KQ, Artzi Y. BERTScore: evaluating text generation with BERT. ICLR. 2020.",
      },
    ],
    version: "v0.4.0",
    status: "implemented",
    apiPath: "es.bertscore",
    example: "es.bertscore(ref_token_embeddings, pred_token_embeddings)",
  },
  {
    id: "semantic.embedding_similarity",
    name: "Embedding similarity",
    category: "semantic",
    subcategory: "Embedding-based",
    description:
      "Similarity or distance between the sentence embedding of each prediction and of its reference: cosine similarity, or Euclidean / Manhattan distance. Values depend on the embedding model.",
    formula: "cos = a·b / (‖a‖‖b‖);  euclidean = ‖a − b‖₂;  manhattan = ‖a − b‖₁",
    inputs: [
      "reference_embeddings: embeddings from your encoder",
      "prediction_embeddings: embeddings with the same dimension",
    ],
    outputs: "MetricResult (float, or per-example array with average=None)",
    range: "cosine [-1, 1]; distances [0, ∞)",
    assumptions: [],
    limitations: [],
    references: [
      {
        citation: "Reimers N, Gurevych I. Sentence-BERT. EMNLP-IJCNLP. 2019:3982-3992.",
      },
    ],
    version: "v0.4.0",
    status: "implemented",
    apiPath: "es.embedding_similarity",
    example: 'es.embedding_similarity(ref_embeddings, pred_embeddings, metric="cosine")',
  },
  {
    id: "semantic.model_score",
    name: "Model-based score (COMET, BLEURT, BARTScore, AlignScore, ...)",
    category: "semantic",
    subcategory: "Learned metrics",
    description:
      "Scores from any learned evaluation model or judge you supply, per example, so they get the same confidence intervals, model comparison and reports as every other metric.",
    formula: "mean_i scorer(reference_i, prediction_i[, source_i])",
    inputs: [
      "references: one reference string (or a list of references) per example",
      "predictions: one model output per example",
      "scorer: a callable returning one score per example (COMET, BLEURT, a judge)",
    ],
    outputs: "MetricResult (float, or per-example array with average=None)",
    range: "that of the scorer",
    assumptions: [],
    limitations: [],
    references: [
      {
        citation:
          "Rei R, Stewart C, Farinha AC, Lavie A. COMET: a neural framework for MT evaluation. EMNLP. 2020.",
      },
      {
        citation:
          "Sellam T, Das D, Parikh AP. BLEURT: learning robust metrics for text generation. ACL. 2020.",
      },
    ],
    version: "v0.4.0",
    status: "implemented",
    apiPath: "es.model_score",
    example: "es.model_score(references, predictions, scorer=my_comet_scorer)",
  },
  {
    id: "semantic.moverscore",
    name: "MoverScore",
    category: "semantic",
    subcategory: "Embedding-based",
    description:
      "One minus the earth mover's distance between the IDF-weighted token embeddings of prediction and reference, with Euclidean transport cost between L2-normalised embeddings (MoverScore v2 style).",
    formula: "1 − EMD(w_ref, w_pred; ‖r̂_i − p̂_j‖₂)",
    inputs: [
      "reference_embeddings: embeddings from your encoder",
      "prediction_embeddings: embeddings with the same dimension",
    ],
    outputs: "MetricResult (float, or per-example array with average=None)",
    range: "(−∞, 1]",
    assumptions: [],
    limitations: [],
    references: [
      {
        citation:
          "Zhao W, Peyrard M, Liu F, Gao Y, Meyer CM, Eger S. MoverScore: text generation evaluating with contextualized embeddings and earth mover distance. EMNLP. 2019:563-578.",
      },
    ],
    version: "v0.4.0",
    status: "implemented",
    apiPath: "es.moverscore",
    example: "es.moverscore(ref_token_embeddings, pred_token_embeddings)",
  },
  {
    id: "structured-output.api_call_success_rate",
    name: "API-call success rate",
    category: "structured-output",
    subcategory: "Tool use",
    description:
      "Share of tool or API calls that completed successfully (status flags, HTTP status codes below 400, or exceptions recorded as failures).",
    formula: "successful calls / calls",
    inputs: ["results: per call, success flag, HTTP status or exception"],
    outputs: "MetricResult (float, or per-example array with average=None)",
    range: "[0, 1]",
    assumptions: [],
    limitations: [],
    references: [
      {
        citation:
          "Patil SG, Mao H, Yan F, et al. The Berkeley Function Calling Leaderboard (BFCL): from tool use to agentic evaluation of large language models. ICML. 2025.",
      },
    ],
    version: "v0.4.0",
    status: "implemented",
    apiPath: "es.api_call_success_rate",
    example: "es.api_call_success_rate(call_results)",
  },
  {
    id: "structured-output.constraint_satisfaction_rate",
    name: "Constraint satisfaction rate",
    category: "structured-output",
    subcategory: "Instruction following",
    description:
      "Share of individual constraints satisfied, pooled over all outputs (IFEval instruction-level accuracy).",
    formula: "satisfied constraints / constraints",
    inputs: ["checks: per output, pass/fail of each verifiable instruction"],
    outputs: "MetricResult (float, or per-example array with average=None)",
    range: "[0, 1]",
    assumptions: [],
    limitations: [],
    references: [
      {
        citation:
          "Zhou J, Lu T, Mishra S, et al. Instruction-following evaluation for large language models (IFEval). arXiv:2311.07911. 2023.",
      },
    ],
    version: "v0.4.0",
    status: "implemented",
    apiPath: "es.constraint_satisfaction_rate",
    example: "es.constraint_satisfaction_rate(checks)",
  },
  {
    id: "structured-output.format_compliance",
    name: "Format compliance",
    category: "structured-output",
    subcategory: "Instruction following",
    description:
      "Share of outputs that fully match a required format, given as a regular expression (for example a refusal template or an answer line such as 'Answer: <letter>').",
    formula: "outputs matching the format / outputs",
    inputs: ["outputs: model outputs (strings)", "pattern: regular expression"],
    outputs: "MetricResult (float, or per-example array with average=None)",
    range: "[0, 1]",
    assumptions: [],
    limitations: [],
    references: [
      {
        citation:
          "Zhou J, Lu T, Mishra S, et al. Instruction-following evaluation for large language models (IFEval). arXiv:2311.07911. 2023.",
      },
    ],
    version: "v0.4.0",
    status: "implemented",
    apiPath: "es.format_compliance",
    example: 'es.format_compliance(outputs, r"Answer: [A-D]")',
  },
  {
    id: "structured-output.instruction_compliance_rate",
    name: "Instruction compliance rate",
    category: "structured-output",
    subcategory: "Instruction following",
    description:
      "Share of outputs that satisfy every instruction checked for them (IFEval prompt-level strict accuracy).",
    formula: "outputs with all checks passed / outputs",
    inputs: ["checks: per output, pass/fail of each verifiable instruction"],
    outputs: "MetricResult (float, or per-example array with average=None)",
    range: "[0, 1]",
    assumptions: [],
    limitations: [],
    references: [
      {
        citation:
          "Zhou J, Lu T, Mishra S, et al. Instruction-following evaluation for large language models (IFEval). arXiv:2311.07911. 2023.",
      },
    ],
    version: "v0.4.0",
    status: "implemented",
    apiPath: "es.instruction_compliance_rate",
    example: "es.instruction_compliance_rate(checks)",
  },
  {
    id: "structured-output.json_schema_compliance",
    name: "JSON Schema compliance",
    category: "structured-output",
    subcategory: "Structured output",
    description:
      "Share of outputs that parse as JSON and validate against a JSON Schema (types, required and additional properties, enums, ranges, patterns, arrays, combinators, local $ref).",
    formula: "outputs valid against the schema / outputs",
    inputs: ["outputs: model outputs (strings)", "schema: a JSON Schema"],
    outputs: "MetricResult (float, or per-example array with average=None)",
    range: "[0, 1]",
    assumptions: [],
    limitations: [],
    references: [
      {
        citation:
          "JSON Schema: a media type for describing JSON documents. Draft 2020-12. json-schema.org.",
      },
    ],
    version: "v0.4.0",
    status: "implemented",
    apiPath: "es.json_schema_compliance",
    example: "es.json_schema_compliance(outputs, schema)",
  },
  {
    id: "structured-output.json_validity",
    name: "JSON validity",
    category: "structured-output",
    subcategory: "Structured output",
    description:
      "Share of outputs that parse as JSON (the whole output, or the fenced / embedded JSON in lenient modes).",
    formula: "parseable outputs / outputs",
    inputs: ["outputs: model outputs (strings)"],
    outputs: "MetricResult (float, or per-example array with average=None)",
    range: "[0, 1]",
    assumptions: [],
    limitations: [],
    references: [
      {
        citation:
          "Bray T. The JavaScript Object Notation (JSON) data interchange format. RFC 8259. 2017.",
      },
    ],
    version: "v0.4.0",
    status: "implemented",
    apiPath: "es.json_validity",
    example: 'es.json_validity(outputs, mode="fenced")',
  },
  {
    id: "structured-output.instruction_retention",
    name: "Multi-turn instruction retention",
    category: "structured-output",
    subcategory: "Instruction following",
    description:
      "Share of later turns in which instructions given earlier in the conversation are still satisfied, pooled over conversations.",
    formula: "later-turn checks passed / later-turn checks",
    inputs: ["turn_checks: per conversation, checks in later turns"],
    outputs: "MetricResult (float, or per-example array with average=None)",
    range: "[0, 1]",
    assumptions: [],
    limitations: [],
    references: [
      {
        citation:
          "Kwan WC, Zeng X, Jiang Y, et al. MT-Eval: a multi-turn capabilities evaluation benchmark for large language models. EMNLP. 2024.",
      },
    ],
    version: "v0.4.0",
    status: "implemented",
    apiPath: "es.instruction_retention",
    example: "es.instruction_retention(turn_checks)",
  },
  {
    id: "structured-output.required_field_accuracy",
    name: "Required-field accuracy",
    category: "structured-output",
    subcategory: "Structured output",
    description:
      "Share of expected fields (dotted paths) present in the parsed output with the expected value, pooled over all examples; a missing field or unparseable output counts as wrong.",
    formula: "correct fields / expected fields",
    inputs: [
      "expected: per example, field path -> expected value",
      "outputs: model outputs (strings)",
    ],
    outputs: "MetricResult (float, or per-example array with average=None)",
    range: "[0, 1]",
    assumptions: [],
    limitations: [],
    references: [
      {
        citation:
          "Patil SG, Mao H, Yan F, et al. The Berkeley Function Calling Leaderboard (BFCL): from tool use to agentic evaluation of large language models. ICML. 2025.",
      },
    ],
    version: "v0.4.0",
    status: "implemented",
    apiPath: "es.required_field_accuracy",
    example: "es.required_field_accuracy(expected_fields, outputs)",
  },
  {
    id: "structured-output.tool_argument_accuracy",
    name: "Tool-argument accuracy",
    category: "structured-output",
    subcategory: "Tool use",
    description:
      "Share of expected tool calls reproduced with the right tool and exactly the expected arguments (JSON equality after optional normalisation); calls are matched by tool name in order.",
    formula: "expected calls matched with equal arguments / expected calls",
    inputs: [
      "expected_calls: expected tool calls per example",
      "predicted_calls: predicted tool calls per example",
    ],
    outputs: "MetricResult (float, or per-example array with average=None)",
    range: "[0, 1]",
    assumptions: [],
    limitations: [],
    references: [
      {
        citation:
          "Patil SG, Mao H, Yan F, et al. The Berkeley Function Calling Leaderboard (BFCL): from tool use to agentic evaluation of large language models. ICML. 2025.",
      },
    ],
    version: "v0.4.0",
    status: "implemented",
    apiPath: "es.tool_argument_accuracy",
    example: "es.tool_argument_accuracy(expected_calls, predicted_calls)",
  },
  {
    id: "structured-output.tool_call_f1",
    name: "Tool-call precision, recall and F1",
    category: "structured-output",
    subcategory: "Tool use",
    description:
      "Matching of predicted to expected calls (same tool, and same arguments unless match='name'), pooled over examples: precision over predicted calls, recall over expected calls.",
    formula: "F1 = 2PR/(P+R), P = matched/predicted, R = matched/expected",
    inputs: [
      "expected_calls: expected tool calls per example",
      "predicted_calls: predicted tool calls per example",
    ],
    outputs: "MetricResult (float, or per-example array with average=None)",
    range: "[0, 1]",
    assumptions: [],
    limitations: [],
    references: [
      {
        citation:
          "Patil SG, Mao H, Yan F, et al. The Berkeley Function Calling Leaderboard (BFCL): from tool use to agentic evaluation of large language models. ICML. 2025.",
      },
    ],
    version: "v0.4.0",
    status: "implemented",
    apiPath: "es.tool_call_f1",
    example: "es.tool_call_f1(expected_calls, predicted_calls)",
  },
  {
    id: "structured-output.tool_selection_accuracy",
    name: "Tool-selection accuracy",
    category: "structured-output",
    subcategory: "Tool use",
    description:
      "Share of examples whose predicted tool calls name exactly the expected tools (as a multiset; order ignored unless ordered=True).",
    formula: "mean[tools(predicted) = tools(expected)]",
    inputs: [
      "expected_calls: expected tool calls per example",
      "predicted_calls: predicted tool calls per example",
    ],
    outputs: "MetricResult (float, or per-example array with average=None)",
    range: "[0, 1]",
    assumptions: [],
    limitations: [],
    references: [
      {
        citation:
          "Patil SG, Mao H, Yan F, et al. The Berkeley Function Calling Leaderboard (BFCL): from tool use to agentic evaluation of large language models. ICML. 2025.",
      },
    ],
    version: "v0.4.0",
    status: "implemented",
    apiPath: "es.tool_selection_accuracy",
    example: "es.tool_selection_accuracy(expected_calls, predicted_calls)",
  },
  {
    id: "structured-output.extra_content_rate",
    name: "Unwanted extra-content rate",
    category: "structured-output",
    subcategory: "Structured output",
    description:
      "Share of outputs that contain text beyond the requested payload, e.g. prose or code fences around JSON that should stand alone.",
    formula: "outputs with extra content / outputs",
    inputs: ["outputs: model outputs (strings)"],
    outputs: "MetricResult (float, or per-example array with average=None)",
    range: "[0, 1]",
    assumptions: [],
    limitations: [],
    references: [
      {
        citation:
          "Zhou J, Lu T, Mishra S, et al. Instruction-following evaluation for large language models (IFEval). arXiv:2311.07911. 2023.",
      },
    ],
    version: "v0.4.0",
    status: "implemented",
    apiPath: "es.extra_content_rate",
    example: "es.extra_content_rate(outputs)",
  },
  {
    id: "structured-output.xml_validity",
    name: "XML validity",
    category: "structured-output",
    subcategory: "Structured output",
    description:
      "Share of outputs that are well-formed XML (one root element); document type declarations are rejected so that untrusted output cannot trigger entity expansion.",
    formula: "well-formed outputs / outputs",
    inputs: ["outputs: model outputs (strings)"],
    outputs: "MetricResult (float, or per-example array with average=None)",
    range: "[0, 1]",
    assumptions: [],
    limitations: [],
    references: [
      {
        citation: "Extensible Markup Language (XML) 1.0, 5th ed. W3C Recommendation. 2008.",
      },
    ],
    version: "v0.4.0",
    status: "implemented",
    apiPath: "es.xml_validity",
    example: "es.xml_validity(xml_outputs)",
  },
  {
    id: "text-generation.bleu",
    name: "BLEU",
    category: "text-generation",
    subcategory: "Reference-based and distributional",
    description:
      "Corpus-level geometric mean of clipped n-gram precisions (n = 1..4) times a brevity penalty, computed exactly as sacreBLEU (13a tokenization, exponential smoothing).",
    formula: "BLEU = BP · exp(Σ_n (1/N) log p_n), BP = min(1, exp(1 − r/c))",
    inputs: [
      "references: one reference string (or a list of references) per example",
      "predictions: one model output per example",
    ],
    outputs: "MetricResult (float, or per-example array with average=None)",
    range: "[0, 100]",
    assumptions: [],
    limitations: [],
    references: [
      {
        citation:
          "Papineni K, Roukos S, Ward T, Zhu WJ. BLEU: a method for automatic evaluation of machine translation. ACL. 2002:311-318.",
      },
      {
        citation: "Post M. A call for clarity in reporting BLEU scores. WMT. 2018:186-191.",
      },
      {
        citation:
          "Chen B, Cherry C. A systematic comparison of smoothing techniques for sentence-level BLEU. WMT. 2014.",
      },
    ],
    version: "v0.4.0",
    status: "implemented",
    apiPath: "es.bleu",
    example: "es.bleu(references, predictions)  # corpus BLEU, sacreBLEU conventions",
  },
  {
    id: "text-generation.chrf",
    name: "chrF / chrF++",
    category: "text-generation",
    subcategory: "Reference-based and distributional",
    description:
      "F-beta score (β = 2) over character n-grams (n = 1..6), plus word uni- and bigrams for chrF++ (word_order=2); robust for morphologically rich languages. Computed exactly as sacreBLEU.",
    formula: "chrF_β = (1 + β²) · chrP · chrR / (β² · chrP + chrR)",
    inputs: [
      "references: one reference string (or a list of references) per example",
      "predictions: one model output per example",
    ],
    outputs: "MetricResult (float, or per-example array with average=None)",
    range: "[0, 100]",
    assumptions: [],
    limitations: [],
    references: [
      {
        citation:
          "Popović M. chrF: character n-gram F-score for automatic MT evaluation. WMT. 2015:392-395.",
      },
      {
        citation: "Popović M. chrF++: words helping character n-grams. WMT. 2017:612-618.",
      },
      {
        citation: "Post M. A call for clarity in reporting BLEU scores. WMT. 2018:186-191.",
      },
    ],
    version: "v0.4.0",
    status: "implemented",
    apiPath: "es.chrf",
    example: "es.chrf(references, predictions)               # word_order=2 for chrF++",
  },
  {
    id: "text-generation.cider",
    name: "CIDEr-D",
    category: "text-generation",
    subcategory: "Captioning",
    description:
      "Consensus with several references: cosine similarity of TF-IDF weighted n-gram vectors (n = 1..4), clipped to the reference counts and damped by a Gaussian length penalty; IDF comes from the references of the whole evaluated set (the coco-caption implementation).",
    formula: "10 · mean_n mean_refs [Σ min(g_h, g_r)·g_r / (‖g_h‖‖g_r‖)] · exp(−Δ²/2σ²)",
    inputs: [
      "references: one reference string (or a list of references) per example",
      "predictions: one model output per example",
    ],
    outputs: "MetricResult (float, or per-example array with average=None)",
    range: "[0, 10]",
    assumptions: [],
    limitations: [],
    references: [
      {
        citation:
          "Vedantam R, Zitnick CL, Parikh D. CIDEr: consensus-based image description evaluation. CVPR. 2015:4566-4575.",
      },
    ],
    version: "v0.4.0",
    status: "implemented",
    apiPath: "es.cider",
    example: "es.cider(caption_references, captions)",
  },
  {
    id: "text-generation.cross_entropy",
    name: "Cross-entropy (negative log-likelihood)",
    category: "text-generation",
    subcategory: "Language-model likelihood",
    description:
      "Average negative log-probability the model assigns to the observed tokens, pooled over all tokens of all sequences.",
    formula: "H = −(1/T) Σ_t log p(x_t | x_<t)",
    inputs: ["token_logprobs: per-token natural-log probabilities, one array per sequence"],
    outputs: "MetricResult (float, or per-example array with average=None)",
    range: "[0, ∞)",
    assumptions: [],
    limitations: [],
    references: [
      {
        citation:
          "Jelinek F, Mercer RL, Bahl LR, Baker JK. Perplexity—a measure of the difficulty of speech recognition tasks. JASA. 1977;62(S1):S63.",
      },
    ],
    version: "v0.4.0",
    status: "implemented",
    apiPath: "es.cross_entropy",
    example: "es.cross_entropy(token_logprobs, base=2)  # bits per token",
  },
  {
    id: "text-generation.distinct_n",
    name: "Distinct-n",
    category: "text-generation",
    subcategory: "Reference-based and distributional",
    description:
      "Number of distinct n-grams divided by the total number of n-grams across all predictions (whitespace tokens); a simple lexical-diversity indicator.",
    formula: "|unique n-grams| / |n-grams|",
    inputs: ["predictions: one model output per example"],
    outputs: "MetricResult (float, or per-example array with average=None)",
    range: "[0, 1]",
    assumptions: [],
    limitations: [],
    references: [
      {
        citation:
          "Li J, Galley M, Brockett C, Gao J, Dolan B. A diversity-promoting objective function for neural conversation models. NAACL. 2016:110-119.",
      },
    ],
    version: "v0.4.0",
    status: "implemented",
    apiPath: "es.distinct_n",
    example: "es.distinct_n(predictions, n=2)",
  },
  {
    id: "text-generation.mauve",
    name: "MAUVE",
    category: "text-generation",
    subcategory: "Reference-based and distributional",
    description:
      "Gap between the distribution of generated text and of human text: both sets of feature vectors are quantized together (L2 normalisation, PCA to 90% variance, k-means), and MAUVE is the area under the divergence frontier of the two histograms. 1 means indistinguishable.",
    formula: "area under {(exp(−c·KL(Q‖R_λ)), exp(−c·KL(P‖R_λ))) : R_λ = λP + (1−λ)Q}",
    inputs: [
      "reference_features: one feature vector per human text",
      "generated_features: one feature vector per generated text",
    ],
    outputs: "MetricResult (float, or per-example array with average=None)",
    range: "(0, 1]",
    assumptions: [],
    limitations: [],
    references: [
      {
        citation:
          "Pillutla K, Swayamdipta S, Zellers R, Thickstun J, Welleck S, Choi Y, Harchaoui Z. MAUVE: measuring the gap between neural text and human text using divergence frontiers. NeurIPS. 2021.",
      },
      {
        citation:
          "Pillutla K, Liu L, Thickstun J, Welleck S, Swayamdipta S, Zellers R, Oh S, Choi Y, Harchaoui Z. MAUVE scores for generative models: theory and practice. JMLR. 2023;24(356):1-92.",
      },
    ],
    version: "v0.4.0",
    status: "implemented",
    apiPath: "es.mauve",
    example: "es.mauve(human_features, model_features, random_state=0)",
  },
  {
    id: "text-generation.meteor",
    name: "METEOR",
    category: "text-generation",
    subcategory: "Reference-based and distributional",
    description:
      "Unigram alignment between prediction and reference by exact, stemmed and (optionally) synonym matches; harmonic mean weighted towards recall, penalised for fragmented alignments. Best reference per example, averaged over examples (NLTK's meteor_score).",
    formula: "(1 − γ (chunks/m)^β) · P·R / (α P + (1 − α) R)",
    inputs: [
      "references: one reference string (or a list of references) per example",
      "predictions: one model output per example",
    ],
    outputs: "MetricResult (float, or per-example array with average=None)",
    range: "[0, 1]",
    assumptions: [],
    limitations: [],
    references: [
      {
        citation:
          "Banerjee S, Lavie A. METEOR: an automatic metric for MT evaluation with improved correlation with human judgments. ACL Workshop on Evaluation Measures. 2005:65-72.",
      },
      {
        citation:
          "Lavie A, Agarwal A. METEOR: an automatic metric for MT evaluation with high levels of correlation with human judgments. WMT. 2007:228-231.",
      },
    ],
    version: "v0.4.0",
    status: "implemented",
    apiPath: "es.meteor",
    example: "es.meteor(references, predictions)             # synonyms=... to add WordNet",
  },
  {
    id: "text-generation.perplexity",
    name: "Perplexity",
    category: "text-generation",
    subcategory: "Language-model likelihood",
    description:
      "Exponentiated token-average negative log-likelihood, pooled over all tokens. Only comparable between models that share a tokenizer.",
    formula: "PPL = exp(−(1/T) Σ_t log p(x_t | x_<t))",
    inputs: ["token_logprobs: per-token natural-log probabilities, one array per sequence"],
    outputs: "MetricResult (float, or per-example array with average=None)",
    range: "[1, ∞)",
    assumptions: [],
    limitations: [],
    references: [
      {
        citation:
          "Jelinek F, Mercer RL, Bahl LR, Baker JK. Perplexity—a measure of the difficulty of speech recognition tasks. JASA. 1977;62(S1):S63.",
      },
    ],
    version: "v0.4.0",
    status: "implemented",
    apiPath: "es.perplexity",
    example: "es.perplexity(token_logprobs)",
  },
  {
    id: "text-generation.rouge_1",
    name: "ROUGE-1",
    category: "text-generation",
    subcategory: "Reference-based and distributional",
    description:
      "Unigram overlap between prediction and reference after lowercasing and splitting on non-alphanumerics (as Google's rouge-score); F-measure averaged over examples, best reference per example.",
    formula: "F1 of clipped unigram overlap",
    inputs: [
      "references: one reference string (or a list of references) per example",
      "predictions: one model output per example",
    ],
    outputs: "MetricResult (float, or per-example array with average=None)",
    range: "[0, 1]",
    assumptions: [],
    limitations: [],
    references: [
      {
        citation:
          "Lin CY. ROUGE: a package for automatic evaluation of summaries. Text Summarization Branches Out. 2004.",
      },
    ],
    version: "v0.4.0",
    status: "implemented",
    apiPath: "es.rouge_1",
    example: "es.rouge_1(references, predictions)",
  },
  {
    id: "text-generation.rouge_2",
    name: "ROUGE-2",
    category: "text-generation",
    subcategory: "Reference-based and distributional",
    description:
      "Bigram overlap between prediction and reference after lowercasing and splitting on non-alphanumerics (as Google's rouge-score); F-measure averaged over examples, best reference per example.",
    formula: "F1 of clipped bigram overlap",
    inputs: [
      "references: one reference string (or a list of references) per example",
      "predictions: one model output per example",
    ],
    outputs: "MetricResult (float, or per-example array with average=None)",
    range: "[0, 1]",
    assumptions: [],
    limitations: [],
    references: [
      {
        citation:
          "Lin CY. ROUGE: a package for automatic evaluation of summaries. Text Summarization Branches Out. 2004.",
      },
    ],
    version: "v0.4.0",
    status: "implemented",
    apiPath: "es.rouge_2",
    example: "es.rouge_2(references, predictions)",
  },
  {
    id: "text-generation.rouge_l",
    name: "ROUGE-L",
    category: "text-generation",
    subcategory: "Reference-based and distributional",
    description:
      "Longest common subsequence between prediction and reference after lowercasing and splitting on non-alphanumerics (as Google's rouge-score); F-measure averaged over examples, best reference per example.",
    formula: "P = LCS/|pred|, R = LCS/|ref|, F1",
    inputs: [
      "references: one reference string (or a list of references) per example",
      "predictions: one model output per example",
    ],
    outputs: "MetricResult (float, or per-example array with average=None)",
    range: "[0, 1]",
    assumptions: [],
    limitations: [],
    references: [
      {
        citation:
          "Lin CY. ROUGE: a package for automatic evaluation of summaries. Text Summarization Branches Out. 2004.",
      },
    ],
    version: "v0.4.0",
    status: "implemented",
    apiPath: "es.rouge_l",
    example: 'es.rouge_l(references, predictions, measure="fmeasure")',
  },
  {
    id: "text-generation.rouge_lsum",
    name: "ROUGE-Lsum",
    category: "text-generation",
    subcategory: "Reference-based and distributional",
    description:
      "Summary-level union LCS over sentences (one sentence per line) between prediction and reference after lowercasing and splitting on non-alphanumerics (as Google's rouge-score); F-measure averaged over examples, best reference per example.",
    formula: "union-LCS over newline-separated sentences",
    inputs: [
      "references: one reference string (or a list of references) per example",
      "predictions: one model output per example",
    ],
    outputs: "MetricResult (float, or per-example array with average=None)",
    range: "[0, 1]",
    assumptions: [],
    limitations: [],
    references: [
      {
        citation:
          "Lin CY. ROUGE: a package for automatic evaluation of summaries. Text Summarization Branches Out. 2004.",
      },
    ],
    version: "v0.4.0",
    status: "implemented",
    apiPath: "es.rouge_lsum",
    example: "es.rouge_lsum(references, predictions)       # one sentence per line",
  },
  {
    id: "text-generation.self_bleu",
    name: "Self-BLEU",
    category: "text-generation",
    subcategory: "Reference-based and distributional",
    description:
      "Average sentence BLEU of each prediction against all other predictions as references; higher means the outputs are more alike (less diverse).",
    formula: "mean_i BLEU(p_i, {p_j : j ≠ i})",
    inputs: ["predictions: one model output per example"],
    outputs: "MetricResult (float, or per-example array with average=None)",
    range: "[0, 100]",
    assumptions: [],
    limitations: [],
    references: [
      {
        citation:
          "Zhu Y, et al. Texygen: a benchmarking platform for text generation models. SIGIR. 2018:1097-1100.",
      },
    ],
    version: "v0.4.0",
    status: "implemented",
    apiPath: "es.self_bleu",
    example: "es.self_bleu(predictions)",
  },
  {
    id: "text-generation.sentence_bleu",
    name: "Sentence BLEU",
    category: "text-generation",
    subcategory: "Reference-based and distributional",
    description:
      "BLEU computed for each example separately (exponential smoothing, effective order) and averaged; use for per-example scores, not for reporting corpus quality.",
    formula: "mean_i BLEU(prediction_i, references_i)",
    inputs: [
      "references: one reference string (or a list of references) per example",
      "predictions: one model output per example",
    ],
    outputs: "MetricResult (float, or per-example array with average=None)",
    range: "[0, 100]",
    assumptions: [],
    limitations: [],
    references: [
      {
        citation:
          "Papineni K, Roukos S, Ward T, Zhu WJ. BLEU: a method for automatic evaluation of machine translation. ACL. 2002:311-318.",
      },
      {
        citation:
          "Chen B, Cherry C. A systematic comparison of smoothing techniques for sentence-level BLEU. WMT. 2014.",
      },
    ],
    version: "v0.4.0",
    status: "implemented",
    apiPath: "es.sentence_bleu",
    example: "es.sentence_bleu(references, predictions, average=None)",
  },
  {
    id: "text-generation.spice",
    name: "SPICE",
    category: "text-generation",
    subcategory: "Captioning",
    description:
      "F-score between the semantic tuples (objects, attributes, relations) of the candidate caption's scene graph and the union of the references' scene graphs, with exact or synonym matching; averaged over images.",
    formula: "P = |T(c) ⊗ T(S)| / |T(c)|, R = |T(c) ⊗ T(S)| / |T(S)|, SPICE = 2PR / (P + R)",
    inputs: ["references: one reference string (or a list of references) per example"],
    outputs: "MetricResult (float, or per-example array with average=None)",
    range: "[0, 1]",
    assumptions: [],
    limitations: [],
    references: [
      {
        citation:
          "Anderson P, Fernando B, Johnson M, Gould S. SPICE: semantic propositional image caption evaluation. ECCV. 2016:382-398.",
      },
    ],
    version: "v0.5.0",
    status: "implemented",
    apiPath: "es.spice",
    example:
      'es.spice([[("dog",), ("dog", "brown")]], [[("dog",)]], synonyms=None)  # or parser=, synonyms="wordnet"',
  },
  {
    id: "text-generation.ter",
    name: "TER",
    category: "text-generation",
    subcategory: "Reference-based and distributional",
    description:
      "Translation edit rate: minimum number of insertions, deletions, substitutions and block shifts to turn the prediction into the closest reference, divided by the average reference length (Tercom, as in sacreBLEU). Lower is better.",
    formula: "TER = Σ edits / Σ average reference length × 100",
    inputs: [
      "references: one reference string (or a list of references) per example",
      "predictions: one model output per example",
    ],
    outputs: "MetricResult (float, or per-example array with average=None)",
    range: "[0, ∞)",
    assumptions: [],
    limitations: [],
    references: [
      {
        citation:
          "Snover M, Dorr B, Schwartz R, Micciulla L, Makhoul J. A study of translation edit rate with targeted human annotation. AMTA. 2006:223-231.",
      },
      {
        citation: "Post M. A call for clarity in reporting BLEU scores. WMT. 2018:186-191.",
      },
    ],
    version: "v0.4.0",
    status: "implemented",
    apiPath: "es.ter",
    example: "es.ter(references, predictions)",
  },
];
