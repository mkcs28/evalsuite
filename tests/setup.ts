import "@testing-library/jest-dom/vitest";
import { cleanup } from "@testing-library/react";
import { afterEach, vi } from "vitest";

afterEach(() => cleanup());

const router = { replace: vi.fn(), push: vi.fn(), prefetch: vi.fn(), back: vi.fn() };
let pathname = "/";
export function setPathname(p: string) {
  pathname = p;
}

vi.mock("next/navigation", () => ({
  usePathname: () => pathname,
  useRouter: () => router,
  useSearchParams: () => new URLSearchParams(),
}));

if (!("IntersectionObserver" in globalThis)) {
  class IO {
    observe() {}
    disconnect() {}
    unobserve() {}
  }
  // @ts-expect-error minimal stub for jsdom
  globalThis.IntersectionObserver = IO;
}

vi.mock("next/dynamic", () => ({
  default: () =>
    function DynamicStub() {
      return null;
    },
}));
