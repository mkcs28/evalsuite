import type { Metadata } from "next";
import { ButtonLink } from "@/components/ui/button-link";
import { PageHeader } from "@/components/ui/page-header";
import { RELEASE_NOTES } from "@/data/releases";

export const metadata: Metadata = {
  title: "Release notes",
  description: "Changes in each published EvalSuite release.",
  alternates: { canonical: "/release-notes" },
};

export default function ReleaseNotesPage() {
  return (
    <>
      <PageHeader title="Release notes">
        Changes in each published version, grouped as Added, Changed, Fixed, Deprecated, Removed and
        Security.
      </PageHeader>
      <div className="mx-auto max-w-3xl px-4 pt-12 sm:px-6">
        {RELEASE_NOTES.length === 0 ? (
          <div className="rounded-lg border border-dashed border-border px-6 py-14 text-center">
            <p className="font-semibold">No versions have been released yet.</p>
            <p className="mt-2 text-sm text-muted-foreground">
              Notes appear here when a version is published to PyPI.
            </p>
            <ButtonLink href="/roadmap" variant="secondary" className="mt-6">
              View the roadmap
            </ButtonLink>
          </div>
        ) : (
          <ol className="space-y-12">
            {RELEASE_NOTES.map((r) => (
              <li key={r.version}>
                <h2 className="text-xl font-medium">{r.version}</h2>
                {r.date ? <p className="text-sm text-muted-foreground">{r.date}</p> : null}
                {r.changes.map((c) => (
                  <div key={c.kind} className="mt-4">
                    <h3 className="font-semibold">{c.kind}</h3>
                    <ul className="mt-1 list-disc pl-5 text-muted-foreground">
                      {c.items.map((i) => (
                        <li key={i}>{i}</li>
                      ))}
                    </ul>
                  </div>
                ))}
              </li>
            ))}
          </ol>
        )}
      </div>
    </>
  );
}
