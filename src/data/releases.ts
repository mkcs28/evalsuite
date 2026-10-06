import type { ReleaseTarget } from "@/types/status";

export type ChangeKind = "Added" | "Changed" | "Fixed" | "Deprecated" | "Removed" | "Security";

export interface ReleaseNote {
  version: ReleaseTarget;
  /** ISO date once published; null while unreleased. */
  date: string | null;
  changes: Array<{ kind: ChangeKind; items: string[] }>;
}

/**
 * Published releases only. Empty until v0.1.0 is on PyPI.
 * Add an entry here (mirroring CHANGELOG.md) when a version is actually released.
 */
export const RELEASE_NOTES: ReleaseNote[] = [];
