"use client";

import { useEffect, useState } from "react";
import { AuthCard } from "@/components/auth/auth-card";
import { readResetToken } from "@/components/auth/password-forms";
import { apiBaseUrl } from "@/lib/api";
import { unsubscribe } from "@/lib/api/download-client";

export function UnsubscribeForm() {
  const [state, setState] = useState<{ kind: "working" | "done" | "error"; text: string }>({
    kind: "working",
    text: "Updating your preferences",
  });

  useEffect(() => {
    const token = readResetToken(window.location.hash);
    window.history.replaceState(null, "", window.location.pathname);
    const base = apiBaseUrl();
    if (!token || !base) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setState({
        kind: "error",
        text: "This link is incomplete. Use the link from the email you received.",
      });
      return;
    }
    unsubscribe(base, token)
      .then((text) => setState({ kind: "done", text }))
      .catch((err: unknown) =>
        setState({
          kind: "error",
          text: err instanceof Error ? err.message : "Something went wrong.",
        }),
      );
  }, []);

  return (
    <AuthCard title="Security notices" subtitle="Manage emails about EvalSuite downloads.">
      <p
        role={state.kind === "error" ? "alert" : "status"}
        className={`rounded-xl border p-4 text-sm ${
          state.kind === "done"
            ? "border-success/35 bg-success/6"
            : state.kind === "error"
              ? "border-danger/30 bg-danger/5"
              : "border-border"
        }`}
      >
        {state.text}
      </p>
    </AuthCard>
  );
}
