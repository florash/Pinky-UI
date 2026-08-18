# Touch fallback audit

A pass over every hover-dependent interaction in the codebase, checked
against the house rule in [`packages/skills/patterns/touch-fallback.md`](../packages/skills/patterns/touch-fallback.md):
nothing may be reachable only through hover.

## Method

1. `onMouseEnter`/`onMouseLeave` usage — 3 hits, all reviewed individually.
2. Tailwind reveal patterns (`opacity-0 … group-hover:opacity-100`,
   `hidden group-hover:block`, `invisible group-hover:visible`) — the
   fingerprint of "hidden until hover" content.
3. Every `hover:` class site checked for a companion `useCompactLayout`,
   `pointerType` guard, `onFocus`, or `@media (hover: hover)` gate.
4. The `cursor/` effects family (ambient pointer-follow effects, inherently
   desktop-only by nature) checked for graceful no-op on touch rather than a
   full interaction fallback, since there is no touch equivalent of "ambient
   light follows the cursor" to provide.

## Findings

### Fixed

- **Perspective Bento** (`packages/layouts/src/editorial/perspective-bento.tsx`)
  — the per-item label pill was shown via a plain CSS `group-hover:opacity-100`
  rule, while the component's own `active`/`focused` React state (used for the
  depth animation) was tracked separately and never wired to the pill. Result:
  keyboard focus already produced the depth lift but never revealed the label
  — the exact "reachable by pointer only" gap the house rule exists to catch.
  Fixed by driving the pill's visibility off the same `focused` state, plus
  showing it unconditionally on compact/touch layouts.

### Reviewed, no change needed

- **Split-Screen Gallery**, **Cinematic Horizontal Gallery** — their
  `group-hover:opacity-100` overlays are `aria-hidden` gradient tints with
  `pointer-events-none`; no text or functionality lives inside them, so
  there's nothing for a touch or keyboard user to miss.
- **Interactive Bar Ranking**, **Tooltip**, **expanded-navigation** (the only
  three `onMouseEnter`/`onMouseLeave` call sites outside effects) — all pair
  the mouse handlers with `onFocus`/`onBlur`, so keyboard access already
  matches hover access. Tooltip is hover/focus-only by design (see its own
  skill doc — it's a label, not a place to put anything essential).
- **`cursor/*` effects** (`cursor-spotlight`, `cursor-blob`, `cursor-trail`,
  `lens-cursor`, `liquid-cursor`, `soft-cursor`, `cursor-text`, `image-trail`,
  `hover-image-preview`, `magnetic-cursor-target`) — all check
  `useMotionEnabled`/`pointerType`/compact layout and degrade to a plain,
  fully-functional surface on touch. These are ambient pointer atmosphere,
  not content gates, so "fallback" means "does nothing and doesn't block
  the tap," which all ten already do.
- Every other `hover:` class site found (buttons, menu triggers, tactile
  controls, tabs, dock, gooey menu, ~30 files) uses hover only for a
  decorative style change — colour, shadow, scale — on an element that is
  already fully clickable/tappable regardless of hover state. No fallback is
  needed because nothing is gated.

## Net result

One real gap found and fixed. The rest of the system already follows its own
[[touch-fallback]] rule consistently — the `pointerType !== "touch"` guard on
primitives like `Magnetic`, `Spotlight` and `Tilt`, paired with
`useCompactLayout()` at the layout level, is doing its job.
