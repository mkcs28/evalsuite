"use client";

import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

interface Heading {
  id: string;
  text: string;
  level: 2 | 3;
}

/** Reads h2/h3 headings from the rendered article and tracks the visible one. */
export function TableOfContents() {
  const pathname = usePathname();
  const [headings, setHeadings] = useState<Heading[]>([]);
  const [active, setActive] = useState<string | null>(null);

  useEffect(() => {
    const nodes = Array.from(
      document.querySelectorAll<HTMLHeadingElement>(
        "[data-doc-article] h2[id], [data-doc-article] h3[id]",
      ),
    );
    // Sync with DOM content rendered by the server for this route.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setHeadings(
      nodes.map((n) => ({
        id: n.id,
        text: n.textContent ?? "",
        level: n.tagName === "H2" ? 2 : 3,
      })),
    );
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
        if (visible[0]) setActive(visible[0].target.id);
      },
      { rootMargin: "-80px 0px -65% 0px" },
    );
    nodes.forEach((n) => observer.observe(n));
    return () => observer.disconnect();
  }, [pathname]);

  if (headings.length < 2) return null;
  return (
    <nav aria-label="On this page" className="text-sm">
      <p className="mb-2 font-semibold">On this page</p>
      <ul className="space-y-1.5">
        {headings.map((h) => (
          <li key={h.id} className={h.level === 3 ? "pl-3" : undefined}>
            <a
              href={`#${h.id}`}
              className={
                active === h.id ? "text-foreground" : "text-muted-foreground hover:text-foreground"
              }
              aria-current={active === h.id ? "location" : undefined}
            >
              {h.text}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
}
