"use client";

import { Download, LockKeyhole, MailCheck, ShieldCheck } from "lucide-react";
import { useEffect, useId, useState } from "react";
import { buttonClass } from "@/components/ui/button-link";
import { apiBaseUrl } from "@/lib/api";
import { requestDownload } from "@/lib/api/download-client";
import { cn } from "@/lib/utils/cn";
import { PERSONAL_EMAIL_HINT, personalEmailError } from "@/lib/validation/email";

export interface GateFile {
  filename: string;
  kind: "wheel" | "sdist";
  sizeLabel: string;
}

/**
 * Mandatory email step before downloading. The API records the email for security notices
 * about the version and returns short-lived signed links; the website only serves files
 * for valid links. Before the first release, the same step signs up for the v0.1.0 notice.
 */
export function DownloadGate({ version, files }: { version: string | null; files: GateFile[] }) {
  const base = apiBaseUrl();
  const id = useId();
  const [email, setEmail] = useState("");
  const [consent, setConsent] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [links, setLinks] = useState<Record<string, string> | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const [expiresAt, setExpiresAt] = useState<number | null>(null);
  const [now, setNow] = useState(() => Date.now());

  useEffect(() => {
    if (!expiresAt) return;
    const t = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(t);
  }, [expiresAt]);

  const emailError = personalEmailError(email);
  // Show the rule as soon as a complete address has been typed.
  const showEmailError = !!emailError && /@[^@\s]+\.[a-z]{2,}$/i.test(email.trim());
  const valid = !emailError && consent;
  const expired = expiresAt !== null && now >= expiresAt;
  const remaining = expiresAt ? Math.max(0, Math.ceil((expiresAt - now) / 1000)) : 0;

  if (!base) {
    return (
      <div role="status" className="rounded-2xl border border-warning/35 bg-warning/6 p-5 text-sm">
        <p className="font-semibold">Downloads are not available on this deployment</p>
        <p className="mt-1 text-muted-foreground">
          The email step needs the EvalSuite API. Site operators enable it by setting{" "}
          <code>NEXT_PUBLIC_API_BASE_URL</code>.
        </p>
      </div>
    );
  }

  if ((links || message) && !expired) {
    return (
      <div role="status" className="rounded-2xl border border-success/40 bg-success/6 p-6">
        <p className="flex items-center gap-2 font-semibold">
          <MailCheck className="size-5 text-success" aria-hidden /> {message}
        </p>
        {links ? (
          <>
            <div className="mt-4 flex flex-wrap gap-3">
              {files.map((f) => (
                <a
                  key={f.filename}
                  href={links[f.filename]}
                  download={f.filename}
                  className={buttonClass(f.kind === "wheel" ? "primary" : "secondary", "h-10")}
                >
                  <Download className="size-4" aria-hidden />
                  {f.kind === "wheel" ? "Download wheel" : "Download source"} ({f.sizeLabel})
                </a>
              ))}
            </div>
            <p className="mt-3 text-xs text-muted-foreground" aria-live="polite">
              These links expire in {Math.floor(remaining / 60)}:
              {String(remaining % 60).padStart(2, "0")}. A confirmation with an unsubscribe link has
              been sent to {email.trim().toLowerCase()}.
            </p>
          </>
        ) : null}
      </div>
    );
  }

  return (
    <form
      noValidate
      className="rounded-2xl border border-border bg-surface p-6 shadow-panel"
      onSubmit={async (e) => {
        e.preventDefault();
        if (!valid || busy) return;
        setBusy(true);
        setError(null);
        try {
          if (version === null) {
            const g = await requestDownload(base, {
              email: email.trim(),
              version: "upcoming",
              filename: null,
            });
            setMessage(g.message);
          } else {
            const grants = await Promise.all(
              files.map((f) =>
                requestDownload(base, { email: email.trim(), version, filename: f.filename }),
              ),
            );
            const map: Record<string, string> = {};
            files.forEach((f, i) => {
              if (grants[i]?.downloadPath) map[f.filename] = grants[i].downloadPath!;
            });
            setLinks(map);
            setMessage("Your download is ready");
            setExpiresAt(Date.now() + (grants[0]?.expiresIn ?? 600) * 1000);
            setNow(Date.now());
          }
        } catch (err) {
          setError(err instanceof Error ? err.message : "The request could not be completed.");
        } finally {
          setBusy(false);
        }
      }}
    >
      <div className="flex items-start gap-3">
        <span className="icon-tile">
          <LockKeyhole className="size-5" aria-hidden />
        </span>
        <div>
          <h3 className="text-lg font-semibold">
            {version ? "Enter your email to download" : "Enter your email to be notified"}
          </h3>
          <p className="mt-1 text-sm text-muted-foreground">
            <strong className="text-foreground">
              For security purposes, this step is mandatory.
            </strong>{" "}
            We use your email only to warn you if a security issue is found in the version you
            download
            {version ? "" : ", and to tell you when v0.1.0 is released"}. It is never shared, and
            every email has an unsubscribe link.
          </p>
        </div>
      </div>

      <div className="mt-5">
        <label htmlFor={`${id}-email`} className="text-sm font-medium">
          Personal email
          <span className="text-danger" aria-hidden>
            {" "}
            *
          </span>
        </label>
        <input
          id={`${id}-email`}
          type="email"
          required
          aria-required
          aria-invalid={showEmailError}
          aria-describedby={`${id}-email-note`}
          autoComplete="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="mt-1.5 h-11 w-full rounded-xl border border-border bg-surface px-3.5 text-sm outline-none transition focus:border-primary focus:ring-4 focus:ring-primary/15"
          placeholder="you@gmail.com"
        />
        <p
          id={`${id}-email-note`}
          role={showEmailError ? "alert" : undefined}
          className={cn("mt-1 text-xs", showEmailError ? "text-danger" : "text-muted-foreground")}
        >
          {showEmailError ? emailError : PERSONAL_EMAIL_HINT}
        </p>
      </div>
      <label className="mt-4 flex items-start gap-2.5 text-sm">
        <input
          type="checkbox"
          required
          aria-required
          checked={consent}
          onChange={(e) => setConsent(e.target.checked)}
          className="mt-0.5"
        />
        <span>
          I agree to receive security notices about{" "}
          {version ? `EvalSuite ${version}` : "EvalSuite releases"}.
        </span>
      </label>
      {expired ? (
        <p className="mt-3 text-sm text-warning">
          Your download links expired. Submit again for new ones.
        </p>
      ) : null}
      {error ? (
        <p role="alert" className="mt-3 text-sm text-danger">
          {error}
        </p>
      ) : null}
      <button
        type="submit"
        disabled={!valid || busy}
        className={cn(
          buttonClass("primary", "mt-5 w-full disabled:cursor-not-allowed disabled:opacity-50"),
        )}
      >
        {version ? (
          <Download className="size-4" aria-hidden />
        ) : (
          <ShieldCheck className="size-4" aria-hidden />
        )}
        {busy ? "Please wait" : version ? "Continue to download" : "Notify me"}
      </button>
      {!valid ? (
        <p className="mt-2 text-center text-xs text-muted-foreground">
          Enter a personal email and tick the box to continue.
        </p>
      ) : null}
    </form>
  );
}
