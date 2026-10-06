"use client";

import Link from "next/link";
import { useEffect, useId, useState } from "react";
import { buttonClass } from "@/components/ui/button-link";
import { ApiUnconfigured, AuthCard, inputClass } from "./auth-card";
import { useAuth } from "./auth-provider";

export function ForgotPasswordForm() {
  const { status, client } = useAuth();
  const id = useId();
  const [sent, setSent] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  return (
    <AuthCard
      title="Reset your password"
      subtitle="We will email you a link to choose a new password."
      footer={
        <Link href="/login" className="font-medium text-primary underline-offset-4 hover:underline">
          Back to sign in
        </Link>
      }
    >
      {status === "unconfigured" || !client ? (
        <ApiUnconfigured />
      ) : sent ? (
        <p
          role="status"
          className="rounded-xl border border-success/35 bg-success/6 p-4 text-sm leading-relaxed"
        >
          {sent} The link expires after a short time and works once.
        </p>
      ) : (
        <form
          className="space-y-4"
          onSubmit={async (e) => {
            e.preventDefault();
            setBusy(true);
            setError(null);
            try {
              setSent(
                await client.forgotPassword(String(new FormData(e.currentTarget).get("email"))),
              );
            } catch (err) {
              setError(err instanceof Error ? err.message : "The request could not be sent.");
            } finally {
              setBusy(false);
            }
          }}
        >
          <div>
            <label htmlFor={`${id}-email`} className="text-sm font-medium">
              Email
            </label>
            <input
              id={`${id}-email`}
              name="email"
              type="email"
              required
              autoComplete="email"
              className={`${inputClass} mt-1.5`}
            />
          </div>
          {error ? (
            <p role="alert" className="text-sm text-danger">
              {error}
            </p>
          ) : null}
          <button
            type="submit"
            disabled={busy}
            className={buttonClass("primary", "w-full disabled:opacity-60")}
          >
            {busy ? "Sending" : "Send reset link"}
          </button>
        </form>
      )}
    </AuthCard>
  );
}

/** Reads the token from the URL fragment (#token=...), which is never sent to any server. */
export function readResetToken(hash: string): string | null {
  const token = new URLSearchParams(hash.replace(/^#/, "")).get("token");
  return token && /^[A-Za-z0-9_-]{20,200}$/.test(token) ? token : null;
}

export function ResetPasswordForm() {
  const { status, client } = useAuth();
  const id = useId();
  const [token, setToken] = useState<string | null | undefined>(undefined);
  const [done, setDone] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    // The fragment is only available in the browser.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setToken(readResetToken(window.location.hash));
    // Remove the token from the address bar and history.
    window.history.replaceState(null, "", window.location.pathname);
  }, []);

  return (
    <AuthCard
      title="Choose a new password"
      subtitle="Other sessions are signed out once the password changes."
    >
      {status === "unconfigured" || !client ? (
        <ApiUnconfigured />
      ) : done ? (
        <div role="status" className="space-y-4">
          <p className="rounded-xl border border-success/35 bg-success/6 p-4 text-sm">{done}</p>
          <Link href="/login" className={buttonClass("primary", "w-full")}>
            Sign in
          </Link>
        </div>
      ) : token === null ? (
        <div role="alert" className="space-y-4 text-sm">
          <p>
            This page needs the link from the password-reset email. The link may be incomplete or
            already used.
          </p>
          <Link href="/forgot-password" className={buttonClass("secondary", "w-full")}>
            Request a new link
          </Link>
        </div>
      ) : (
        <form
          className="space-y-4"
          onSubmit={async (e) => {
            e.preventDefault();
            const f = new FormData(e.currentTarget);
            const password = String(f.get("password"));
            if (password !== String(f.get("confirm"))) {
              setError("The passwords do not match.");
              return;
            }
            setBusy(true);
            setError(null);
            try {
              setDone(await client.resetPassword(token ?? "", password));
            } catch (err) {
              setError(err instanceof Error ? err.message : "The password could not be reset.");
            } finally {
              setBusy(false);
            }
          }}
        >
          <div>
            <label htmlFor={`${id}-password`} className="text-sm font-medium">
              New password
            </label>
            <input
              id={`${id}-password`}
              name="password"
              type="password"
              required
              minLength={10}
              maxLength={128}
              autoComplete="new-password"
              className={`${inputClass} mt-1.5`}
            />
          </div>
          <div>
            <label htmlFor={`${id}-confirm`} className="text-sm font-medium">
              Confirm new password
            </label>
            <input
              id={`${id}-confirm`}
              name="confirm"
              type="password"
              required
              minLength={10}
              maxLength={128}
              autoComplete="new-password"
              className={`${inputClass} mt-1.5`}
            />
          </div>
          {error ? (
            <p role="alert" className="text-sm text-danger">
              {error}
            </p>
          ) : null}
          <button
            type="submit"
            disabled={busy || token === undefined}
            className={buttonClass("primary", "w-full disabled:opacity-60")}
          >
            {busy ? "Saving" : "Set new password"}
          </button>
        </form>
      )}
    </AuthCard>
  );
}
