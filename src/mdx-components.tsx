import type { MDXComponents } from "mdx/types";
import Link from "next/link";
import type { AnchorHTMLAttributes } from "react";
import { CodeBlock } from "@/components/code/code-block";
import { MetricTable } from "@/components/metrics/metric-table";
import { Callout } from "@/components/ui/callout";
import { StatusBadge } from "@/components/ui/status-badge";

function slugify(text: unknown): string | undefined {
  return typeof text === "string"
    ? text
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/(^-|-$)/g, "")
    : undefined;
}

function A({ href = "", ...props }: AnchorHTMLAttributes<HTMLAnchorElement>) {
  if (href.startsWith("/") || href.startsWith("#")) return <Link href={href} {...props} />;
  return <a href={href} target="_blank" rel="noopener noreferrer" {...props} />;
}

const components: MDXComponents = {
  wrapper: ({ children }) => <div className="doc-prose">{children}</div>,
  a: A,
  h2: ({ children }) => <h2 id={slugify(children)}>{children}</h2>,
  h3: ({ children }) => <h3 id={slugify(children)}>{children}</h3>,
  table: (props) => (
    <div className="table-wrap">
      <table {...props} />
    </div>
  ),
  CodeBlock,
  Callout,
  StatusBadge,
  MetricTable,
};

export function useMDXComponents(): MDXComponents {
  return components;
}
