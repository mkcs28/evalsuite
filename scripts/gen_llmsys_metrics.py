"""Generate the website's v0.5.0 LLM-systems metric entries from the evalsuite-python registry.

Every example call is executed against the package before it is written. Output:
src/data/metrics/llmsys.generated.ts in the website repository.

    python scripts/gen_llmsys_metrics.py .
"""

import json
import sys
import warnings

import numpy as np

import evalsuite as es

SITE = sys.argv[1]
CATEGORY = {
    "safety": "safety",
    "robustness": "robustness",
    "uncertainty": "uncertainty",
    "agents": "agents",
    "multilingual": "multilingual",
    "code": "code",
    "long_context": "long-context",
    "efficiency": "efficiency",
}
SUBCATEGORY = {
    "safety": "Safety", "security": "Security", "bias": "Bias", "privacy": "Privacy",
    "robustness": "Robustness", "consistency": "Consistency", "generalization": "Generalisation",
    "reliability": "Reliability", "long-context": "Long context", "calibration": "Calibration",
    "selective-prediction": "Selective prediction", "agents": "Agents", "tool-use": "Tool use",
    "planning": "Planning", "state-tracking": "State tracking", "language-identification": "Language ID",
    "semantic-similarity": "Semantic similarity", "fairness": "Parity", "translation": "Translation",
    "culture": "Culture", "code-generation": "Code generation", "code-quality": "Code quality",
    "testing": "Testing", "software-engineering": "Software engineering", "code-security": "Security",
    "code-efficiency": "Efficiency", "summarization": "Summarization", "latency": "Latency",
    "throughput": "Throughput", "usage": "Usage", "cost": "Cost", "resources": "Resources", "energy": "Energy",
}

rng = np.random.default_rng(0)
NS = {
    "es": es,
    "np": np,
    "rng": rng,
    "trajectories": [[{"name": "search", "arguments": {"q": "x"}, "ok": False}, {"name": "search", "arguments": {"q": "y"}, "ok": True}]],
    "tools": {"search": {"type": "object", "properties": {"q": {"type": "string"}}, "required": ["q"]}},
}

