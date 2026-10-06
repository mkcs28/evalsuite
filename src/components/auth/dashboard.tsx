"use client";

import {
  Activity,
  Building2,
  CalendarDays,
  ChevronDown,
  Gauge,
  Globe2,
  KeyRound,
  LogOut,
  Mail,
  Plus,
  RefreshCw,
  ShieldCheck,
  Trash2,
  TriangleAlert,
  UserRound,
  type LucideIcon,
} from "lucide-react";
import Link from "next/link";
import { useCallback, useEffect, useId, useState } from "react";
import { buttonClass } from "@/components/ui/button-link";
import { CopyAction } from "@/components/ui/copy-action";
import {
  MINIMUM_AGE,
  ROLES,
  type ApiKey,
  type CreatedKey,
  type Usage,
  type User,
} from "@/lib/api/account-client";
import { apiBaseUrl } from "@/lib/api";
import { cn } from "@/lib/utils/cn";
import { AccountSettings } from "./account-settings";
import { ApiUnconfigured, inputClass } from "./auth-card";
import { useAuth } from "./auth-provider";

const dateFmt = new Intl.DateTimeFormat("en", { dateStyle: "medium", timeStyle: "short" });
const dayFmt = new Intl.DateTimeFormat("en", { dateStyle: "medium" });
const fmt = (iso: string | null) => (iso ? dateFmt.format(new Date(iso)) : "Never");
const masked = (prefix: string) => `es_live_${prefix}_••••••••••••••••`;
const roleLabel = (role: string | null | undefined) => ROLES.find(([v]) => v === role)?.[1] ?? null;

function initials(user: User): string {
  const source = user.name?.trim() || user.email;
  const parts = source.split(/\s+/).filter(Boolean);
  return (
    ((parts[0]?.[0] ?? "") + (parts.length > 1 ? (parts.at(-1)?.[0] ?? "") : "")).toUpperCase() ||
    "?"
  );
}

function Card({
  title,
  icon: Icon,
  action,
  children,
  className,
}: {
  title: string;
  icon: LucideIcon;
  action?: React.ReactNode;
  children: React.ReactNode;
  className?: string;
}) {
  const id = useId();
  return (
    <section
      aria-labelledby={id}
      className={cn("rounded-2xl border border-border bg-surface", className)}
    >
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border-subtle px-6 py-4">
        <h2 id={id} className="flex items-center gap-2.5 text-base font-semibold">
          <span className="icon-tile size-8 rounded-lg">
            <Icon className="size-4" aria-hidden />
          </span>
          {title}
        </h2>
        {action}
      </div>
      <div className="p-6">{children}</div>
    </section>
  );
}

function snippets(base: string) {
  const body = `{"task":"binary-classification","yTrue":[1,0,1,1],"yPred":[1,0,0,1],"metrics":["classification.accuracy","classification.f1"],"confidence":{"method":"wilson","level":0.95,"nBootstrap":1000,"randomState":42}}`;
  return {
    cURL: `curl ${base}/api/v1/evaluate \\
  -H "X-API-Key: $EVALSUITE_API_KEY" \\
  -H "Content-Type: application/json" \\
  -d '${body}'`,
    Python: `import os, requests

r = requests.post(
    "${base}/api/v1/evaluate",
    headers={"X-API-Key": os.environ["EVALSUITE_API_KEY"]},
    json={
        "task": "binary-classification",
        "yTrue": [1, 0, 1, 1],
        "yPred": [1, 0, 0, 1],
        "metrics": ["classification.accuracy", "classification.f1"],
        "confidence": {"method": "wilson", "level": 0.95, "nBootstrap": 1000, "randomState": 42},
    },
    timeout=30,
)
r.raise_for_status()
print(r.json())`,
    JavaScript: `const res = await fetch("${base}/api/v1/evaluate", {
  method: "POST",
  headers: {
    "X-API-Key": process.env.EVALSUITE_API_KEY,
    "Content-Type": "application/json",
  },
  body: JSON.stringify(${body}),
});
console.log(await res.json());`,
  } as const;
}

