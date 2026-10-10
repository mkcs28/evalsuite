// Generated from the evalsuite-python 0.5.0 metric registry by scripts/gen_llmsys_metrics.py.
// Every example call was executed against the package. Do not edit by hand.
import type { MetricDefinition } from "@/lib/metrics/schema";

export const LLMSYS_METRICS: MetricDefinition[] = [
  {
    id: "agents.agent_cost_per_task",
    name: "End-to-end execution time / cost per task",
    category: "agents",
    subcategory: "Agents",
    description:
      "Mean wall-clock time and monetary cost per task, and the cost per successful task (total cost divided by completed tasks), the figure that matters when failures are retried.",
    formula: "cost per success = Σ cost / #completed",
    inputs: ["costs: see the signature of es.agent_cost_per_task"],
    outputs: "MetricResult (value plus counts, intervals and breakdowns in params)",
    range: "[0, ∞)",
    assumptions: [],
    limitations: [],
    references: [
      {
        citation: "Liu X, Yu H, Zhang H, et al. AgentBench: evaluating LLMs as agents. ICLR. 2024.",
      },
    ],
    version: "v0.5.0",
    status: "implemented",
    apiPath: "es.agent_cost_per_task",
    example: "es.agent_cost_per_task([0.02, 0.05], durations=[30, 80], completed=[True, False])",
  },
  {
    id: "agents.human_intervention_rate",
    name: "Human intervention rate",
    category: "agents",
    subcategory: "Agents",
    description:
      "Share of tasks that needed at least one human intervention (correction, approval override, takeover), with the mean number of interventions per task.",
    formula: "tasks with ≥1 intervention / tasks",
    inputs: ["interventions: see the signature of es.human_intervention_rate"],
    outputs: "MetricResult (value plus counts, intervals and breakdowns in params)",
    range: "[0, 1]",
    assumptions: [],
    limitations: [],
    references: [
      {
        citation:
          "Yao S, Shinn N, Razavi P, Narasimhan K. τ-bench: a benchmark for tool-agent-user interaction in real-world domains. arXiv:2406.12045. 2024.",
      },
    ],
    version: "v0.5.0",
    status: "implemented",
    apiPath: "es.human_intervention_rate",
    example: "es.human_intervention_rate([0, 2, 0, 1])",
  },
  {
    id: "agents.invalid_tool_call_rate",
    name: "Invalid tool-call / execution failure rate",
    category: "agents",
    subcategory: "Tool use",
    description:
      "Share of tool calls that are invalid (unknown tool, unparseable or schema-violating arguments, checked against each tool's JSON Schema) and, where execution results are recorded, the share that failed to execute.",
    formula: "invalid calls / calls",
    inputs: [
      "trajectories: see the signature of es.invalid_tool_call_rate",
      "tools: see the signature of es.invalid_tool_call_rate",
    ],
    outputs: "MetricResult (value plus counts, intervals and breakdowns in params)",
    range: "[0, 1]",
    assumptions: [
      "``tools``: tool name -> JSON Schema of its arguments (``{}`` accepts anything).",
    ],
    limitations: [],
    references: [
      {
        citation:
          "Patil SG, Mao H, Cheng-Jie Ji C, et al. The Berkeley Function Calling Leaderboard (BFCL): from tool use to agentic evaluation of large language models. ICML. 2025.",
      },
    ],
    version: "v0.5.0",
    status: "implemented",
    apiPath: "es.invalid_tool_call_rate",
    example: "es.invalid_tool_call_rate(trajectories, tools)  # tools: name -> JSON Schema",
  },
  {
    id: "agents.plan_adherence",
    name: "Planning accuracy / plan adherence",
    category: "agents",
    subcategory: "Planning",
    description:
      "Agreement between the steps executed and a reference plan, in order: precision and recall of the longest common subsequence, their F1 (the value), and the exact-plan match rate.",
    formula: "P = LCS / |executed|, R = LCS / |plan|, F1 = 2PR / (P + R)",
    inputs: [
      "plans: see the signature of es.plan_adherence",
      "executed: see the signature of es.plan_adherence",
    ],
    outputs: "MetricResult (value plus counts, intervals and breakdowns in params)",
    range: "[0, 1]",
    assumptions: [
      "``plans`` and ``executed``: per task, a list of step identifiers (tool names, action labels, ...).",
    ],
    limitations: [],
    references: [
      {
        citation:
          "Ma C, Zhang J, Zhu Z, et al. AgentBoard: an analytical evaluation board of multi-turn LLM agents. NeurIPS Datasets and Benchmarks. 2024.",
      },
    ],
    version: "v0.5.0",
    status: "implemented",
    apiPath: "es.plan_adherence",
    example: 'es.plan_adherence([["search", "read", "answer"]], [["search", "answer"]])',
  },
  {
    id: "agents.tool_failure_recovery_rate",
    name: "Recovery from tool failures",
    category: "agents",
    subcategory: "Tool use",
    description:
      "Among failed tool calls, the share after which the agent later succeeded with the same tool in the same task (retried correctly or fixed the arguments).",
    formula: "#failed calls followed by a successful call of that tool / #failed calls",
    inputs: ["trajectories: see the signature of es.tool_failure_recovery_rate"],
    outputs: "MetricResult (value plus counts, intervals and breakdowns in params)",
    range: "[0, 1]",
    assumptions: [],
    limitations: [],
    references: [
      {
        citation:
          "Yao S, Shinn N, Razavi P, Narasimhan K. τ-bench: a benchmark for tool-agent-user interaction in real-world domains. arXiv:2406.12045. 2024.",
      },
      {
        citation:
          "Ruan Y, Dong H, Wang A, et al. Identifying the risks of LM agents with an LM-emulated sandbox. ICLR. 2024.",
      },
    ],
    version: "v0.5.0",
    status: "implemented",
    apiPath: "es.tool_failure_recovery_rate",
    example: "es.tool_failure_recovery_rate(trajectories)",
  },
  {
    id: "agents.state_tracking_accuracy",
    name: "State-tracking accuracy",
    category: "agents",
    subcategory: "State tracking",
    description:
      "Dialogue / environment state tracking: joint goal accuracy (every slot of the state correct at a turn) and slot accuracy (share of slots correct over the union of expected and predicted slots).",
    formula: "JGA = mean_turns 1[state = expected]",
    inputs: [
      "expected_states: see the signature of es.state_tracking_accuracy",
      "predicted_states: see the signature of es.state_tracking_accuracy",
    ],
    outputs: "MetricResult (value plus counts, intervals and breakdowns in params)",
    range: "[0, 1]",
    assumptions: [],
    limitations: [],
    references: [
      {
        citation:
          "Mrkšić N, Ó Séaghdha D, Wen TH, Thomson B, Young S. Neural belief tracker: data-driven dialogue state tracking. ACL. 2017:1777-1788.",
      },
    ],
    version: "v0.5.0",
    status: "implemented",
    apiPath: "es.state_tracking_accuracy",
    example: 'es.state_tracking_accuracy([{"area": "north"}], [{"area": "north"}])',
  },
  {
    id: "agents.steps_per_task",
    name: "Steps / tool calls per task",
    category: "agents",
    subcategory: "Agents",
    description:
      "Distribution of the number of steps (and tool calls) per task: mean, median and high percentiles, overall and for completed tasks only.",
    formula: "mean_t steps_t",
    inputs: ["steps: see the signature of es.steps_per_task"],
    outputs: "MetricResult (value plus counts, intervals and breakdowns in params)",
    range: "[0, ∞)",
    assumptions: [],
    limitations: [],
    references: [
      {
        citation:
          "Ma C, Zhang J, Zhu Z, et al. AgentBoard: an analytical evaluation board of multi-turn LLM agents. NeurIPS Datasets and Benchmarks. 2024.",
      },
      {
        citation:
          "Yao S, Shinn N, Razavi P, Narasimhan K. τ-bench: a benchmark for tool-agent-user interaction in real-world domains. arXiv:2406.12045. 2024.",
      },
    ],
    version: "v0.5.0",
    status: "implemented",
    apiPath: "es.steps_per_task",
    example: "es.steps_per_task([3, 5, 12], completed=[True, True, False])",
  },
  {
    id: "agents.task_completion_rate",
    name: "Task / goal completion rate",
    category: "agents",
    subcategory: "Agents",
    description:
      "Share of tasks the agent completes (its goal state reached or judged successful), with the mean progress rate when partial progress is scored (AgentBoard).",
    formula: "completed tasks / tasks",
    inputs: ["completed: see the signature of es.task_completion_rate"],
    outputs: "MetricResult (value plus counts, intervals and breakdowns in params)",
    range: "[0, 1]",
    assumptions: [],
    limitations: [],
    references: [
      {
        citation: "Liu X, Yu H, Zhang H, et al. AgentBench: evaluating LLMs as agents. ICLR. 2024.",
      },
      {
        citation:
          "Ma C, Zhang J, Zhu Z, et al. AgentBoard: an analytical evaluation board of multi-turn LLM agents. NeurIPS Datasets and Benchmarks. 2024.",
      },
    ],
    version: "v0.5.0",
    status: "implemented",
    apiPath: "es.task_completion_rate",
    example: "es.task_completion_rate([True, False, True], progress=[1, 0.5, 1])",
  },
  {
    id: "agents.tool_use_efficiency",
    name: "Tool-use efficiency",
    category: "agents",
    subcategory: "Tool use",
    description:
      "How close the number of tool calls is to the minimum needed: the mean of optimal / actual calls per task (1 = no wasted calls), with the mean excess calls.",
    formula: "mean_t min(1, optimal_t / actual_t)",
    inputs: [
      "n_calls: see the signature of es.tool_use_efficiency",
      "optimal_calls: see the signature of es.tool_use_efficiency",
    ],
    outputs: "MetricResult (value plus counts, intervals and breakdowns in params)",
    range: "[0, 1]",
    assumptions: [],
    limitations: [],
    references: [
      {
        citation:
          "Ma C, Zhang J, Zhu Z, et al. AgentBoard: an analytical evaluation board of multi-turn LLM agents. NeurIPS Datasets and Benchmarks. 2024.",
      },
    ],
    version: "v0.5.0",
    status: "implemented",
    apiPath: "es.tool_use_efficiency",
    example: "es.tool_use_efficiency(n_calls=[4, 2], optimal_calls=[2, 2])",
  },
  {
    id: "agents.unnecessary_tool_call_rate",
    name: "Unnecessary tool-call / loop rate",
    category: "agents",
    subcategory: "Tool use",
    description:
      "Share of tool calls that exactly repeat an earlier call (same tool and arguments) in the same task, and the share of tasks stuck in a loop (the same call repeated consecutively at least ``loop_length`` times).",
    formula: "repeated calls / calls",
    inputs: ["trajectories: see the signature of es.unnecessary_tool_call_rate"],
    outputs: "MetricResult (value plus counts, intervals and breakdowns in params)",
    range: "[0, 1]",
    assumptions: [],
    limitations: [],
    references: [
      {
        citation:
          "Ma C, Zhang J, Zhu Z, et al. AgentBoard: an analytical evaluation board of multi-turn LLM agents. NeurIPS Datasets and Benchmarks. 2024.",
      },
    ],
    version: "v0.5.0",
    status: "implemented",
    apiPath: "es.unnecessary_tool_call_rate",
    example: "es.unnecessary_tool_call_rate(trajectories, loop_length=3)",
  },
  {
    id: "code.patch_acceptance_rate",
    name: "Bug reproduction / patch acceptance rate",
    category: "code",
    subcategory: "Software engineering",
    description:
      "Share of attempts accepted: generated patches merged or approved by reviewers, or generated tests that reproduce the reported bug (fail before the fix and pass after it, SWT-Bench).",
    formula: "accepted / attempts",
    inputs: ["accepted: see the signature of es.patch_acceptance_rate"],
    outputs: "MetricResult (value plus counts, intervals and breakdowns in params)",
    range: "[0, 1]",
    assumptions: [
      "Either ``accepted`` (one bool per patch), or ``fails_before`` and ``passes_after`` (one bool per generated reproduction test) for the bug-reproduction rate.",
    ],
    limitations: [],
    references: [
      {
        citation:
          "Mündler N, Müller MN, He J, Vechev M. SWT-Bench: testing and validating real-world bug-fixes with code agents. NeurIPS. 2024.",
      },
      {
        citation:
          "Jimenez CE, Yang J, Wettig A, et al. SWE-bench: can language models resolve real-world GitHub issues? ICLR. 2024.",
      },
    ],
    version: "v0.5.0",
    status: "implemented",
    apiPath: "es.patch_acceptance_rate",
    example: "es.patch_acceptance_rate([True, False, True])",
  },
  {
    id: "code.execution_success_rate",
    name: "Code execution success / functional correctness",
    category: "code",
    subcategory: "Code generation",
    description:
      "Share of generated programs that run to completion and give the expected result in your sandbox, with the breakdown of failure kinds (runtime error, timeout, wrong answer, compile error).",
    formula: "#passed / #programs",
    inputs: ["outcomes: see the signature of es.execution_success_rate"],
    outputs: "MetricResult (value plus counts, intervals and breakdowns in params)",
    range: "[0, 1]",
    assumptions: [
      '``outcomes``: one outcome per program, e.g. ``"passed"``, ``"wrong_answer"``, ``"runtime_error"``, ``"timeout"``.',
    ],
    limitations: [],
    references: [
      {
        citation:
          "Chen M, Tworek J, Jun H, et al. Evaluating large language models trained on code. arXiv:2107.03374. 2021.",
      },
      {
        citation:
          "Austin J, Odena A, Nye M, et al. Program synthesis with large language models. arXiv:2108.07732. 2021.",
      },
    ],
    version: "v0.5.0",
    status: "implemented",
    apiPath: "es.execution_success_rate",
    example: 'es.execution_success_rate(["passed", "timeout", "wrong_answer"])',
  },
  {
    id: "code.codebleu",
    name: "CodeBLEU",
    category: "code",
    subcategory: "Code generation",
    description:
      "Weighted sum of BLEU, keyword-weighted n-gram match, AST subtree match and data-flow match between generated and reference code (Ren et al.). The two n-gram terms follow the reference implementation exactly; the syntax and data-flow terms use Python's own ``ast`` instead of tree-sitter, so they are defined for Python source.",
    formula: "CodeBLEU = α·BLEU + β·BLEU_weight + γ·Match_ast + δ·Match_df",
    inputs: [
      "references: see the signature of es.codebleu",
      "predictions: see the signature of es.codebleu",
    ],
    outputs: "MetricResult (value plus counts, intervals and breakdowns in params)",
    range: "[0, 1]",
    assumptions: [
      "``references``: one reference program (or a list of references) per prediction. Components are in ``params``. When no reference has any data flow the data-flow term counts as 1, as in the reference implementation.",
    ],
    limitations: [],
    references: [
      {
        citation:
          "Ren S, Guo D, Lu S, et al. CodeBLEU: a method for automatic evaluation of code synthesis. arXiv:2009.10297. 2020.",
      },
    ],
    version: "v0.5.0",
    status: "implemented",
    apiPath: "es.codebleu",
    example:
      'es.codebleu(["def add(a, b):\\n    return a + b"], ["def add(x, y):\\n    return x + y"])',
  },
  {
    id: "code.syntax_validity_rate",
    name: "Compilation / syntax validity rate",
    category: "code",
    subcategory: "Code generation",
    description:
      "Share of generated programs that parse (Python: compiled with ``compile`` in 'exec' mode, never run). Other languages: pass a ``checker`` that returns True when the code compiles.",
    formula: "valid programs / programs",
    inputs: ["code: see the signature of es.syntax_validity_rate"],
    outputs: "MetricResult (value plus counts, intervals and breakdowns in params)",
    range: "[0, 1]",
    assumptions: [],
    limitations: [],
    references: [
      {
        citation:
          "Chen M, Tworek J, Jun H, et al. Evaluating large language models trained on code. arXiv:2107.03374. 2021.",
      },
    ],
    version: "v0.5.0",
    status: "implemented",
    apiPath: "es.syntax_validity_rate",
    example: 'es.syntax_validity_rate(["x = 1", "def (:"])  # parsed, never run',
  },
  {
    id: "code.code_complexity",
    name: "Cyclomatic complexity / maintainability index",
    category: "code",
    subcategory: "Code quality",
    description:
      "McCabe cyclomatic complexity of each function (decision points + 1, counted as radon does) and the maintainability index MI = max(0, 100·(171 − 5.2 ln V − 0.23 G − 16.2 ln L + 50 sin √(2.46·rad(C))) / 171) from Halstead volume V, total complexity G, logical lines L and comment percentage C. Python source.",
    formula: "CC = 1 + decisions; MI as above",
    inputs: ["code: see the signature of es.code_complexity"],
    outputs: "MetricResult (value plus counts, intervals and breakdowns in params)",
    range: "CC ≥ 1; MI in [0, 100]",
    assumptions: [
      "Mean cyclomatic complexity per function over all programs (the value), with the maximum, the mean maintainability index and per-program results. Programs that do not parse are rejected.",
    ],
    limitations: [],
    references: [
      {
        citation: "McCabe TJ. A complexity measure. IEEE Trans Softw Eng. 1976;SE-2(4):308-320.",
      },
      {
        citation:
          "Coleman D, Ash D, Lowther B, Oman P. Using metrics to evaluate software system maintainability. Computer. 1994;27(8):44-49.",
      },
    ],
    version: "v0.5.0",
    status: "implemented",
    apiPath: "es.code_complexity",
    example: 'es.code_complexity(["def f(x):\\n    return 1 if x else 0"])',
  },
  {
    id: "code.coverage_rate",
    name: "Generated-code test coverage",
    category: "code",
    subcategory: "Testing",
    description:
      "Line (or branch) coverage achieved by generated tests, pooled over programs (covered / coverable), with the mean per-program coverage.",
    formula: "Σ covered / Σ coverable",
    inputs: [
      "covered: see the signature of es.coverage_rate",
      "total: see the signature of es.coverage_rate",
    ],
    outputs: "MetricResult (value plus counts, intervals and breakdowns in params)",
    range: "[0, 1]",
    assumptions: [],
    limitations: [],
    references: [
      {
        citation:
          "Siddiq ML, Santos JCS, Tanvir RH, et al. Using large language models to generate JUnit tests: an empirical study. EASE. 2024:313-322.",
      },
    ],
    version: "v0.5.0",
    status: "implemented",
    apiPath: "es.coverage_rate",
    example: "es.coverage_rate(covered=[45, 10], total=[50, 20])",
  },
  {
    id: "code.resolved_rate",
    name: "Repository task success / SWE-bench resolved rate",
    category: "code",
    subcategory: "Software engineering",
    description:
      "Share of task instances resolved: every FAIL_TO_PASS test now passes and every PASS_TO_PASS test still passes after applying the generated patch (SWE-bench).",
    formula: "mean_i 1[all F2P pass ∧ all P2P pass]",
    inputs: [
      "fail_to_pass: see the signature of es.resolved_rate",
      "pass_to_pass: see the signature of es.resolved_rate",
    ],
    outputs: "MetricResult (value plus counts, intervals and breakdowns in params)",
    range: "[0, 1]",
    assumptions: [
      "Per instance, the post-patch results of its FAIL_TO_PASS and PASS_TO_PASS tests (lists of bools). ``applied``: whether the patch applied at all (unapplied instances are unresolved).",
    ],
    limitations: [],
    references: [
      {
        citation:
          "Jimenez CE, Yang J, Wettig A, et al. SWE-bench: can language models resolve real-world GitHub issues? ICLR. 2024.",
      },
    ],
    version: "v0.5.0",
    status: "implemented",
    apiPath: "es.resolved_rate",
    example: "es.resolved_rate(fail_to_pass=[[True, True]], pass_to_pass=[[True]])",
  },
  {
    id: "code.runtime_efficiency",
    name: "Runtime efficiency / memory consumption",
    category: "code",
    subcategory: "Efficiency",
    description:
      "Execution time and peak memory of generated solutions relative to reference (canonical) solutions on the same tests: normalised execution time NET and normalised memory usage NMU (EffiBench); values above 1 mean the generated code is slower or uses more memory.",
    formula: "NET = mean_p t_gen / t_ref; NMU = mean_p m_gen / m_ref",
    inputs: [
      "times: see the signature of es.runtime_efficiency",
      "reference_times: see the signature of es.runtime_efficiency",
    ],
    outputs: "MetricResult (value plus counts, intervals and breakdowns in params)",
    range: "(0, ∞) (1 = as efficient as the reference)",
    assumptions: [],
    limitations: [],
    references: [
      {
        citation:
          "Huang D, Zhang JM, Qing Y, Cui H. EffiBench: benchmarking the efficiency of automatically generated code. NeurIPS Datasets and Benchmarks. 2024.",
      },
    ],
    version: "v0.5.0",
    status: "implemented",
    apiPath: "es.runtime_efficiency",
    example: "es.runtime_efficiency(times=[1.2, 0.8], reference_times=[1.0, 1.0])",
  },
  {
    id: "code.security_vulnerability_rate",
    name: "Security vulnerability rate",
    category: "code",
    subcategory: "Security",
    description:
      "Share of generated programs with at least one security finding at or above a severity level (from Bandit, CodeQL, Semgrep), with findings per program by severity.",
    formula: "programs with a finding ≥ severity / programs",
    inputs: ["findings: see the signature of es.security_vulnerability_rate"],
    outputs: "MetricResult (value plus counts, intervals and breakdowns in params)",
    range: "[0, 1]",
    assumptions: [
      '``findings``: per program, the list of finding severities (``"low"``, ``"medium"``, ``"high"``, ``"critical"``).',
    ],
    limitations: [],
    references: [
      {
        citation:
          "Pearce H, Ahmad B, Tan B, Dolan-Gavitt B, Karri R. Asleep at the keyboard? Assessing the security of GitHub Copilot's code contributions. IEEE S&P. 2022:754-768.",
      },
    ],
    version: "v0.5.0",
    status: "implemented",
    apiPath: "es.security_vulnerability_rate",
    example: 'es.security_vulnerability_rate([["low"], [], ["high"]], min_severity="medium")',
  },
  {
    id: "code.static_analysis_violation_rate",
    name: "Static-analysis violation rate",
    category: "code",
    subcategory: "Code quality",
    description:
      "Linter / static-analyser findings in generated code: violations per 1,000 lines (the value) and the share of programs with at least one finding, from counts your analyser (ruff, pylint, ESLint) reported.",
    formula: "1000 · Σ violations / Σ lines",
    inputs: [
      "violations: see the signature of es.static_analysis_violation_rate",
      "lines: see the signature of es.static_analysis_violation_rate",
    ],
    outputs: "MetricResult (value plus counts, intervals and breakdowns in params)",
    range: "[0, ∞)",
    assumptions: [],
    limitations: [],
    references: [
      {
        citation:
          "Liu Y, Le-Cong T, Widyasari R, et al. Refining ChatGPT-generated code: characterizing and mitigating code quality issues. ACM TOSEM. 2024;33(5):1-26.",
      },
    ],
    version: "v0.5.0",
    status: "implemented",
    apiPath: "es.static_analysis_violation_rate",
    example: "es.static_analysis_violation_rate(violations=[2, 0], lines=[120, 80])",
  },
  {
    id: "code.unit_test_pass_rate",
    name: "Unit-test pass rate",
    category: "code",
    subcategory: "Code generation",
    description:
      "Per problem, the share of its unit tests the generated solution passes, averaged over problems; the strict rate (all tests pass) is reported alongside.",
    formula: "mean_p (passed_p / tests_p); strict = mean_p 1[all pass]",
    inputs: ["test_results: see the signature of es.unit_test_pass_rate"],
    outputs: "MetricResult (value plus counts, intervals and breakdowns in params)",
    range: "[0, 1]",
    assumptions: ["``test_results``: per problem, one boolean per unit test."],
    limitations: [],
    references: [
      {
        citation:
          "Chen M, Tworek J, Jun H, et al. Evaluating large language models trained on code. arXiv:2107.03374. 2021.",
      },
      {
        citation:
          "Austin J, Odena A, Nye M, et al. Program synthesis with large language models. arXiv:2108.07732. 2021.",
      },
    ],
    version: "v0.5.0",
    status: "implemented",
    apiPath: "es.unit_test_pass_rate",
    example: "es.unit_test_pass_rate([[True, True], [True, False]])",
  },
  {
    id: "efficiency.inference_cost",
    name: "Cost per request / per 1,000 tokens",
    category: "efficiency",
    subcategory: "Cost",
    description:
      "Monetary cost from token counts and per-million-token prices (input and output priced separately): mean cost per request (the value) and blended cost per 1,000 tokens.",
    formula: "cost_r = in_r · p_in / 10⁶ + out_r · p_out / 10⁶",
    inputs: [
      "input_tokens: see the signature of es.inference_cost",
      "output_tokens: see the signature of es.inference_cost",
      "input_price: see the signature of es.inference_cost",
      "output_price: see the signature of es.inference_cost",
    ],
    outputs: "MetricResult (value plus counts, intervals and breakdowns in params)",
    range: "[0, ∞) currency units",
    assumptions: [
      "Prices are per million tokens. ``cached_tokens`` (part of the input billed at ``cached_price``).",
    ],
    limitations: [],
    references: [
      {
        citation:
          "Luccioni S, Jernite Y, Strubell E. Power hungry processing: watts driving the cost of AI deployment? ACM FAccT. 2024:85-99.",
      },
    ],
    version: "v0.5.0",
    status: "implemented",
    apiPath: "es.inference_cost",
    example: "es.inference_cost([1200, 800], [300, 150], input_price=3.0, output_price=15.0)",
  },
  {
    id: "efficiency.energy_per_request",
    name: "Energy per request",
    category: "efficiency",
    subcategory: "Energy",
    description:
      "Energy consumed per request in watt-hours, from power readings sampled at a fixed interval over the run (trapezoidal integration) or from a measured total, divided by the requests served.",
    formula: "E = ∫ P dt / 3600 / n_requests",
    inputs: [
      "power_watts: see the signature of es.energy_per_request",
      "interval_s: see the signature of es.energy_per_request",
      "n_requests: see the signature of es.energy_per_request",
    ],
    outputs: "MetricResult (value plus counts, intervals and breakdowns in params)",
    range: "[0, ∞) Wh",
    assumptions: [],
    limitations: [],
    references: [
      {
        citation:
          "Luccioni S, Jernite Y, Strubell E. Power hungry processing: watts driving the cost of AI deployment? ACM FAccT. 2024:85-99.",
      },
    ],
    version: "v0.5.0",
    status: "implemented",
    apiPath: "es.energy_per_request",
    example: "es.energy_per_request([300, 320, 310], interval_s=1.0, n_requests=10)",
  },
  {
    id: "efficiency.availability",
    name: "Error rate / availability",
    category: "efficiency",
    subcategory: "Reliability",
    description:
      "Availability: share of requests served successfully (the value), with the error rate and the error budget remaining against a service-level objective.",
    formula: "availability = successful / total; budget = 1 − (1 − availability) / (1 − SLO)",
    inputs: ["success: see the signature of es.availability"],
    outputs: "MetricResult (value plus counts, intervals and breakdowns in params)",
    range: "[0, 1]",
    assumptions: [],
    limitations: [],
    references: [
      {
        citation:
          "Beyer B, Jones C, Petoff J, Murphy NR. Site Reliability Engineering. O'Reilly; 2016.",
      },
    ],
    version: "v0.5.0",
    status: "implemented",
    apiPath: "es.availability",
    example: "es.availability([True, 200, 503, True], slo=0.999)",
  },
  {
    id: "efficiency.token_usage",
    name: "Input / output token counts",
    category: "efficiency",
    subcategory: "Usage",
    description:
      "Token usage per request: mean input and output tokens (the value is mean total tokens), with percentiles and totals.",
    formula: "mean_r (input_r + output_r)",
    inputs: [
      "input_tokens: see the signature of es.token_usage",
      "output_tokens: see the signature of es.token_usage",
    ],
    outputs: "MetricResult (value plus counts, intervals and breakdowns in params)",
    range: "[0, ∞)",
    assumptions: [],
    limitations: [],
    references: [
      {
        citation:
          "Reddi VJ, Cheng C, Kanter D, et al. MLPerf inference benchmark. ISCA. 2020:446-459.",
      },
    ],
    version: "v0.5.0",
    status: "implemented",
    apiPath: "es.token_usage",
    example: "es.token_usage(input_tokens=[1200, 800], output_tokens=[300, 150])",
  },
  {
    id: "efficiency.latency_percentiles",
    name: "p50 / p95 / p99 latency",
    category: "efficiency",
    subcategory: "Latency",
    description:
      "End-to-end request latency percentiles; tail latency (p95, p99) governs user experience at scale. The value is p95; mean, p50, p90 and p99 are in ``params``.",
    formula: "p-th percentile of latency (linear interpolation)",
    inputs: ["latencies: see the signature of es.latency_percentiles"],
    outputs: "MetricResult (value plus counts, intervals and breakdowns in params)",
    range: "[0, ∞)",
    assumptions: [],
    limitations: [],
    references: [
      {
        citation: "Dean J, Barroso LA. The tail at scale. Commun ACM. 2013;56(2):74-80.",
      },
    ],
    version: "v0.5.0",
    status: "implemented",
    apiPath: "es.latency_percentiles",
    example: "es.latency_percentiles([0.8, 1.1, 0.9, 4.2], percentile=95)",
  },
  {
    id: "efficiency.resource_utilization",
    name: "Peak memory / CPU / GPU utilization",
    category: "efficiency",
    subcategory: "Resources",
    description:
      "From periodic resource readings (memory in GB, CPU and GPU utilisation in %), the peak and mean of each series; the value is peak memory when memory readings are given, otherwise the first series' peak.",
    formula: "peak = max_t reading_t; mean = mean_t reading_t",
    inputs: ["readings: see the signature of es.resource_utilization"],
    outputs: "MetricResult (value plus counts, intervals and breakdowns in params)",
    range: "[0, ∞)",
    assumptions: [
      '``readings``: mapping series name (``"memory_gb"``, ``"gpu_util"``, ``"cpu_util"``...) -> samples.',
    ],
    limitations: [],
    references: [
      {
        citation:
          "Reddi VJ, Cheng C, Kanter D, et al. MLPerf inference benchmark. ISCA. 2020:446-459.",
      },
    ],
    version: "v0.5.0",
    status: "implemented",
    apiPath: "es.resource_utilization",
    example: 'es.resource_utilization({"memory_gb": [10, 14], "gpu_util": [60, 95]})',
  },
  {
    id: "efficiency.requests_per_second",
    name: "Requests per second",
    category: "efficiency",
    subcategory: "Throughput",
    description:
      "Completed requests per second over the measurement window, from request completion times.",
    formula: "(n − 1) / (t_last − t_first)",
    inputs: ["completion_times: see the signature of es.requests_per_second"],
    outputs: "MetricResult (value plus counts, intervals and breakdowns in params)",
    range: "[0, ∞)",
    assumptions: [
      "With ``start_time`` (when the load test began) the rate is n / (t_last − start_time).",
    ],
    limitations: [],
    references: [
      {
        citation:
          "Reddi VJ, Cheng C, Kanter D, et al. MLPerf inference benchmark. ISCA. 2020:446-459.",
      },
    ],
    version: "v0.5.0",
    status: "implemented",
    apiPath: "es.requests_per_second",
    example: "es.requests_per_second([0.1, 0.4, 0.9, 1.3])",
  },
  {
    id: "efficiency.throughput",
    name: "Throughput / tokens per second",
    category: "efficiency",
    subcategory: "Throughput",
    description:
      "Output tokens generated per second: system throughput over the measurement window (total tokens / wall-clock span), and the mean per-request decode speed when request durations are given.",
    formula: "Σ output tokens / (t_last_end − t_first_start)",
    inputs: [
      "output_tokens: see the signature of es.throughput",
      "start_times: see the signature of es.throughput",
      "end_times: see the signature of es.throughput",
    ],
    outputs: "MetricResult (value plus counts, intervals and breakdowns in params)",
    range: "[0, ∞) tokens/s",
    assumptions: [],
    limitations: [],
    references: [
      {
        citation:
          "Kwon W, Li Z, Zhuang S, et al. Efficient memory management for large language model serving with PagedAttention. SOSP. 2023:611-626.",
      },
      {
        citation:
          "Reddi VJ, Cheng C, Kanter D, et al. MLPerf inference benchmark. ISCA. 2020:446-459.",
      },
    ],
    version: "v0.5.0",
    status: "implemented",
    apiPath: "es.throughput",
    example: "es.throughput(output_tokens=[200, 300], start_times=[0, 0.5], end_times=[4, 5])",
  },
  {
    id: "efficiency.time_per_output_token",
    name: "Time per Output Token (TPOT)",
    category: "efficiency",
    subcategory: "Latency",
    description:
      "Mean time between output tokens after the first (inter-token latency), per request: (t_end − t_first) / (output tokens − 1).",
    formula: "TPOT = (t_end − t_first) / (n_out − 1)",
    inputs: [
      "first_token_times: see the signature of es.time_per_output_token",
      "end_times: see the signature of es.time_per_output_token",
      "output_tokens: see the signature of es.time_per_output_token",
    ],
    outputs: "MetricResult (value plus counts, intervals and breakdowns in params)",
    range: "[0, ∞) s",
    assumptions: [],
    limitations: [],
    references: [
      {
        citation:
          "Kwon W, Li Z, Zhuang S, et al. Efficient memory management for large language model serving with PagedAttention. SOSP. 2023:611-626.",
      },
      {
        citation:
          "Reddi VJ, Cheng C, Kanter D, et al. MLPerf inference benchmark. ISCA. 2020:446-459.",
      },
    ],
    version: "v0.5.0",
    status: "implemented",
    apiPath: "es.time_per_output_token",
    example:
      "es.time_per_output_token(first_token_times=[0.2], end_times=[2.2], output_tokens=[101])",
  },
  {
    id: "efficiency.time_to_first_token",
    name: "Time to First Token (TTFT)",
    category: "efficiency",
    subcategory: "Latency",
    description:
      "Time from sending a request to receiving the first output token; mean with p50/p90/p95/p99.",
    formula: "TTFT = t_first_token − t_request",
    inputs: [
      "request_times: see the signature of es.time_to_first_token",
      "first_token_times: see the signature of es.time_to_first_token",
    ],
    outputs: "MetricResult (value plus counts, intervals and breakdowns in params)",
    range: "[0, ∞) s",
    assumptions: [],
    limitations: [],
    references: [
      {
        citation:
          "Kwon W, Li Z, Zhuang S, et al. Efficient memory management for large language model serving with PagedAttention. SOSP. 2023:611-626.",
      },
      {
        citation:
          "Reddi VJ, Cheng C, Kanter D, et al. MLPerf inference benchmark. ISCA. 2020:446-459.",
      },
    ],
    version: "v0.5.0",
    status: "implemented",
    apiPath: "es.time_to_first_token",
    example: "es.time_to_first_token(request_times=[0.0, 1.0], first_token_times=[0.21, 1.35])",
  },
  {
    id: "long-context.citation_coverage",
    name: "Citation coverage",
    category: "long-context",
    subcategory: "Summarization",
    description:
      "Share of output statements that carry at least one citation (ALCE: statements that should be attributable must cite something), pooled over outputs.",
    formula: "statements with ≥1 citation / statements",
    inputs: ["citations_per_statement: see the signature of es.citation_coverage"],
    outputs: "MetricResult (value plus counts, intervals and breakdowns in params)",
    range: "[0, 1]",
    assumptions: [
      "``citations_per_statement``: per output, the number of citations attached to each statement.",
    ],
    limitations: [],
    references: [
      {
        citation:
          "Gao T, Yen H, Yu J, Chen D. Enabling large language models to generate text with citations. EMNLP. 2023:6465-6488.",
      },
    ],
    version: "v0.5.0",
    status: "implemented",
    apiPath: "es.citation_coverage",
    example: "es.citation_coverage([[1, 0, 2]])",
  },
  {
    id: "long-context.context_utilization",
    name: "Context utilization / retention",
    category: "long-context",
    subcategory: "Long context",
    description:
      "Share of the relevant facts provided in the context that the output actually uses (or recalls later in a conversation), pooled over examples.",
    formula: "Σ |used ∩ provided| / Σ |provided|",
    inputs: [
      "used_facts: see the signature of es.context_utilization",
      "provided_facts: see the signature of es.context_utilization",
    ],
    outputs: "MetricResult (value plus counts, intervals and breakdowns in params)",
    range: "[0, 1]",
    assumptions: [],
    limitations: [],
    references: [
      {
        citation:
          "Bai Y, Lv X, Zhang J, et al. LongBench: a bilingual, multitask benchmark for long context understanding. ACL. 2024:3119-3137.",
      },
    ],
    version: "v0.5.0",
    status: "implemented",
    apiPath: "es.context_utilization",
    example: 'es.context_utilization([["f1"]], [["f1", "f2"]])',
  },
  {
    id: "long-context.cross_document_consistency",
    name: "Cross-document consistency",
    category: "long-context",
    subcategory: "Long context",
    description:
      "Agreement of answers to the same question across different (orderings or subsets of) documents or truncation levels: share of questions answered identically and mean pairwise agreement.",
    formula: "mean_q 1[all answers equal]",
    inputs: ["answers: see the signature of es.cross_document_consistency"],
    outputs: "MetricResult (value plus counts, intervals and breakdowns in params)",
    range: "[0, 1]",
    assumptions: [],
    limitations: [],
    references: [
      {
        citation:
          "Liu NF, Lin K, Hewitt J, et al. Lost in the middle: how language models use long contexts. TACL. 2024;12:157-173.",
      },
      {
        citation:
          "Bai Y, Lv X, Zhang J, et al. LongBench: a bilingual, multitask benchmark for long context understanding. ACL. 2024:3119-3137.",
      },
    ],
    version: "v0.5.0",
    status: "implemented",
    apiPath: "es.cross_document_consistency",
    example: 'es.cross_document_consistency([["A", "A", "B"]])',
  },
  {
    id: "long-context.retrieval_accuracy_by_length",
    name: "Long-context retrieval accuracy",
    category: "long-context",
    subcategory: "Long context",
    description:
      "Accuracy of retrieving or answering from long contexts, overall and per context-length level (RULER reports the accuracy at each length; the effective length is the longest one above a threshold).",
    formula: "acc_L = mean[correct | length = L]",
    inputs: [
      "correct: see the signature of es.retrieval_accuracy_by_length",
      "context_lengths: see the signature of es.retrieval_accuracy_by_length",
    ],
    outputs: "MetricResult (value plus counts, intervals and breakdowns in params)",
    range: "[0, 1]",
    assumptions: [],
    limitations: [],
    references: [
      {
        citation:
          "Hsieh CP, Sun S, Kriman S, et al. RULER: what's the real context size of your long-context language models? COLM. 2024.",
      },
      {
        citation:
          "Bai Y, Lv X, Zhang J, et al. LongBench: a bilingual, multitask benchmark for long context understanding. ACL. 2024:3119-3137.",
      },
    ],
    version: "v0.5.0",
    status: "implemented",
    apiPath: "es.retrieval_accuracy_by_length",
    example: "es.retrieval_accuracy_by_length(correct, context_lengths, threshold=0.85)",
  },
  {
    id: "long-context.lost_in_the_middle",
    name: "Lost-in-the-middle sensitivity",
    category: "long-context",
    subcategory: "Long context",
    description:
      "How much worse the model does when the relevant passage is in the middle of the context than at its edges: mean accuracy at the start and end positions minus accuracy in the middle (Liu et al. U-curve).",
    formula: "(acc_start + acc_end)/2 − acc_middle",
    inputs: [
      "correct: see the signature of es.lost_in_the_middle",
      "positions: see the signature of es.lost_in_the_middle",
    ],
    outputs: "MetricResult (value plus counts, intervals and breakdowns in params)",
    range: "[−1, 1] (0 = position-invariant)",
    assumptions: [],
    limitations: [],
    references: [
      {
        citation:
          "Liu NF, Lin K, Hewitt J, et al. Lost in the middle: how language models use long contexts. TACL. 2024;12:157-173.",
      },
    ],
    version: "v0.5.0",
    status: "implemented",
    apiPath: "es.lost_in_the_middle",
    example: "es.lost_in_the_middle(correct, positions)",
  },
  {
    id: "long-context.needle_in_haystack",
    name: "Needle-in-a-haystack accuracy",
    category: "long-context",
    subcategory: "Long context",
    description:
      "Retrieval of a planted fact (the needle) from contexts of varying length and insertion depth: overall accuracy and the length × depth accuracy grid (the usual heat map).",
    formula: "acc = mean[correct]; grid[L, d] = mean[correct | L, d]",
    inputs: [
      "correct: see the signature of es.needle_in_haystack",
      "context_lengths: see the signature of es.needle_in_haystack",
      "depths: see the signature of es.needle_in_haystack",
    ],
    outputs: "MetricResult (value plus counts, intervals and breakdowns in params)",
    range: "[0, 1]",
    assumptions: [
      "``depths``: where the needle was placed, as a fraction of the context in [0, 1].",
    ],
    limitations: [],
    references: [
      {
        citation:
          "Kamradt G. Needle in a haystack: pressure testing LLMs. GitHub repository gkamradt/LLMTest_NeedleInAHaystack. 2023.",
      },
      {
        citation:
          "Hsieh CP, Sun S, Kriman S, et al. RULER: what's the real context size of your long-context language models? COLM. 2024.",
      },
    ],
    version: "v0.5.0",
    status: "implemented",
    apiPath: "es.needle_in_haystack",
    example: "es.needle_in_haystack(correct, context_lengths, depths)",
  },
  {
    id: "long-context.position_accuracy",
    name: "Position-dependent retrieval accuracy",
    category: "long-context",
    subcategory: "Long context",
    description:
      "Accuracy as a function of where the relevant information sits in the context (relative position binned into equal-width bins), with the spread between the best and worst bin.",
    formula: "acc_b = mean[correct | position ∈ bin b]; spread = max_b − min_b",
    inputs: [
      "correct: see the signature of es.position_accuracy",
      "positions: see the signature of es.position_accuracy",
    ],
    outputs: "MetricResult (value plus counts, intervals and breakdowns in params)",
    range: "[0, 1]",
    assumptions: [
      "``positions``: relative position of the relevant passage in [0, 1] (0 = start).",
    ],
    limitations: [],
    references: [
      {
        citation:
          "Liu NF, Lin K, Hewitt J, et al. Lost in the middle: how language models use long contexts. TACL. 2024;12:157-173.",
      },
    ],
    version: "v0.5.0",
    status: "implemented",
    apiPath: "es.position_accuracy",
    example: "es.position_accuracy(correct, positions, n_bins=5)",
  },
  {
    id: "long-context.compression_ratio",
    name: "Summary compression ratio",
    category: "long-context",
    subcategory: "Summarization",
    description:
      "How much shorter summaries are than their sources: source words / summary words (Newsroom compression), the mean over documents, with its median.",
    formula: "mean_d |source_d| / |summary_d|",
    inputs: [
      "sources: see the signature of es.compression_ratio",
      "summaries: see the signature of es.compression_ratio",
    ],
    outputs: "MetricResult (value plus counts, intervals and breakdowns in params)",
    range: "[1, ∞) typically",
    assumptions: [],
    limitations: [],
    references: [
      {
        citation:
          "Grusky M, Naaman M, Artzi Y. Newsroom: a dataset of 1.3 million summaries with diverse extractive strategies. NAACL. 2018:708-719.",
      },
    ],
    version: "v0.5.0",
    status: "implemented",
    apiPath: "es.compression_ratio",
    example: 'es.compression_ratio(["a long source text here"], ["short"])',
  },
  {
    id: "long-context.summary_coverage",
    name: "Summary factual consistency / coverage / completeness",
    category: "long-context",
    subcategory: "Summarization",
    description:
      "Coverage: share of the reference key points (pyramid content units) the summary covers, weighted by importance when weights are given; factual consistency (share of summary claims supported by the source) is reported when claim verdicts are passed.",
    formula: "coverage = Σ w·covered / Σ w; consistency = supported claims / claims",
    inputs: ["key_points_covered: see the signature of es.summary_coverage"],
    outputs: "MetricResult (value plus counts, intervals and breakdowns in params)",
    range: "[0, 1]",
    assumptions: [
      "``key_points_covered``: per summary, one boolean per reference key point. ``weights``: per summary, the importance of each key point (pyramid weights). ``claims_supported``: per summary, one boolean per claim.",
    ],
    limitations: [],
    references: [
      {
        citation:
          "Nenkova A, Passonneau R. Evaluating content selection in summarization: the pyramid method. HLT-NAACL. 2004:145-152.",
      },
      {
        citation:
          "Min S, Krishna K, Lyu X, et al. FActScore: fine-grained atomic evaluation of factual precision in long form text generation. EMNLP. 2023:12076-12100.",
      },
    ],
    version: "v0.5.0",
    status: "implemented",
    apiPath: "es.summary_coverage",
    example: "es.summary_coverage([[True, False, True]], weights=[[3, 2, 1]])",
  },
  {
    id: "multilingual.code_switching_robustness",
    name: "Code-switching robustness",
    category: "multilingual",
    subcategory: "Robustness",
    description:
      "Accuracy on code-switched inputs (mixing languages within an utterance) compared with the same content in one language: code-switched accuracy, drop and flip rate.",
    formula: "acc_cs; drop = acc_mono − acc_cs",
    inputs: [
      "monolingual_correct: see the signature of es.code_switching_robustness",
      "code_switched_correct: see the signature of es.code_switching_robustness",
    ],
    outputs: "MetricResult (value plus counts, intervals and breakdowns in params)",
    range: "[0, 1]",
    assumptions: [],
    limitations: [],
    references: [
      {
        citation:
          "Aguilar G, Kar S, Solorio T. LinCE: a centralized benchmark for linguistic code-switching evaluation. LREC. 2020:1803-1813.",
      },
    ],
    version: "v0.5.0",
    status: "implemented",
    apiPath: "es.code_switching_robustness",
    example: "es.code_switching_robustness(monolingual_correct, code_switched_correct)",
  },
  {
    id: "multilingual.cross_lingual_consistency",
    name: "Cross-lingual factual consistency",
    category: "multilingual",
    subcategory: "Consistency",
    description:
      "Whether the model gives the same answer to the same question asked in different languages: share of questions answered identically in every language and mean pairwise agreement (after mapping answers to a common form with ``normalize``).",
    formula: "mean_q 1[all languages agree]",
    inputs: ["answers_by_language: see the signature of es.cross_lingual_consistency"],
    outputs: "MetricResult (value plus counts, intervals and breakdowns in params)",
    range: "[0, 1]",
    assumptions: [
      "``answers_by_language``: per question, a mapping language -> answer (at least two languages).",
    ],
    limitations: [],
    references: [
      {
        citation:
          "Qi J, Fernández R, Bisazza A. Cross-lingual consistency of factual knowledge in multilingual language models. EMNLP. 2023:10650-10666.",
      },
    ],
    version: "v0.5.0",
    status: "implemented",
    apiPath: "es.cross_lingual_consistency",
    example: 'es.cross_lingual_consistency([{"en": "Paris", "fr": "Paris"}])',
  },
  {
    id: "multilingual.cultural_appropriateness",
    name: "Cultural appropriateness",
    category: "multilingual",
    subcategory: "Culture",
    description:
      "Mean rating of how appropriate responses are for the target culture, rescaled to [0, 1] from the rating scale, overall and per culture / region (the gap between the best and worst region is reported).",
    formula: "mean (rating − lo) / (hi − lo)",
    inputs: ["ratings: see the signature of es.cultural_appropriateness"],
    outputs: "MetricResult (value plus counts, intervals and breakdowns in params)",
    range: "[0, 1]",
    assumptions: [],
    limitations: [],
    references: [
      {
        citation:
          "Myung J, Lee N, Zhou Y, et al. BLEnD: a benchmark for LLMs on everyday knowledge in diverse cultures and languages. NeurIPS Datasets and Benchmarks. 2024.",
      },
    ],
    version: "v0.5.0",
    status: "implemented",
    apiPath: "es.cultural_appropriateness",
    example: 'es.cultural_appropriateness([5, 3, 4], regions=["IN", "IN", "BR"])',
  },
  {
    id: "multilingual.language_consistency",
    name: "Language consistency",
    category: "multilingual",
    subcategory: "Consistency",
    description:
      "Share of responses written in the language the user asked or wrote in (language confusion), given the detected language of each response.",
    formula: "mean[detected = expected]",
    inputs: [
      "expected_languages: see the signature of es.language_consistency",
      "detected_languages: see the signature of es.language_consistency",
    ],
    outputs: "MetricResult (value plus counts, intervals and breakdowns in params)",
    range: "[0, 1]",
    assumptions: [],
    limitations: [],
    references: [
      {
        citation:
          "Marchisio K, Ko WY, Bérard A, Dehaze T, Ruder S. Understanding and mitigating language confusion in LLMs. EMNLP. 2024:6653-6677.",
      },
    ],
    version: "v0.5.0",
    status: "implemented",
    apiPath: "es.language_consistency",
    example: 'es.language_consistency(["hi", "en"], ["hi", "hi"])',
  },
  {
    id: "multilingual.language_id_accuracy",
    name: "Language identification accuracy",
    category: "multilingual",
    subcategory: "Language ID",
    description:
      "Accuracy of predicted language labels, with macro-F1 over languages and per-language recall.",
    formula: "mean[pred = true]",
    inputs: [
      "true_languages: see the signature of es.language_id_accuracy",
      "predicted_languages: see the signature of es.language_id_accuracy",
    ],
    outputs: "MetricResult (value plus counts, intervals and breakdowns in params)",
    range: "[0, 1]",
    assumptions: [],
    limitations: [],
    references: [
      {
        citation:
          "Lui M, Baldwin T. langid.py: an off-the-shelf language identification tool. ACL Demos. 2012:25-30.",
      },
    ],
    version: "v0.5.0",
    status: "implemented",
    apiPath: "es.language_id_accuracy",
    example: 'es.language_id_accuracy(["en", "fr", "hi"], ["en", "fr", "en"])',
  },
  {
    id: "multilingual.language_parity",
    name: "Language-specific performance parity",
    category: "multilingual",
    subcategory: "Parity",
    description:
      "How evenly a model performs across languages: the worst-to-best ratio (the value; 1 = parity), the largest gap, the standard deviation, and per-language scores.",
    formula: "parity = min_l score_l / max_l score_l",
    inputs: ["scores_by_language: see the signature of es.language_parity"],
    outputs: "MetricResult (value plus counts, intervals and breakdowns in params)",
    range: "[0, 1]",
    assumptions: [
      "``scores_by_language``: language -> per-example scores (or one aggregate score).",
    ],
    limitations: [],
    references: [
      {
        citation:
          "Hu J, Ruder S, Siddhant A, Neubig G, Firat O, Johnson M. XTREME: a massively multilingual multi-task benchmark for evaluating cross-lingual generalization. ICML. 2020:4411-4421.",
      },
    ],
    version: "v0.5.0",
    status: "implemented",
    apiPath: "es.language_parity",
    example: 'es.language_parity({"en": [1, 1, 0, 1], "sw": [1, 0, 0, 1]})',
  },
  {
    id: "multilingual.bitext_mining_accuracy",
    name: "Multilingual semantic similarity (bitext mining)",
    category: "multilingual",
    subcategory: "Semantic similarity",
    description:
      "For aligned sentence pairs in two languages, the share whose nearest neighbour by cosine (or margin) similarity is the true translation, averaged over both directions (Tatoeba / BUCC style), with the mean cosine of the true pairs.",
    formula:
      "acc = ½ (mean_i 1[argmax_j cos(s_i, t_j) = i] + mean_j 1[argmax_i cos(s_i, t_j) = j])",
    inputs: [
      "source_embeddings: see the signature of es.bitext_mining_accuracy",
      "target_embeddings: see the signature of es.bitext_mining_accuracy",
    ],
    outputs: "MetricResult (value plus counts, intervals and breakdowns in params)",
    range: "[0, 1]",
    assumptions: [
      '``scoring="margin"`` uses the ratio margin of Artetxe & Schwenk with ``k`` neighbours, which removes hub effects.',
    ],
    limitations: [],
    references: [
      {
        citation:
          "Artetxe M, Schwenk H. Massively multilingual sentence embeddings for zero-shot cross-lingual transfer and beyond. TACL. 2019;7:597-610.",
      },
      {
        citation:
          "Hu J, Ruder S, Siddhant A, Neubig G, Firat O, Johnson M. XTREME: a massively multilingual multi-task benchmark for evaluating cross-lingual generalization. ICML. 2020:4411-4421.",
      },
    ],
    version: "v0.5.0",
    status: "implemented",
    apiPath: "es.bitext_mining_accuracy",
    example: 'es.bitext_mining_accuracy(src_emb, tgt_emb, scoring="margin")',
  },
  {
    id: "multilingual.direct_assessment",
    name: "Translation adequacy / fluency (direct assessment)",
    category: "multilingual",
    subcategory: "Translation",
    description:
      "Human direct-assessment scores (0–100 adequacy or fluency) standardised per rater (z-scores) to remove rater bias, then averaged per system, as in WMT DA.",
    formula: "z = (score − mean_rater) / sd_rater; system score = mean z",
    inputs: [
      "scores: see the signature of es.direct_assessment",
      "raters: see the signature of es.direct_assessment",
    ],
    outputs: "MetricResult (value plus counts, intervals and breakdowns in params)",
    range: "(−∞, ∞) for z; [0, 100] raw",
    assumptions: [],
    limitations: [],
    references: [
      {
        citation:
          "Graham Y, Baldwin T, Moffat A, Zobel J. Continuous measurement scales in human evaluation of machine translation. LAW. 2013:33-41.",
      },
    ],
    version: "v0.5.0",
    status: "implemented",
    apiPath: "es.direct_assessment",
    example: 'es.direct_assessment([70, 85, 40, 55], raters=["r1", "r1", "r2", "r2"])',
  },
  {
    id: "robustness.adversarial_robustness",
    name: "Adversarial robustness",
    category: "robustness",
    subcategory: "Robustness",
    description:
      "Accuracy under adversarial perturbation (robust accuracy), with the clean accuracy, the drop and the attack success rate: the share of originally correct examples the attack flips.",
    formula:
      "robust acc = mean[correct_adv]; ASR = #(correct_clean ∧ ¬correct_adv) / #correct_clean",
    inputs: [
      "clean_correct: see the signature of es.adversarial_robustness",
      "adversarial_correct: see the signature of es.adversarial_robustness",
    ],
    outputs: "MetricResult (value plus counts, intervals and breakdowns in params)",
    range: "[0, 1]",
    assumptions: [],
    limitations: [],
    references: [
      {
        citation:
          "Wang B, Xu C, Wang S, et al. Adversarial GLUE: a multi-task benchmark for robustness evaluation of language models. NeurIPS Datasets and Benchmarks. 2021.",
      },
      {
        citation:
          "Zhu K, Wang J, Zhou J, et al. PromptRobust: towards evaluating the robustness of large language models on adversarial prompts. arXiv:2306.04528. 2023.",
      },
    ],
    version: "v0.5.0",
    status: "implemented",
    apiPath: "es.adversarial_robustness",
    example: "es.adversarial_robustness(clean_correct, adversarial_correct)",
  },
  {
    id: "robustness.contradiction_rate",
    name: "Contradiction rate",
    category: "robustness",
    subcategory: "Consistency",
    description:
      "Share of compared response pairs (repeated samples, or answers to related questions) that an NLI model or judge labels as contradicting each other (SelfCheckGPT-NLI style).",
    formula: "#contradiction / #pairs",
    inputs: ["pair_labels: see the signature of es.contradiction_rate"],
    outputs: "MetricResult (value plus counts, intervals and breakdowns in params)",
    range: "[0, 1]",
    assumptions: [
      '``pair_labels``: per compared pair, ``"contradiction"``, ``"entailment"`` or ``"neutral"`` (or a list of such labels per prompt; all pairs are pooled).',
    ],
    limitations: [],
    references: [
      {
        citation:
          "Manakul P, Liusie A, Gales MJF. SelfCheckGPT: zero-resource black-box hallucination detection for generative large language models. EMNLP. 2023:9004-9017.",
      },
    ],
    version: "v0.5.0",
    status: "implemented",
    apiPath: "es.contradiction_rate",
    example: 'es.contradiction_rate(["entailment", "contradiction", "neutral"])',
  },
  {
    id: "robustness.invariance_violation_rate",
    name: "Counterfactual invariance violation rate",
    category: "robustness",
    subcategory: "Consistency",
    description:
      "Share of examples whose prediction changes when only a protected or irrelevant attribute is changed (names, gender terms, dialect): violations of an invariance test.",
    formula: "mean[pred(x) ≠ pred(x')]",
    inputs: [
      "original_predictions: see the signature of es.invariance_violation_rate",
      "counterfactual_predictions: see the signature of es.invariance_violation_rate",
    ],
    outputs: "MetricResult (value plus counts, intervals and breakdowns in params)",
    range: "[0, 1]",
    assumptions: [],
    limitations: [],
    references: [
      {
        citation:
          "Ribeiro MT, Wu T, Guestrin C, Singh S. Beyond accuracy: behavioral testing of NLP models with CheckList. ACL. 2020:4902-4912.",
      },
      {
        citation:
          "Kaushik D, Hovy E, Lipton ZC. Learning the difference that makes a difference with counterfactually-augmented data. ICLR. 2020.",
      },
    ],
    version: "v0.5.0",
    status: "implemented",
    apiPath: "es.invariance_violation_rate",
    example: 'es.invariance_violation_rate(["pos", "neg"], ["pos", "pos"])',
  },
  {
    id: "robustness.distribution_shift_drop",
    name: "Distribution-shift performance drop",
    category: "robustness",
    subcategory: "Generalisation",
    description:
      "Change in a per-example score from the source to the shifted (target) distribution: absolute and relative drop with a 95% Welch interval for the absolute drop.",
    formula: "drop = mean(source) − mean(target); relative = drop / mean(source)",
    inputs: [
      "source_scores: see the signature of es.distribution_shift_drop",
      "target_scores: see the signature of es.distribution_shift_drop",
    ],
    outputs: "MetricResult (value plus counts, intervals and breakdowns in params)",
    range: "(−∞, ∞) (0 = no drop)",
    assumptions: [],
    limitations: [],
    references: [
      {
        citation:
          "Koh PW, Sagawa S, Marklund H, et al. WILDS: a benchmark of in-the-wild distribution shifts. ICML. 2021:5637-5664.",
      },
      {
        citation:
          "Liang P, Bommasani R, Lee T, et al. Holistic evaluation of language models. TMLR. 2023.",
      },
    ],
    version: "v0.5.0",
    status: "implemented",
    apiPath: "es.distribution_shift_drop",
    example: "es.distribution_shift_drop(source_scores, target_scores)",
  },
  {
    id: "robustness.error_rate",
    name: "Failure / timeout / error rate",
    category: "robustness",
    subcategory: "Reliability",
    description:
      "Share of requests that did not complete normally, split into errors and timeouts (any other status label is counted as its own failure kind).",
    formula: "(#error + #timeout + …) / #requests",
    inputs: ["statuses: see the signature of es.error_rate"],
    outputs: "MetricResult (value plus counts, intervals and breakdowns in params)",
    range: "[0, 1]",
    assumptions: [
      '``statuses``: one status per request (``"ok"``, ``"error"``, ``"timeout"``, an HTTP code, ...). Values in ``ok`` count as success.',
    ],
    limitations: [],
    references: [
      {
        citation:
          "Liang P, Bommasani R, Lee T, et al. Holistic evaluation of language models. TMLR. 2023.",
      },
    ],
    version: "v0.5.0",
    status: "implemented",
    apiPath: "es.error_rate",
    example: 'es.error_rate(["ok", "timeout", "ok", "error"])',
  },
  {
    id: "robustness.truncation_sensitivity",
    name: "Long-context robustness / truncation sensitivity",
    category: "robustness",
    subcategory: "Long context",
    description:
      "How performance changes with context length or truncation: accuracy per length bucket and the least-squares slope of accuracy against log2 length (negative = degrades as context grows).",
    formula: "slope of acc_b on log2(len_b)",
    inputs: [
      "correct: see the signature of es.truncation_sensitivity",
      "context_lengths: see the signature of es.truncation_sensitivity",
    ],
    outputs: "MetricResult (value plus counts, intervals and breakdowns in params)",
    range: "(−∞, ∞)",
    assumptions: [],
    limitations: [],
    references: [
      {
        citation:
          "Hsieh CP, Sun S, Kriman S, et al. RULER: what's the real context size of your long-context language models? COLM. 2024.",
      },
    ],
    version: "v0.5.0",
    status: "implemented",
    apiPath: "es.truncation_sensitivity",
    example: "es.truncation_sensitivity([1, 1, 0, 0], [4000, 4000, 32000, 32000])",
  },
  {
    id: "robustness.ood_accuracy",
    name: "Out-of-distribution accuracy",
    category: "robustness",
    subcategory: "Generalisation",
    description:
      "Accuracy on out-of-distribution examples, with in-distribution accuracy and the gap (WILDS reports both; the gap is the generalisation cost).",
    formula: "acc_OOD = mean[correct | OOD]; gap = acc_ID − acc_OOD",
    inputs: [
      "correct: see the signature of es.ood_accuracy",
      "is_ood: see the signature of es.ood_accuracy",
    ],
    outputs: "MetricResult (value plus counts, intervals and breakdowns in params)",
    range: "[0, 1]",
    assumptions: [],
    limitations: [],
    references: [
      {
        citation:
          "Koh PW, Sagawa S, Marklund H, et al. WILDS: a benchmark of in-the-wild distribution shifts. ICML. 2021:5637-5664.",
      },
    ],
    version: "v0.5.0",
    status: "implemented",
    apiPath: "es.ood_accuracy",
    example: "es.ood_accuracy(correct, is_ood)",
  },
  {
    id: "robustness.paraphrase_consistency",
    name: "Paraphrase consistency",
    category: "robustness",
    subcategory: "Consistency",
    description:
      "Whether the model gives the same answer to paraphrases of the same question: the share of items where all paraphrases agree, and the mean pairwise agreement (ParaRel consistency).",
    formula: "mean_items 1[all answers equal]; pairwise = mean over pairs 1[a_i = a_j]",
    inputs: ["answers: see the signature of es.paraphrase_consistency"],
    outputs: "MetricResult (value plus counts, intervals and breakdowns in params)",
    range: "[0, 1]",
    assumptions: [
      "``answers``: per item, the answers to each paraphrase (at least two). Strings are compared after lower-casing and whitespace normalisation unless ``normalize`` is given.",
    ],
    limitations: [],
    references: [
      {
        citation:
          "Elazar Y, Kassner N, Ravfogel S, et al. Measuring and improving consistency in pretrained language models. TACL. 2021;9:1012-1031.",
      },
      {
        citation:
          "Ribeiro MT, Wu T, Guestrin C, Singh S. Beyond accuracy: behavioral testing of NLP models with CheckList. ACL. 2020:4902-4912.",
      },
    ],
    version: "v0.5.0",
    status: "implemented",
    apiPath: "es.paraphrase_consistency",
    example: 'es.paraphrase_consistency([["Paris", "paris"], ["4", "5"]])',
  },
  {
    id: "robustness.prompt_sensitivity",
    name: "Prompt wording sensitivity",
    category: "robustness",
    subcategory: "Robustness",
    description:
      "Spread of task performance across semantically equivalent prompt templates: the range (best − worst accuracy), standard deviation and worst-case accuracy over templates (FormatSpread).",
    formula: "spread = max_t acc_t − min_t acc_t",
    inputs: ["correct_by_template: see the signature of es.prompt_sensitivity"],
    outputs: "MetricResult (value plus counts, intervals and breakdowns in params)",
    range: "[0, 1]",
    assumptions: [
      "``correct_by_template``: mapping template name -> per-example correctness (or scores), the same examples under every template; or a 2-D array (templates × examples).",
    ],
    limitations: [],
    references: [
      {
        citation:
          "Sclar M, Choi Y, Tsvetkov Y, Suhr A. Quantifying language models' sensitivity to spurious features in prompt design. ICLR. 2024.",
      },
      {
        citation:
          "Zhu K, Wang J, Zhou J, et al. PromptRobust: towards evaluating the robustness of large language models on adversarial prompts. arXiv:2306.04528. 2023.",
      },
    ],
    version: "v0.5.0",
    status: "implemented",
    apiPath: "es.prompt_sensitivity",
    example: 'es.prompt_sensitivity({"t1": [1, 1, 0], "t2": [1, 0, 0]})',
  },
  {
    id: "robustness.recovery_success_rate",
    name: "Recovery success rate",
    category: "robustness",
    subcategory: "Reliability",
    description:
      "Among episodes in which a failure occurred (an error, a failed tool call, a wrong intermediate step), the share from which the system recovered and still completed the task.",
    formula: "#(failed ∧ recovered) / #failed",
    inputs: [
      "failed: see the signature of es.recovery_success_rate",
      "recovered: see the signature of es.recovery_success_rate",
    ],
    outputs: "MetricResult (value plus counts, intervals and breakdowns in params)",
    range: "[0, 1]",
    assumptions: [],
    limitations: [],
    references: [
      {
        citation:
          "Liang P, Bommasani R, Lee T, et al. Holistic evaluation of language models. TMLR. 2023.",
      },
    ],
    version: "v0.5.0",
    status: "implemented",
    apiPath: "es.recovery_success_rate",
    example: "es.recovery_success_rate(failed=[True, True, False], recovered=[True, False, False])",
  },
  {
    id: "robustness.response_stability",
    name: "Response stability",
    category: "robustness",
    subcategory: "Consistency",
    description:
      "Agreement among repeated samples for the same prompt: the mean pairwise agreement and the share of prompts where every sample agrees, plus the mean share held by the most common answer.",
    formula: "mean_prompts mean_{i<j} 1[a_i = a_j]",
    inputs: ["samples: see the signature of es.response_stability"],
    outputs: "MetricResult (value plus counts, intervals and breakdowns in params)",
    range: "[0, 1]",
    assumptions: [],
    limitations: [],
    references: [
      {
        citation:
          "Manakul P, Liusie A, Gales MJF. SelfCheckGPT: zero-resource black-box hallucination detection for generative large language models. EMNLP. 2023:9004-9017.",
      },
      {
        citation:
          "Elazar Y, Kassner N, Ravfogel S, et al. Measuring and improving consistency in pretrained language models. TACL. 2021;9:1012-1031.",
      },
    ],
    version: "v0.5.0",
    status: "implemented",
    apiPath: "es.response_stability",
    example: 'es.response_stability([["a", "a", "b"], ["x", "x", "x"]])',
  },
  {
    id: "robustness.noise_robustness",
    name: "Typographical-noise robustness",
    category: "robustness",
    subcategory: "Robustness",
    description:
      "Accuracy on inputs with typos (character swaps, deletions, insertions, substitutions) relative to clean inputs: perturbed accuracy, absolute and relative drop and flip rate. ``add_typos`` makes the noisy inputs reproducibly.",
    formula: "acc_noisy; drop = acc_clean − acc_noisy",
    inputs: [
      "clean_correct: see the signature of es.noise_robustness",
      "noisy_correct: see the signature of es.noise_robustness",
    ],
    outputs: "MetricResult (value plus counts, intervals and breakdowns in params)",
    range: "[0, 1]",
    assumptions: [],
    limitations: [],
    references: [
      {
        citation:
          "Belinkov Y, Bisk Y. Synthetic and natural noise both break neural machine translation. ICLR. 2018.",
      },
      {
        citation:
          "Ribeiro MT, Wu T, Guestrin C, Singh S. Beyond accuracy: behavioral testing of NLP models with CheckList. ACL. 2020:4902-4912.",
      },
    ],
    version: "v0.5.0",
    status: "implemented",
    apiPath: "es.noise_robustness",
    example: "es.noise_robustness(clean_correct, noisy_correct)  # inputs from es.add_typos",
  },
  {
    id: "safety.attack_success_rate",
    name: "Attack success rate (jailbreak / prompt injection)",
    category: "safety",
    subcategory: "Security",
    description:
      "Share of adversarial prompts (jailbreaks, direct or indirect prompt injections) after which the model did what the attacker wanted, overall and per attack type.",
    formula: "successful attacks / attacks",
    inputs: ["succeeded: see the signature of es.attack_success_rate"],
    outputs: "MetricResult (value plus counts, intervals and breakdowns in params)",
    range: "[0, 1]",
    assumptions: [],
    limitations: [],
    references: [
      {
        citation:
          "Mazeika M, Phan L, Yin X, et al. HarmBench: a standardized evaluation framework for automated red teaming and robust refusal. ICML. 2024.",
      },
      {
        citation:
          "Liu Y, Jia Y, Geng R, Jia J, Gong NZ. Formalizing and benchmarking prompt injection attacks and defenses. USENIX Security. 2024.",
      },
    ],
    version: "v0.5.0",
    status: "implemented",
    apiPath: "es.attack_success_rate",
    example:
      'es.attack_success_rate([True, False, True], attack_types=["jailbreak", "injection", "injection"])',
  },
  {
    id: "safety.harmful_response_rate",
    name: "Harmful response rate",
    category: "safety",
    subcategory: "Safety",
    description:
      "Share of responses judged harmful. Given which prompts request harmful content, it is the unsafe compliance rate: harmful responses among harmful prompts (HarmBench attack success).",
    formula: "harmful responses / responses (restricted to harmful prompts when given)",
    inputs: ["harmful: see the signature of es.harmful_response_rate"],
    outputs: "MetricResult (value plus counts, intervals and breakdowns in params)",
    range: "[0, 1]",
    assumptions: [
      "``harmful``: one verdict per response. ``harmful_prompt`` (optional): whether each prompt asked for harmful content; the rate is then over those prompts only. ``categories``: per-category rates.",
    ],
    limitations: [],
    references: [
      {
        citation:
          "Mazeika M, Phan L, Yin X, et al. HarmBench: a standardized evaluation framework for automated red teaming and robust refusal. ICML. 2024.",
      },
    ],
    version: "v0.5.0",
    status: "implemented",
    apiPath: "es.harmful_response_rate",
    example: "es.harmful_response_rate([True, False, False], harmful_prompt=[True, True, False])",
  },
  {
    id: "safety.exposure",
    name: "Memorization exposure",
    category: "safety",
    subcategory: "Privacy",
    description:
      "Exposure of a planted canary (Carlini et al.): how much more likely the model finds the true secret than random candidates of the same format, in bits. log2 of the candidate-space size means the canary is ranked first (fully memorised); about 1 means no memorisation.",
    formula: "exposure = log2 |R| − log2 rank(canary)",
    inputs: [
      "canary_scores: see the signature of es.exposure",
      "candidate_scores: see the signature of es.exposure",
    ],
    outputs: "MetricResult (value plus counts, intervals and breakdowns in params)",
    range: "[0, log2 |R|]",
    assumptions: [
      "``canary_scores``: the model's log-perplexity of each planted canary (lower = more likely). ``candidate_scores``: per canary, log-perplexities of random candidates from the same space. Without ``space_size`` the rank among the sampled candidates is used (|R| = candidates + 1); with it the rank is extrapolated (sampling estimate).",
    ],
    limitations: [],
    references: [
      {
        citation:
          "Carlini N, Liu C, Erlingsson Ú, Kos J, Song D. The secret sharer: evaluating and testing unintended memorization in neural networks. USENIX Security. 2019:267-284.",
      },
    ],
    version: "v0.5.0",
    status: "implemented",
    apiPath: "es.exposure",
    example: "es.exposure(canary_logppl, candidate_logppl)",
  },
  {
    id: "safety.over_refusal_rate",
    name: "Over-refusal rate",
    category: "safety",
    subcategory: "Safety",
    description:
      "Share of safe prompts the model refuses (exaggerated safety, XSTest): refusals among prompts that should be answered.",
    formula: "refused ∧ ¬should_refuse / ¬should_refuse",
    inputs: [
      "refused: see the signature of es.over_refusal_rate",
      "should_refuse: see the signature of es.over_refusal_rate",
    ],
    outputs: "MetricResult (value plus counts, intervals and breakdowns in params)",
    range: "[0, 1]",
    assumptions: [],
    limitations: [],
    references: [
      {
        citation:
          "Röttger P, Kirk HR, Vidgen B, et al. XSTest: a test suite for identifying exaggerated safety behaviours in large language models. NAACL. 2024:5377-5400.",
      },
    ],
    version: "v0.5.0",
    status: "implemented",
    apiPath: "es.over_refusal_rate",
    example:
      "es.over_refusal_rate(refused=[True, False, True], should_refuse=[True, False, False])",
  },
  {
    id: "safety.pii_leakage_rate",
    name: "PII leakage rate",
    category: "safety",
    subcategory: "Privacy",
    description:
      "Share of outputs that contain personal or sensitive information: matches of the built-in detectors (e-mail, phone, Luhn-valid card number, IPv4, US SSN) and/or verbatim occurrences of protected strings (secrets or canaries planted in training or context data).",
    formula: "outputs with ≥1 detected item / outputs",
    inputs: ["outputs: see the signature of es.pii_leakage_rate"],
    outputs: "MetricResult (value plus counts, intervals and breakdowns in params)",
    range: "[0, 1]",
    assumptions: [
      '``kinds``: built-in detectors to run (default: all; ``()`` also means all). ``protected``: strings that must never appear (matched case-insensitively). Per-kind leak rates are in ``params["by_kind"]``.',
    ],
    limitations: [],
    references: [
      {
        citation:
          "Carlini N, Liu C, Erlingsson Ú, Kos J, Song D. The secret sharer: evaluating and testing unintended memorization in neural networks. USENIX Security. 2019:267-284.",
      },
    ],
    version: "v0.5.0",
    status: "implemented",
    apiPath: "es.pii_leakage_rate",
    example: 'es.pii_leakage_rate(["mail me at a@b.io", "no PII"], protected=["SECRET-42"])',
  },
  {
    id: "safety.policy_violation_rate",
    name: "Policy violation rate",
    category: "safety",
    subcategory: "Safety",
    description:
      "Share of outputs that violate at least one content policy, with the violation rate of each policy.",
    formula: "outputs with ≥1 violated policy / outputs",
    inputs: ["violations: see the signature of es.policy_violation_rate"],
    outputs: "MetricResult (value plus counts, intervals and breakdowns in params)",
    range: "[0, 1]",
    assumptions: [
      "``violations``: per output, the list of policies it violates (empty if none). ``policies``: the full policy list, so policies never violated appear with rate 0.",
    ],
    limitations: [],
    references: [
      {
        citation:
          "Mazeika M, Phan L, Yin X, et al. HarmBench: a standardized evaluation framework for automated red teaming and robust refusal. ICML. 2024.",
      },
    ],
    version: "v0.5.0",
    status: "implemented",
    apiPath: "es.policy_violation_rate",
    example: 'es.policy_violation_rate([[], ["violence"]], policies=["violence", "pii"])',
  },
  {
    id: "safety.red_team_success_rate",
    name: "Red-team success rate",
    category: "safety",
    subcategory: "Security",
    description:
      "Share of red-team goals achieved within k attempts (success@k), with the per-attempt success rate and per-category breakdown.",
    formula: "goals with a success among the first k attempts / goals",
    inputs: ["attempts: see the signature of es.red_team_success_rate"],
    outputs: "MetricResult (value plus counts, intervals and breakdowns in params)",
    range: "[0, 1]",
    assumptions: [
      "``attempts``: per red-team goal, the outcome of each attempt in order (True = the attack worked).",
    ],
    limitations: [],
    references: [
      {
        citation:
          "Ganguli D, Lovitt L, Kernion J, et al. Red teaming language models to reduce harms: methods, scaling behaviors, and lessons learned. arXiv:2209.07858. 2022.",
      },
      {
        citation:
          "Mazeika M, Phan L, Yin X, et al. HarmBench: a standardized evaluation framework for automated red teaming and robust refusal. ICML. 2024.",
      },
    ],
    version: "v0.5.0",
    status: "implemented",
    apiPath: "es.red_team_success_rate",
    example: "es.red_team_success_rate([[False, True], [False, False, False]], k=3)",
  },
  {
    id: "safety.refusal_rate",
    name: "Refusal rate",
    category: "safety",
    subcategory: "Safety",
    description:
      "Share of prompts the model refuses. Given which prompts should be refused, the value is the appropriate refusal rate (refusals among should-refuse prompts) and precision and F1 are reported.",
    formula: "refused / prompts, or refused ∧ should_refuse / should_refuse",
    inputs: ["refused: see the signature of es.refusal_rate"],
    outputs: "MetricResult (value plus counts, intervals and breakdowns in params)",
    range: "[0, 1]",
    assumptions: [],
    limitations: [],
    references: [
      {
        citation:
          "Röttger P, Kirk HR, Vidgen B, et al. XSTest: a test suite for identifying exaggerated safety behaviours in large language models. NAACL. 2024:5377-5400.",
      },
      {
        citation:
          "Mazeika M, Phan L, Yin X, et al. HarmBench: a standardized evaluation framework for automated red teaming and robust refusal. ICML. 2024.",
      },
    ],
    version: "v0.5.0",
    status: "implemented",
    apiPath: "es.refusal_rate",
    example: "es.refusal_rate([True, False, True], should_refuse=[True, False, False])",
  },
  {
    id: "safety.stereotype_preference",
    name: "Stereotype preference (CrowS-Pairs)",
    category: "safety",
    subcategory: "Bias",
    description:
      "Share of minimally different sentence pairs where the model assigns higher likelihood to the more stereotypical sentence. An unbiased model scores 0.5.",
    formula: "mean[ℓ(stereotypical) > ℓ(anti-stereotypical)]",
    inputs: [
      "stereo_scores: see the signature of es.stereotype_preference",
      "anti_stereo_scores: see the signature of es.stereotype_preference",
    ],
    outputs: "MetricResult (value plus counts, intervals and breakdowns in params)",
    range: "[0, 1] (ideal 0.5)",
    assumptions: [
      "Scores are the model's (pseudo-)log-likelihoods of the stereotypical and anti-stereotypical sentence in each pair. Ties count as half.",
    ],
    limitations: [],
    references: [
      {
        citation:
          "Nangia N, Vania C, Bhalerao R, Bowman SR. CrowS-Pairs: a challenge dataset for measuring social biases in masked language models. EMNLP. 2020:1953-1967.",
      },
    ],
    version: "v0.5.0",
    status: "implemented",
    apiPath: "es.stereotype_preference",
    example: "es.stereotype_preference(stereo_loglik, anti_stereo_loglik)",
  },
  {
    id: "safety.toxicity_score",
    name: "Toxicity score (toxicity / hate / harassment)",
    category: "safety",
    subcategory: "Safety",
    description:
      "From per-continuation classifier scores (Perspective API, Detoxify): the expected maximum toxicity over k samples per prompt and the probability that at least one sample is toxic (RealToxicityPrompts); per-attribute means for hate speech, harassment and other attributes.",
    formula: "mean_prompt max_j s_ij; P(max_j s_ij ≥ τ)",
    inputs: ["scores: see the signature of es.toxicity_score"],
    outputs: "MetricResult (value plus counts, intervals and breakdowns in params)",
    range: "[0, 1]",
    assumptions: [
      '``scores``: per prompt, one score (or a list of scores, one per sampled continuation) in [0, 1]. ``attributes`` (optional): mapping attribute name (``"hate"``, ``"harassment"``...) -> scores in the same shape; their expected-maximum values are reported in ``params["by_attribute"]``.',
    ],
    limitations: [],
    references: [
      {
        citation:
          "Gehman S, Gururangan S, Sap M, Choi Y, Smith NA. RealToxicityPrompts: evaluating neural toxic degeneration in language models. Findings of EMNLP. 2020:3356-3369.",
      },
      {
        citation:
          "Lees A, Tran VQ, Tay Y, et al. A new generation of Perspective API: efficient multilingual character-level transformers. KDD. 2022:3197-3207.",
      },
    ],
    version: "v0.5.0",
    status: "implemented",
    apiPath: "es.toxicity_score",
    example:
      "es.toxicity_score([[0.1, 0.8], [0.05, 0.2]], threshold=0.5)  # Perspective / Detoxify scores",
  },
  {
    id: "safety.weat_effect_size",
    name: "WEAT effect size",
    category: "safety",
    subcategory: "Bias",
    description:
      "Word Embedding Association Test: how much more strongly target set X than target set Y associates with attribute set A than with B, as a standardised effect size (Cohen's d analogue), with a permutation p-value.",
    formula:
      "d = (mean_x s(x,A,B) − mean_y s(y,A,B)) / std_{w∈X∪Y} s(w,A,B), s = mean cos(w,A) − mean cos(w,B)",
    inputs: [
      "X: see the signature of es.weat_effect_size",
      "Y: see the signature of es.weat_effect_size",
      "A: see the signature of es.weat_effect_size",
      "B: see the signature of es.weat_effect_size",
    ],
    outputs: "MetricResult (value plus counts, intervals and breakdowns in params)",
    range: "[−2, 2] (0 = no association)",
    assumptions: [
      "Embeddings (rows) of the two target sets and two attribute sets. The one-sided p-value uses random equal-size re-partitions of X ∪ Y (exact enumeration is used when it is smaller).",
    ],
    limitations: [],
    references: [
      {
        citation:
          "Caliskan A, Bryson JJ, Narayanan A. Semantics derived automatically from language corpora contain human-like biases. Science. 2017;356(6334):183-186.",
      },
    ],
    version: "v0.5.0",
    status: "implemented",
    apiPath: "es.weat_effect_size",
    example: "es.weat_effect_size(X, Y, A, B, random_state=0)  # embeddings of word sets",
  },
  {
    id: "uncertainty.adaptive_calibration_error",
    name: "Adaptive calibration error (ACE)",
    category: "uncertainty",
    subcategory: "Calibration",
    description:
      "Calibration error with equal-mass bins: the unweighted mean |accuracy − confidence| over R bins that each hold the same number of predictions, so sparse high-confidence regions do not hide errors.",
    formula: "ACE = (1/R) Σ_r |acc(r) − conf(r)|, bins of equal count",
    inputs: [
      "correct: see the signature of es.adaptive_calibration_error",
      "confidence: see the signature of es.adaptive_calibration_error",
    ],
    outputs: "MetricResult (value plus counts, intervals and breakdowns in params)",
    range: "[0, 1]",
    assumptions: [],
    limitations: [],
    references: [
      {
        citation:
          "Nixon J, Dusenberry M, Jerfel G, Nguyen T, Liu J, Zhang L, Tran D. Measuring calibration in deep learning. CVPR Workshops. 2019.",
      },
    ],
    version: "v0.5.0",
    status: "implemented",
    apiPath: "es.adaptive_calibration_error",
    example: "es.adaptive_calibration_error(correct, confidence, n_bins=15)",
  },
  {
    id: "uncertainty.aurc",
    name: "Area under the risk-coverage curve (AURC)",
    category: "uncertainty",
    subcategory: "Selective prediction",
    description:
      "Mean selective risk over all coverages when questions are answered in order of decreasing confidence; lower means confidence ranks errors last. E-AURC subtracts the AURC of a perfect ranking.",
    formula: "AURC = (1/n) Σ_k risk(k/n); E-AURC = AURC − AURC*",
    inputs: ["correct: see the signature of es.aurc", "confidence: see the signature of es.aurc"],
    outputs: "MetricResult (value plus counts, intervals and breakdowns in params)",
    range: "[0, 1]",
    assumptions: [],
    limitations: [],
    references: [
      {
        citation:
          "Geifman Y, Uziel G, El-Yaniv R. Bias-reduced uncertainty estimation for deep neural classifiers. ICLR. 2019.",
      },
    ],
    version: "v0.5.0",
    status: "implemented",
    apiPath: "es.aurc",
    example: "es.aurc(correct, confidence)  # E-AURC in params",
  },
  {
    id: "uncertainty.confidence_accuracy_correlation",
    name: "Confidence–accuracy correlation",
    category: "uncertainty",
    subcategory: "Calibration",
    description:
      "How well confidence discriminates correct from incorrect answers: the AUROC of confidence for correctness (P(true) discrimination, Kadavath et al.), with the point-biserial and Spearman correlations.",
    formula: "AUROC = P(conf_correct > conf_wrong) + ½ P(tie)",
    inputs: [
      "correct: see the signature of es.confidence_accuracy_correlation",
      "confidence: see the signature of es.confidence_accuracy_correlation",
    ],
    outputs: "MetricResult (value plus counts, intervals and breakdowns in params)",
    range: "[0, 1] (0.5 = no signal)",
    assumptions: [],
    limitations: [],
    references: [
      {
        citation:
          "Kadavath S, Conerly T, Askell A, et al. Language models (mostly) know what they know. arXiv:2207.05221. 2022.",
      },
    ],
    version: "v0.5.0",
    status: "implemented",
    apiPath: "es.confidence_accuracy_correlation",
    example: "es.confidence_accuracy_correlation(correct, confidence)",
  },
  {
    id: "uncertainty.coverage_at_risk",
    name: "Coverage at fixed risk",
    category: "uncertainty",
    subcategory: "Selective prediction",
    description:
      "The largest share of questions the model can answer (abstaining on the rest by confidence) while keeping the selective error rate at or below the target risk.",
    formula: "max coverage over curve points with risk ≤ target",
    inputs: [
      "correct: see the signature of es.coverage_at_risk",
      "confidence: see the signature of es.coverage_at_risk",
    ],
    outputs: "MetricResult (value plus counts, intervals and breakdowns in params)",
    range: "[0, 1]",
    assumptions: [],
    limitations: [],
    references: [
      {
        citation:
          "El-Yaniv R, Wiener Y. On the foundations of noise-free selective classification. JMLR. 2010;11:1605-1641.",
      },
      {
        citation:
          "Geifman Y, Uziel G, El-Yaniv R. Bias-reduced uncertainty estimation for deep neural classifiers. ICLR. 2019.",
      },
    ],
    version: "v0.5.0",
    status: "implemented",
    apiPath: "es.coverage_at_risk",
    example: "es.coverage_at_risk(correct, confidence, risk=0.05)",
  },
  {
    id: "uncertainty.risk_at_coverage",
    name: "Risk at fixed coverage",
    category: "uncertainty",
    subcategory: "Selective prediction",
    description:
      "Selective risk at the target coverage, read from the risk-coverage curve at the smallest confidence threshold whose coverage reaches the target (ties are answered together).",
    formula: "risk at the first curve point with coverage ≥ target",
    inputs: [
      "correct: see the signature of es.risk_at_coverage",
      "confidence: see the signature of es.risk_at_coverage",
    ],
    outputs: "MetricResult (value plus counts, intervals and breakdowns in params)",
    range: "[0, 1]",
    assumptions: [],
    limitations: [],
    references: [
      {
        citation:
          "El-Yaniv R, Wiener Y. On the foundations of noise-free selective classification. JMLR. 2010;11:1605-1641.",
      },
      {
        citation:
          "Geifman Y, Uziel G, El-Yaniv R. Bias-reduced uncertainty estimation for deep neural classifiers. ICLR. 2019.",
      },
    ],
    version: "v0.5.0",
    status: "implemented",
    apiPath: "es.risk_at_coverage",
    example: "es.risk_at_coverage(correct, confidence, coverage=0.9)",
  },
  {
    id: "uncertainty.selective_risk",
    name: "Selective risk",
    category: "uncertainty",
    subcategory: "Selective prediction",
    description:
      "Error rate on the questions the model answers when it abstains on the least confident ones so that a given share (coverage) is answered.",
    formula: "risk(c) = errors among the ⌈c·n⌉ most confident / ⌈c·n⌉",
    inputs: [
      "correct: see the signature of es.selective_risk",
      "confidence: see the signature of es.selective_risk",
    ],
    outputs: "MetricResult (value plus counts, intervals and breakdowns in params)",
    range: "[0, 1]",
    assumptions: [],
    limitations: [],
    references: [
      {
        citation:
          "El-Yaniv R, Wiener Y. On the foundations of noise-free selective classification. JMLR. 2010;11:1605-1641.",
      },
      {
        citation:
          "Geifman Y, Uziel G, El-Yaniv R. Bias-reduced uncertainty estimation for deep neural classifiers. ICLR. 2019.",
      },
    ],
    version: "v0.5.0",
    status: "implemented",
    apiPath: "es.selective_risk",
    example: "es.selective_risk(correct, confidence, coverage=0.8)",
  },
];
