import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { AuthProvider } from "@/components/auth/auth-provider";
import { Dashboard } from "@/components/auth/dashboard";
import {
  ForgotPasswordForm,
  ResetPasswordForm,
  readResetToken,
} from "@/components/auth/password-forms";
import { Playground } from "@/components/playground/playground";

const BASE = "https://api.example.org";
const USER = {
  id: "u1",
  email: "ada@example.org",
  name: "Ada",
  createdAt: "2026-10-05T00:00:00Z",
  eligibleForApi: true,
};
const USAGE = {
  requestsLast24h: 0,
  requestsLast30d: 0,
  observationsLast30d: 0,
  rateLimitPerMinute: 60,
};
const reply = (body: unknown, status = 200) =>
  new Response(status === 204 ? null : JSON.stringify(body), { status });

function api(routes: Record<string, (init?: RequestInit) => Response>) {
  return vi.fn(async (url: string, init?: RequestInit) => {
    const key = `${init?.method ?? "GET"} ${url.replace(`${BASE}/api/v1`, "")}`;
    const handler = routes[key];
    return handler
      ? handler(init)
      : reply({ error: { code: "not_found", message: `No route ${key}` } }, 404);
  });
}

function signedIn(token = "session-1") {
  sessionStorage.setItem(
    "evalsuite.session",
    JSON.stringify({ token, expiresAt: Date.now() + 60_000 }),
  );
}

afterEach(() => {
  vi.unstubAllGlobals();
  sessionStorage.clear();
});

describe("password reset", () => {
  it("parses only well-formed tokens from the fragment", () => {
    expect(readResetToken("#token=abcdefghijklmnopqrstuvwxyz_-0123")).toBe(
      "abcdefghijklmnopqrstuvwxyz_-0123",
    );
    expect(readResetToken("#token=short")).toBeNull();
    expect(readResetToken("#token=<script>alert(1)</script>xxxxxxxxxx")).toBeNull();
    expect(readResetToken("")).toBeNull();
  });

  it("shows the neutral confirmation after requesting a link", async () => {
    vi.stubGlobal(
      "fetch",
      api({
        "POST /auth/password/forgot": () =>
          reply(
            { message: "If an account exists for that email, a reset link has been sent." },
            202,
          ),
      }),
    );
    render(
      <AuthProvider baseUrl={BASE}>
        <ForgotPasswordForm />
      </AuthProvider>,
    );
    await userEvent.type(await screen.findByLabelText("Email"), "ada@example.org");
    await userEvent.click(screen.getByRole("button", { name: "Send reset link" }));
    expect(await screen.findByRole("status")).toHaveTextContent("If an account exists");
  });

  it("resets the password with the token from the link and clears it from the address bar", async () => {
    const fetchMock = api({
      "POST /auth/password/reset": () => reply({ message: "Your password has been changed." }),
    });
    vi.stubGlobal("fetch", fetchMock);
    window.history.replaceState(
      null,
      "",
      "/reset-password#token=abcdefghijklmnopqrstuvwxyz0123456789",
    );
    render(
      <AuthProvider baseUrl={BASE}>
        <ResetPasswordForm />
      </AuthProvider>,
    );
    await waitFor(() => expect(window.location.hash).toBe(""));
    await userEvent.type(screen.getByLabelText("New password"), "brand-new-pass-1");
    await userEvent.type(screen.getByLabelText("Confirm new password"), "brand-new-pass-1");
    await userEvent.click(screen.getByRole("button", { name: "Set new password" }));
    expect(await screen.findByText("Your password has been changed.")).toBeInTheDocument();
    const body = JSON.parse(
      String((fetchMock.mock.calls.at(-1) as unknown as [string, RequestInit])[1].body),
    );
    expect(body).toEqual({
      token: "abcdefghijklmnopqrstuvwxyz0123456789",
      password: "brand-new-pass-1",
    });
  });

  it("explains a missing token", async () => {
    window.history.replaceState(null, "", "/reset-password");
    render(
      <AuthProvider baseUrl={BASE}>
        <ResetPasswordForm />
      </AuthProvider>,
    );
    expect(await screen.findByRole("link", { name: "Request a new link" })).toBeInTheDocument();
  });
});

