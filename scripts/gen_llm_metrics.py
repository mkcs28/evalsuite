"""Generate the website's v0.4.0 metric entries from the evalsuite package registry.

Every example call is executed against the package before it is written, so the site never shows a call that
does not run. Output: src/data/metrics/llm.generated.ts in the website repository.
"""

import json
import sys
import warnings

import numpy as np

import evalsuite as es

SITE = sys.argv[1]

CATEGORY = {
    "generation": "text-generation", "captioning": "text-generation", "language-modeling": "text-generation",
    "semantic-similarity": "semantic", "learned-metric": "semantic",
    "factuality": "factuality", "question-answering": "factuality",
    "preference": "llm-judge", "agreement": "llm-judge", "judge-reliability": "llm-judge", "rubric": "llm-judge",
    "reasoning": "reasoning", "sampling": "reasoning",
    "retrieval": "rag", "rag": "rag", "operations": "rag",
    "structured-output": "structured-output", "tool-use": "structured-output",
    "instruction-following": "structured-output",
}
SUBCATEGORY = {
    "generation": "Reference-based and distributional", "captioning": "Captioning",
    "language-modeling": "Language-model likelihood", "semantic-similarity": "Embedding-based",
    "learned-metric": "Learned metrics", "factuality": "Claims and citations",
    "question-answering": "Answers", "preference": "Pairwise preferences", "agreement": "Agreement",
    "judge-reliability": "Judge reliability", "rubric": "Rubric scoring", "reasoning": "Benchmarks",
    "sampling": "Sampling", "retrieval": "Ranked retrieval", "rag": "Context and end-to-end",
    "operations": "Operations", "structured-output": "Structured output", "tool-use": "Tool use",
    "instruction-following": "Instruction following",
}

INPUTS = {
    "references": "references: one reference string (or a list of references) per example",
    "predictions": "predictions: one model output per example",
    "token_logprobs": "token_logprobs: per-token natural-log probabilities, one array per sequence",
    "reference_embeddings": "reference_embeddings: embeddings from your encoder",
    "prediction_embeddings": "prediction_embeddings: embeddings with the same dimension",
    "reference_features": "reference_features: one feature vector per human text",
    "generated_features": "generated_features: one feature vector per generated text",
    "scorer": "scorer: a callable returning one score per example (COMET, BLEURT, a judge)",
    "claim_verdicts": "claim_verdicts: per answer, the verdict of each claim (supported / contradicted / unsupported)",
    "support_scores": "support_scores: per answer, support scores in [0, 1]",
    "citations": "citations: per answer, statements with 'supported' and per-citation relevance",
    "gold_verdicts": "gold_verdicts: gold claim labels",
    "predicted_verdicts": "predicted_verdicts: predicted claim labels",
    "extracted_facts": "extracted_facts: facts extracted from each output",
    "knowledge_base": "knowledge_base: set of trusted facts",
    "tp": "tp, fp, fn: statement counts per answer",
    "fp": "", "fn": "",
    "question_embeddings": "question_embeddings: (n, dim)",
    "generated_question_embeddings": "generated_question_embeddings: per question, embeddings of regenerated questions",
    "should_abstain": "should_abstain: whether each question should be declined",
    "abstained": "abstained: whether the system declined",
    "outcomes": "outcomes: win / loss / tie against the baseline",
    "comparisons": "comparisons: (model_a, model_b, outcome) rows",
    "ratings": "ratings: raters × items matrix (NaN = missing) or items × raters labels",
    "judge": "judge: judge labels or scores", "human": "human: human labels or scores",
    "verdicts_original": "verdicts_original: winner with the original order",
    "verdicts_swapped": "verdicts_swapped: winner with the order swapped",
    "winners": "winners: A / B / tie per comparison", "length_a": "length_a, length_b: response lengths",
    "length_b": "", "judge_prefers_own": "judge_prefers_own: judge preferred its own model's output",
    "human_prefers_own": "human_prefers_own: humans preferred the same output",
    "scores": "scores: rubric ratings, (n, n_criteria)",
    "n_samples": "n_samples: samples per problem", "n_correct": "n_correct: passing samples per problem",
    "samples": "samples: sampled answers per question", "outputs": "outputs: model outputs (strings)",
    "relevant": "relevant: per query, relevant ids or id -> grade", "retrieved": "retrieved: per query, ranked ids",
    "chunk_relevance": "chunk_relevance: per query, relevance of each retrieved chunk in rank order",
    "claim_attributed": "claim_attributed: per query, whether each reference claim is in the context",
    "unit_relevance": "unit_relevance: per query, relevance of each retrieved chunk or sentence",
    "latencies": "latencies: one latency per request", "success": "success: one boolean per task",
    "stages": "stages: failing stage per request (None for successes)",
    "schema": "schema: a JSON Schema", "expected": "expected: per example, field path -> expected value",
    "expected_calls": "expected_calls: expected tool calls per example",
    "predicted_calls": "predicted_calls: predicted tool calls per example",
    "results": "results: per call, success flag, HTTP status or exception",
    "checks": "checks: per output, pass/fail of each verifiable instruction",
    "turn_checks": "turn_checks: per conversation, checks in later turns", "pattern": "pattern: regular expression",
}

