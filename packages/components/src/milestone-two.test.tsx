import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";

import { setReducedMotion } from "../../../vitest.setup";
import { ElasticToggle } from "./controls/elastic-toggle";
import { FloatingDock } from "./navigation/floating-dock";
import { GooeyMenu } from "./navigation/gooey-menu";
import { LiquidCard } from "./cards/liquid-card";
import { RippleButton } from "./buttons/ripple-button";
import { SpotlightCard } from "./cards/spotlight-card";
import { TiltCard } from "./cards/tilt-card";

const DOCK_ITEMS = [
  { id: "home", label: "Home", icon: <span />, href: "/" },
  { id: "work", label: "Work", icon: <span />, href: "/work", active: true },
  { id: "notes", label: "Notes", icon: <span />, href: "/notes" },
];

describe("FloatingDock", () => {
  it("is a navigation landmark of real links", () => {
    render(<FloatingDock items={DOCK_ITEMS} aria-label="Main" />);

    expect(screen.getByRole("navigation", { name: "Main" })).toBeInTheDocument();
    expect(screen.getAllByRole("link")).toHaveLength(3);
  });

  it("gives every item a permanent accessible name", () => {
    render(<FloatingDock items={DOCK_ITEMS} labels={false} />);

    // Labels are off, so the name must come from the item itself.
    for (const item of DOCK_ITEMS) {
      expect(screen.getByRole("link", { name: item.label })).toBeInTheDocument();
    }
  });

  it("marks the active item", () => {
    render(<FloatingDock items={DOCK_ITEMS} />);
    expect(screen.getByRole("link", { name: "Work" })).toHaveAttribute("aria-current", "page");
    expect(screen.getByText("Work")).toBeVisible();
  });

  it("is reachable by keyboard with no pointer proximity", async () => {
    const user = userEvent.setup();
    render(<FloatingDock items={DOCK_ITEMS} />);

    await user.tab();
    expect(screen.getByRole("link", { name: "Home" })).toHaveFocus();
    await user.tab();
    expect(screen.getByRole("link", { name: "Work" })).toHaveFocus();
  });

  it("activates buttons without an href", async () => {
    const user = userEvent.setup();
    const onSelect = vi.fn();
    render(
      <FloatingDock items={[{ id: "a", label: "Action", icon: <span />, onSelect }]} />,
    );

    await user.click(screen.getByRole("button", { name: "Action" }));
    expect(onSelect).toHaveBeenCalledTimes(1);
  });

  it("stays usable with motion disabled", () => {
    setReducedMotion(true);
    render(<FloatingDock items={DOCK_ITEMS} />);
    expect(screen.getAllByRole("link")).toHaveLength(3);
  });
});

describe("ElasticToggle", () => {
  it("is a switch with a name and a state", () => {
    render(<ElasticToggle label="Notifications" />);

    const toggle = screen.getByRole("switch", { name: "Notifications" });
    expect(toggle).toHaveAttribute("aria-checked", "false");
    expect(toggle).toHaveClass("focus-visible:ring-2");
  });

  it("toggles on click", async () => {
    const user = userEvent.setup();
    const onCheckedChange = vi.fn();
    render(<ElasticToggle label="Sounds" onCheckedChange={onCheckedChange} />);

    await user.click(screen.getByRole("switch", { name: "Sounds" }));

    expect(onCheckedChange).toHaveBeenCalledWith(true);
    expect(screen.getByRole("switch", { name: "Sounds" })).toHaveAttribute("aria-checked", "true");
  });

  it("toggles from the keyboard", async () => {
    const user = userEvent.setup();
    render(<ElasticToggle label="Sounds" />);

    await user.tab();
    const toggle = screen.getByRole("switch", { name: "Sounds" });
    expect(toggle).toHaveFocus();

    await user.keyboard(" ");
    expect(toggle).toHaveAttribute("aria-checked", "true");
    await user.keyboard("{Enter}");
    expect(toggle).toHaveAttribute("aria-checked", "false");
  });

  it("respects a controlled value", async () => {
    const user = userEvent.setup();
    const onCheckedChange = vi.fn();
    render(<ElasticToggle label="Sounds" checked={false} onCheckedChange={onCheckedChange} />);

    await user.click(screen.getByRole("switch", { name: "Sounds" }));

    expect(onCheckedChange).toHaveBeenCalledWith(true);
    expect(screen.getByRole("switch", { name: "Sounds" })).toHaveAttribute("aria-checked", "false");
  });

  it("does nothing when disabled", async () => {
    const user = userEvent.setup();
    const onCheckedChange = vi.fn();
    render(<ElasticToggle label="Sounds" disabled onCheckedChange={onCheckedChange} />);

    await user.click(screen.getByRole("switch", { name: "Sounds" }));
    expect(onCheckedChange).not.toHaveBeenCalled();
  });
});

