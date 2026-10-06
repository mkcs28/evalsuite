"use client";

import { Users } from "lucide-react";
import { useEffect, useState } from "react";
import { apiBaseUrl } from "@/lib/api";

const ID_KEY = "evalsuite.visitor";
const SENT_KEY = "evalsuite.visit-sent";

/** Random per-browser id; the API stores only a peppered hash of it. */
function visitorId(): string {
  try {
    const existing = localStorage.getItem(ID_KEY);
    if (existing && /^[0-9a-f-]{36}$/i.test(existing)) return existing;
    const fresh = crypto.randomUUID();
    localStorage.setItem(ID_KEY, fresh);
    return fresh;
  } catch {
    return crypto.randomUUID();
  }
}

/**
 * Total unique visitors, counted by the API. Each browser counts once; no IP address or
 * personal data is stored. Hidden when the site runs without the API.
 */
export function VisitorCounter() {
  const base = apiBaseUrl();
  const [total, setTotal] = useState<number | null>(null);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    if (!base) return;
    let alreadySent = false;
    try {
      alreadySent = sessionStorage.getItem(SENT_KEY) === "1";
    } catch {
      alreadySent = false;
    }
    const request = alreadySent
      ? fetch(`${base}/api/v1/stats`, { credentials: "omit" })
      : fetch(`${base}/api/v1/stats/visit`, {
          method: "POST",
          credentials: "omit",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ visitorId: visitorId() }),
        });
    request
      .then((r) => (r.ok ? r.json() : Promise.reject(new Error(String(r.status)))))
      .then((data: { totalVisitors?: unknown }) => {
        if (typeof data.totalVisitors !== "number") throw new Error("bad response");
        setTotal(data.totalVisitors);
        try {
          sessionStorage.setItem(SENT_KEY, "1");
        } catch {
          // storage unavailable: the API still counts this browser once
        }
      })
      .catch(() => setFailed(true));
  }, [base]);

  if (!base || failed) return null;
  return (
    <p
      className="inline-flex items-center gap-2 rounded-full border border-border bg-surface/80 px-3 py-1.5 text-sm backdrop-blur"
      aria-live="polite"
    >
      <Users className="size-4 text-primary" aria-hidden />
      {total === null ? (
        <span className="text-muted-foreground">Counting visitors</span>
      ) : (
        <span>
          <strong className="font-semibold tabular-nums">
            {new Intl.NumberFormat("en").format(total)}
          </strong>{" "}
          <span className="text-muted-foreground">
            {total === 1 ? "visitor" : "visitors"} so far
          </span>
        </span>
      )}
    </p>
  );
}
