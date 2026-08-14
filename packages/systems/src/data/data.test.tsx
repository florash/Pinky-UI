import { fireEvent, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";

import { setReducedMotion } from "../../../../vitest.setup";
import { allProductSystems } from "@pinky/registry";
import { AnimatedNumber } from "./animated-number";
import { ComparisonBars } from "./comparison-bars";
import { DataLens } from "./data-lens";
import { ExpandableDataRow } from "./expandable-data-row";
import { FilterRail } from "./filter-rail";
import { InteractiveSparkline } from "./interactive-sparkline";
import { RadialMeter } from "./radial-meter";
import { SelectionTray } from "./selection-tray";
import { SortableDataRows } from "./sortable-data-rows";
import { TimelineScrubber } from "./timeline-scrubber";

const DATA = [{ label: "May", value: 12 }, { label: "June", value: 18 }, { label: "July", value: 16 }];

describe("Data systems", () => {
  it("exposes one stable final AnimatedNumber value under reduced motion", () => {
    setReducedMotion(true);
    render(<AnimatedNumber value={1503} prefix="$" locale="en-US" />);
    expect(screen.getAllByText("$1,503")).toHaveLength(2);
  });

  it("inspects sparkline points with Arrow keys", async () => {
    const user = userEvent.setup();
    render(<InteractiveSparkline data={DATA} label="Revenue history" />);
    const chart = screen.getByRole("img", { name: /revenue history/i });
    chart.focus(); await user.keyboard("{Home}{ArrowRight}");
    expect(screen.getByText("June")).toBeInTheDocument();
    expect(screen.getByText("18")).toBeInTheDocument();
  });

  it("keeps DataLens chart-agnostic and keyboard selectable", async () => {
    const user = userEvent.setup(); const change = vi.fn();
    render(<DataLens items={DATA} label="Inspect revenue" onIndexChange={change} renderLens={(item) => <span>{item.label}</span>}><div>Custom SVG surface</div></DataLens>);
    const lens = screen.getByRole("slider", { name: "Inspect revenue" }); lens.focus(); await user.keyboard("{ArrowRight}");
    expect(change).toHaveBeenCalledWith(1); expect(screen.getByText("June")).toBeInTheDocument();
  });

  it("snaps Timeline Scrubber state through its native range", () => {
    const change = vi.fn();
    render(<TimelineScrubber stops={[{ id: "a", label: "Alpha" }, { id: "b", label: "Beta" }]} index={0} onIndexChange={change} />);
    fireEvent.change(screen.getByRole("slider", { name: "Timeline" }), { target: { value: "1" } });
    expect(change).toHaveBeenCalledWith(1);
  });

  it("publishes semantic values for meters and comparison bars", () => {
    render(<><RadialMeter value={67} label="Completion" /><ComparisonBars label="Plans" items={[{ id: "a", label: "Current", value: 42 }, { id: "b", label: "Target", value: 67 }]} /></>);
    expect(screen.getByRole("meter", { name: "Completion" })).toHaveAttribute("aria-valuenow", "67");
    expect(screen.getByRole("listitem", { name: "Target: 67" })).toBeInTheDocument();
  });

  it("registers all non-duplicative production systems with live demos", () => {
    expect(allProductSystems).toHaveLength(58);
    expect(new Set(allProductSystems.map((item) => item.slug))).toHaveProperty("size", 58);
    expect(allProductSystems.every((item) => item.status === "ready")).toBe(true);
    expect(allProductSystems.every((item) => item.demoPath.endsWith(`#${item.slug}`))).toBe(true);
  });

  it("selects and clears a grouped FilterRail option", async () => {
    const user = userEvent.setup(); const change = vi.fn();
    render(<FilterRail groups={[{ id: "status", label: "Status", options: [{ id: "ready", label: "Ready" }] }]} onValueChange={change} />);
    await user.click(screen.getByRole("button", { name: /Ready/ }));
    expect(change).toHaveBeenCalledWith({ status: "ready" });
    await user.click(screen.getByRole("button", { name: "Remove Ready filter" }));
    expect(change).toHaveBeenLastCalledWith({});
  });

  it("reorders data rows with the keyboard handle", () => {
    const change = vi.fn(); const items = [{ id: "a", label: "Alpha", values: { status: "Ready" } }, { id: "b", label: "Beta", values: { status: "Review" } }];
    render(<SortableDataRows columns={[{ id: "status", label: "Status" }]} items={items} onReorder={change} />);
    const handle = screen.getByRole("button", { name: "Reorder Alpha" });
    fireEvent.keyDown(handle, { key: " " }); fireEvent.keyDown(handle, { key: "ArrowDown" });
    expect(change).toHaveBeenCalledWith([items[1], items[0]]);
  });

  it("opens an ExpandableDataRow detail region and exposes a selection tray action", async () => {
    const user = userEvent.setup(); const action = vi.fn();
    render(<><ExpandableDataRow row={{ id: "row", label: "Alpha", values: ["Ready"], detail: <p>Row details</p> }} columns={["Status"]} /><SelectionTray items={[{ id: "row", label: "Alpha" }]} actions={[{ id: "archive", label: "Archive", onAction: action }]} /></>);
    await user.click(screen.getByRole("button", { name: "Expand Alpha" }));
    expect(screen.getByRole("region", { name: "Alpha details" })).toHaveTextContent("Row details");
    await user.click(screen.getByRole("checkbox", { name: "Alpha" }));
    await user.click(screen.getByRole("button", { name: "Archive" }));
    expect(action).toHaveBeenCalledWith([{ id: "row", label: "Alpha" }]);
  });

  it("keeps data disclosure usable when motion is reduced", async () => {
    setReducedMotion(true);
    const user = userEvent.setup();
    render(<ExpandableDataRow row={{ id: "row", label: "Alpha", detail: <p>Details</p> }} />);
    await user.click(screen.getByRole("button", { name: "Expand Alpha" }));
    expect(screen.getByRole("region", { name: "Alpha details" })).toHaveTextContent("Details");
  });
});
