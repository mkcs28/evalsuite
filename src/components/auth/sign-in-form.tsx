"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useId, useState } from "react";
import { buttonClass } from "@/components/ui/button-link";
import { ApiUnconfigured, AuthCard, inputClass } from "./auth-card";
import { useAuth } from "./auth-provider";

export function SignInForm() {
  const { status, signIn } = useAuth();
  const router = useRouter();
  const id = useId();
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  return (
    <AuthCard
      title="Sign in"
      subtitle="Manage your API keys and usage."
      footer={
        <>
          No account yet?{" "}
          <Link
            href="/register"
            className="font-medium text-primary underline-offset-4 hover:underline"
          >
            Create one
          </Link>
        </>
      }
    >
      {status === "unconfigured" ? (
        <ApiUnconfigured />
      ) : (
        <form
          className="space-y-4"
          onSubmit={async (e) => {
            e.preventDefault();
            const form = new FormData(e.currentTarget);
            setBusy(true);
            setError(null);
            try {
              await signIn(String(form.get("email")), String(form.get("password")));
              router.push("/dashboard");
            } catch (err) {
              setError(err instanceof Error ? err.message : "Sign-in failed.");
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
          <div>
            <div className="flex items-baseline justify-between">
              <label htmlFor={`${id}-password`} className="text-sm font-medium">
                Password
              </label>
              <Link
                href="/forgot-password"
                className="text-xs font-medium text-primary hover:underline"
              >
                Forgot password?
              </Link>
            </div>
            <input
              id={`${id}-password`}
              name="password"
              type="password"
              required
              autoComplete="current-password"
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
            {busy ? "Signing in" : "Sign in"}
          </button>
        </form>
      )}
    </AuthCard>
  );
}
