"use client";

import { Monitor, Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import { useSyncExternalStore } from "react";

const ORDER = ["system", "light", "dark"] as const;
const LABEL = { system: "System theme", light: "Light theme", dark: "Dark theme" } as const;

const subscribe = () => () => {};

export function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  // True only after hydration, so the server and first client render agree.
  const mounted = useSyncExternalStore(
    subscribe,
    () => true,
    () => false,
  );
  const current = (
    mounted && ORDER.includes(theme as (typeof ORDER)[number]) ? theme : "system"
  ) as (typeof ORDER)[number];
  const next = ORDER[(ORDER.indexOf(current) + 1) % ORDER.length]!;
  const Icon = current === "light" ? Sun : current === "dark" ? Moon : Monitor;

  return (
    <button
      type="button"
      onClick={() => setTheme(next)}
      className="inline-flex size-9 items-center justify-center rounded-md text-muted-foreground hover:bg-surface-muted hover:text-foreground"
      aria-label={`${LABEL[current]}. Switch to ${LABEL[next].toLowerCase()}`}
      title={LABEL[current]}
    >
      <Icon className="size-4" aria-hidden />
    </button>
  );
}
