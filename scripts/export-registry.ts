/**
 * Export the validated metric registry to backend/app/data/metrics.json so the
 * API serves exactly what the website documents. Run: npm run registry:export
 */
import { writeFileSync } from "node:fs";
import { resolve } from "node:path";
import { registry } from "../src/lib/metrics/registry";
import domains from "../src/data/personal-email-domains.json";

const out = resolve(import.meta.dirname, "../backend/app/data/metrics.json");
writeFileSync(out, JSON.stringify(registry, null, 2) + "\n", "utf8");
console.warn(`Wrote ${registry.length} metrics to ${out}`);

const domainsOut = resolve(import.meta.dirname, "../backend/app/data/personal_email_domains.json");
writeFileSync(domainsOut, JSON.stringify(domains, null, 2) + "\n", "utf8");
console.warn(`Wrote ${domains.domains.length} personal email domains to ${domainsOut}`);
