import { z } from "zod";
import { RELEASES, STATUSES } from "@/types/status";

import { METRIC_CATEGORIES } from "./categories";
export { CATEGORY_LABEL, METRIC_CATEGORIES, type MetricCategory } from "./categories";

export const ReferenceSchema = z.object({ citation: z.string().min(10) });
export type Reference = z.infer<typeof ReferenceSchema>;

/**
 * MetricDefinition mirrors the planned Python metric registry (`es.metric_info(...)`).
 * When the package exists, its registry export (JSON) is validated against this
 * schema and replaces the hand-written data in src/data/metrics.
 */
export const MetricDefinitionSchema = z.object({
  id: z.string().regex(/^[a-z-]+\.[a-z0-9_]+$/, "id must look like 'category.metric_name'"),
  name: z.string().min(2),
  category: z.enum(METRIC_CATEGORIES),
  subcategory: z.string().optional(),
  description: z.string().min(10),
  formula: z.string().min(1),
  inputs: z.array(z.string()).min(1),
  outputs: z.string().min(1),
  range: z.string().optional(),
  assumptions: z.array(z.string()),
  limitations: z.array(z.string()),
  references: z.array(ReferenceSchema),
  version: z.enum(RELEASES),
  status: z.enum(STATUSES),
  apiPath: z.string().regex(/^es\.[a-z0-9_.]+$/),
});

export type MetricDefinition = z.infer<typeof MetricDefinitionSchema>;
export const MetricRegistrySchema = z.array(MetricDefinitionSchema);
