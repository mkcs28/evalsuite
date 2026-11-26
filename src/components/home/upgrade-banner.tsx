import Link from "next/link";
import { siteConfig } from "@/lib/config/site";

/** Reaches users of releases older than 1.1.2, which cannot tell them about new versions themselves. */
export function UpgradeBanner() {
  return (
    <div className="border-b border-border-subtle bg-surface-muted">
      <p className="mx-auto max-w-[1680px] px-4 py-2.5 text-center text-sm sm:px-6">
        <span className="font-semibold">EvalSuite {siteConfig.package.latestRelease} is out.</span>{" "}
        On an older version? Upgrade once with{" "}
        <code className="rounded bg-surface px-1.5 py-0.5">pip install -U evalsuite-python</code>;
        from 1.1.2 on, EvalSuite tells you about new releases itself.{" "}
        <Link href="/release-notes" className="underline underline-offset-4">
          What&apos;s new
        </Link>
      </p>
    </div>
  );
}