EXAMPLES = {
    "harmful_response_rate": "es.harmful_response_rate([True, False, False], harmful_prompt=[True, True, False])",
    "refusal_rate": "es.refusal_rate([True, False, True], should_refuse=[True, False, False])",
    "over_refusal_rate": "es.over_refusal_rate(refused=[True, False, True], should_refuse=[True, False, False])",
    "attack_success_rate": 'es.attack_success_rate([True, False, True], attack_types=["jailbreak", "injection", "injection"])',
    "red_team_success_rate": "es.red_team_success_rate([[False, True], [False, False, False]], k=3)",
    "toxicity_score": "es.toxicity_score([[0.1, 0.8], [0.05, 0.2]], threshold=0.5)  # Perspective / Detoxify scores",
    "stereotype_preference": "es.stereotype_preference(stereo_loglik, anti_stereo_loglik)",
    "weat_effect_size": "es.weat_effect_size(X, Y, A, B, random_state=0)  # embeddings of word sets",
    "pii_leakage_rate": 'es.pii_leakage_rate(["mail me at a@b.io", "no PII"], protected=["SECRET-42"])',
    "exposure": "es.exposure(canary_logppl, candidate_logppl)",
    "policy_violation_rate": 'es.policy_violation_rate([[], ["violence"]], policies=["violence", "pii"])',
    "adversarial_robustness": "es.adversarial_robustness(clean_correct, adversarial_correct)",
    "noise_robustness": "es.noise_robustness(clean_correct, noisy_correct)  # inputs from es.add_typos",
    "ood_accuracy": "es.ood_accuracy(correct, is_ood)",
    "distribution_shift_drop": "es.distribution_shift_drop(source_scores, target_scores)",
    "paraphrase_consistency": 'es.paraphrase_consistency([["Paris", "paris"], ["4", "5"]])',
    "invariance_violation_rate": 'es.invariance_violation_rate(["pos", "neg"], ["pos", "pos"])',
    "response_stability": 'es.response_stability([["a", "a", "b"], ["x", "x", "x"]])',
    "contradiction_rate": 'es.contradiction_rate(["entailment", "contradiction", "neutral"])',
    "error_rate": 'es.error_rate(["ok", "timeout", "ok", "error"])',
    "recovery_success_rate": "es.recovery_success_rate(failed=[True, True, False], recovered=[True, False, False])",
    "prompt_sensitivity": 'es.prompt_sensitivity({"t1": [1, 1, 0], "t2": [1, 0, 0]})',
    "truncation_sensitivity": "es.truncation_sensitivity([1, 1, 0, 0], [4000, 4000, 32000, 32000])",
    "adaptive_calibration_error": "es.adaptive_calibration_error(correct, confidence, n_bins=15)",
    "selective_risk": "es.selective_risk(correct, confidence, coverage=0.8)",
    "aurc": "es.aurc(correct, confidence)  # E-AURC in params",
    "risk_at_coverage": "es.risk_at_coverage(correct, confidence, coverage=0.9)",
    "coverage_at_risk": "es.coverage_at_risk(correct, confidence, risk=0.05)",
    "confidence_accuracy_correlation": "es.confidence_accuracy_correlation(correct, confidence)",
    "task_completion_rate": "es.task_completion_rate([True, False, True], progress=[1, 0.5, 1])",
    "invalid_tool_call_rate": "es.invalid_tool_call_rate(trajectories, tools)  # tools: name -> JSON Schema",
    "tool_use_efficiency": "es.tool_use_efficiency(n_calls=[4, 2], optimal_calls=[2, 2])",
    "steps_per_task": "es.steps_per_task([3, 5, 12], completed=[True, True, False])",
    "plan_adherence": 'es.plan_adherence([["search", "read", "answer"]], [["search", "answer"]])',
    "state_tracking_accuracy": 'es.state_tracking_accuracy([{"area": "north"}], [{"area": "north"}])',
    "tool_failure_recovery_rate": "es.tool_failure_recovery_rate(trajectories)",
    "unnecessary_tool_call_rate": "es.unnecessary_tool_call_rate(trajectories, loop_length=3)",
    "human_intervention_rate": "es.human_intervention_rate([0, 2, 0, 1])",
    "agent_cost_per_task": "es.agent_cost_per_task([0.02, 0.05], durations=[30, 80], completed=[True, False])",
    "language_id_accuracy": 'es.language_id_accuracy(["en", "fr", "hi"], ["en", "fr", "en"])',
    "bitext_mining_accuracy": 'es.bitext_mining_accuracy(src_emb, tgt_emb, scoring="margin")',
    "language_parity": 'es.language_parity({"en": [1, 1, 0, 1], "sw": [1, 0, 0, 1]})',
    "code_switching_robustness": "es.code_switching_robustness(monolingual_correct, code_switched_correct)",
    "direct_assessment": 'es.direct_assessment([70, 85, 40, 55], raters=["r1", "r1", "r2", "r2"])',
    "cultural_appropriateness": 'es.cultural_appropriateness([5, 3, 4], regions=["IN", "IN", "BR"])',
    "language_consistency": 'es.language_consistency(["hi", "en"], ["hi", "hi"])',
    "cross_lingual_consistency": 'es.cross_lingual_consistency([{"en": "Paris", "fr": "Paris"}])',
    "unit_test_pass_rate": "es.unit_test_pass_rate([[True, True], [True, False]])",
    "syntax_validity_rate": 'es.syntax_validity_rate(["x = 1", "def (:"])  # parsed, never run',
    "static_analysis_violation_rate": "es.static_analysis_violation_rate(violations=[2, 0], lines=[120, 80])",
    "execution_success_rate": 'es.execution_success_rate(["passed", "timeout", "wrong_answer"])',
    "coverage_rate": "es.coverage_rate(covered=[45, 10], total=[50, 20])",
    "patch_acceptance_rate": "es.patch_acceptance_rate([True, False, True])",
    "resolved_rate": "es.resolved_rate(fail_to_pass=[[True, True]], pass_to_pass=[[True]])",
    "security_vulnerability_rate": 'es.security_vulnerability_rate([["low"], [], ["high"]], min_severity="medium")',
    "runtime_efficiency": "es.runtime_efficiency(times=[1.2, 0.8], reference_times=[1.0, 1.0])",
    "code_complexity": 'es.code_complexity(["def f(x):\\n    return 1 if x else 0"])',
    "codebleu": 'es.codebleu(["def add(a, b):\\n    return a + b"], ["def add(x, y):\\n    return x + y"])',
    "retrieval_accuracy_by_length": "es.retrieval_accuracy_by_length(correct, context_lengths, threshold=0.85)",
    "needle_in_haystack": "es.needle_in_haystack(correct, context_lengths, depths)",
    "position_accuracy": "es.position_accuracy(correct, positions, n_bins=5)",
    "lost_in_the_middle": "es.lost_in_the_middle(correct, positions)",
    "context_utilization": 'es.context_utilization([["f1"]], [["f1", "f2"]])',
    "summary_coverage": "es.summary_coverage([[True, False, True]], weights=[[3, 2, 1]])",
    "compression_ratio": 'es.compression_ratio(["a long source text here"], ["short"])',
    "citation_coverage": "es.citation_coverage([[1, 0, 2]])",
    "cross_document_consistency": 'es.cross_document_consistency([["A", "A", "B"]])',
    "time_to_first_token": "es.time_to_first_token(request_times=[0.0, 1.0], first_token_times=[0.21, 1.35])",
    "time_per_output_token": "es.time_per_output_token(first_token_times=[0.2], end_times=[2.2], output_tokens=[101])",
    "latency_percentiles": "es.latency_percentiles([0.8, 1.1, 0.9, 4.2], percentile=95)",
    "throughput": "es.throughput(output_tokens=[200, 300], start_times=[0, 0.5], end_times=[4, 5])",
    "token_usage": "es.token_usage(input_tokens=[1200, 800], output_tokens=[300, 150])",
    "inference_cost": "es.inference_cost([1200, 800], [300, 150], input_price=3.0, output_price=15.0)",
    "resource_utilization": 'es.resource_utilization({"memory_gb": [10, 14], "gpu_util": [60, 95]})',
    "energy_per_request": "es.energy_per_request([300, 320, 310], interval_s=1.0, n_requests=10)",
    "requests_per_second": "es.requests_per_second([0.1, 0.4, 0.9, 1.3])",
    "availability": "es.availability([True, 200, 503, True], slo=0.999)",
}

