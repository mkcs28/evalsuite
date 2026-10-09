"use client";

import { ShieldCheck, TriangleAlert } from "@/components/ui/icons";
import { useRouter } from "next/navigation";
import { useId, useState } from "react";
import { buttonClass } from "@/components/ui/button-link";
import { inputClass } from "./auth-card";
import { useAuth } from "./auth-provider";

export function AccountSettings() {
  const { client, replaceToken, signOut } = useAuth();
  const router = useRouter();
  const id = useId();
  const [pwMessage, setPwMessage] = useState<{ ok: boolean; text: string } | null>(null);
  const [delError, setDelError] = useState<string | null>(null);
  const [busy, setBusy] = useState<"password" | "delete" | null>(null);
  const [confirmDelete, setConfirmDelete] = useState(false);
  if (!client) return null;

  return (
    <div className="mt-10 grid gap-6 lg:grid-cols-2">
      <section
        aria-labelledby={`${id}-security`}
        className="rounded-2xl border border-border bg-surface p-6"
      >
        <h2 id={`${id}-security`} className="flex items-center gap-2 text-lg font-semibold">
          <ShieldCheck className="size-5 text-primary" aria-hidden /> Change password
        </h2>
        <p className="mt-1 text-sm text-muted-foreground">
          Other signed-in sessions end. API keys keep working.
        </p>
        <form
          className="mt-5 space-y-3"
          onSubmit={async (e) => {
            e.preventDefault();
            const form = e.currentTarget;
            const f = new FormData(form);
            const next = String(f.get("new"));
            if (next !== String(f.get("confirm"))) {
              setPwMessage({ ok: false, text: "The new passwords do not match." });
              return;
            }
            setBusy("password");
            setPwMessage(null);
            try {
              const t = await client.changePassword(String(f.get("current")), next);
              replaceToken(t.accessToken, t.expiresIn);
              form.reset();
              setPwMessage({
                ok: true,
                text: "Password changed. Other sessions have been signed out.",
              });
            } catch (err) {
              setPwMessage({
                ok: false,
                text: err instanceof Error ? err.message : "The password was not changed.",
              });
            } finally {
              setBusy(null);
            }
          }}
        >
          <label className="block text-sm font-medium" htmlFor={`${id}-current`}>
            Current password
          </label>
          <input
            id={`${id}-current`}
            name="current"
            type="password"
            required
            autoComplete="current-password"
            className={inputClass}
          />
          <label className="block text-sm font-medium" htmlFor={`${id}-new`}>
            New password
          </label>
          <input
            id={`${id}-new`}
            name="new"
            type="password"
            required
            minLength={10}
            maxLength={128}
            autoComplete="new-password"
            className={inputClass}
          />
          <label className="block text-sm font-medium" htmlFor={`${id}-confirm`}>
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
            className={inputClass}
          />
          {pwMessage ? (
            <p
              role={pwMessage.ok ? "status" : "alert"}
              className={`text-sm ${pwMessage.ok ? "text-success" : "text-danger"}`}
            >
              {pwMessage.text}
            </p>
          ) : null}
          <button
            type="submit"
            disabled={busy !== null}
            className={buttonClass("primary", "disabled:opacity-60")}
          >
            {busy === "password" ? "Saving" : "Change password"}
          </button>
        </form>
      </section>

      <section
        aria-labelledby={`${id}-danger`}
        className="rounded-2xl border border-danger/35 bg-surface p-6"
      >
        <h2 id={`${id}-danger`} className="flex items-center gap-2 text-lg font-semibold">
          <TriangleAlert className="size-5 text-danger" aria-hidden /> Delete account
        </h2>
        <p className="mt-1 text-sm text-muted-foreground">
          Permanently deletes your account, all API keys and usage counters. This cannot be undone.
        </p>
        <form
          className="mt-5 space-y-3"
          onSubmit={async (e) => {
            e.preventDefault();
            const password = String(new FormData(e.currentTarget).get("password"));
            // Two-step, in-page confirmation instead of a browser dialog.
            if (!confirmDelete) {
              setConfirmDelete(true);
              return;
            }
            setBusy("delete");
            setDelError(null);
            try {
              await client.deleteAccount(password);
              signOut();
              router.push("/");
            } catch (err) {
              setDelError(err instanceof Error ? err.message : "The account was not deleted.");
            } finally {
              setBusy(null);
            }
          }}
        >
          <label className="block text-sm font-medium" htmlFor={`${id}-delete`}>
            Confirm with your password
          </label>
          <input
            id={`${id}-delete`}
            name="password"
            type="password"
            required
            autoComplete="current-password"
            className={inputClass}
          />
          {delError ? (
            <p role="alert" className="text-sm text-danger">
              {delError}
            </p>
          ) : null}
          {confirmDelete ? (
            <p
              role="alert"
              className="rounded-xl border border-danger/40 bg-danger/5 p-3 text-sm font-medium"
            >
              This permanently deletes your account, API key and usage history. It cannot be undone.
            </p>
          ) : null}
          <button
            type="submit"
            disabled={busy !== null}
            className={
              confirmDelete
                ? "inline-flex h-11 items-center justify-center rounded-xl bg-danger px-5 text-sm font-semibold text-white hover:bg-danger/90 disabled:opacity-60"
                : "inline-flex h-11 items-center justify-center rounded-xl border border-danger/50 px-5 text-sm font-semibold text-danger hover:bg-danger/8 disabled:opacity-60"
            }
          >
            {busy === "delete"
              ? "Deleting"
              : confirmDelete
                ? "Yes, permanently delete my account"
                : "Delete account"}
          </button>
          {confirmDelete ? (
            <button
              type="button"
              onClick={() => setConfirmDelete(false)}
              className="ml-2 inline-flex h-11 items-center rounded-xl px-4 text-sm font-semibold text-muted-foreground hover:text-foreground"
            >
              Cancel
            </button>
          ) : null}
        </form>
      </section>
    </div>
  );
}
