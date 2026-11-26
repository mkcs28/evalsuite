/** The EvalSuite engine compiled to WebAssembly (npm `evalsuite`, web build), loaded once from the CDN. */
export const WASM_URL = "https://cdn.jsdelivr.net/npm/evalsuite@1/web/evalsuite.js";

export interface EngineResult {
  metric: string;
  value?: unknown;
  values?: unknown;
  ci_low?: number;
  ci_high?: number;
  ci_method?: string;
}

export interface Engine {
  evaluate: (metric: string, args: unknown) => EngineResult;
  metrics: () => string[];
  version: () => string;
}

interface WasmModule extends Engine {
  default: () => Promise<unknown>;
}

let pending: Promise<Engine> | null = null;

/** Loads the engine (about 1 MB, cached by the browser); rejects if it cannot be fetched. */
export function loadEngine(): Promise<Engine> {
  if (!pending) {
    pending = (async () => {
      const m = (await import(
        /* webpackIgnore: true */ /* turbopackIgnore: true */ WASM_URL
      )) as WasmModule;
      await m.default();
      return m;
    })();
    pending.catch(() => {
      pending = null;
    });
  }
  return pending;
}
