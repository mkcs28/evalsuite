import { render, screen, within } from "@testing-library/react";
import { Benefits } from "@/components/home/benefits";

describe("Benefits section", () => {
  it("shows outcomes and audiences, labelled as design goals", () => {
    render(<Benefits />);
    expect(
      screen.getByRole("heading", { level: 2, name: /What you gain with EvalSuite/ }),
    ).toBeInTheDocument();
    for (const t of [
      "Fewer silent errors",
      "Uncertainty by default",
      "Less glue code",
      "Reproducible numbers",
    ]) {
      expect(screen.getByRole("heading", { level: 3, name: t })).toBeInTheDocument();
    }
    for (const who of [
      "ML researchers",
      "Clinical AI teams",
      "Computer vision",
      "Reviewers and statisticians",
      "Students and educators",
      "Research software teams",
    ]) {
      expect(screen.getByRole("heading", { level: 4, name: who })).toBeInTheDocument();
    }
    expect(screen.getByText("Delivered in v0.1.0, extended through v0.3.0")).toBeInTheDocument();
  });

  it("makes no numeric performance claims", () => {
    const { container } = render(<Benefits />);
    expect(within(container).queryByText(/\d+\s*%|\d+x faster|faster than/i)).toBeNull();
  });
});
