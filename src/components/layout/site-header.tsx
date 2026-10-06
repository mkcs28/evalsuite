"use client";

import { Menu, Search, X } from "lucide-react";
import dynamic from "next/dynamic";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import { siteConfig } from "@/lib/config/site";
import { cn } from "@/lib/utils/cn";
import { buttonClass } from "@/components/ui/button-link";
import { ResourceLink } from "@/components/ui/resource-link";
import { Logo } from "./logo";
import { ThemeToggle } from "./theme-toggle";
import { useAuth } from "@/components/auth/auth-provider";

const SearchDialog = dynamic(() => import("./search-dialog"), { ssr: false });

export function isActive(pathname: string, href: string): boolean {
  if (href === "/docs")
    return (
      pathname === "/docs" ||
      (pathname.startsWith("/docs/") && !pathname.startsWith("/docs/metrics"))
    );
  return pathname === href || pathname.startsWith(`${href}/`);
}

export function SiteHeader() {
  const pathname = usePathname() ?? "/";
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const closeSearch = useCallback(() => setSearchOpen(false), []);
  const { links } = siteConfig;
  const { status } = useAuth();
  const account =
    status === "signed-in"
      ? { href: "/dashboard", label: "Dashboard" }
      : status === "unconfigured"
        ? null
        : { href: "/login", label: "Sign in" };

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setSearchOpen(true);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  useEffect(() => {
    if (!menuOpen) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setMenuOpen(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [menuOpen]);

  return (
    <header className="sticky top-0 z-40 px-3 pt-3 sm:px-5">
      <div className="mx-auto flex h-14 max-w-[1680px] items-center gap-3 rounded-2xl xl:gap-6 border border-border/80 bg-background/70 px-3 shadow-[0_8px_30px_-12px_rgb(0_0_0/0.18)] backdrop-blur-xl sm:px-4">
        <Link
          href="/"
          className="shrink-0 rounded"
          aria-label="EvalSuite home"
          onClick={() => setMenuOpen(false)}
        >
          <Logo />
        </Link>

        <nav aria-label="Main" className="hidden xl:block">
          <ul className="flex items-center gap-1">
            {siteConfig.nav.map((item) => {
              const active = isActive(pathname, item.href);
              return (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    aria-current={active ? "page" : undefined}
                    className={cn(
                      "relative rounded-lg px-3 py-1.5 text-sm font-medium transition-colors",
                      active
                        ? "bg-surface-muted text-foreground"
                        : "text-muted-foreground hover:text-foreground",
                    )}
                  >
                    {item.label}
                    {active ? (
                      <span
                        aria-hidden
                        className="absolute inset-x-3 -bottom-[13px] h-0.5 rounded bg-primary"
                      />
                    ) : null}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        <div className="ml-auto flex items-center gap-1">
          <button
            type="button"
            onClick={() => setSearchOpen(true)}
            className="hidden h-9 items-center gap-2 rounded-lg border border-border bg-surface-muted/60 px-3 text-sm text-muted-foreground hover:text-foreground md:inline-flex"
            aria-label="Search documentation and metrics"
          >
            <Search className="size-4" aria-hidden />
            <span>Search</span>
            <kbd className="ml-3 rounded border border-border-subtle px-1 text-[11px]">Ctrl K</kbd>
          </button>
          <button
            type="button"
            onClick={() => setSearchOpen(true)}
            className="inline-flex size-9 items-center justify-center rounded-md text-muted-foreground hover:bg-surface-muted md:hidden"
            aria-label="Search documentation and metrics"
          >
            <Search className="size-4" aria-hidden />
          </button>
          <ResourceLink
            href={links.repository}
            pendingLabel="Repository link not yet published"
            className="hidden px-2 py-2 text-sm font-medium text-muted-foreground hover:text-foreground 2xl:inline"
          >
            GitHub
          </ResourceLink>
          <ResourceLink
            href={links.pypi}
            pendingLabel="PyPI package coming with v0.1.0"
            className="hidden px-2 py-2 text-sm font-medium text-muted-foreground hover:text-foreground 2xl:inline"
          >
            PyPI
          </ResourceLink>
          <ThemeToggle />
          {account ? (
            <Link
              href={account.href}
              className="hidden rounded-lg px-3 py-1.5 text-sm font-medium text-muted-foreground hover:text-foreground sm:inline-flex"
            >
              {account.label}
            </Link>
          ) : null}
          <Link
            href="/docs/getting-started"
            className={buttonClass("primary", "ml-1 hidden h-9 rounded-lg px-4 sm:inline-flex")}
          >
            Get started
          </Link>
          <button
            type="button"
            className="inline-flex size-10 items-center justify-center rounded-md hover:bg-surface-muted xl:hidden"
            aria-expanded={menuOpen}
            aria-controls="mobile-nav"
            aria-label={menuOpen ? "Close menu" : "Open menu"}
            onClick={() => setMenuOpen((o) => !o)}
          >
            {menuOpen ? (
              <X className="size-5" aria-hidden />
            ) : (
              <Menu className="size-5" aria-hidden />
            )}
          </button>
        </div>
      </div>

      {menuOpen ? (
        <nav
          id="mobile-nav"
          aria-label="Main"
          className="mx-auto mt-2 max-h-[calc(100dvh-6rem)] max-w-[1680px] overflow-y-auto rounded-2xl border border-border bg-surface-elevated px-3 pb-5 pt-2 shadow-panel xl:hidden"
        >
          <ul className="flex flex-col">
            {siteConfig.nav.map((item) => {
              const active = isActive(pathname, item.href);
              return (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    onClick={() => setMenuOpen(false)}
                    aria-current={active ? "page" : undefined}
                    className={cn(
                      "flex border-l-2 px-3 py-2.5 text-[15px] font-medium",
                      active
                        ? "border-primary text-foreground"
                        : "border-transparent text-muted-foreground",
                    )}
                  >
                    {item.label}
                  </Link>
                </li>
              );
            })}
          </ul>
          <div className="mt-4 flex flex-wrap gap-x-5 gap-y-2 px-3 text-sm">
            <ResourceLink href={links.repository} pendingLabel="Repository link not yet published">
              GitHub{links.repository ? "" : " (link pending)"}
            </ResourceLink>
            <ResourceLink href={links.pypi} pendingLabel="PyPI package coming with v0.1.0">
              PyPI{links.pypi ? "" : " (coming with v0.1.0)"}
            </ResourceLink>
          </div>
          {account ? (
            <Link
              href={account.href}
              onClick={() => setMenuOpen(false)}
              className="mt-3 block px-3 text-sm font-medium"
            >
              {account.label}
            </Link>
          ) : null}
          <Link
            href="/docs/getting-started"
            onClick={() => setMenuOpen(false)}
            className={buttonClass("primary", "mx-3 mt-4 flex")}
          >
            Get started
          </Link>
        </nav>
      ) : null}

      {searchOpen ? <SearchDialog onClose={closeSearch} /> : null}
    </header>
  );
}
