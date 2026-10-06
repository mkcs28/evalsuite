import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { AuthProvider } from "@/components/auth/auth-provider";
import { Dashboard } from "@/components/auth/dashboard";
import {
  missingSummary,
  RegisterForm,
  validateRegistration,
  type Values,
} from "@/components/auth/register-form";
import { ageFrom } from "@/lib/api/account-client";

const BASE = "https://api.example.org";
const reply = (body: unknown, status = 200) => new Response(JSON.stringify(body), { status });
const USER = {
  id: "u1",
  email: "ada@gmail.com",
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
const KEY = {
  id: "k1",
  name: "laptop",
  prefix: "abcd1234",
  createdAt: "2026-10-05T00:00:00Z",
  lastUsedAt: null,
  revokedAt: null,
};

function isoYearsAgo(years: number, days = 0) {
  const t = new Date();
  const d = new Date(t.getFullYear() - years, t.getMonth(), t.getDate() + days);
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}

const valid: Values = {
  email: "ada@gmail.com",
  password: "correct-horse-battery",
  confirm: "correct-horse-battery",
  name: "Ada Lovelace",
  dateOfBirth: isoYearsAgo(30),
  role: "academic-researcher",
  organization: "Analytical Engine Lab",
  country: "United Kingdom",
  intendedUse: "Evaluating clinical risk models for a study.",
  acceptTerms: true,
};

afterEach(() => {
  vi.unstubAllGlobals();
  sessionStorage.clear();
});

describe("age rule", () => {
  it("computes age with the birthday counted on the day", () => {
    const today = new Date(2026, 9, 6);
    expect(ageFrom("2008-10-06", today)).toBe(18);
    expect(ageFrom("2008-10-07", today)).toBe(17);
    expect(ageFrom("not-a-date", today)).toBeNull();
  });

  it("accepts only personal email addresses", () => {
    expect(validateRegistration({ ...valid, email: "manoj@jssstu.ac.in" }).email).toMatch(
      /personal email/,
    );
    expect(validateRegistration({ ...valid, email: "manoj@gmail.com" }).email).toBeUndefined();
  });

  it("validates every field like the API", () => {
    expect(validateRegistration(valid)).toEqual({});
    expect(validateRegistration({ ...valid, dateOfBirth: isoYearsAgo(17) }).dateOfBirth).toMatch(
      /at least 18/,
    );
    expect(validateRegistration({ ...valid, dateOfBirth: isoYearsAgo(18, 1) }).dateOfBirth).toMatch(
      /at least 18/,
    );
    expect(validateRegistration({ ...valid, dateOfBirth: isoYearsAgo(18) })).toEqual({});
    expect(validateRegistration({ ...valid, dateOfBirth: "" }).dateOfBirth).toBeDefined();
    expect(validateRegistration({ ...valid, intendedUse: "short" }).intendedUse).toBeDefined();
    expect(validateRegistration({ ...valid, acceptTerms: false }).acceptTerms).toBeDefined();
    expect(validateRegistration({ ...valid, confirm: "different-password" }).confirm).toBeDefined();
    expect(validateRegistration({ ...valid, email: "not-an-email" }).email).toBeDefined();
    for (const field of ["name", "organization", "country", "role"] as const) {
      expect(validateRegistration({ ...valid, [field]: "" })[field]).toBeDefined();
    }
  });
});

describe("what is still missing", () => {
  it("names a too-short intended use with its length (the reported case)", () => {
    const v = { ...valid, intendedUse: "Research Purpose" };
    expect(missingSummary(validateRegistration(v), v)).toEqual([
      "How will you use the API? needs at least 20 characters (16 so far)",
    ]);
  });

  it("lists every unmet requirement in form order", () => {
    const v = { ...valid, organization: "", acceptTerms: false };
    expect(missingSummary(validateRegistration(v), v)).toEqual([
      "Organisation: Enter your organisation.",
      "Tick the confirmation box",
    ]);
  });

  it("is empty when the form is valid", () => {
    expect(missingSummary(validateRegistration(valid), valid)).toEqual([]);
  });
});

describe("registration form", () => {
  async function fill(dob: string, { skip }: { skip?: string } = {}) {
    // Labels end with a required marker ("Password *"); match the label text exactly.
    const byLabel = (label: string) =>
      screen.getByLabelText((content) => content.replace(/\s*\*\s*$/, "").trim() === label);
    const type = async (label: string, text: string) => {
      if (label !== skip) await userEvent.type(byLabel(label), text);
    };
    await screen.findByRole("button", { name: "Create account" });
    await type("Full name", "Ada Lovelace");
    await type("Personal email", "ada@gmail.com");
    await type("Date of birth", dob);
    if (skip !== "Role") await userEvent.selectOptions(byLabel("Role"), "academic-researcher");
    await type("Organisation", "Analytical Engine Lab");
    await type("Country", "United Kingdom");
    await type("How will you use the API?", "Evaluating clinical risk models for a study.");
    await type("Password", "correct-horse-battery");
    await type("Confirm password", "correct-horse-battery");
    if (skip !== "terms") await userEvent.click(screen.getByRole("checkbox"));
  }

  function renderForm() {
    render(
      <AuthProvider baseUrl={BASE}>
        <RegisterForm />
      </AuthProvider>,
    );
  }

  it("starts with the button disabled", async () => {
    renderForm();
    expect(await screen.findByRole("button", { name: "Create account" })).toBeDisabled();
  });

  it("keeps the button disabled and explains when under 18", async () => {
    const fetchMock = vi.fn();
    vi.stubGlobal("fetch", fetchMock);
    renderForm();
    await fill(isoYearsAgo(16));
    expect(screen.getByRole("button", { name: "Create account" })).toBeDisabled();
    expect(
      screen.getAllByText("You must be at least 18 years old to register.").length,
    ).toBeGreaterThan(0);
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it.each(["Organisation", "Country", "Role", "terms"])(
    "keeps the button disabled when %s is missing",
    async (skip) => {
      renderForm();
      await fill(isoYearsAgo(30), { skip });
      expect(screen.getByRole("button", { name: "Create account" })).toBeDisabled();
    },
  );

  it("shows the live counter and the exact blocker for a short intended use", async () => {
    renderForm();
    await fill(isoYearsAgo(30), { skip: "How will you use the API?" });
    await userEvent.type(
      screen.getByLabelText(
        (c) => c.replace(/\s*\*\s*$/, "").trim() === "How will you use the API?",
      ),
      "Research Purpose",
    );
    expect(screen.getByText("16 / 20 characters minimum")).toBeInTheDocument();
    expect(
      screen.getByText("How will you use the API? needs at least 20 characters (16 so far)"),
    ).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Create account" })).toBeDisabled();
  });

  it("enables the button once every field is valid and sends the full profile", async () => {
    const calls: Array<{ url: string; body: unknown }> = [];
    vi.stubGlobal(
      "fetch",
      vi.fn(async (url: string, init?: RequestInit) => {
        calls.push({ url, body: init?.body ? JSON.parse(String(init.body)) : null });
        if (url.endsWith("/auth/register")) return reply(USER, 201);
        if (url.endsWith("/auth/login"))
          return reply({ accessToken: "tok-1234567890", tokenType: "bearer", expiresIn: 3600 });
        return reply(USER);
      }),
    );
    renderForm();
    await fill(isoYearsAgo(30));
    const button = screen.getByRole("button", { name: "Create account" });
    expect(button).toBeEnabled();
    await userEvent.click(button);
    await waitFor(() => expect(calls.some((c) => c.url.endsWith("/auth/register"))).toBe(true));
    const body = calls.find((c) => c.url.endsWith("/auth/register"))!.body as Record<
      string,
      unknown
    >;
    expect(body).toEqual({
      name: "Ada Lovelace",
      email: "ada@gmail.com",
      dateOfBirth: isoYearsAgo(30),
      role: "academic-researcher",
      organization: "Analytical Engine Lab",
      country: "United Kingdom",
      intendedUse: "Evaluating clinical risk models for a study.",
      password: "correct-horse-battery",
      acceptTerms: true,
    });
  });
});

describe("one key per account", () => {
  function api(overrides: Record<string, () => Response> = {}, user = USER, keys = [KEY]) {
    return vi.fn(async (url: string, init?: RequestInit) => {
      const key = `${init?.method ?? "GET"} ${url.replace(`${BASE}/api/v1`, "")}`;
      if (overrides[key]) return overrides[key]();
      if (key === "GET /auth/me") return reply(user);
      if (key === "GET /keys") return reply(keys);
      if (key === "GET /usage") return reply(USAGE);
      return reply({ error: { code: "not_found", message: key } }, 404);
    });
  }

  function renderDashboard() {
    sessionStorage.setItem(
      "evalsuite.session",
      JSON.stringify({ token: "s", expiresAt: Date.now() + 60_000 }),
    );
    render(
      <AuthProvider baseUrl={BASE}>
        <Dashboard />
      </AuthProvider>,
    );
  }

  it("offers rotation instead of a second key, confirmed in the page", async () => {
    // A blocked browser dialog must not matter: confirm() is never used.
    const confirmSpy = vi.fn(() => false);
    vi.stubGlobal("confirm", confirmSpy);
    vi.stubGlobal(
      "fetch",
      api({
        "POST /keys/k1/rotate": () =>
          reply(
            { ...KEY, id: "k2", prefix: "eeee5555", key: "es_live_eeee5555_" + "r".repeat(43) },
            201,
          ),
      }),
    );
    renderDashboard();
    const rotate = await screen.findByRole("button", { name: "Rotate key" });
    expect(screen.queryByRole("button", { name: "Create key" })).toBeNull();
    await userEvent.click(rotate);
    expect(screen.getByRole("alertdialog")).toHaveTextContent(/stops working immediately/);
    await userEvent.click(screen.getByRole("button", { name: "Yes, rotate key" }));
    expect(await screen.findByText(/^es_live_eeee5555_r+$/)).toBeInTheDocument();
    expect(confirmSpy).not.toHaveBeenCalled();
  });

  it("revokes after in-page confirmation, and Cancel does nothing", async () => {
    const calls: string[] = [];
    const base = api({ "DELETE /keys/k1": () => new Response(null, { status: 204 }) });
    vi.stubGlobal(
      "fetch",
      vi.fn(async (url: string, init?: RequestInit) => {
        calls.push(`${init?.method ?? "GET"} ${url.replace(`${BASE}/api/v1`, "")}`);
        return base(url, init);
      }),
    );
    renderDashboard();
    await userEvent.click(await screen.findByRole("button", { name: "Revoke" }));
    await userEvent.click(screen.getByRole("button", { name: "Cancel" }));
    expect(screen.queryByRole("alertdialog")).toBeNull();
    expect(calls).not.toContain("DELETE /keys/k1");
    await userEvent.click(screen.getByRole("button", { name: "Revoke" }));
    await userEvent.click(screen.getByRole("button", { name: "Yes, revoke key" }));
    await waitFor(() => expect(calls).toContain("DELETE /keys/k1"));
  });

  it("shows the create form when there is no active key", async () => {
    vi.stubGlobal("fetch", api({}, USER, []));
    renderDashboard();
    expect(await screen.findByRole("button", { name: "Create key" })).toBeInTheDocument();
    expect(screen.queryByRole("button", { name: "Rotate key" })).toBeNull();
  });

  it("explains the age requirement to ineligible accounts", async () => {
    vi.stubGlobal("fetch", api({}, { ...USER, eligibleForApi: false }, []));
    renderDashboard();
    expect(await screen.findByText(/aged 18 or over/)).toBeInTheDocument();
    expect(screen.queryByRole("button", { name: "Create key" })).toBeNull();
  });
});
