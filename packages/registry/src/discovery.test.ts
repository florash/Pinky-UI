import { describe, expect, it } from "vitest";

import { allEffects, allProductSystems, allWorkflowSystems, components, mobileSystems, primitives } from "./index";

const entries = [...components, ...allEffects, ...allProductSystems, ...allWorkflowSystems, ...primitives];

describe("public discovery canonicalization", () => {
  it("points every preset or secondary relation at one existing entry", () => {
    for (const entry of entries) {
      const canonicalSlug = entry.discovery?.canonicalSlug;
      if (!canonicalSlug) continue;

      const matches = entries.filter((candidate) => candidate.slug === canonicalSlug);
      expect(matches, `${entry.slug} canonical target`).toHaveLength(1);
      expect(entry.discovery?.role, `${entry.slug} discovery role`).not.toBe("canonical");
    }
  });

  it("keeps the named consolidations visible without duplicating canonical entries", () => {
    const roles = new Map(entries.map((entry) => [entry.slug, entry.discovery?.role]));

    expect(roles.get("inline-edit-field")).toBe("canonical");
    expect(roles.get("inline-edit-morph")).toBe("preset");
    expect(roles.get("split-text-reveal")).toBe("canonical");
    expect(roles.get("word-stagger")).toBe("preset");
    expect(roles.get("character-stagger")).toBe("preset");
    expect(roles.get("mask-reveal")).toBe("canonical");
    expect(roles.get("image-reveal")).toBe("preset");
    expect(roles.get("expandable-data-row")).toBe("canonical");
    expect(roles.get("progressive-step-workflow")).toBe("canonical");
    expect(roles.get("multi-step-progress")).toBe("preset");
    expect(roles.get("cursor")).toBe("canonical");
    expect(roles.get("glow")).toBe("secondary");
  });

  it("registers the mobile-first expansion as distinct canonical workflow systems", () => {
    const expected = [
      "floating-tab-bar",
      "contextual-bottom-bar",
      "scroll-compact-bottom-nav",
      "sticky-bottom-cta",
      "floating-action-island",
      "swipe-to-confirm",
      "search-morph-header",
      "keyboard-aware-composer",
      "mobile-selection-bar",
      "progressive-auth-surface",
      "auth-completion-morph",
      "morphing-bottom-navigation",
      "bottom-search-sheet",
      "detent-sheet",
      "long-press-selection",
      "progressive-mobile-form",
      "fullscreen-media-morph",
      "quick-action-sheet",
    ];
    const mobile = allWorkflowSystems.filter((entry) => entry.family === "mobile");
    expect(mobileSystems).toHaveLength(54);
    expect(mobile).toHaveLength(54);
    expect(expected.every((slug) => mobile.some((entry) => entry.slug === slug && entry.discovery?.role === "canonical"))).toBe(true);
  });
});