EXAMPLES = {
    "bleu": "es.bleu(references, predictions)  # corpus BLEU, sacreBLEU conventions",
    "sentence_bleu": "es.sentence_bleu(references, predictions, average=None)",
    "chrf": "es.chrf(references, predictions)               # word_order=2 for chrF++",
    "ter": "es.ter(references, predictions)",
    "rouge_1": "es.rouge_1(references, predictions)",
    "rouge_2": "es.rouge_2(references, predictions)",
    "rouge_l": "es.rouge_l(references, predictions, measure=\"fmeasure\")",
    "rouge_lsum": "es.rouge_lsum(references, predictions)       # one sentence per line",
    "meteor": "es.meteor(references, predictions)             # synonyms=... to add WordNet",
    "cider": "es.cider(caption_references, captions)",
    "perplexity": "es.perplexity(token_logprobs)",
    "cross_entropy": "es.cross_entropy(token_logprobs, base=2)  # bits per token",
    "distinct_n": "es.distinct_n(predictions, n=2)",
    "self_bleu": "es.self_bleu(predictions)",
    "mauve": "es.mauve(human_features, model_features, random_state=0)",
    "bertscore": "es.bertscore(ref_token_embeddings, pred_token_embeddings)",
    "embedding_similarity": "es.embedding_similarity(ref_embeddings, pred_embeddings, metric=\"cosine\")",
    "moverscore": "es.moverscore(ref_token_embeddings, pred_token_embeddings)",
    "model_score": "es.model_score(references, predictions, scorer=my_comet_scorer)",
    "exact_match": "es.exact_match(references, predictions)      # SQuAD normalisation",
    "token_f1": "es.token_f1(references, predictions)",
    "faithfulness": "es.faithfulness(claim_verdicts)",
    "hallucination_rate": "es.hallucination_rate(claim_verdicts)",
    "groundedness": "es.groundedness(support_scores)",
    "citation_precision": "es.citation_precision(citations)",
    "citation_recall": "es.citation_recall(citations)",
    "claim_verification_accuracy": "es.claim_verification_accuracy(gold_verdicts, predicted_verdicts)",
    "knowledge_consistency": "es.knowledge_consistency(extracted_facts, knowledge_base)",
    "answer_correctness": "es.answer_correctness(tp, fp, fn, similarity=similarity)",
    "answer_relevance": "es.answer_relevance(question_embeddings, regenerated_embeddings)",
    "abstention_accuracy": "es.abstention_accuracy(should_abstain, abstained, correct=correct)",
    "win_rate": "es.win_rate(outcomes)",
    "bradley_terry": "es.bradley_terry(comparisons, scale=\"elo\")",
    "elo_ratings": "es.elo_ratings(comparisons)",
    "krippendorff_alpha": "es.krippendorff_alpha(rater_matrix, level=\"ordinal\")",
    "fleiss_kappa": "es.fleiss_kappa(item_ratings)",
    "judge_agreement": "es.judge_agreement(judge_scores, human_scores, kind=\"ordinal\")",
    "position_consistency": "es.position_consistency(verdicts_original, verdicts_swapped)",
    "verbosity_bias": "es.verbosity_bias(winners, length_a, length_b)",
    "self_preference_bias": "es.self_preference_bias(judge_prefers_own, human_prefers_own)",
    "rubric_score": "es.rubric_score(rubric, criteria=[\"helpfulness\", \"fluency\"])",
    "pass_at_k": "es.pass_at_k(n_samples, n_correct, k=10)",
    "majority_vote_accuracy": "es.majority_vote_accuracy(answers, samples)",
    "benchmark_accuracy": "es.benchmark_accuracy(gsm8k_solutions, outputs, style=\"gsm8k\")",
    "precision_at_k": "es.precision_at_k(relevant, retrieved, k=5)",
    "recall_at_k": "es.recall_at_k(relevant, retrieved, k=5)",
    "hit_rate_at_k": "es.hit_rate_at_k(relevant, retrieved, k=5)",
    "mrr": "es.mrr(relevant, retrieved)",
    "mean_average_precision_at_k": "es.mean_average_precision_at_k(relevant, retrieved, k=10)",
    "ndcg_at_k": "es.ndcg_at_k(graded, retrieved, k=10)",
    "context_precision": "es.context_precision(chunk_relevance)",
    "context_recall": "es.context_recall(claim_attributed)",
    "context_relevance": "es.context_relevance(chunk_relevance)",
    "latency_summary": "es.latency_summary(latencies_ms, statistic=\"p95\")",
    "task_success_rate": "es.task_success_rate(success)",
    "failure_attribution": "es.failure_attribution(stages)",
    "json_validity": "es.json_validity(outputs, mode=\"fenced\")",
    "json_schema_compliance": "es.json_schema_compliance(outputs, schema)",
    "xml_validity": "es.xml_validity(xml_outputs)",
    "required_field_accuracy": "es.required_field_accuracy(expected_fields, outputs)",
    "tool_selection_accuracy": "es.tool_selection_accuracy(expected_calls, predicted_calls)",
    "tool_argument_accuracy": "es.tool_argument_accuracy(expected_calls, predicted_calls)",
    "tool_call_f1": "es.tool_call_f1(expected_calls, predicted_calls)",
    "api_call_success_rate": "es.api_call_success_rate(call_results)",
    "instruction_compliance_rate": "es.instruction_compliance_rate(checks)",
    "constraint_satisfaction_rate": "es.constraint_satisfaction_rate(checks)",
    "format_compliance": "es.format_compliance(outputs, r\"Answer: [A-D]\")",
    "instruction_retention": "es.instruction_retention(turn_checks)",
    "extra_content_rate": "es.extra_content_rate(outputs)",
}

