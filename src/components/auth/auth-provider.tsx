"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { AccountClient, type User } from "@/lib/api/account-client";
import { apiBaseUrl } from "@/lib/api";

/**
 * Session handling for the dashboard.
 *
 * The access token is kept in sessionStorage: it survives reloads in the same tab
 * and is cleared when the tab closes. It is short-lived (default 60 minutes) and
 * can only manage the account, never other keys' secrets. Because the site and
 * API may live on different domains, a cross-site httpOnly cookie is not used.
 */
const STORAGE_KEY = "evalsuite.session";

interface StoredSession {
  token: string;
  expiresAt: number;
}

type Status = "unconfigured" | "loading" | "signed-out" | "signed-in";

interface AuthContextValue {
  status: Status;
  user: User | null;
  client: AccountClient | null;
  token: string | null;
  signIn(email: string, password: string): Promise<void>;
  /** Replace the stored session token (after a password change). */
  replaceToken(token: string, expiresIn: number): void;
  signOut(): void;
}

const AuthContext = createContext<AuthContextValue | null>(null);

function readSession(): StoredSession | null {
  try {
    const raw = sessionStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as Partial<StoredSession>;
    if (typeof parsed.token !== "string" || typeof parsed.expiresAt !== "number") return null;
    return parsed.expiresAt > Date.now() ? (parsed as StoredSession) : null;
  } catch {
    return null;
  }
}

function writeSession(session: StoredSession | null) {
  try {
    if (session) sessionStorage.setItem(STORAGE_KEY, JSON.stringify(session));
    else sessionStorage.removeItem(STORAGE_KEY);
  } catch {
    // Storage can be unavailable (private mode); the session then lasts for this page only.
  }
}

export function AuthProvider({
  children,
  baseUrl = apiBaseUrl(),
}: {
  children: ReactNode;
  baseUrl?: string | null;
}) {
  const [token, setToken] = useState<string | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [status, setStatus] = useState<Status>(baseUrl ? "loading" : "unconfigured");

  const client = useMemo(
    () => (baseUrl ? new AccountClient(baseUrl, () => readSession()?.token ?? null) : null),
    [baseUrl],
  );

  const signOut = useCallback(() => {
    writeSession(null);
    setToken(null);
    setUser(null);
    setStatus(client ? "signed-out" : "unconfigured");
  }, [client]);

  useEffect(() => {
    if (!client) return;
    const session = readSession();
    // Restore the session from storage after hydration.
    /* eslint-disable react-hooks/set-state-in-effect */
    if (!session) {
      setStatus("signed-out");
      return;
    }
    setToken(session.token);
    client
      .me()
      .then((u) => {
        setUser(u);
        setStatus("signed-in");
      })
      .catch(() => signOut());
    /* eslint-enable react-hooks/set-state-in-effect */
  }, [client, signOut]);

  const signIn = useCallback(
    async (email: string, password: string) => {
      if (!client) throw new Error("The EvalSuite API is not configured.");
      const t = await client.login(email, password);
      writeSession({ token: t.accessToken, expiresAt: Date.now() + t.expiresIn * 1000 });
      setToken(t.accessToken);
      setUser(await client.me());
      setStatus("signed-in");
    },
    [client],
  );

  const replaceToken = useCallback((next: string, expiresIn: number) => {
    writeSession({ token: next, expiresAt: Date.now() + expiresIn * 1000 });
    setToken(next);
  }, []);

  const value = useMemo(
    () => ({ status, user, client, token, signIn, replaceToken, signOut }),
    [status, user, client, token, signIn, replaceToken, signOut],
  );
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

const NO_PROVIDER: AuthContextValue = {
  status: "unconfigured",
  user: null,
  client: null,
  token: null,
  signIn: () => Promise.reject(new Error("The EvalSuite API is not configured.")),
  replaceToken: () => {},
  signOut: () => {},
};

export function useAuth(): AuthContextValue {
  return useContext(AuthContext) ?? NO_PROVIDER;
}
