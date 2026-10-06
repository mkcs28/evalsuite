#!/usr/bin/env node
// Publish built package files to the website's own download area.
//
//   npm run release:add -- --version 0.1.0 dist/evalsuite-0.1.0-py3-none-any.whl dist/evalsuite-0.1.0.tar.gz
//
// Copies the files to releases/<version>/ (private; served only via signed links), records size and SHA-256 in
// src/data/downloads.json, and refuses to overwrite an existing release or file.
import { createHash } from "node:crypto";
import {
  copyFileSync,
  existsSync,
  mkdirSync,
  readFileSync,
  statSync,
  writeFileSync,
} from "node:fs";
import { basename, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const VERSION = /^\d+\.\d+\.\d+(?:(?:a|b|rc)\d+)?$/;

export function kindOf(filename, version) {
  if (filename === `evalsuite-${version}-py3-none-any.whl`) return "wheel";
  if (filename === `evalsuite-${version}.tar.gz`) return "sdist";
  return null;
}

export function addRelease({ root, version, files, date = new Date().toISOString().slice(0, 10) }) {
  if (!VERSION.test(version))
    throw new Error(`Invalid version "${version}". Use MAJOR.MINOR.PATCH.`);
  if (files.length === 0) throw new Error("Pass at least one built file (wheel and/or sdist).");
  const manifestPath = join(root, "src/data/downloads.json");
  const manifest = JSON.parse(readFileSync(manifestPath, "utf8"));
  if (manifest.releases.some((r) => r.version === version)) {
    throw new Error(
      `Release ${version} is already published. Releases are immutable; bump the version.`,
    );
  }
  const target = join(root, "releases", version);
  const entries = files.map((file) => {
    const filename = basename(file);
    const kind = kindOf(filename, version);
    if (!kind) {
      throw new Error(
        `${filename} is not evalsuite-${version}-py3-none-any.whl or evalsuite-${version}.tar.gz.`,
      );
    }
    if (!existsSync(file)) throw new Error(`File not found: ${file}`);
    const data = readFileSync(file);
    return {
      file,
      filename,
      kind,
      size: statSync(file).size,
      sha256: createHash("sha256").update(data).digest("hex"),
    };
  });
  if (new Set(entries.map((e) => e.kind)).size !== entries.length)
    throw new Error("Pass one wheel and/or one sdist.");
  mkdirSync(target, { recursive: true });
  for (const e of entries) {
    const dest = join(target, e.filename);
    if (existsSync(dest)) throw new Error(`${dest} already exists; refusing to overwrite.`);
    copyFileSync(e.file, dest);
  }
  manifest.releases.unshift({
    version,
    date,
    files: entries.map(({ filename, kind, size, sha256 }) => ({ filename, kind, size, sha256 })),
  });
  writeFileSync(manifestPath, JSON.stringify(manifest, null, 2) + "\n");
  return manifest.releases[0];
}

if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  const args = process.argv.slice(2);
  const i = args.indexOf("--version");
  if (i === -1 || !args[i + 1]) {
    console.error("Usage: npm run release:add -- --version 0.1.0 <wheel> [sdist]");
    process.exit(2);
  }
  const version = args[i + 1];
  const files = args.filter((_, j) => j !== i && j !== i + 1);
  try {
    const release = addRelease({ root: process.cwd(), version, files });
    for (const f of release.files)
      console.log(`${f.filename}  ${f.size} bytes  sha256 ${f.sha256}`);
    console.log(`Published ${version}. Commit releases/${version} and src/data/downloads.json.`);
  } catch (err) {
    console.error(err instanceof Error ? err.message : err);
    process.exit(1);
  }
}
