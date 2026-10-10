import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { DownloadButton } from "@/components/download/download-button";
import { InstallCommand } from "@/components/download/install-command";

describe("install command", () => {
  it("shows pip install with a working copy button and honest PyPI status", async () => {
    const execCommand = vi.fn(() => true);
    Object.defineProperty(document, "execCommand", { value: execCommand, configurable: true });
    render(<InstallCommand />);
    expect(screen.getByLabelText("Install command")).toHaveTextContent(
      "$ pip install evalsuite-python",
    );
    expect(screen.getByRole("link", { name: "View on PyPI" })).toHaveAttribute(
      "href",
      "https://pypi.org/project/evalsuite-python/",
    );
    await userEvent.click(screen.getByRole("button", { name: "Copy" }));
    expect(await screen.findByRole("button", { name: "Copied" })).toBeInTheDocument();
    expect(execCommand).toHaveBeenCalledWith("copy");
  });
});

describe("download button", () => {
  it("always goes through the email step, never a direct file link", () => {
    render(<DownloadButton />);
    const link = screen.getByRole("link", { name: /Download/ });
    expect(link).toHaveAttribute("href", "/download#get");
    expect(link).not.toHaveAttribute("download");
    expect(link).toHaveTextContent("Download v0.4.1");
  });
});

describe("download gate (mandatory email)", () => {
  const files = [
    {
      filename: "evalsuite_python-0.1.0-py3-none-any.whl",
      kind: "wheel" as const,
      sizeLabel: "120 KB",
    },
    { filename: "evalsuite_python-0.1.0.tar.gz", kind: "sdist" as const, sizeLabel: "90 KB" },
  ];

  afterEach(() => {
    vi.unstubAllEnvs();
    vi.unstubAllGlobals();
  });

  it("explains the security purpose and keeps the button disabled until email and consent", async () => {
    vi.stubEnv("NEXT_PUBLIC_API_BASE_URL", "https://api.example.org");
    const { DownloadGate } = await import("@/components/download/download-gate");
    render(<DownloadGate version="0.1.0" files={files} />);
    expect(screen.getByText("For security purposes, this step is mandatory.")).toBeInTheDocument();
    const button = screen.getByRole("button", { name: /Continue to download/ });
    expect(button).toBeDisabled();
    await userEvent.type(screen.getByLabelText(/Personal email/), "reader@gmail.com");
    expect(button).toBeDisabled();
    await userEvent.click(screen.getByRole("checkbox"));
    expect(button).toBeEnabled();
  });

  it("shows signed download links after the email is accepted", async () => {
    vi.stubEnv("NEXT_PUBLIC_API_BASE_URL", "https://api.example.org");
    const fetchMock = vi.fn(async (_url: string, init?: RequestInit) => {
      const body = JSON.parse(String(init?.body)) as { filename: string };
      return new Response(
        JSON.stringify({
          downloadPath: `/api/download/0.1.0/${body.filename}?token=t`,
          expiresIn: 600,
          message: "ok",
        }),
      );
    });
    vi.stubGlobal("fetch", fetchMock);
    const { DownloadGate } = await import("@/components/download/download-gate");
    render(<DownloadGate version="0.1.0" files={files} />);
    await userEvent.type(screen.getByLabelText(/Personal email/), "reader@gmail.com");
    await userEvent.click(screen.getByRole("checkbox"));
    await userEvent.click(screen.getByRole("button", { name: /Continue to download/ }));
    const wheel = await screen.findByRole("link", { name: /Download wheel/ });
    expect(wheel).toHaveAttribute(
      "href",
      "/api/download/0.1.0/evalsuite_python-0.1.0-py3-none-any.whl?token=t",
    );
    expect(screen.getByRole("link", { name: /Download source/ })).toBeInTheDocument();
    const sent = JSON.parse(
      String((fetchMock.mock.calls[0] as unknown as [string, RequestInit])[1].body),
    );
    expect(sent).toMatchObject({ email: "reader@gmail.com", acceptSecurityNotices: true });
  });

  it("before the first release, signs up for the v0.1.0 notice", async () => {
    vi.stubEnv("NEXT_PUBLIC_API_BASE_URL", "https://api.example.org");
    vi.stubGlobal(
      "fetch",
      vi.fn(
        async () =>
          new Response(
            JSON.stringify({
              downloadPath: null,
              expiresIn: null,
              message: "You will be emailed when v0.1.0 is released.",
            }),
          ),
      ),
    );
    const { DownloadGate } = await import("@/components/download/download-gate");
    render(<DownloadGate version={null} files={[]} />);
    await userEvent.type(screen.getByLabelText(/Personal email/), "reader@gmail.com");
    await userEvent.click(screen.getByRole("checkbox"));
    await userEvent.click(screen.getByRole("button", { name: "Notify me" }));
    expect(await screen.findByText(/emailed when v0.1.0 is released/)).toBeInTheDocument();
  });

  it("rejects organisation email addresses with an explanation", async () => {
    vi.stubEnv("NEXT_PUBLIC_API_BASE_URL", "https://api.example.org");
    const { DownloadGate } = await import("@/components/download/download-gate");
    render(<DownloadGate version="0.1.0" files={files} />);
    await userEvent.type(screen.getByLabelText(/Personal email/), "manoj@jssstu.ac.in");
    await userEvent.click(screen.getByRole("checkbox"));
    expect(screen.getByRole("alert")).toHaveTextContent(/personal email address/);
    expect(screen.getByRole("button", { name: /Continue to download/ })).toBeDisabled();
  });

  it("says downloads are unavailable without the API", async () => {
    vi.stubEnv("NEXT_PUBLIC_API_BASE_URL", "");
    const { DownloadGate } = await import("@/components/download/download-gate");
    render(<DownloadGate version="0.1.0" files={files} />);
    expect(screen.getByText("Downloads are not available on this deployment")).toBeInTheDocument();
  });
});
