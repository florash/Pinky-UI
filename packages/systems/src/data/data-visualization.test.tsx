import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";

import { AnnotatedTimeline } from "./annotated-timeline";
import { ChartTableView } from "./chart-table-view";
import { ComparisonChart } from "./comparison-chart";
import { InteractiveBarRanking } from "./interactive-bar-ranking";
import { InteractiveLineChart } from "./interactive-line-chart";
import { LinkedSmallMultiples } from "./linked-small-multiples";
import { RangeBrushChart } from "./range-brush-chart";
import { ThresholdBandChart } from "./threshold-band-chart";

const DATA = [
  { id: "mon", label: "Mon", value: 12, context: "Quiet start" },
  { id: "tue", label: "Tue", value: 15, context: "Campaign" },
  { id: "wed", label: "Wed", value: 14, context: "Dip" },
  { id: "thu", label: "Thu", value: 19, context: "Release" },
  { id: "fri", label: "Fri", value: 23, context: "Launch" },
];

describe("Data visualization systems", () => {
  it("reads an interactive line point with keyboard focus", async () => {
    const user = userEvent.setup();
    render(<InteractiveLineChart data={DATA} label="Weekly usage" formatValue={(value) => `${value}k`} />);
    const chart = screen.getByRole("img", { name: "Weekly usage" });
    chart.focus(); await user.keyboard("{Home}{ArrowRight}");
    expect(screen.getByRole("status")).toHaveTextContent("Tue");
    expect(screen.getByRole("status")).toHaveTextContent("15k");
  });

  it("keeps a brush range adjustable and resettable", async () => {
    const user = userEvent.setup();
    const { container } = render(<RangeBrushChart data={DATA} label="Usage history" defaultStartIndex={1} defaultEndIndex={3} />);
    const start = screen.getByRole("slider", { name: "Range start" });
    start.focus(); await user.keyboard("{ArrowRight}");
    expect(start).toHaveValue("2");
    expect(screen.getAllByText("Wed").length).toBeGreaterThan(0);
    const overview = container.querySelectorAll("svg")[1];
    const overviewPath = overview?.querySelector("path")?.getAttribute("d") ?? "";
    const overviewX = [...overviewPath.matchAll(/[ML] ([\d.]+)/g)].map((match) => Number(match[1]));
    const selectedWindow = overview?.querySelector("rect");
    expect(Number(selectedWindow?.getAttribute("x"))).toBeCloseTo(overviewX[2] ?? 0, 1);
    expect(Number(selectedWindow?.getAttribute("x")) + Number(selectedWindow?.getAttribute("width"))).toBeCloseTo(overviewX[3] ?? 0, 1);
    await user.click(screen.getByRole("button", { name: "Reset range" }));
    expect(screen.getAllByText("Tue").length).toBeGreaterThan(0);
  });

  it("publishes both values and the difference for comparison reading", async () => {
    const user = userEvent.setup();
    render(<ComparisonChart labels={DATA.map((item) => item.label)} series={[{ id: "a", label: "A", values: [10, 12, 14, 16, 18] }, { id: "b", label: "B", values: [8, 9, 11, 14, 17], marker: "square" }]} label="Series comparison" />);
    const chart = screen.getByRole("img", { name: "Series comparison" });
    chart.focus(); await user.keyboard("{Home}{ArrowRight}");
    expect(screen.getByRole("status")).toHaveTextContent("Tue");
    expect(screen.getByRole("status")).toHaveTextContent("Difference -3");
  });

  it("connects an annotated event to its data point", async () => {
    const user = userEvent.setup();
    render(<AnnotatedTimeline data={DATA} annotations={[{ id: "release", index: 3, label: "Release", description: "The release changed the curve." }]} label="Launch timeline" />);
    expect(screen.getByRole("status")).toHaveTextContent("Thu");
    expect(screen.getByRole("status")).toHaveTextContent("The release changed the curve.");
    await user.click(screen.getAllByRole("button", { name: /Release: The release changed/ })[0]!);
    expect(screen.getByRole("status")).toHaveTextContent("The release changed the curve.");
    expect(screen.getByRole("status")).toHaveTextContent("Thu");
  });

  it("reports threshold state as text alongside the chart", async () => {
    const user = userEvent.setup();
    render(<ThresholdBandChart data={DATA.map((item, index) => ({ ...item, value: [42, 58, 66, 84, 92][index]! }))} bands={[{ id: "normal", label: "Normal", min: 0, max: 60 }, { id: "watch", label: "Watch", min: 60, max: 80 }, { id: "target", label: "Target", min: 80, max: 100 }]} label="Response time" />);
    const chart = screen.getByRole("img", { name: "Response time" });
    chart.focus(); await user.keyboard("{End}");
    expect(screen.getByRole("status")).toHaveTextContent("Target");
    expect(screen.getByRole("list", { name: "Threshold bands" })).toHaveTextContent("Watch");
  });

  it("sorts and changes metric without losing ranked row identity", async () => {
    const user = userEvent.setup();
    render(<InteractiveBarRanking items={[{ id: "a", label: "Alpha", values: { reach: 80, quality: 50 } }, { id: "b", label: "Beta", values: { reach: 60, quality: 90 } }]} metrics={[{ id: "reach", label: "Reach" }, { id: "quality", label: "Quality" }]} label="Ranking" />);
    expect(screen.getByRole("listitem", { name: /Alpha/ })).toHaveTextContent("80");
    await user.click(screen.getByRole("button", { name: "Quality" }));
    expect(screen.getByRole("listitem", { name: /Beta/ })).toHaveTextContent("90");
    await user.click(screen.getByRole("button", { name: "Sort ascending" }));
    expect(screen.getByRole("button", { name: "Sort descending" })).toBeInTheDocument();
  });

  it("moves one shared reading position across small multiples", async () => {
    const user = userEvent.setup();
    render(<LinkedSmallMultiples charts={[{ id: "one", label: "Revenue", data: DATA }, { id: "two", label: "Sessions", data: DATA.map((item) => ({ ...item, value: item.value + 10 })) }]} label="Metric comparison" />);
    const group = screen.getByRole("group", { name: "Metric comparison" });
    group.focus(); await user.keyboard("{Home}{ArrowRight}");
    expect(screen.getByRole("status")).toHaveTextContent("Tue");
    expect(screen.getByRole("status")).toHaveTextContent("Revenue");
    expect(screen.getByRole("status")).toHaveTextContent("Sessions");
  });

  it("switches the same selected data between chart and semantic table", async () => {
    const user = userEvent.setup();
    render(<ChartTableView data={DATA} label="Weekly usage" formatValue={(value) => `${value}k`} />);
    const chart = screen.getByRole("img", { name: "Weekly usage" });
    chart.focus(); await user.keyboard("{Home}{ArrowRight}");
    await user.click(screen.getByRole("button", { name: "Table" }));
    expect(screen.getByRole("table")).toBeInTheDocument();
    expect(screen.getByRole("columnheader", { name: "Period" })).toBeInTheDocument();
    expect(screen.getByRole("row", { name: /Tue/ })).toHaveAttribute("aria-selected", "true");
    await user.click(screen.getByRole("button", { name: "Chart" }));
    expect(screen.getByRole("img", { name: "Weekly usage" })).toBeInTheDocument();
  });
});