c_ = rng.random(200) < 0.7
NS.update(
    stereo_loglik=rng.normal(-20, 2, 10), anti_stereo_loglik=rng.normal(-20, 2, 10),
    X=rng.normal(size=(4, 8)), Y=rng.normal(size=(4, 8)), A=rng.normal(size=(4, 8)), B=rng.normal(size=(4, 8)),
    canary_logppl=[2.0], candidate_logppl=[list(rng.normal(4, 1, 50))],
    clean_correct=[True, True, False, True], adversarial_correct=[True, False, False, False],
    noisy_correct=[True, False, False, True], correct=c_, is_ood=rng.random(200) < 0.3,
    source_scores=rng.normal(0.8, 0.1, 50), target_scores=rng.normal(0.7, 0.1, 50),
    confidence=np.clip(c_ * 0.3 + rng.uniform(0.2, 0.7, 200), 0, 1),
    src_emb=rng.normal(size=(20, 8)), tgt_emb=rng.normal(size=(20, 8)),
    monolingual_correct=[True, True, False], code_switched_correct=[True, False, False],
    context_lengths=rng.choice([4000, 8000, 16000], 200), depths=rng.choice([0.0, 0.5, 1.0], 200),
    positions=rng.uniform(0, 1, 200),
)

with warnings.catch_warnings():
    warnings.simplefilter("ignore")
    for name, code in EXAMPLES.items():
        eval(code.split("  #")[0], dict(NS))  # noqa: S307 - verify every example runs

entries = []
for mid in es.list_metrics():
    cat, fn = mid.split(".")
    if cat not in CATEGORY:
        continue
    info = es.metric_info(mid)
    if fn not in EXAMPLES:
        raise SystemExit(f"no example for {fn}")
    doc = (info.function.__doc__ or "").strip().split("\n\n")[0].replace("\n", " ")
    entries.append({
        "id": f"{CATEGORY[cat]}.{fn}",
        "name": info.name,
        "category": CATEGORY[cat],
        "subcategory": SUBCATEGORY[info.task],
        "description": info.definition,
        "formula": info.formula,
        "inputs": [f"{k}: see the signature of es.{fn}" for k in info.input_requirements] or ["see the API reference"],
        "outputs": "MetricResult (value plus counts, intervals and breakdowns in params)",
        "range": info.range,
        "assumptions": [doc] if doc and len(doc) < 400 else [],
        "limitations": [],
        "references": [{"citation": c} for c in info.references],
        "version": "v0.5.0",
        "status": "implemented",
        "apiPath": f"es.{fn}",
        "example": EXAMPLES[fn],
    })

entries.sort(key=lambda e: (e["category"], e["name"].lower()))
ts = (
    f"// Generated from the evalsuite-python {es.__version__} metric registry by scripts/gen_llmsys_metrics.py.\n"
    "// Every example call was executed against the package. Do not edit by hand.\n"
    'import type { MetricDefinition } from "@/lib/metrics/schema";\n\n'
    "export const LLMSYS_METRICS: MetricDefinition[] = "
    + json.dumps(entries, ensure_ascii=False, indent=2)
    + ";\n"
)
open(f"{SITE}/src/data/metrics/llmsys.generated.ts", "w", encoding="utf-8").write(ts)
print(f"wrote {len(entries)} metrics; categories: {sorted({e['category'] for e in entries})}")
