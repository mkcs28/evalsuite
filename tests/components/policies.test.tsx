import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import domains from "@/data/personal-email-domains.json";
import backendDomains from "../../backend/app/data/personal_email_domains.json";
import { FooterStatus, measureDownloadMbps } from "@/components/layout/footer-status";
import {
  isPersonalEmail,
  personalEmailError,
  PERSONAL_EMAIL_MESSAGE,
} from "@/lib/validation/email";

describe("personal email rule", () => {
  it.each(["ada@gmail.com", "ADA@Outlook.com", "x@yahoo.co.in", "y@proton.me", " z@icloud.com "])(
    "accepts %s",
    (e) => {
      expect(isPersonalEmail(e)).toBe(true);
    },
  );

  it.each([
    "ada@jssstu.ac.in",
    "ada@university.edu",
    "ada@company.com",
    "ada@sub.gmail.com",
    "ada@gmail.com.evil.org",
    "ada@mailinator.com",
  ])("rejects %s", (e) => {
    expect(isPersonalEmail(e)).toBe(false);
    expect(personalEmailError(e)).toBe(PERSONAL_EMAIL_MESSAGE);
  });

  it("uses exactly the same list as the API", () => {
    expect(backendDomains).toEqual(domains);
  });
});

describe("visitor counter", () => {
  afterEach(() => {
    vi.unstubAllEnvs();
    vi.unstubAllGlobals();
    localStorage.clear();
    sessionStorage.clear();
  });

  it("records this browser once and shows the total", async () => {
    vi.stubEnv("NEXT_PUBLIC_API_BASE_URL", "https://api.example.org");
    const fetchMock = vi.fn(async () => new Response(JSON.stringify({ totalVisitors: 12345 })));
    vi.stubGlobal("fetch", fetchMock);
    const { VisitorCounter } = await import("@/components/home/visitor-counter");
    const { unmount } = render(<VisitorCounter />);
    expect(await screen.findByText("12,345")).toBeInTheDocument();
    expect(screen.getByText(/visitors so far/)).toBeInTheDocument();
    const [url, init] = fetchMock.mock.calls[0] as unknown as [string, RequestInit];
    expect(url).toBe("https://api.example.org/api/v1/stats/visit");
    const id = JSON.parse(String(init.body)).visitorId as string;
    expect(id).toMatch(/^[0-9a-f-]{36}$/);
    expect(localStorage.getItem("evalsuite.visitor")).toBe(id);
    unmount();
    // Later page views in the same session only read the total.
    render(<VisitorCounter />);
    await waitFor(() => expect(fetchMock).toHaveBeenCalledTimes(2));
    expect((fetchMock.mock.calls[1] as unknown as [string])[0]).toBe(
      "https://api.example.org/api/v1/stats",
    );
  });

  it("renders nothing without the API", async () => {
    vi.stubEnv("NEXT_PUBLIC_API_BASE_URL", "");
    const { VisitorCounter } = await import("@/components/home/visitor-counter");
    const { container } = render(<VisitorCounter />);
    expect(container).toBeEmptyDOMElement();
  });
});

describe("footer status", () => {
  afterEach(() => vi.unstubAllGlobals());

  it("shows the local date and time and the browser's speed estimate", async () => {
    Object.defineProperty(navigator, "connection", {
      value: {
        downlink: 9.6,
        effectiveType: "4g",
        addEventListener: vi.fn(),
        removeEventListener: vi.fn(),
      },
      configurable: true,
    });
    render(<FooterStatus />);
    expect(
      await screen.findByText(/Connection: ≈ 9.60 Mbps \(4g\), browser estimate/),
    ).toBeInTheDocument();
    expect(document.querySelector("time")?.getAttribute("dateTime")).toMatch(/^\d{4}-\d{2}-\d{2}T/);
  });

  it("measures download speed on demand", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn(async () => new Response(new Uint8Array(524288))),
    );
    render(<FooterStatus />);
    await userEvent.click(screen.getByRole("button", { name: "Test speed" }));
    expect(await screen.findByText(/Download speed: [\d.]+ Mbps \(measured\)/)).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Test again" })).toBeInTheDocument();
  });

  it("computes Mbps from bytes and elapsed time", async () => {
    const times = [1000, 1500];
    vi.spyOn(performance, "now").mockImplementation(() => times.shift() ?? 1500);
    const mbps = await measureDownloadMbps(
      (async () => new Response(new Uint8Array(625_000))) as unknown as typeof fetch,
    );
    expect(mbps).toBeCloseTo(10, 5); // 625,000 bytes in 0.5 s = 10 Mbit/s
  });
});
