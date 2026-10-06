import { readFileSync } from "node:fs";
import { AccountClient } from "../src/lib/api/account-client";
import { ApiEvaluationClient } from "../src/lib/api/api-client";
import { DEMO_DATASETS } from "../src/lib/demo/datasets";
import { MockEvaluationClient } from "../src/lib/api/mock-client";

// Full-stack check against a running API. Usage:
//   API_BASE_URL=http://localhost:8000 API_LOG=/path/to/api.log SITE_URL=http://localhost:3000 npm run test:integration
// API_LOG must capture the API output with EVALSUITE_EMAIL_BACKEND=console (the reset link is read from it).
const base = process.env.API_BASE_URL ?? "http://localhost:8000";
const site = process.env.SITE_URL ?? "http://localhost:3000";
const apiLog = process.env.API_LOG ?? "api.log";
const results: Array<[string, boolean, string?]> = [];
const check = (name: string, ok: boolean, detail?: string) => results.push([name, ok, detail]);
const expectFail = async (p: Promise<unknown>) =>
  p.then(
    () => null,
    (e: Error) => e.message,
  );

let token: string | null = null;
const acct = new AccountClient(base, () => token);
const email = `it-${Date.now()}@gmail.com`;
const isoYearsAgo = (years: number, days = 0) => {
  const t = new Date();
  const d = new Date(Date.UTC(t.getUTCFullYear() - years, t.getUTCMonth(), t.getUTCDate() + days));
  return d.toISOString().slice(0, 10);
};
const profile = {
  name: "Integration Tester",
  role: "academic-researcher" as const,
  organization: "JSS STU",
  country: "India",
  intendedUse: "Automated end-to-end verification of the platform.",
  acceptTerms: true,
};
const underage = await expectFail(
  acct.register({
    ...profile,
    email: `minor-${email}`,
    password: "first-password-1",
    dateOfBirth: isoYearsAgo(17),
  }),
);
check(
  "under-18 registration rejected",
  underage?.includes("at least 18") ?? false,
  underage ?? "accepted",
);
const tomorrow18 = await expectFail(
  acct.register({
    ...profile,
    email: `almost-${email}`,
    password: "first-password-1",
    dateOfBirth: isoYearsAgo(18, 1),
  }),
);
check("registration rejected one day before 18th birthday", tomorrow18 !== null);
const created = await acct.register({
  ...profile,
  email,
  password: "first-password-1",
  dateOfBirth: isoYearsAgo(30),
});
check(
  "adult registration stores profile",
  created.role === "academic-researcher" && created.eligibleForApi,
);
check("date of birth never returned", !("dateOfBirth" in created));
token = (await acct.login(email, "first-password-1")).accessToken;
check("register + login + me", (await acct.me()).email === email);

let key = await acct.createKey("ci");
const second = await expectFail(acct.createKey("second"));
check(
  "second active key refused",
  second?.startsWith("Each account can have one active API key") ?? false,
  second ?? "created",
);
const firstKey = key;
key = await acct.rotateKey(firstKey.id);
check("rotation issues a new key", key.key !== firstKey.key && key.name === "ci");
const oldKeyClient = new ApiEvaluationClient(base, undefined, () => firstKey.key);
const keyClient = new ApiEvaluationClient(base, undefined, () => key.key);
const sessionClient = new ApiEvaluationClient(base, undefined, () => token);
const d = DEMO_DATASETS[0]!;
const req = {
  task: "binary-classification" as const,
  yTrue: d.yTrue,
  yPred: d.yPred,
  yProb: d.yProb,
  metrics: [
    "classification.accuracy",
    "classification.mcc",
    "classification.roc_auc",
    "calibration.brier_score",
  ],
  confidence: {
    method: "bootstrap-percentile" as const,
    level: 0.95,
    nBootstrap: 500,
    randomState: 7,
  },
};
check(
  "rotated-out key rejected",
  (await expectFail(
    oldKeyClient.evaluate({ ...req, confidence: { ...req.confidence, method: "none" } }),
  )) !== null,
);
const a = await keyClient.evaluate(req);
const b = await sessionClient.evaluate(req);
const demo = await new MockEvaluationClient().evaluate({
  ...req,
  confidence: { ...req.confidence, method: "none" },
});
check("evaluate with API key", a.engine.kind === "api" && a.metrics.length === 4);
check("evaluate with session (playground path)", b.metrics.length === 4);
check(
  "bootstrap reproducible across calls",
  JSON.stringify(a.metrics) === JSON.stringify(b.metrics),
);
check(
  "API point estimates equal browser demo",
  a.metrics.every((m, i) => Math.abs((m.value ?? 0) - (demo.metrics[i]!.value ?? 0)) < 1e-9),
);
check("usage counted", (await acct.usage()).requestsLast24h === 2);

