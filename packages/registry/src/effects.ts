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
  importPath: "@pinky/effects";
  skill: string;
  usage: string;
  whenToUse: string[];
  whenNotToUse: string[];
};

const entry = (
  family: EffectFamily,
  slug: string,
  name: string,
  description: string,
  skill = slug,
): EffectRegistryEntry => ({
  slug,
  name,
  family,
  description,
  importPath: "@pinky/effects",
  skill,
  usage: `<${name.replace(/\s+/g, "")} />`,
  whenToUse: ["As a restrained enhancement to meaningful content."],
  whenNotToUse: ["When the content or control would be unclear without motion."],
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
];

export const motionEffects: EffectRegistryEntry[] = [
  entry("motion", "blur-reveal", "Blur Reveal", "A low-blur, low-travel in-view entrance."),
  entry("motion", "spring-reveal", "Spring Reveal", "A generic Pinky spring entrance."),
  entry("motion", "mask-reveal", "Mask Reveal", "A directional clipping reveal."),
  entry("motion", "stagger-reveal", "Stagger Reveal", "A parent-driven sequence for child content."),
  entry("motion", "image-reveal", "Image Reveal", "A media-specific mask, scale and focus entrance."),
  entry("motion", "liquid-loader", "Liquid Loader", "A small accessible loading/progress indicator."),
  entry("motion", "shared-morph", "Shared Morph", "Guidance for the existing shared-element Morph primitive.", "shared-morph"),
];

export const textEffects: EffectRegistryEntry[] = [
  entry("text", "split-text-reveal", "Split Text Reveal", "Stable word, character or line entrance."),
  entry("text", "word-stagger", "Word Stagger", "A focused word-level reveal."),
  entry("text", "character-stagger", "Character Stagger", "A short-heading character reveal."),
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