describe("account settings", () => {
  it("changes the password and stores the new session token", async () => {
    signedIn("old-session");
    vi.stubGlobal(
      "fetch",
      api({
        "GET /auth/me": () => reply(USER),
        "GET /keys": () => reply([]),
        "GET /usage": () => reply(USAGE),
        "POST /auth/password/change": () =>
          reply({ accessToken: "new-session-token", tokenType: "bearer", expiresIn: 3600 }),
      }),
    );
    render(
      <AuthProvider baseUrl={BASE}>
        <Dashboard />
      </AuthProvider>,
    );
    await userEvent.type(await screen.findByLabelText("Current password"), "old-password-1");
    await userEvent.type(screen.getByLabelText("New password"), "new-password-22");
    await userEvent.type(screen.getByLabelText("Confirm new password"), "new-password-22");
    await userEvent.click(screen.getByRole("button", { name: "Change password" }));
    expect(await screen.findByText(/Password changed/)).toBeInTheDocument();
    expect(JSON.parse(sessionStorage.getItem("evalsuite.session") ?? "{}").token).toBe(
      "new-session-token",
    );
  });

  it("deletes the account after confirmation and signs out", async () => {
    signedIn();
    vi.stubGlobal("confirm", () => false); // never consulted
    vi.stubGlobal(
      "fetch",
      api({
        "GET /auth/me": () => reply(USER),
        "GET /keys": () => reply([]),
        "GET /usage": () => reply(USAGE),
        "DELETE /auth/me": () => reply(null, 204),
      }),
    );
    render(
      <AuthProvider baseUrl={BASE}>
        <Dashboard />
      </AuthProvider>,
    );
    await userEvent.type(
      await screen.findByLabelText("Confirm with your password"),
      "old-password-1",
    );
    await userEvent.click(screen.getByRole("button", { name: "Delete account" }));
    expect(screen.getByRole("alert")).toHaveTextContent(/It cannot be undone/);
    expect(sessionStorage.getItem("evalsuite.session")).not.toBeNull();
    await userEvent.click(
      screen.getByRole("button", { name: "Yes, permanently delete my account" }),
    );
    await waitFor(() => expect(sessionStorage.getItem("evalsuite.session")).toBeNull());
  });
});

describe("playground on the API", () => {
  it("runs on the API with the session token when signed in", async () => {
    signedIn("session-xyz");
    const fetchMock = api({
      "GET /auth/me": () => reply(USER),
      "POST /evaluate": () =>
        reply({
          task: "binary-classification",
          nObservations: 80,
          metrics: [{ id: "classification.accuracy", name: "Accuracy", value: 0.75 }],
          engine: { kind: "api", label: "EvalSuite 0.1.1", version: "0.1.1" },
          warnings: [],
        }),
    });
    vi.stubGlobal("fetch", fetchMock);
    vi.stubEnv("NEXT_PUBLIC_API_BASE_URL", BASE);
    render(
      <AuthProvider baseUrl={BASE}>
        <Playground />
      </AuthProvider>,
    );
    const apiRadio = await screen.findByRole("radio", { name: "EvalSuite API" });
    await waitFor(() => expect(apiRadio).toBeEnabled());
    await userEvent.click(apiRadio);
    await userEvent.click(screen.getByRole("button", { name: "Run evaluation" }));
    expect(await screen.findByText("API result")).toBeInTheDocument();
    expect(screen.getByText(/EvalSuite 0.1.1/)).toBeInTheDocument();
    const [, init] = fetchMock.mock.calls.at(-1) as unknown as [string, RequestInit];
    expect((init.headers as Record<string, string>).Authorization).toBe("Bearer session-xyz");
    vi.unstubAllEnvs();
  });
});
