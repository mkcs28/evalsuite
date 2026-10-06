"use client";

import { CalendarClock, Gauge, Loader2 } from "lucide-react";
import { useEffect, useState } from "react";

const TEST_FILE = "/speedtest.bin";

interface NetworkInformationLike {
  downlink?: number;
  effectiveType?: string;
  addEventListener?: (type: "change", listener: () => void) => void;
  removeEventListener?: (type: "change", listener: () => void) => void;
}

function connection(): NetworkInformationLike | undefined {
  return (navigator as Navigator & { connection?: NetworkInformationLike }).connection;
}

/** Measured throughput in Mbit/s from downloading a 512 KiB file once, uncached. */
export async function measureDownloadMbps(fetchImpl: typeof fetch = fetch): Promise<number> {
  const started = performance.now();
  const res = await fetchImpl(`${TEST_FILE}?t=${Date.now()}`, { cache: "no-store" });
  if (!res.ok) throw new Error(`Speed test failed (${res.status}).`);
  const bytes = (await res.arrayBuffer()).byteLength;
  const seconds = Math.max((performance.now() - started) / 1000, 0.001);
  return (bytes * 8) / seconds / 1_000_000;
}

const formatMbps = (v: number) => (v >= 100 ? v.toFixed(0) : v >= 10 ? v.toFixed(1) : v.toFixed(2));

/** Live local date and time, and the visitor's connection speed. Client-only, nothing is sent anywhere. */
export function FooterStatus() {
  const [now, setNow] = useState<Date | null>(null);
  const [estimate, setEstimate] = useState<string | null>(null);
  const [measured, setMeasured] = useState<number | null>(null);
  const [state, setState] = useState<"idle" | "testing" | "error">("idle");

  useEffect(() => {
    // Rendered after hydration so server and client output match.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setNow(new Date());
    const tick = setInterval(() => setNow(new Date()), 1000);
    const conn = connection();
    const read = () =>
      setEstimate(
        conn?.downlink
          ? `≈ ${formatMbps(conn.downlink)} Mbps${conn.effectiveType ? ` (${conn.effectiveType})` : ""}`
          : null,
      );
    read();
    conn?.addEventListener?.("change", read);
    return () => {
      clearInterval(tick);
      conn?.removeEventListener?.("change", read);
    };
  }, []);

  const runTest = async () => {
    setState("testing");
    try {
      setMeasured(await measureDownloadMbps());
      setState("idle");
    } catch {
      setState("error");
    }
  };

  return (
    <div className="flex flex-col gap-3 text-xs text-muted-foreground sm:flex-row sm:flex-wrap sm:items-center sm:gap-x-6">
      <p className="flex items-center gap-2" aria-live="off">
        <CalendarClock className="size-4 shrink-0" aria-hidden />
        {now ? (
          <span>
            <time dateTime={now.toISOString()} className="tabular-nums">
              {new Intl.DateTimeFormat(undefined, { dateStyle: "full" }).format(now)},{" "}
              {new Intl.DateTimeFormat(undefined, { timeStyle: "medium" }).format(now)}
            </time>{" "}
            <span className="opacity-75">({Intl.DateTimeFormat().resolvedOptions().timeZone})</span>
          </span>
        ) : (
          <span>Loading local time</span>
        )}
      </p>
      <div className="flex flex-wrap items-center gap-2">
        <Gauge className="size-4 shrink-0" aria-hidden />
        <span aria-live="polite">
          {measured !== null
            ? `Download speed: ${formatMbps(measured)} Mbps (measured)`
            : estimate
              ? `Connection: ${estimate}, browser estimate`
              : "Connection speed: not reported by this browser"}
        </span>
        <button
          type="button"
          onClick={runTest}
          disabled={state === "testing"}
          className="inline-flex items-center gap-1 rounded-md border border-border px-2 py-0.5 font-medium text-foreground hover:border-primary/50 disabled:opacity-60"
        >
          {state === "testing" ? <Loader2 className="size-3 animate-spin" aria-hidden /> : null}
          {state === "testing" ? "Testing" : measured !== null ? "Test again" : "Test speed"}
        </button>
        {state === "error" ? <span className="text-danger">Speed test failed.</span> : null}
      </div>
    </div>
  );
}
