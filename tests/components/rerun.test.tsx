import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Playground } from "@/components/playground/playground";

const intervalTexts = () =>
  within(screen.getByRole("table", { name: /Metric estimates/ }))
    .getAllByRole("row")
    .map((r) => r.textContent ?? "");

describe("re-running after changing settings", () => {
  it.each([
    ["Confidence level", "0.99", /99% Wilson/],
    ["Confidence level", "0.9", /90% Wilson/],
  ])("updates results after changing %s to %s", async (label, value, expected) => {
    render(<Playground />);
    const run = screen.getByRole("button", { name: "Run evaluation" });
    await userEvent.click(run);
    expect(intervalTexts().join(" ")).toMatch(/95% Wilson/);
    await userEvent.selectOptions(screen.getByLabelText(label), value);
    await userEvent.click(screen.getByRole("button", { name: "Run evaluation" }));
    expect(intervalTexts().join(" ")).toMatch(expected);
  });

  it("re-runs after switching to bootstrap and changing resamples", async () => {
    render(<Playground />);
    await userEvent.click(screen.getByRole("button", { name: "Run evaluation" }));
    await userEvent.selectOptions(
      screen.getByLabelText("Confidence interval"),
      "bootstrap-percentile",
    );
    const resamples = screen.getByLabelText("Bootstrap resamples");
    await userEvent.clear(resamples);
    await userEvent.type(resamples, "500");
    await userEvent.click(screen.getByRole("button", { name: "Run evaluation" }));
    expect(intervalTexts().join(" ")).toMatch(/percentile bootstrap/);
  });
});

describe("hidden settings never block a run", () => {
  it("runs after an invalid resample count once bootstrap is switched off", async () => {
    render(<Playground />);
    await userEvent.selectOptions(
      screen.getByLabelText("Confidence interval"),
      "bootstrap-percentile",
    );
    const resamples = screen.getByLabelText("Bootstrap resamples");
    await userEvent.clear(resamples);
    await userEvent.type(resamples, "50");
    await userEvent.click(screen.getByRole("button", { name: "Run evaluation" }));
    expect(screen.getByText(/Use between 100 and 2000 resamples/)).toBeInTheDocument();
    await userEvent.selectOptions(screen.getByLabelText("Confidence interval"), "wilson");
    await userEvent.click(screen.getByRole("button", { name: "Run evaluation" }));
    expect(await screen.findByRole("table", { name: /Metric estimates/ })).toBeInTheDocument();
    expect(intervalTexts().join(" ")).toMatch(/95% Wilson/);
  });

  it("explains next to the Run button why a run did not start", async () => {
    render(<Playground />);
    await userEvent.selectOptions(
      screen.getByLabelText("Confidence interval"),
      "bootstrap-percentile",
    );
    await userEvent.clear(screen.getByLabelText("Bootstrap resamples"));
    await userEvent.click(screen.getByRole("button", { name: "Run evaluation" }));
    expect(screen.getByText(/fix the highlighted field/i)).toBeInTheDocument();
    // Any whole number in range is accepted (not only multiples of 100).
    await userEvent.type(screen.getByLabelText("Bootstrap resamples"), "250");
    await userEvent.click(screen.getByRole("button", { name: "Run evaluation" }));
    expect(await screen.findByRole("table", { name: /Metric estimates/ })).toBeInTheDocument();
    const table = screen.getByRole("table", { name: /Metric estimates/ });
    const methods = Array.from(table.querySelectorAll("[title]")).map((el) =>
      el.getAttribute("title"),
    );
    expect(methods.some((m) => m?.includes("250 resamples"))).toBe(true);
  });
});
