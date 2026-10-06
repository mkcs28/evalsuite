"use client";
import Link from "next/link";

export default function ErrorPage({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="mx-auto max-w-xl px-4 py-28 text-center">
      <h1 className="text-3xl font-bold tracking-tight">This page could not be displayed</h1>
      <p className="mt-3 text-muted-foreground">
        An unexpected error occurred while rendering. Try again, or return to the documentation.
      </p>
      <div className="mt-8 flex justify-center gap-3">
        <button
          type="button"
          onClick={reset}
          className="inline-flex h-10 items-center rounded-md bg-primary px-4 text-sm font-medium text-primary-foreground"
        >
          Try again
        </button>
        <Link
          href="/docs"
          className="inline-flex h-10 items-center rounded-md border border-border px-4 text-sm font-medium"
        >
          Open documentation
        </Link>
      </div>
    </div>
  );
}
