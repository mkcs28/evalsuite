import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { AuthProvider } from "@/components/auth/auth-provider";
import { Dashboard } from "@/components/auth/dashboard";
import { SignInForm } from "@/components/auth/sign-in-form";

const USER = {
  id: "u1",
  email: "ada@example.org",
  name: "Ada",
  createdAt: "2026-10-05T00:00:00Z",
  eligibleForApi: true,
};
const USAGE = {
  requestsLast24h: 3,
  requestsLast30d: 10,
  observationsLast30d: 240,
  rateLimitPerMinute: 60,
};

function fakeApi() {
  const keys: Array<Record<string, unknown>> = [];
  return vi.fn(async (url: string, init?: RequestInit) => {
    const path = url.replace("https://api.example.org/api/v1", "");
    const method = init?.method ?? "GET";
    const reply = (body: unknown, status = 200) => new Response(JSON.stringify(body), { status });
    if (path === "/auth/login") {
      const { password } = JSON.parse(String(init?.body)) as { password: string };
      return password === "right-password"
        ? reply({ accessToken: "session-token-123", tokenType: "bearer", expiresIn: 3600 })
        : reply(
            { error: { code: "invalid_credentials", message: "Email or password is incorrect." } },
            401,
          );
    }
    if (path === "/auth/me") return reply(USER);
    if (path === "/usage") return reply(USAGE);
    if (path === "/keys" && method === "GET") return reply(keys);
    if (path === "/keys" && method === "POST") {
      const k = {
        id: "k1",
        name: "laptop",
        prefix: "abcd1234",
        createdAt: "2026-10-05T00:00:00Z",
        lastUsedAt: null,
        revokedAt: null,
      };
      keys.push(k);
      return reply({ ...k, key: "es_live_abcd1234_" + "s".repeat(43) }, 201);
    }
    return reply({ error: { code: "not_found", message: "Not found" } }, 404);
  });
}

describe("authentication UI", () => {
  beforeEach(() => sessionStorage.clear());

  it("explains when no API is configured", () => {
    render(
      <AuthProvider baseUrl={null}>
        <SignInForm />
      </AuthProvider>,
    );
    expect(screen.getByText("Accounts are not available on this deployment")).toBeInTheDocument();
    expect(screen.queryByLabelText("Password")).toBeNull();
  });

  it("shows the API error on a wrong password", async () => {
    vi.stubGlobal("fetch", fakeApi());
    render(
      <AuthProvider baseUrl="https://api.example.org">
        <SignInForm />
      </AuthProvider>,
    );
    await userEvent.type(await screen.findByLabelText("Email"), "ada@example.org");
    await userEvent.type(screen.getByLabelText("Password"), "wrong-password");
    await userEvent.click(screen.getByRole("button", { name: "Sign in" }));
    expect(await screen.findByRole("alert")).toHaveTextContent("Email or password is incorrect.");
    expect(sessionStorage.getItem("evalsuite.session")).toBeNull();
    vi.unstubAllGlobals();
  });

  it("restores a session and creates a key that is shown once", async () => {
    vi.stubGlobal("fetch", fakeApi());
    sessionStorage.setItem(
      "evalsuite.session",
      JSON.stringify({ token: "session-token-123", expiresAt: Date.now() + 60_000 }),
    );
    render(
      <AuthProvider baseUrl="https://api.example.org">
        <Dashboard />
      </AuthProvider>,
    );
    expect(await screen.findByText("Signed in as ada@example.org")).toBeInTheDocument();
    await waitFor(() => expect(screen.getByText("240")).toBeInTheDocument());
    await userEvent.type(screen.getByLabelText("Key name"), "laptop");
    await userEvent.click(screen.getByRole("button", { name: "Create key" }));
    expect(await screen.findByText("Copy your new key now")).toBeInTheDocument();
    expect(screen.getByText(/^es_live_abcd1234_s+$/)).toBeInTheDocument();
    // A labelled copy button sits next to the key; copying works even without the async Clipboard API.
    const execCommand = vi.fn(() => true);
    Object.defineProperty(document, "execCommand", { value: execCommand, configurable: true });
    await userEvent.click(screen.getByRole("button", { name: "Copy key" }));
    expect(await screen.findByRole("button", { name: "Copied" })).toBeInTheDocument();
    expect(execCommand).toHaveBeenCalledWith("copy");
    expect(
      screen.getByRole("button", { name: "Copy as environment variable" }),
    ).toBeInTheDocument();
    // The active key is listed, masked, with rotate and revoke actions.
    expect(await screen.findByText("es_live_abcd1234_••••••••••••••••")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Rotate key" })).toBeInTheDocument();
    await userEvent.click(screen.getByRole("button", { name: "I have stored it" }));
    expect(screen.queryByText(/^es_live_abcd1234_s+$/)).toBeNull();
    vi.unstubAllGlobals();
  });

  it("signs out and clears the session", async () => {
    vi.stubGlobal("fetch", fakeApi());
    sessionStorage.setItem(
      "evalsuite.session",
      JSON.stringify({ token: "session-token-123", expiresAt: Date.now() + 60_000 }),
    );
    render(
      <AuthProvider baseUrl="https://api.example.org">
        <Dashboard />
      </AuthProvider>,
    );
    await userEvent.click(await screen.findByRole("button", { name: "Sign out" }));
    expect(screen.getByText("Sign in to manage API keys")).toBeInTheDocument();
    expect(sessionStorage.getItem("evalsuite.session")).toBeNull();
    vi.unstubAllGlobals();
  });
});
