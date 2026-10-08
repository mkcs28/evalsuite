import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { isActive, SiteHeader } from "@/components/layout/site-header";
import { setPathname } from "../setup";

describe("SiteHeader", () => {
  it("marks the active route", () => {
    setPathname("/playground");
    render(<SiteHeader />);
    const nav = screen.getAllByRole("navigation", { name: "Main" })[0]!;
    expect(within(nav).getByRole("link", { name: "Playground" })).toHaveAttribute(
      "aria-current",
      "page",
    );
    expect(within(nav).getByRole("link", { name: "Docs" })).not.toHaveAttribute("aria-current");
  });

  it("links to the real GitHub repository and PyPI project", () => {
    setPathname("/");
    render(<SiteHeader />);
    for (const link of screen.getAllByRole("link", { name: /github/i }))
      expect(link).toHaveAttribute("href", "https://github.com/mkcs28/evalsuite-python");
    for (const link of screen.getAllByRole("link", { name: /pypi/i }))
      expect(link).toHaveAttribute("href", "https://pypi.org/project/evalsuite-python/");
  });

  it("opens and closes the mobile menu", async () => {
    setPathname("/");
    render(<SiteHeader />);
    const toggle = screen.getByRole("button", { name: "Open menu" });
    await userEvent.click(toggle);
    expect(screen.getByRole("button", { name: "Close menu" })).toHaveAttribute(
      "aria-expanded",
      "true",
    );
    expect(screen.getAllByText("PyPI").length).toBeGreaterThan(0);
    await userEvent.keyboard("{Escape}");
    expect(screen.getByRole("button", { name: "Open menu" })).toHaveAttribute(
      "aria-expanded",
      "false",
    );
  });

  it("keeps Docs and Metrics active states separate", () => {
    expect(isActive("/docs/classification", "/docs")).toBe(true);
    expect(isActive("/docs/metrics/classification--f1", "/docs")).toBe(false);
    expect(isActive("/docs/metrics/classification--f1", "/docs/metrics")).toBe(true);
  });
});
