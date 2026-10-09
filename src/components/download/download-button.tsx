import { Download } from "@/components/ui/icons";
import Link from "next/link";
import { buttonClass } from "@/components/ui/button-link";
import { latestRelease } from "@/lib/downloads/manifest";

/** Opens the download page, where the mandatory email step issues signed download links. */
export function DownloadButton({ variant = "secondary" }: { variant?: "primary" | "secondary" }) {
  // Always goes through the email step on /download; files are never linked directly.
  return (
    <Link href="/download#get" className={buttonClass(variant)}>
      <Download className="size-4" aria-hidden />
      {latestRelease ? `Download v${latestRelease.version}` : "Download"}
      {latestRelease ? null : (
        <span className="rounded-full bg-surface-muted px-2 py-0.5 text-[11px] font-medium text-muted-foreground">
          soon
        </span>
      )}
    </Link>
  );
}