// Password reset through the emailed link (console email backend writes it to the API log).
await acct.forgotPassword(email);
const unknown = await acct.forgotPassword("nobody-" + email);
check(
  "forgot-password answers identically for unknown emails",
  unknown.startsWith("If an account exists"),
);
await new Promise((r) => setTimeout(r, 300));
const log = readFileSync(apiLog, "utf8");
const link = [
  ...log.matchAll(
    new RegExp(
      `(${site.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}/reset-password#token=[A-Za-z0-9_-]+)`,
      "g",
    ),
  ),
].at(-1)?.[1];
check("reset email points at the website with a fragment token", !!link);
const resetToken = new URLSearchParams(link!.split("#")[1]).get("token")!;
const oldToken = token;
await acct.resetPassword(resetToken, "second-password-2");
token = oldToken;
check("old session rejected after reset", (await expectFail(acct.me())) !== null);
check(
  "reset link single-use",
  (await expectFail(acct.resetPassword(resetToken, "third-password-3"))) !== null,
);
check(
  "old password rejected",
  (await expectFail(acct.login(email, "first-password-1"))) === "Email or password is incorrect.",
);
token = (await acct.login(email, "second-password-2")).accessToken;
check("login with new password", (await acct.me()).email === email);
check("API key survives password reset", (await keyClient.evaluate(req)).metrics.length === 4);

const changed = await acct.changePassword("second-password-2", "fourth-password-4");
const before = token;
token = changed.accessToken;
check("change password returns a working session", (await acct.me()).email === email);
token = before;
check("previous session ends after change", (await expectFail(acct.me())) !== null);
token = changed.accessToken;

await acct.revokeKey(key.id);
check(
  "revoked key rejected",
  (await expectFail(keyClient.evaluate(req))) === "The API key is invalid or has been revoked.",
);

const pre = await fetch(`${base}/api/v1/evaluate`, {
  method: "OPTIONS",
  headers: {
    Origin: site,
    "Access-Control-Request-Method": "POST",
    "Access-Control-Request-Headers": "authorization,content-type",
  },
});
check("CORS allows the website origin", pre.headers.get("access-control-allow-origin") === site);
const evil = await fetch(`${base}/api/v1/evaluate`, {
  method: "OPTIONS",
  headers: { Origin: "https://evil.example", "Access-Control-Request-Method": "POST" },
});
check("CORS rejects other origins", evil.headers.get("access-control-allow-origin") === null);
const health = await fetch(`${base}/api/v1/health/ready`);
check(
  "readiness reports database and Redis",
  (await health.json()).rateLimitStore === true && health.headers.get("x-request-id") !== null,
);

await acct.deleteAccount("fourth-password-4");
check("account deleted; session invalid", (await expectFail(acct.me())) !== null);
check(
  "account deleted; login fails",
  (await expectFail(acct.login(email, "fourth-password-4"))) !== null,
);

const signup = await fetch(`${base}/api/v1/downloads/request`, {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({ email: `dl-${email}`, version: "upcoming", acceptSecurityNotices: true }),
});
check(
  "download email step (pre-release signup)",
  signup.ok && (await signup.json()).downloadPath === null,
);
const noConsent = await fetch(`${base}/api/v1/downloads/request`, {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({ email: `dl-${email}`, version: "upcoming", acceptSecurityNotices: false }),
});
check("download requires consent to security notices", noConsent.status === 422);

const orgEmail = await expectFail(
  acct.register({
    ...profile,
    email: `staff-${Date.now()}@jssstu.ac.in`,
    password: "first-password-1",
    dateOfBirth: isoYearsAgo(30),
  }),
);
check(
  "organisation email refused at registration",
  orgEmail?.includes("personal email") ?? false,
  orgEmail ?? "accepted",
);
const visitor = crypto.randomUUID();
const v1 = await (
  await fetch(`${base}/api/v1/stats/visit`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ visitorId: visitor }),
  })
).json();
const v2 = await (
  await fetch(`${base}/api/v1/stats/visit`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ visitorId: visitor }),
  })
).json();
const total = await (await fetch(`${base}/api/v1/stats`)).json();
check(
  "visitor counted once per browser",
  v1.totalVisitors >= 1 &&
    v2.totalVisitors === v1.totalVisitors &&
    total.totalVisitors === v1.totalVisitors,
);

for (const [name, ok, detail] of results)
  console.log(`${ok ? "PASS" : "FAIL"}  ${name}${detail ? ` (${detail})` : ""}`);
console.log(`${results.filter((r) => r[1]).length}/${results.length} passed`);
process.exit(results.every((r) => r[1]) ? 0 : 1);
