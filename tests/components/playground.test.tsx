import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Playground } from "@/components/playground/playground";

describe("Playground", () => {
  it("labels demo mode and runs a deterministic evaluation", async () => {
    render(<Playground />);
    expect(screen.getByText("Demo mode.")).toBeInTheDocument();
    expect(screen.getByRole("radio", { name: "EvalSuite API" })).toBeDisabled();
    await userEvent.click(screen.getByRole("button", { name: "Run evaluation" }));
    const table = await screen.findByRole("table", { name: /Metric estimates/ });
    expect(within(table).getByRole("rowheader", { name: /^Accuracy/ })).toBeInTheDocument();
    expect(screen.getByText("Demo data")).toBeInTheDocument();
    expect(screen.getByText(/not EvalSuite/)).toBeInTheDocument();
    const first = table.textContent;
    await userEvent.click(screen.getByRole("button", { name: "Run evaluation" }));
    expect((await screen.findByRole("table", { name: /Metric estimates/ })).textContent).toBe(
      first,
    );
  });

  it("shows validation errors for invalid input", async () => {
    render(<Playground />);
    const field = screen.getByLabelText("Ground truth (y_true)");
    await userEvent.clear(field);
    await userEvent.type(field, "1, 0, maybe");
    await userEvent.click(screen.getByRole("button", { name: "Run evaluation" }));
    expect(await screen.findByText(/Value 3 \("maybe"\) is not a number/)).toBeInTheDocument();
  });

  it("switches to regression metrics", async () => {
    render(<Playground />);
    await userEvent.selectOptions(screen.getByLabelText("Task"), "regression");
    expect(screen.getByLabelText("Mean absolute error")).toBeChecked();
    expect(screen.queryByLabelText("Predicted probabilities (y_prob, optional)")).toBeNull();
    await userEvent.click(screen.getByRole("button", { name: "Run evaluation" }));
    expect(
      await screen.findByRole("rowheader", { name: /Root mean squared error/ }),
    ).toBeInTheDocument();
  });
});
