import { z } from "zod";
import raw from "@/data/downloads.json";

/**
 * Release files hosted by the website itself (public/downloads/<version>/<filename>).
 * The manifest is written by scripts/add-release.mjs, never by hand.
 */
/** Name on PyPI ("evalsuite" was taken as too similar to "eval-suite"); imported as `evalsuite`. */
export const PACKAGE_NAME = "evalsuite-python";
/** Normalised prefix of built files: evalsuite_python-<version>-py3-none-any.whl, evalsuite_python-<version>.tar.gz. */
export const FILE_PREFIX = "evalsuite_python";
export const IMPORT_NAME = "evalsuite";

const VERSION = /^\d+\.\d+\.\d+(?:(?:a|b|rc)\d+)?$/;

export const DownloadFileSchema = z.object({
  filename: z
    .string()
    .regex(/^evalsuite_python-[0-9][A-Za-z0-9.]*(?:-py3-none-any\.whl|\.tar\.gz)$/),
  kind: z.enum(["wheel", "sdist"]),
  size: z.number().int().positive(),
  sha256: z.string().regex(/^[a-f0-9]{64}$/),
});

export const ReleaseSchema = z
  .object({
    version: z.string().regex(VERSION),
    date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
    files: z.array(DownloadFileSchema).min(1),
  })
  .superRefine((r, ctx) => {
    for (const f of r.files) {
      if (!f.filename.startsWith(`${FILE_PREFIX}-${r.version}`)) {
        ctx.addIssue({
          code: "custom",
          message: `${f.filename} does not match version ${r.version}`,
        });
      }
    }
  });

export const ManifestSchema = z.object({ releases: z.array(ReleaseSchema) });

export type DownloadFile = z.infer<typeof DownloadFileSchema>;
export type Release = z.infer<typeof ReleaseSchema>;

/** Validated at build time; newest release first. */
export const releases: Release[] = ManifestSchema.parse(raw).releases.sort((a, b) =>
  b.version.localeCompare(a.version, "en", { numeric: true }),
);

export const latestRelease: Release | null = releases[0] ?? null;

export function downloadUrl(release: Release, file: DownloadFile): string {
  return `/downloads/${release.version}/${file.filename}`;
}

export function preferredFile(release: Release): DownloadFile {
  return release.files.find((f) => f.kind === "wheel") ?? release.files[0]!;
}

export function formatSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

export const PIP_INSTALL = `pip install ${PACKAGE_NAME}`;