rng = np.random.default_rng(0)
NS = {
    "es": es,
    "references": [["the cat sat on the mat", "a cat on a mat"], ["a dog ran"], ["hello world"]],
    "predictions": ["the cat sat on a mat", "dog ran", "hello there world"],
    "caption_references": [["a cat on a mat", "a cat sitting", "cat on mat"], ["a red car", "car parked", "red car"]],
    "captions": ["a cat on the mat", "a red car parked"],
    "token_logprobs": [np.log([0.5, 0.25, 0.8]), np.log([0.9, 0.6])],
    "human_features": rng.normal(size=(60, 8)), "model_features": rng.normal(0.3, 1, size=(60, 8)),
    "ref_token_embeddings": [rng.normal(size=(5, 8)) for _ in range(3)],
    "pred_token_embeddings": [rng.normal(size=(4, 8)) for _ in range(3)],
    "ref_embeddings": rng.normal(size=(3, 8)), "pred_embeddings": rng.normal(size=(3, 8)),
    "my_comet_scorer": lambda r, p: [0.8, 0.5, 0.7][: len(p)],
    "claim_verdicts": [["supported", "supported", "contradicted"], [True, False]],
    "support_scores": [[0.9, 0.7], [0.2]],
    "citations": [[{"supported": True, "citations": [True, False]}, {"supported": False, "citations": []}]],
    "gold_verdicts": ["supported", "contradicted", "nei"], "predicted_verdicts": ["supported", "supported", "nei"],
    "extracted_facts": [{("Paris", "capital_of", "France")}], "knowledge_base": {("Paris", "capital_of", "France")},
    "tp": [3, 2], "fp": [1, 0], "fn": [0, 1], "similarity": [0.9, 0.8],
    "question_embeddings": rng.normal(size=(2, 8)), "regenerated_embeddings": [rng.normal(size=(3, 8)) for _ in range(2)],
    "should_abstain": [True, False, False], "abstained": [True, False, True], "correct": [False, True, False],
    "outcomes": ["win", "tie", "loss", "win"],
    "comparisons": [("a", "b", "win"), ("b", "c", "win"), ("c", "a", "win"), ("a", "c", "tie"), ("b", "a", "loss")],
    "rater_matrix": np.array([[1, 2, 3, 3], [1, 2, 3, 4], [2, 2, 3, np.nan]]),
    "item_ratings": [["good", "good", "bad"], ["bad", "bad", "bad"], ["good", "bad", "good"]],
    "judge_scores": [1, 2, 3, 4, 5], "human_scores": [1, 2, 3, 5, 4],
    "verdicts_original": ["A", "B", "A"], "verdicts_swapped": ["A", "A", "A"],
    "winners": ["A", "B", "A"], "length_a": [120, 80, 300], "length_b": [90, 100, 150],
    "judge_prefers_own": [True, True, False], "human_prefers_own": [True, False, False],
    "rubric": [[5, 4], [3, 4]],
    "n_samples": [10, 10], "n_correct": [3, 0], "answers": ["42", "7"], "samples": [["42", "41", "42"], ["7", "8", "8"]],
    "gsm8k_solutions": ["... #### 18", "#### 42"], "outputs": ['{"answer": 18}', "Answer: 41"],
    "relevant": [{"d1", "d3"}, {"d7"}], "retrieved": [["d1", "d2", "d3"], ["d5", "d7"]],
    "graded": [{"d1": 3, "d3": 1}, {"d7": 2}],
    "chunk_relevance": [[True, False, True], [False, True]], "claim_attributed": [[True, True, False], [True]],
    "latencies_ms": [120, 180, 95, 400], "success": [True, True, False],
    "stages": ["retrieval", None, "generation"],
    "schema": {"type": "object", "required": ["answer"]},
    "xml_outputs": ["<a><b>1</b></a>", "<a>"],
    "expected_fields": [{"answer": 18}, {"answer": 42}],
    "expected_calls": [{"name": "search", "arguments": {"q": "evalsuite"}}],
    "predicted_calls": [{"name": "search", "arguments": {"q": "evalsuite"}}],
    "call_results": [200, 500, True], "checks": [[True, True], [True, False]],
    "turn_checks": [[True, [True, False]]],
}

