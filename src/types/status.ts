/**
 * Status vocabulary shared by every part of the site.
 * The website never shows a package capability as "implemented" unless it has
 * actually shipped in a released EvalSuite version.
 */
export const STATUSES = [
  "implemented",
  "demo",
  "in-development",
  "planned",
  "coming-soon",
] as const;
export type Status = (typeof STATUSES)[number];

export const STATUS_LABEL: Record<Status, string> = {
  implemented: "Implemented",
  demo: "Demo",
  "in-development": "In development",
  planned: "Planned",
  "coming-soon": "Coming soon",
};

export const RELEASES = ["v0.1.0", "v0.1.1", "v0.1.2", "v0.2.0", "v0.2.1", "v0.3.0"] as const;
export type ReleaseTarget = (typeof RELEASES)[number];
