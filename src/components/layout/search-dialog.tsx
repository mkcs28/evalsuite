"use client";

import { FileText, Search, Sigma } from "@/components/ui/icons";
import Link from "next/link";
import { useEffect, useId, useMemo, useRef, useState } from "react";
import { searchSite } from "@/lib/search";

export default function SearchDialog({ onClose }: { onClose: () => void }) {
  const [query, setQuery] = useState("");
  const [active, setActive] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const listId = useId();
  const results = useMemo(() => searchSite(query), [query]);

  useEffect(() => {
    inputRef.current?.focus();
    const previous = document.activeElement as HTMLElement | null;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
      previous?.focus();
    };
  }, [onClose]);

  return (
    <div
      className="fixed inset-0 z-50 flex items-start justify-center bg-foreground/25 px-4 pt-[12vh] backdrop-blur-[2px]"
      onMouseDown={onClose}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-label="Search documentation and metrics"
        className="w-full max-w-xl overflow-hidden rounded-xl border border-border bg-surface-elevated shadow-panel"
        onMouseDown={(e) => e.stopPropagation()}
      >
        <div className="flex items-center gap-2 border-b border-border-subtle px-4">
          <Search className="size-4 text-muted-foreground" aria-hidden />
          <input
            ref={inputRef}
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setActive(0);
            }}
            onKeyDown={(e) => {
              if (e.key === "ArrowDown") {
                e.preventDefault();
                setActive((i) => Math.min(i + 1, results.length - 1));
              } else if (e.key === "ArrowUp") {
                e.preventDefault();
                setActive((i) => Math.max(i - 1, 0));
              } else if (e.key === "Enter" && results[active]) {
                e.preventDefault();
                document.getElementById(`${listId}-${active}`)?.click();
              }
            }}
            placeholder="Search pages and metrics"
            className="h-12 w-full bg-transparent text-[15px] outline-none placeholder:text-muted-foreground"
            role="combobox"
            aria-expanded="true"
            aria-controls={listId}
            aria-activedescendant={results[active] ? `${listId}-${active}` : undefined}
            aria-label="Search"
          />
          <kbd className="rounded border border-border px-1.5 text-[11px] text-muted-foreground">
            Esc
          </kbd>
        </div>
        <ul id={listId} role="listbox" className="max-h-[50vh] overflow-y-auto p-2">
          {results.length === 0 ? (
            <li className="px-3 py-6 text-center text-sm text-muted-foreground">
              No pages or metrics match “{query}”.
            </li>
          ) : (
            results.map((r, i) => (
              <li key={r.href} role="option" aria-selected={i === active}>
                <Link
                  id={`${listId}-${i}`}
                  href={r.href}
                  onClick={onClose}
                  onMouseEnter={() => setActive(i)}
                  className={`flex items-center gap-3 rounded-md px-3 py-2 text-sm ${i === active ? "bg-surface-muted" : ""}`}
                >
                  {r.kind === "Metric" ? (
                    <Sigma className="size-4 text-muted-foreground" aria-hidden />
                  ) : (
                    <FileText className="size-4 text-muted-foreground" aria-hidden />
                  )}
                  <span className="font-medium">{r.title}</span>
                  <span className="ml-auto truncate text-xs text-muted-foreground">{r.detail}</span>
                </Link>
              </li>
            ))
          )}
        </ul>
      </div>
    </div>
  );
}