function QuickStart() {
  const base = apiBaseUrl() ?? "https://YOUR-API-HOST";
  const all = snippets(base);
  const [tab, setTab] = useState<keyof typeof all>("cURL");
  const id = useId();
  return (
    <Card
      title="Quick start"
      icon={Activity}
      action={
        <div
          role="tablist"
          aria-label="Language"
          className="inline-flex rounded-lg border border-border p-0.5"
        >
          {(Object.keys(all) as Array<keyof typeof all>).map((name) => (
            <button
              key={name}
              id={`${id}-${name}`}
              role="tab"
              type="button"
              aria-selected={tab === name}
              aria-controls={`${id}-panel`}
              onClick={() => setTab(name)}
              className={cn(
                "rounded-md px-3 py-1 text-sm font-medium",
                tab === name
                  ? "bg-surface-muted text-foreground"
                  : "text-muted-foreground hover:text-foreground",
              )}
            >
              {name}
            </button>
          ))}
        </div>
      }
    >
      <div id={`${id}-panel`} role="tabpanel" aria-labelledby={`${id}-${tab}`}>
        <div className="relative rounded-xl border border-border bg-surface-muted">
          <div className="absolute right-2 top-2">
            <CopyAction text={all[tab]} label="Copy" variant="secondary" className="h-8" />
          </div>
          <pre className="p-4 pt-14 text-xs leading-6 sm:pr-28 sm:pt-4">{all[tab]}</pre>
        </div>
        <p className="mt-3 text-sm text-muted-foreground">
          Store your key in the <code className="text-[0.85em]">EVALSUITE_API_KEY</code> environment
          variable. Results currently come from an interim engine, labelled in every response, until
          EvalSuite v0.1.0 is released.{" "}
          <Link href="/docs/api" className="font-medium text-primary hover:underline">
            API reference
          </Link>
        </p>
      </div>
    </Card>
  );
}