describe("RippleButton", () => {
  it("activates from the keyboard", async () => {
    const user = userEvent.setup();
    const onClick = vi.fn();
    render(<RippleButton onClick={onClick}>Save</RippleButton>);

    await user.tab();
    expect(screen.getByRole("button", { name: "Save" })).toHaveFocus();

    await user.keyboard("{Enter}");
    expect(onClick).toHaveBeenCalledTimes(1);
    await user.keyboard(" ");
    expect(onClick).toHaveBeenCalledTimes(2);
  });

  it("does not fire when disabled", async () => {
    const user = userEvent.setup();
    const onClick = vi.fn();
    render(
      <RippleButton disabled onClick={onClick}>
        Save
      </RippleButton>,
    );

    await user.click(screen.getByRole("button", { name: "Save" }));
    expect(onClick).not.toHaveBeenCalled();
  });

  it("forwards native button attributes", () => {
    render(<RippleButton type="submit">Submit</RippleButton>);
    expect(screen.getByRole("button", { name: "Submit" })).toHaveAttribute("type", "submit");
  });
});

describe("GooeyMenu", () => {
  const ITEMS = [
    { id: "work", label: "Work" },
    { id: "studio", label: "Studio" },
    { id: "contact", label: "Contact" },
  ];

  it("is a navigation landmark and marks the current item", async () => {
    const user = userEvent.setup();
    render(<GooeyMenu items={ITEMS} aria-label="Sections" />);

    expect(screen.getByRole("navigation", { name: "Sections" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Work" })).toHaveAttribute("aria-pressed", "true");

    await user.click(screen.getByRole("button", { name: "Studio" }));
    expect(screen.getByRole("button", { name: "Studio" })).toHaveAttribute("aria-pressed", "true");
    expect(screen.getByRole("button", { name: "Work" })).toHaveAttribute("aria-pressed", "false");
  });

  it("exposes button selection as pressed state", async () => {
    const user = userEvent.setup();
    render(<GooeyMenu items={ITEMS} />);
    const studio = screen.getByRole("button", { name: "Studio" });

    expect(screen.getByRole("button", { name: "Work" })).toHaveAttribute("aria-pressed", "true");
    await user.click(studio);
    expect(studio).toHaveAttribute("aria-pressed", "true");
  });

  it("reports selection changes", async () => {
    const user = userEvent.setup();
    const onValueChange = vi.fn();
    render(<GooeyMenu items={ITEMS} onValueChange={onValueChange} />);

    await user.click(screen.getByRole("button", { name: "Contact" }));
    expect(onValueChange).toHaveBeenCalledWith("contact");
  });
});

describe("surfaces render their content", () => {
  it("Liquid Card", () => {
    render(
      <LiquidCard>
        <h2>Premium</h2>
      </LiquidCard>,
    );
    expect(screen.getByRole("heading", { name: "Premium" })).toBeInTheDocument();
  });

  it("Spotlight Card", () => {
    render(
      <SpotlightCard>
        <h2>Calm</h2>
      </SpotlightCard>,
    );
    expect(screen.getByRole("heading", { name: "Calm" })).toBeInTheDocument();
  });

  it("Tilt Card, including its foreground layer", () => {
    render(
      <TiltCard foreground={<span>Badge</span>}>
        <h2>Cover</h2>
      </TiltCard>,
    );
    expect(screen.getByRole("heading", { name: "Cover" })).toBeInTheDocument();
    expect(screen.getByText("Badge")).toBeInTheDocument();
  });

  it("Liquid Card keeps its content with motion disabled", () => {
    setReducedMotion(true);
    render(
      <LiquidCard>
        <p>Still readable</p>
      </LiquidCard>,
    );
    expect(screen.getByText("Still readable")).toBeInTheDocument();
  });
});
