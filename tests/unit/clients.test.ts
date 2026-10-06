import { createEvaluationClient } from "@/lib/api";
import { ApiEvaluationClient } from "@/lib/api/api-client";
import { MockEvaluationClient } from "@/lib/api/mock-client";
import { EvaluationClientError, type EvaluationRequest } from "@/lib/api/types";
import { DEMO_DATASETS } from "@/lib/demo/datasets";

const demo = DEMO_DATASETS[0]!;
const request: EvaluationRequest = {
  task: "binary-classification",
  yTrue: demo.yTrue,
  yPred: demo.yPred,
  yProb: demo.yProb,
  metrics: ["classification.accuracy", "classification.roc_auc", "classification.mcc"],
  confidence: { method: "bootstrap-percentile", level: 0.95, nBootstrap: 300, randomState: 7 },
};

describe("client factory", () => {
  it("defaults to the mock client", () => {
    expect(createEvaluationClient({}).kind).toBe("mock");
    expect(createEvaluationClient({ backend: "api" }).kind).toBe("mock");
    expect(
      createEvaluationClient({ backend: "api", apiBaseUrl: "https://api.example.org" }).kind,
    ).toBe("api");
  });
});

describe("MockEvaluationClient", () => {
  const client = new MockEvaluationClient();

  it("is deterministic for a fixed seed", async () => {
    const a = await client.evaluate(request);
    const b = await client.evaluate(request);
    expect(a).toEqual(b);
    expect(a.engine.kind).toBe("mock");
    expect(a.engine.label).toMatch(/not EvalSuite/);
  });

  it("produces intervals that contain the estimate", async () => {
    const res = await client.evaluate(request);
    for (const m of res.metrics) {
      expect(m.value).not.toBeNull();
      expect(m.interval!.lower).toBeLessThanOrEqual(m.value!);
      expect(m.interval!.upper).toBeGreaterThanOrEqual(m.value!);
    }
  });

  it("rejects mismatched lengths with a clear message", async () => {
    await expect(client.evaluate({ ...request, yPred: request.yPred.slice(1) })).rejects.toThrow(
      /same number of observations/,
    );
  });

  it("rejects non-binary labels", async () => {
    await expect(
      client.evaluate({ ...request, yTrue: request.yTrue.map((v, i) => (i === 0 ? 2 : v)) }),
    ).rejects.toBeInstanceOf(EvaluationClientError);
  });

  it("explains when probabilities are missing", async () => {
    const res = await client.evaluate({
      ...request,
      yProb: undefined,
      confidence: { ...request.confidence, method: "none" },
    });
    const auc = res.metrics.find((m) => m.id === "classification.roc_auc")!;
    expect(auc.value).toBeNull();
    expect(auc.note).toMatch(/probabilities/);
  });
});

describe("ApiEvaluationClient", () => {
  const ok = (body: unknown, status = 200) =>
    Promise.resolve(
      new Response(JSON.stringify(body), {
        status,
        headers: { "Content-Type": "application/json" },
      }),
    );

  it("rejects non-http base URLs", () => {
    expect(() => new ApiEvaluationClient("ftp://example.org")).toThrow(EvaluationClientError);
  });

  it("validates responses with the shared schema", async () => {
    const fetchImpl = vi.fn(() => ok({ status: "ok", version: "0.1.0" }));
    const client = new ApiEvaluationClient(
      "https://api.example.org/",
      fetchImpl as unknown as typeof fetch,
    );
    await expect(client.health()).resolves.toEqual({ status: "ok", version: "0.1.0" });
    expect(fetchImpl).toHaveBeenCalledWith(
      "https://api.example.org/api/v1/health",
      expect.objectContaining({ credentials: "omit" }),
    );
  });

  it("surfaces API error messages", async () => {
    const client = new ApiEvaluationClient("https://api.example.org", (() =>
      ok({ error: { code: "bad", message: "y_true is empty." } }, 422)) as unknown as typeof fetch);
    await expect(client.evaluate(request)).rejects.toThrow("y_true is empty.");
  });

  it("rejects malformed responses", async () => {
    const client = new ApiEvaluationClient("https://api.example.org", (() =>
      ok({ unexpected: true })) as unknown as typeof fetch);
    await expect(client.health()).rejects.toMatchObject({ code: "invalid-response" });
  });

  it("reports an unavailable backend", async () => {
    const client = new ApiEvaluationClient("https://api.example.org", (() =>
      Promise.reject(new TypeError("network"))) as unknown as typeof fetch);
    await expect(client.health()).rejects.toMatchObject({ code: "unavailable" });
  });
});
