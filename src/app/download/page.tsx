import { FileArchive, FileCheck2 } from "lucide-react";
import type { Metadata } from "next";
import { CodeBlock } from "@/components/code/code-block";
import { DownloadGate } from "@/components/download/download-gate";
import { InstallCommand } from "@/components/download/install-command";
import { CopyAction } from "@/components/ui/copy-action";
import { PageHeader } from "@/components/ui/page-header";
import { StatusBadge } from "@/components/ui/status-badge";
import { formatSize, releases } from "@/lib/downloads/manifest";

export const metadata: Metadata = {
  title: "Download",
  description: "Download EvalSuite directly from this website, or install it with pip.",
  alternates: { canonical: "/download" },
};

export default function DownloadPage() {
  const latest = releases[0] ?? null;
  return (
    <>
      <PageHeader
        title="Download EvalSuite"
        meta={
          releases.length ? (
            <StatusBadge status="implemented" label={`Latest v${releases[0]!.version}`} />
          ) : (
            <StatusBadge status="planned" label="First release: v0.1.0" />
          )
        }
      >
        Install with pip, or download the wheel and source archive directly from this site. Every
        file is listed with its SHA-256 checksum so you can verify it.
      </PageHeader>

      <div className="mx-auto max-w-[1280px] space-y-12 px-4 pt-12 sm:px-6">
        <section aria-labelledby="pip-title">
          <h2 id="pip-title" className="text-2xl font-bold tracking-tight">
            Install with pip
          </h2>
          <InstallCommand className="mt-4" />
        </section>

        <section aria-labelledby="files-title" id="get" className="scroll-mt-24">
          <h2 id="files-title" className="text-2xl font-bold tracking-tight">
            Direct download
          </h2>
          <p className="mt-2 max-w-2xl text-muted-foreground">
            Files are hosted on this website.{" "}
            {latest
              ? `Latest release: v${latest.version}.`
              : "No release has been published yet; v0.1.0 is planned."}
          </p>
          <div className="mt-5 grid gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)]">
            <DownloadGate
              version={latest?.version ?? null}
              files={(latest?.files ?? []).map((f) => ({
                filename: f.filename,
                kind: f.kind,
                sizeLabel: formatSize(f.size),
              }))}
            />
            {latest ? (
              <ul className="h-fit divide-y divide-border-subtle rounded-2xl border border-border bg-surface">
                {latest.files.map((file) => (
                  <li key={file.filename} className="flex gap-3 px-5 py-4">
                    <FileArchive
                      className="mt-0.5 size-5 shrink-0 text-muted-foreground"
                      aria-hidden
                    />
                    <div className="min-w-0 flex-1">
                      <p className="font-medium break-all">{file.filename}</p>
                      <p className="mt-0.5 text-xs text-muted-foreground">
                        {file.kind === "wheel" ? "Wheel (recommended)" : "Source distribution"} ·{" "}
                        {formatSize(file.size)}
                      </p>
                      <p className="mt-1 text-xs break-all text-muted-foreground">
                        SHA-256 <code>{file.sha256}</code>
                      </p>
                      <CopyAction
                        text={file.sha256}
                        label="Copy checksum"
                        variant="ghost"
                        className="-ml-3 mt-1"
                      />
                    </div>
                  </li>
                ))}
              </ul>
            ) : (
              <div className="h-fit rounded-2xl border border-dashed border-border bg-surface p-6 text-sm text-muted-foreground">
                <p className="font-semibold text-foreground">What you will get</p>
                <p className="mt-1">
                  The wheel and source archive for each release, each listed with its SHA-256
                  checksum, hosted here rather than on a third-party site.
                </p>
              </div>
            )}
          </div>
          {releases.length > 1 ? (
            <p className="mt-4 text-sm text-muted-foreground">
              Earlier releases:{" "}
              {releases
                .slice(1)
                .map((r) => `v${r.version}`)
                .join(", ")}
              . Contact the maintainers if you need one of them.
            </p>
          ) : null}
        </section>

        <section aria-labelledby="verify-title" className="grid gap-8 lg:grid-cols-2">
          <div>
            <h2
              id="verify-title"
              className="flex items-center gap-3 text-2xl font-bold tracking-tight"
            >
              <span className="brand-gradient inline-flex size-9 items-center justify-center rounded-xl text-on-brand">
                <FileCheck2 className="size-5" aria-hidden />
              </span>
              Verify the file
            </h2>
            <p className="mt-2 text-muted-foreground">
              Compare the printed checksum with the one listed above before installing.
            </p>
            <CodeBlock
              lang="bash"
              code={`# Linux
sha256sum evalsuite-<version>-py3-none-any.whl
# macOS
shasum -a 256 evalsuite-<version>-py3-none-any.whl
# Windows (PowerShell)
Get-FileHash evalsuite-<version>-py3-none-any.whl -Algorithm SHA256`}
            />
          </div>
          <div>
            <h2 className="text-2xl font-bold tracking-tight">Install the downloaded file</h2>
            <p className="mt-2 text-muted-foreground">
              Install into a virtual environment from the file you downloaded.
            </p>
            <CodeBlock
              lang="bash"
              code={`python -m venv .venv
source .venv/bin/activate        # Windows: .venv\\Scripts\\activate
pip install ./evalsuite-<version>-py3-none-any.whl
python -c "import evalsuite; print(evalsuite.__version__)"`}
            />
          </div>
        </section>
      </div>
    </>
  );
}
