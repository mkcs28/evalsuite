#!/usr/bin/env node
// Post-deployment smoke check. Read-only: creates no accounts and sends no email.
//   SITE_URL=https://evalsuite.vercel.app API_BASE_URL=https://evalsuite-api.onrender.com npm run check:deploy
const site = (process.env.SITE_URL ?? "").replace(/\/$/, "");
const api = (process.env.API_BASE_URL ?? "").replace(/\/$/, "");
if (!site || !api) {
  console.error("Set SITE_URL and API_BASE_URL.");
  process.exit(2);
}

const results = [];
const check = async (name, fn) => {
  try {
    const detail = await fn();
    results.push([true, name, detail ?? ""]);
  } catch (err) {
    results.push([false, name, err instanceof Error ? err.message : String(err)]);
  }
};
const get = async (url, init) => {
  const res = await fetch(url, { redirect: "follow", ...init });
  return res;
};
const ok = (cond, msg) => {
  if (!cond) throw new Error(msg);
};

// The free API host sleeps when idle; the first request can take up to a minute.
await check("API wakes up and is ready (database + Redis)", async () => {
  const started = Date.now();
  for (;;) {
    try {
      const res = await get(`${api}/api/v1/health/ready`);
      const body = await res.json();
      ok(res.status === 200 && body.database && body.rateLimitStore, JSON.stringify(body));
      return `${Math.round((Date.now() - started) / 1000)}s`;
    } catch (err) {
      if (Date.now() - started > 120_000) throw err;
      await new Promise((r) => setTimeout(r, 5000));
    }
  }
});
await check("API is served over HTTPS", async () => ok(api.startsWith("https://"), api));
await check("Metric registry served", async () => {
  const list = await (await get(`${api}/api/v1/metrics`)).json();
  ok(Array.isArray(list) && list.length >= 60, `got ${list.length}`);
  return `${list.length} metrics`;
});
await check("CORS allows the website", async () => {
  const res = await get(`${api}/api/v1/evaluate`, {
    method: "OPTIONS",
    headers: {
      Origin: site,
      "Access-Control-Request-Method": "POST",
      "Access-Control-Request-Headers": "content-type,x-api-key",
    },
  });
  ok(
    res.headers.get("access-control-allow-origin") === site,
    `allow-origin=${res.headers.get("access-control-allow-origin")}`,
  );
});
await check("CORS rejects other sites", async () => {
  const res = await get(`${api}/api/v1/evaluate`, {
    method: "OPTIONS",
    headers: { Origin: "https://example.com", "Access-Control-Request-Method": "POST" },
  });
  ok(!res.headers.get("access-control-allow-origin"), "foreign origin allowed");
});
await check("Evaluation requires an API key", async () => {
  const res = await get(`${api}/api/v1/evaluate`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: "{}",
  });
  ok(res.status === 401, `status ${res.status}`);
});
await check("Visitor counter answers", async () => {
  const body = await (await get(`${api}/api/v1/stats`)).json();
  ok(typeof body.totalVisitors === "number", JSON.stringify(body));
  return `${body.totalVisitors} visitors`;
});
for (const path of [
  "/",
  "/docs",
  "/docs/metrics",
  "/playground",
  "/download",
  "/register",
  "/login",
  "/dashboard",
]) {
  await check(`Website ${path}`, async () => {
    const res = await get(`${site}${path}`);
    ok(res.status === 200, `status ${res.status}`);
  });
}
await check("Website knows the API address", async () => {
  const html = await (await get(`${site}/register`)).text();
  ok(
    !html.includes("Accounts are not available on this deployment"),
    "NEXT_PUBLIC_API_BASE_URL is not set on the website",
  );
});
await check("Downloads are not publicly listable", async () => {
  const res = await get(`${site}/api/download/0.0.0/evalsuite_python-0.0.0.tar.gz`);
  ok(res.status === 404 || res.status === 403, `status ${res.status}`);
});
await check("Unknown pages return 404", async () => {
  ok((await get(`${site}/definitely-not-a-page`)).status === 404, "not 404");
});

for (const [pass, name, detail] of results)
  console.log(`${pass ? "PASS" : "FAIL"}  ${name}${detail ? ` (${detail})` : ""}`);
const failed = results.filter((r) => !r[0]).length;
console.log(`${results.length - failed}/${results.length} passed`);
process.exit(failed ? 1 : 0);
