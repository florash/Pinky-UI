# Cursor Spotlight

## Purpose

`CursorSpotlight` is a region-level light that follows the pointer across a hero, gallery or feature section. Unlike a spotlight card, it describes the whole region rather than selecting one card.

Choose `container` for a bounded section and `viewport` only for a deliberately atmospheric page background. Start with low intensity (about 0.15–0.35), a broad radius and a restrained tint. Do not use several high-contrast spotlights or place it over controls where it lowers text contrast.

The layer is decorative and pointer-transparent. Reduced motion and touch fall back to the readable children without the moving light. Check contrast against both the light and the unlit state; the spotlight must never carry meaning by itself.
