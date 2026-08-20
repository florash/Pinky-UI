import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";

import { setReducedMotion } from "../../../vitest.setup";
import { GlowBorder } from "./effects/glow-border";
import { JellyCard } from "./cards/jelly-card";
import { MagneticButton } from "./buttons/magnetic-button";
import { EmailTemplate, emailTemplateHtml } from "./surfaces/email-template";
import { FlipDigits } from "./surfaces/flip-digits";

describe("signature components", () => {
  it("render their content", () => {
    render(
      <JellyCard>
        <h2>Elastic surface</h2>
      </JellyCard>,
    );
    expect(screen.getByRole("heading", { name: "Elastic surface" })).toBeInTheDocument();
  });

  it("renders Email Template's heading, body and a real anchor for the CTA", () => {
    render(
      <EmailTemplate
        brand="Pinky UI"
        eyebrow="Subscription confirmed"
        heading="You're on the list."
        body="No spam, unsubscribe any time."
        ctaLabel="Manage subscription"
        ctaHref="/settings"
        footer="Sent to you@example.com."
      />,
    );
    expect(screen.getByRole("heading", { name: "You're on the list." })).toBeInTheDocument();
    expect(screen.getByText("No spam, unsubscribe any time.")).toBeInTheDocument();
    const cta = screen.getByRole("link", { name: "Manage subscription" });
    expect(cta).toHaveAttribute("href", "/settings");
    expect(screen.getByText("Sent to you@example.com.")).toBeInTheDocument();
  });

  it("omits the CTA and footer for Email Template when not given", () => {
    render(<EmailTemplate heading="Welcome to Pinky UI" body="Your account is ready." />);
    expect(screen.queryByRole("link")).not.toBeInTheDocument();
  });

  it("renders emailTemplateHtml as a table-based document with escaped content and a real href", () => {
    const html = emailTemplateHtml({
      brand: "Pinky UI",
      eyebrow: "Order confirmed",
      heading: "Order <#4821> is on its way",
      body: "Track it & we'll email you.",
      ctaLabel: "View order",
      ctaHref: "https://pinkyui.com/orders/4821",
      footer: "Sent to you@example.com.",
    });
    expect(html).toContain("<table");
    expect(html).toContain('style="');
    expect(html).not.toMatch(/display:\s*flex|display:\s*grid/);
    expect(html).toContain("Order &lt;#4821&gt; is on its way");
    expect(html).toContain('href="https://pinkyui.com/orders/4821"');
    expect(html).toContain(">View order<");
  });

  it("omits emailTemplateHtml's optional blocks when not given", () => {
    const html = emailTemplateHtml({ heading: "Welcome", body: "Your account is ready." });
    expect(html).not.toContain("<a ");
  });

  it("hides Flip Digits' rolling strip from assistive tech and announces the settled value once", () => {
    const { container } = render(<FlipDigits value={1249} label="Members" />);
    expect(screen.getByText("Members: 1249")).toBeInTheDocument();
    expect(container.querySelector('[aria-hidden="true"]')).toBeTruthy();
  });

  it("rolls only the digit characters of a Flip Digits string value, passing separators through", () => {
    render(<FlipDigits value="00:12:45" label="Time remaining" />);
    expect(screen.getByText("Time remaining: 00:12:45")).toBeInTheDocument();
  });

  it("keeps Magnetic Button a real button", async () => {
    const user = userEvent.setup();
    const onClick = vi.fn();
    render(<MagneticButton onClick={onClick}>Get started</MagneticButton>);

    const button = screen.getByRole("button", { name: "Get started" });
    expect(button).toHaveAttribute("type", "button");

    // Reachable and operable from the keyboard, with no pointer involved.
    await user.tab();
    expect(button).toHaveFocus();
    await user.keyboard("{Enter}");
    expect(onClick).toHaveBeenCalledTimes(1);

    await user.click(button);
    expect(onClick).toHaveBeenCalledTimes(2);
  });

  it("does not let a disabled Magnetic Button fire", async () => {
    const user = userEvent.setup();
    const onClick = vi.fn();
    render(
      <MagneticButton disabled onClick={onClick}>
        Disabled
      </MagneticButton>,
    );

    await user.click(screen.getByRole("button", { name: "Disabled" }));
    expect(onClick).not.toHaveBeenCalled();
  });

  it("marks Glow Border's light as decorative", () => {
    const { container } = render(
      <GlowBorder>
        <p>Plan</p>
      </GlowBorder>,
    );

    const decorations = container.querySelectorAll("[aria-hidden='true']");
    expect(decorations.length).toBeGreaterThan(0);

    for (const decoration of decorations) {
      // Nothing readable or focusable may live inside the light layer — it is
      // scenery, and it must not be announced or reachable.
      expect(decoration.textContent).toBe("");
      expect(decoration.querySelector("a, button, input, [tabindex]")).toBeNull();
    }

    expect(screen.getByText("Plan")).toBeInTheDocument();
  });
});

describe("reduced motion", () => {
  it("still renders Jelly Card's content and surface", () => {
    setReducedMotion(true);
    render(
      <JellyCard>
        <p>Content survives</p>
      </JellyCard>,
    );

    expect(screen.getByText("Content survives")).toBeInTheDocument();
  });

  it("still announces Flip Digits' value with no roll", () => {
    setReducedMotion(true);
    render(<FlipDigits value={7} label="Count" />);
    expect(screen.getByText("Count: 7")).toBeInTheDocument();
  });

  it("leaves the Magnetic Button untransformed", () => {
    setReducedMotion(true);
    render(<MagneticButton>Anchored</MagneticButton>);

    const button = screen.getByRole("button", { name: "Anchored" });
    const wrapper = button.parentElement;
    expect(wrapper).not.toBeNull();
    // No pointer offset is written at all when motion is off.
    expect(wrapper?.style.transform ?? "none").toMatch(/^(none|)$/);
  });

  it("keeps tabs operable with motion disabled", async () => {
    setReducedMotion(true);
    const user = userEvent.setup();
    const { FluidTabs } = await import("./navigation/fluid-tabs");

    render(
      <FluidTabs
        aria-label="Views"
        items={[
          { id: "one", label: "One", content: <p>Panel one</p> },
          { id: "two", label: "Two", content: <p>Panel two</p> },
        ]}
      />,
    );

    await user.click(screen.getByRole("tab", { name: "Two" }));
    expect(screen.getByRole("tabpanel")).toHaveTextContent("Panel two");
  });
});