with warnings.catch_warnings():
    warnings.simplefilter("ignore")
    for name, code in EXAMPLES.items():
        exec(code, dict(NS))  # noqa: S102 - verify every example runs

entries = []
for mid in es.list_metrics():
    cat, fn = mid.split(".")
    if cat not in ("text", "reasoning", "retrieval", "rag", "qa"):
        continue
    info = es.metric_info(mid)
    site_cat = CATEGORY[info.task]
    if fn not in EXAMPLES:
        raise SystemExit(f"no example for {fn}")
    inputs = [INPUTS[k] for k in info.input_requirements if INPUTS.get(k)]
    entries.append({
        "id": f"{site_cat}.{fn}",
        "name": info.name,
        "category": site_cat,
        "subcategory": SUBCATEGORY[info.task],
        "description": info.definition,
        "formula": info.formula,
        "inputs": inputs or ["see the API reference"],
        "outputs": "MetricResult (float, or per-example array with average=None)",
        "range": info.range,
        "assumptions": [],
        "limitations": [],
        "references": [{"citation": c} for c in info.references],
        "version": "v0.4.0",
        "status": "implemented",
        "apiPath": f"es.{fn}",
        "example": EXAMPLES[fn],
    })

entries.sort(key=lambda e: (e["category"], e["name"].lower()))
ts = (
    "// Generated from the evalsuite-python 0.4.0 metric registry by scripts/gen_llm_metrics.py.\n"
    "// Every example call was executed against the package. Do not edit by hand.\n"
    'import type { MetricDefinition } from "@/lib/metrics/schema";\n\n'
    "export const LLM_METRICS: MetricDefinition[] = "
    + json.dumps(entries, ensure_ascii=False, indent=2)
    + ";\n"
)
open(f"{SITE}/src/data/metrics/llm.generated.ts", "w", encoding="utf-8").write(ts)
print(f"wrote {len(entries)} metrics; categories: {sorted({e['category'] for e in entries})}")
