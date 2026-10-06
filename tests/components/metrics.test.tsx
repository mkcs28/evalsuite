import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MetricExplorer } from "@/components/metrics/metric-explorer";
import { MetricTable } from "@/components/metrics/metric-table";
import { StatusBadge } from "@/components/ui/status-badge";
import { RoadmapTimeline } from "@/components/roadmap/roadmap-timeline";
import { registry } from "@/lib/metrics/registry";

describe("StatusBadge", () => {
  it("conveys status in text, not colour alone", () => {
    render(<StatusBadge status="planned" />);
    expect(screen.getByText("Planned")).toBeInTheDocument();
  });
});

describe("MetricExplorer", () => {
  it("filters by search and shows details", async () => {
    render(<MetricExplorer metrics={[...registry]} />);
    expect(
      screen.getByText(`${registry.length} of ${registry.length} metrics`),
    ).toBeInTheDocument();
    await userEvent.type(screen.getByRole("searchbox"), "hausdorff");
    expect(screen.getByText(`1 of ${registry.length} metrics`)).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "Hausdorff distance" })).toBeInTheDocument();
    expect(
      screen.getByRole("link", { name: /Full reference for Hausdorff distance/ }),
    ).toHaveAttribute("href", "/docs/metrics/segmentation--hausdorff");
  });

  it("filters by category and offers to clear empty results", async () => {
    render(<MetricExplorer metrics={[...registry]} />);
    await userEvent.selectOptions(screen.getByRole("combobox", { name: "Category" }), "detection");
    expect(screen.getByRole("list", { name: "Metrics" }).children).toHaveLength(
      registry.filter((m) => m.category === "detection").length,
    );
    await userEvent.type(screen.getByRole("searchbox"), "no-such-metric");
    await userEvent.click(screen.getByRole("button", { name: "Clear filters" }));
    expect(
      screen.getByText(`${registry.length} of ${registry.length} metrics`),
    ).toBeInTheDocument();
  });
});

describe("MetricTable", () => {
  it("renders registry rows with status and API", () => {
    render(<MetricTable category="regression" />);
    expect(screen.getByRole("rowheader", { name: "Mean absolute error" })).toBeInTheDocument();
    expect(screen.getAllByText("es.regression.mae").length).toBeGreaterThan(0);
    expect(screen.getAllByText("Planned v0.1.0").length).toBeGreaterThan(0);
  });
});

describe("RoadmapTimeline", () => {
  it("lists the three planned releases", () => {
    render(<RoadmapTimeline />);
    for (const v of ["v0.1.0", "v0.2.0", "v0.3.0"]) expect(screen.getByText(v)).toBeInTheDocument();
    expect(screen.queryByText("Implemented")).toBeNull();
  });
});
