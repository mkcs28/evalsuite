import { createHash } from "node:crypto";
import { existsSync, mkdirSync, mkdtempSync, readFileSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
// @ts-expect-error -- plain ESM script without type declarations
import { addRelease } from "../../scripts/add-release.mjs";
import manifest from "@/data/downloads.json";
import {
  ManifestSchema,
  PIP_INSTALL,
  downloadUrl,
  formatSize,
  preferredFile,
} from "@/lib/downloads/manifest";

function workspace() {
  const root = mkdtempSync(join(tmpdir(), "evalsuite-release-"));
  mkdirSync(join(root, "src/data"), { recursive: true });
  mkdirSync(join(root, "dist"));
  writeFileSync(join(root, "src/data/downloads.json"), JSON.stringify({ releases: [] }));
  const wheel = join(root, "dist/evalsuite-0.1.0-py3-none-any.whl");
  const sdist = join(root, "dist/evalsuite-0.1.0.tar.gz");
  writeFileSync(wheel, "wheel-bytes");
  writeFileSync(sdist, "sdist-bytes-longer");
  return { root, wheel, sdist };
}

describe("release publishing script", () => {
  it("copies files, records size and SHA-256, and produces a valid manifest", () => {
    const { root, wheel, sdist } = workspace();
    addRelease({ root, version: "0.1.0", files: [wheel, sdist], date: "2026-11-01" });
    const written = JSON.parse(readFileSync(join(root, "src/data/downloads.json"), "utf8"));
    const parsed = ManifestSchema.parse(written);
    const release = parsed.releases[0]!;
    expect(release.version).toBe("0.1.0");
    const w = release.files.find((f) => f.kind === "wheel")!;
    expect(w.sha256).toBe(createHash("sha256").update("wheel-bytes").digest("hex"));
    expect(w.size).toBe(11);
    expect(existsSync(join(root, "releases/0.1.0/evalsuite-0.1.0-py3-none-any.whl"))).toBe(true);
    expect(existsSync(join(root, "public/downloads"))).toBe(false);
    expect(downloadUrl(release, w)).toBe("/downloads/0.1.0/evalsuite-0.1.0-py3-none-any.whl");
    expect(preferredFile(release).kind).toBe("wheel");
  });

  it("refuses to republish a version", () => {
    const { root, wheel } = workspace();
    addRelease({ root, version: "0.1.0", files: [wheel] });
    expect(() => addRelease({ root, version: "0.1.0", files: [wheel] })).toThrow(/immutable/);
  });

  it("rejects files that do not match the version or package", () => {
    const { root, wheel } = workspace();
    expect(() => addRelease({ root, version: "0.2.0", files: [wheel] })).toThrow(
      /is not evalsuite-0.2.0/,
    );
    const other = join(root, "dist/malware-0.1.0-py3-none-any.whl");
    writeFileSync(other, "x");
    expect(() => addRelease({ root, version: "0.1.0", files: [other] })).toThrow(
      /is not evalsuite-0.1.0/,
    );
    expect(() => addRelease({ root, version: "latest", files: [wheel] })).toThrow(
      /Invalid version/,
    );
  });
});

describe("download manifest", () => {
  it("is valid and every listed file exists in the private releases folder", () => {
    const parsed = ManifestSchema.parse(manifest);
    for (const r of parsed.releases) {
      for (const f of r.files)
        expect(existsSync(join("releases", r.version, f.filename))).toBe(true);
    }
  });

  it("rejects tampered entries", () => {
    const bad = {
      releases: [
        {
          version: "0.1.0",
          date: "2026-11-01",
          files: [
            { filename: "evalsuite-0.2.0.tar.gz", kind: "sdist", size: 1, sha256: "a".repeat(64) },
          ],
        },
      ],
    };
    expect(ManifestSchema.safeParse(bad).success).toBe(false);
    const badHash = {
      releases: [
        {
          ...bad.releases[0]!,
          files: [
            { ...bad.releases[0]!.files[0]!, filename: "evalsuite-0.1.0.tar.gz", sha256: "xyz" },
          ],
        },
      ],
    };
    expect(ManifestSchema.safeParse(badHash).success).toBe(false);
  });

  it("formats sizes and the pip command", () => {
    expect(formatSize(900)).toBe("900 B");
    expect(formatSize(2048)).toBe("2.0 KB");
    expect(formatSize(3 * 1024 * 1024)).toBe("3.0 MB");
    expect(PIP_INSTALL).toBe("pip install evalsuite");
  });
});
