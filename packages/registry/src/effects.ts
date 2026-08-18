import type { DiscoveryMetadata } from "./types";

/**
 * Isolated Milestone 2.6 metadata. The main registry remains untouched while
 * the layouts workstream is active; this module is the later merge point.
 */
export type EffectFamily = "cursor" | "motion" | "text" | "scroll";

export type EffectRegistryEntry = {
  slug: string;
  name: string;
  family: EffectFamily;
  description: string;
  importPath: "@pinky-ui/effects";
  skill: string;
  usage: string;
  whenToUse: string[];
  whenNotToUse: string[];
  discovery?: DiscoveryMetadata;
};

const entry = (
  family: EffectFamily,
  slug: string,
  name: string,
  description: string,
  skill = slug,
  discovery?: DiscoveryMetadata,
): EffectRegistryEntry => ({
  slug,
  name,
  family,
  description,
  importPath: "@pinky-ui/effects",
  skill,
  usage: `<${name.replace(/\s+/g, "")} />`,
  whenToUse: ["As a restrained enhancement to meaningful content."],
  whenNotToUse: ["When the content or control would be unclear without motion."],
  discovery,
});

export const cursorEffects: EffectRegistryEntry[] = [
  entry("cursor", "soft-cursor", "Soft Cursor", "A small core and spring-lagging follower."),
  entry("cursor", "cursor-trail", "Cursor Trail", "A capped, short-lived trail of dots or bubbles."),
  entry("cursor", "image-trail", "Image Trail", "Images that appear during a fast pointer sweep."),
  entry("cursor", "cursor-spotlight", "Cursor Spotlight", "A subtle region-level light following the pointer."),
  entry("cursor", "liquid-cursor", "Liquid Cursor", "A velocity-aware squash-and-stretch follower."),
  entry("cursor", "cursor-blob", "Cursor Blob", "A slow ambient blob behind the page content."),
  entry("cursor", "cursor-text", "Cursor Text", "A contextual label for a meaningful target."),
  entry("cursor", "hover-image-preview", "Hover Image Preview", "A floating preview for a focused list row."),
  entry("cursor", "lens-cursor", "Lens Cursor", "A small local magnifier for media."),
  entry("cursor", "magnetic-cursor-target", "Magnetic Cursor Target", "Composition of Magnetic and CursorTarget."),
  entry("cursor", "cursor-blend", "Cursor Blend", "A mix-blend-mode:difference circle that inverts against whatever it crosses."),
  entry("cursor", "link-preview", "Link Preview", "A floating thumbnail-and-summary card for a hovered or focused link."),
];

export const motionEffects: EffectRegistryEntry[] = [
  entry("motion", "blur-reveal", "Blur Reveal", "A low-blur, low-travel in-view entrance.", "blur-reveal", {
    role: "canonical",
    note: "Canonical quiet entrance for readable content.",
  }),
  entry("motion", "spring-reveal", "Spring Reveal", "A generic spring entrance preset for Blur Reveal's in-view reading pattern.", "spring-reveal", {
    role: "preset",
    canonicalSlug: "blur-reveal",
    note: "Use when the spring settle is the point; Blur Reveal is the canonical quiet entrance.",
  }),
  entry("motion", "mask-reveal", "Mask Reveal", "A directional clipping reveal.", "mask-reveal", {
    role: "canonical",
    note: "Canonical clipping reveal for editorial and media surfaces.",
  }),
  entry("motion", "stagger-reveal", "Stagger Reveal", "A parent-driven sequence for child content."),
  entry("motion", "image-reveal", "Image Reveal", "A media-specific mask, scale and focus preset of Mask Reveal.", "image-reveal", {
    role: "preset",
    canonicalSlug: "mask-reveal",
    note: "Use for supplied media; choose Mask Reveal when the child surface is not specifically an image.",
  }),
  entry("motion", "liquid-loader", "Liquid Loader", "A small accessible loading/progress indicator."),
  entry("motion", "edge-highlight", "Edge Highlight", "A local hairline responds to the side nearest the pointer."),
  entry("motion", "surface-compression", "Surface Compression", "A tactile press compresses elevation and inset depth."),
  entry("motion", "depth-shift", "Depth Shift", "A small group of planes separates as one surface responds to proximity."),
  entry("motion", "border-travel", "Border Travel", "One restrained border segment travels along the nearest edge."),
  entry("motion", "content-swap-motion", "Content Swap Motion", "Keyed content changes hand off with directional clipping and travel."),
  entry("motion", "sibling-dim", "Sibling Dim", "Hovering or focusing one item in a group fades the rest back."),
  // `shared-morph` used to be listed here. It never had an implementation or an
  // export — it was guidance for the existing `Morph` primitive. It now lives
  // where guidance belongs, in the shared Skills catalogue, so
  // the catalogue only advertises things you can actually import.
];

export const textEffects: EffectRegistryEntry[] = [
  entry("text", "split-text-reveal", "Split Text Reveal", "Stable word, character or line entrance. The canonical text reveal — Word Stagger and Character Stagger are its presets.", "split-text-reveal", {
    role: "canonical",
    note: "Choose the split mode with `by`; named stagger entries are convenience presets.",
  }),
  entry("text", "word-stagger", "Word Stagger", "Preset of Split Text Reveal: `by=\"word\"`. No additional behaviour.", "word-stagger", {
    role: "preset",
    canonicalSlug: "split-text-reveal",
    note: "Named word preset; use Split Text Reveal when the split mode is part of the decision.",
  }),
  entry("text", "character-stagger", "Character Stagger", "Preset of Split Text Reveal: `by=\"character\"`. No additional behaviour.", "character-stagger", {
    role: "preset",
    canonicalSlug: "split-text-reveal",
    note: "Named character preset for short display text; use Split Text Reveal for other modes.",
  }),
  entry("text", "hover-text-reveal", "Hover Text Reveal", "A focused alternate label transition."),
  entry("text", "text-scramble", "Text Scramble", "A brief decorative decode effect."),
  entry("text", "kinetic-underline", "Kinetic Underline", "A small hover and focus underline motion."),
];

export const scrollEffects: EffectRegistryEntry[] = [
  entry("scroll", "scroll-reveal", "Scroll Reveal", "A shared-observer viewport entrance."),
  entry("scroll", "parallax-section", "Parallax Section", "Restrained section-level scroll depth."),
  entry("scroll", "sticky-story", "Sticky Story", "A sticky visual with normal-flow story steps."),
  entry("scroll", "scroll-progress", "Scroll Progress", "Page or container reading progress."),
  entry("scroll", "horizontal-story", "Horizontal Story", "Conservative vertical-to-horizontal panels."),
];

export const effects = {
  cursor: cursorEffects,
  motion: motionEffects,
  text: textEffects,
  scroll: scrollEffects,
};

export const allEffects = [...cursorEffects, ...motionEffects, ...textEffects, ...scrollEffects];