export function Dashboard() {
  const { status, user, client, signOut } = useAuth();
  const id = useId();
  const [keys, setKeys] = useState<ApiKey[]>([]);
  const [usage, setUsage] = useState<Usage | null>(null);
  const [created, setCreated] = useState<CreatedKey | null>(null);
  const [stored, setStored] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  // In-page confirmation (browser confirm() dialogs are blocked in some embeds and browsers).
  const [pending, setPending] = useState<"rotate" | "revoke" | null>(null);

  const refresh = useCallback(async () => {
    if (!client) return;
    try {
      const [k, u] = await Promise.all([client.listKeys(), client.usage()]);
      setKeys(k);
      setUsage(u);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not load your account.");
    }
  }, [client]);

  useEffect(() => {
    // Load account data once a session exists.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    if (status === "signed-in") void refresh();
  }, [status, refresh]);

  if (status === "unconfigured") {
    return (
      <div className="mx-auto max-w-xl px-4 py-24">
        <ApiUnconfigured />
      </div>
    );
  }
  if (status === "loading") {
    return (
      <p className="mx-auto max-w-xl px-4 py-24 text-center text-muted-foreground">
        Loading your account
      </p>
    );
  }
  if (status === "signed-out" || !user) {
    return (
      <div className="mx-auto max-w-md px-4 py-24 text-center">
        <h1 className="text-2xl font-bold">Sign in to manage API keys</h1>
        <p className="mt-2 text-muted-foreground">
          Your session has ended or you have not signed in yet.
        </p>
        <Link href="/login" className={buttonClass("primary", "mt-6")}>
          Sign in
        </Link>
      </div>
    );
  }

  const activeKey = keys.find((k) => !k.revokedAt) ?? null;
  const history = keys.filter((k) => k.revokedAt);

  const run = async (fn: () => Promise<void>, failure: string) => {
    setBusy(true);
    setError(null);
    try {
      await fn();
    } catch (err) {
      setError(err instanceof Error ? err.message : failure);
    } finally {
      setBusy(false);
    }
  };

  const issued = (k: CreatedKey) => {
    setCreated(k);
    setStored(false);
  };

  return (
    <div className="relative -mt-[4.25rem] pt-[4.25rem]">
      <div aria-hidden className="hero-glow absolute inset-x-0 top-0 h-[22rem]" />
      <div className="relative mx-auto max-w-[1280px] px-4 pb-10 pt-10 sm:px-6">
        {/* Header */}
        <header className="flex flex-wrap items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <span
              aria-hidden
              className="brand-gradient inline-flex size-14 items-center justify-center rounded-2xl text-lg font-bold text-on-brand shadow-panel"
            >
              {initials(user)}
            </span>
            <div>
              <p className="text-sm text-muted-foreground">Signed in as {user.email}</p>
              <h1 className="text-gradient text-3xl font-black tracking-tight sm:text-4xl">
                {user.name ? `Hi, ${user.name}` : "Your dashboard"}
              </h1>
            </div>
          </div>
          <button type="button" onClick={signOut} className={buttonClass("secondary", "h-10")}>
            <LogOut className="size-4" aria-hidden /> Sign out
          </button>
        </header>

        {error ? (
          <p
            role="alert"
            className="mt-6 rounded-xl border border-danger/30 bg-danger/5 px-4 py-3 text-sm text-danger"
          >
            {error}
          </p>
        ) : null}

        {/* Usage */}
        <dl className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {(
            [
              ["Requests, last 24 h", usage?.requestsLast24h, Activity],
              ["Requests, last 30 days", usage?.requestsLast30d, CalendarDays],
              [
                "Observations evaluated, 30 days",
                usage?.observationsLast30d?.toLocaleString("en"),
                Gauge,
              ],
              ["Rate limit", usage ? `${usage.rateLimitPerMinute} / min` : undefined, ShieldCheck],
            ] as const
          ).map(([label, value, Icon]) => (
            <div key={label} className="card-hover rounded-2xl border border-border bg-surface p-5">
              <dt className="flex items-center justify-between text-sm text-muted-foreground">
                {label}
                <Icon className="size-4 text-primary" aria-hidden />
              </dt>
              <dd className="mt-3 text-3xl font-bold tabular-nums">{value ?? "–"}</dd>
            </div>
          ))}
        </dl>

        <div className="mt-6 grid gap-6 lg:grid-cols-3">
          <div className="space-y-6 lg:col-span-2">
            {/* API key */}
            <Card
              title="Your API key"
              icon={KeyRound}
              action={
                activeKey ? (
                  <span className="inline-flex items-center gap-1.5 rounded-full border border-success/35 bg-success/8 px-2.5 py-0.5 text-xs font-medium text-success">
                    <span className="size-1.5 rounded-full bg-success" aria-hidden /> Active
                  </span>
                ) : null
              }
            >
              {created && !stored ? (
                <div
                  role="status"
                  className="mb-6 rounded-xl border border-success/40 bg-success/6 p-5"
                >
                  <p className="flex items-center gap-2 font-semibold">
                    <TriangleAlert className="size-4 text-warning" aria-hidden /> Copy your new key
                    now
                  </p>
                  <p className="mt-1 text-sm text-muted-foreground">
                    “{created.name}” will not be shown again. Store it like a password; anyone with
                    it can use your quota.
                  </p>
                  <div className="mt-4 flex flex-col gap-2 sm:flex-row sm:items-center">
                    <code
                      className="min-w-0 flex-1 rounded-lg border border-border bg-surface px-3 py-2.5 text-[13px] break-all select-all"
                      aria-label="New API key"
                    >
                      {created.key}
                    </code>
                    <CopyAction
                      text={created.key}
                      label="Copy key"
                      variant="primary"
                      className="h-10"
                    />
                  </div>
                  <div className="mt-3 flex flex-wrap items-center gap-3">
                    <CopyAction
                      text={`export EVALSUITE_API_KEY="${created.key}"`}
                      label="Copy as environment variable"
                      variant="ghost"
                    />
                    <button
                      type="button"
                      className="ml-auto text-sm font-medium text-muted-foreground underline underline-offset-4 hover:text-foreground"
                      onClick={() => setStored(true)}
                    >
                      I have stored it
                    </button>
                  </div>
                </div>
              ) : null}

              {!user.eligibleForApi ? (
                <p
                  role="note"
                  className="rounded-xl border border-warning/35 bg-warning/6 px-4 py-3 text-sm"
                >
                  API keys are available only to account holders aged {MINIMUM_AGE} or over.
                </p>
              ) : activeKey ? (
                <div>
                  <div className="flex flex-col gap-4 rounded-xl border border-border bg-surface-muted/50 p-4 sm:flex-row sm:items-center">
                    <div className="min-w-0 flex-1">
                      <p className="font-semibold">{activeKey.name}</p>
                      <p className="mt-1 text-sm break-all text-muted-foreground">
                        <code>{masked(activeKey.prefix)}</code>
                      </p>
                    </div>
                    <dl className="grid grid-cols-2 gap-x-6 gap-y-1 text-sm sm:text-right">
                      <dt className="text-muted-foreground">Created</dt>
                      <dd>{fmt(activeKey.createdAt)}</dd>
                      <dt className="text-muted-foreground">Last used</dt>
                      <dd>{fmt(activeKey.lastUsedAt)}</dd>
                    </dl>
                  </div>
                  {pending ? (
                    <div
                      role="alertdialog"
                      aria-labelledby={`${id}-confirm-title`}
                      className={cn(
                        "mt-4 rounded-xl border p-4",
                        pending === "revoke"
                          ? "border-danger/40 bg-danger/5"
                          : "border-warning/40 bg-warning/6",
                      )}
                    >
                      <p id={`${id}-confirm-title`} className="text-sm font-semibold">
                        {pending === "rotate"
                          ? `Rotate “${activeKey.name}”? The current key stops working immediately and a new one is shown once.`
                          : `Revoke “${activeKey.name}”? Requests using it will fail immediately.`}
                      </p>
                      <div className="mt-3 flex flex-wrap gap-2">
                        <button
                          type="button"
                          autoFocus
                          disabled={busy}
                          className={cn(
                            "inline-flex h-10 items-center gap-2 rounded-xl px-4 text-sm font-semibold disabled:opacity-60",
                            pending === "revoke"
                              ? "bg-danger text-white hover:bg-danger/90"
                              : buttonClass("primary", "h-10"),
                          )}
                          onClick={() => {
                            if (!client) return;
                            const action = pending;
                            void run(
                              async () => {
                                if (action === "rotate")
                                  issued(await client.rotateKey(activeKey.id));
                                else {
                                  await client.revokeKey(activeKey.id);
                                  setCreated(null);
                                }
                                setPending(null);
                                await refresh();
                              },
                              action === "rotate"
                                ? "Could not rotate the key."
                                : "Could not revoke the key.",
                            );
                          }}
                        >
                          {busy
                            ? "Working"
                            : pending === "rotate"
                              ? "Yes, rotate key"
                              : "Yes, revoke key"}
                        </button>
                        <button
                          type="button"
                          disabled={busy}
                          onClick={() => setPending(null)}
                          className={buttonClass("secondary", "h-10")}
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="mt-4 flex flex-wrap gap-2">
                      <button
                        type="button"
                        disabled={busy}
                        className={buttonClass("secondary", "h-10 disabled:opacity-60")}
                        onClick={() => setPending("rotate")}
                      >
                        <RefreshCw className="size-4" aria-hidden /> Rotate key
                      </button>
                      <button
                        type="button"
                        disabled={busy}
                        className="inline-flex h-10 items-center gap-2 rounded-xl px-4 text-sm font-semibold text-danger hover:bg-danger/8 disabled:opacity-60"
                        onClick={() => setPending("revoke")}
                      >
                        <Trash2 className="size-4" aria-hidden /> Revoke
                      </button>
                    </div>
                  )}
                  <p className="mt-3 text-xs text-muted-foreground">
                    One active key per account. Rotating issues a new key and disables this one
                    immediately.
                  </p>
                </div>
              ) : (
                <form
                  className="rounded-xl border border-dashed border-border p-6 text-center"
                  onSubmit={(e) => {
                    e.preventDefault();
                    if (!client) return;
                    const form = e.currentTarget;
                    const name = String(new FormData(form).get("name")).trim();
                    if (!name) return;
                    void run(async () => {
                      issued(await client.createKey(name));
                      form.reset();
                      await refresh();
                    }, "Could not create the key.");
                  }}
                >
                  <KeyRound className="mx-auto size-8 text-primary" aria-hidden />
                  <p className="mt-2 font-semibold">You don&apos;t have an API key yet</p>
                  <p className="mt-1 text-sm text-muted-foreground">
                    Name it after where you will use it. It is shown once, so have somewhere safe to
                    store it.
                  </p>
                  <div className="mx-auto mt-4 flex max-w-md gap-2">
                    <label htmlFor={`${id}-name`} className="sr-only">
                      Key name
                    </label>
                    <input
                      id={`${id}-name`}
                      name="name"
                      required
                      maxLength={80}
                      placeholder="Key name, e.g. laptop"
                      className={`${inputClass} h-10`}
                    />
                    <button
                      type="submit"
                      disabled={busy}
                      className={buttonClass("primary", "h-10 shrink-0 disabled:opacity-60")}
                    >
                      <Plus className="size-4" aria-hidden /> Create key
                    </button>
                  </div>
                </form>
              )}

              {history.length ? (
                <details className="group mt-6">
                  <summary className="flex cursor-pointer list-none items-center gap-1.5 text-sm font-medium text-muted-foreground hover:text-foreground">
                    <ChevronDown className="size-4 transition group-open:rotate-180" aria-hidden />
                    Revoked keys ({history.length})
                  </summary>
                  <ul className="mt-3 divide-y divide-border-subtle rounded-xl border border-border text-sm">
                    {history.map((k) => (
                      <li
                        key={k.id}
                        className="flex flex-wrap items-center justify-between gap-2 px-4 py-2.5"
                      >
                        <span className="font-medium">{k.name}</span>
                        <code className="text-xs text-muted-foreground">es_live_{k.prefix}_…</code>
                        <span className="text-muted-foreground">Revoked {fmt(k.revokedAt)}</span>
                      </li>
                    ))}
                  </ul>
                </details>
              ) : null}
            </Card>

            <QuickStart />
          </div>

          {/* Profile */}
          <Card title="Account" icon={UserRound} className="h-fit">
            <dl className="space-y-4 text-sm">
              {(
                [
                  [Mail, "Email", user.email],
                  [UserRound, "Role", roleLabel(user.role)],
                  [Building2, "Organisation", user.organization],
                  [Globe2, "Country", user.country],
                  [CalendarDays, "Member since", dayFmt.format(new Date(user.createdAt))],
                ] as const
              ).map(([Icon, label, value]) => (
                <div key={label} className="flex items-start gap-3">
                  <Icon className="mt-0.5 size-4 shrink-0 text-muted-foreground" aria-hidden />
                  <div className="min-w-0">
                    <dt className="text-muted-foreground">{label}</dt>
                    <dd className="font-medium break-words">{value || "Not provided"}</dd>
                  </div>
                </div>
              ))}
              <div className="flex items-start gap-3">
                <ShieldCheck className="mt-0.5 size-4 shrink-0 text-muted-foreground" aria-hidden />
                <div>
                  <dt className="text-muted-foreground">API access</dt>
                  <dd
                    className={cn(
                      "font-medium",
                      user.eligibleForApi ? "text-success" : "text-warning",
                    )}
                  >
                    {user.eligibleForApi ? "Eligible (18+)" : `Not eligible (under ${MINIMUM_AGE})`}
                  </dd>
                </div>
              </div>
            </dl>
          </Card>
        </div>

        <AccountSettings />
      </div>
    </div>
  );
}
