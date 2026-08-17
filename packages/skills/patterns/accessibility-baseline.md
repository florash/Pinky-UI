---
name: accessibility-baseline
description: Hard accessibility rules every Pinky UI component must meet — roles, keyboard contract, touch targets, focus visibility, tooltip content, hover fallback.
when: Writing or reviewing any interactive component, before deciding it's done.
avoid: Treating any rule here as optional for "just a demo" or "just a preview" component — the registry has no separate bar for those.
dependencies: touch-fallback, reduced-motion, mobile-gesture-conflicts, thumb-zone
---

# Accessibility Baseline

The floor every component in this library stands on, not a checklist for one component type. Where a rule already has its own skill with more detail, this page states the rule and links out rather than repeating it.

## Roles and ARIA, by category

These are the minimums observed and enforced across the existing registry. A component that doesn't fit a category cleanly should pick the closest one rather than inventing a new contract.

| Category | Baseline |
|---|---|
| Disclosure (accordion, collapsible panel, dropdown trigger) | Real `<button>` trigger, `aria-expanded`, `aria-controls` pointing at the panel's `id`. |
| Dialog / sheet / modal overlay | `role="dialog"`, `aria-modal="true"`, `aria-label` or `aria-labelledby`. Focus moves into it on open and returns to the trigger on close — never left on a removed element. |
| Non-modal floating surface (popover, context menu, peek panel) | `role` matching its semantics (`menu`, `listbox`, plain labelled region) — not `dialog`; it must not trap focus or block the rest of the page. |
| Toast / status message | `role="status"` for routine updates, `role="alert"` only for something the user must not miss. Never both roles on the same element. |
| Tooltip | See the dedicated rule below — it is stricter than "give it a role." |
| Combobox / command menu / autocomplete | `role="combobox"` on the input, `aria-expanded`, `aria-controls`, `aria-autocomplete`; the list is `role="listbox"` with `role="option"` children and `aria-selected`/`aria-selected` state tracked via an active-descendant or real focus move. |
| Tabs | `role="tablist"`/`role="tab"`/`role="tabpanel"`, `aria-selected` on the active tab, roving `tabIndex` (only the active tab is `0`). |
| Toggle / switch / segmented control | `role="radio"`/`role="switch"` as appropriate with `aria-checked`, or a real `<input>` — never a `<div>` with just a visual state and an `onClick`. |
| Slider / range / scrubber | `role="slider"` with `aria-valuemin`, `aria-valuemax`, `aria-valuenow`, and arrow-key support — not pointer-drag-only. |
| Decorative motion (glow, spotlight, cursor trail, border travel) | `aria-hidden="true"` on every purely visual layer. The content underneath carries the meaning by itself. |

If a component's real behavior doesn't match any row above, that's a signal to re-derive the right ARIA pattern from the WAI-ARIA APG rather than skip it.

## Keyboard contract

- **Escape** closes the nearest open overlay (popover, sheet, dialog, menu) and returns focus to what opened it. It never closes more than one layer at a time in a nested stack.
- **Arrow keys** move selection inside composite widgets (tabs, listboxes, menus, sliders, radio groups) — never `Tab`. `Tab` moves between widgets, arrows move within one.
- **No keyboard trap** outside a true modal. A modal dialog traps `Tab` inside itself while open; everything else must remain fully tab-reachable in and out.
- **Focus never lands on a removed element.** Anything that can unmount while focused or hovered (a filtered list row, a route change, a dismissed toast) must hand focus back to something real — see `useRestoreFocus`-style patterns already used throughout `packages/systems`.
- **Enter/Space activate**, matching native `<button>` behavior, whether or not the component is visually a button.

## Touch targets: 44×44, no exceptions

Every interactive element — button, link, tab, chip, row action — needs a real or effective hit area of at least 44×44 CSS pixels.

- Prefer sizing the element itself (`min-h-11 min-w-11` and friends are already the convention across `packages/systems`).
- Where the *visual* size must stay smaller than 44px (an icon in a dense toolbar, a swatch, a compact control), pad the hit area with a transparent `::before` instead of growing the icon — see `apps/website/src/components/site/theme-switch.tsx` for the reference implementation. Gate that padding on `[@media(pointer:coarse)]`, not viewport width: a narrow desktop window with a mouse doesn't need — and shouldn't get — an oversized, overlapping hit area.
- Never shrink a target to fit a layout. Fix the layout.

## Focus visibility

- Every interactive element gets a visible focus-visible state — the shared convention is `focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ink-900/20` (or `/25` with an offset on dark surfaces). `outline-none` alone, with nothing replacing it, is never acceptable.
- Focus rings are not optional under `prefers-reduced-motion: reduce`. With motion removed, color and outline are doing all of the feedback that hover and animation used to share — see [[reduced-motion]].
- Don't rely on `:hover` styling to imply focus state. They're independent and both need to be visibly correct.

## Tooltip: hard rules

`Tooltip` (`packages/systems/src/overlays/tooltip.tsx`) is the one component on this list with rules stricter than its category baseline, because it's the easiest place to accidentally gate real information behind a hover-only, no-hover-capable-pointer-blind affordance:

1. **A tooltip must never carry the only copy of any information.** If removing the tooltip would make the trigger's purpose unclear or hide a value the user needs, that content belongs in visible text, not a tooltip.
2. **An icon-only trigger must have its own `aria-label`.** The tooltip's content is not a substitute for the trigger's accessible name — a screen reader user tabbing past the control needs to know what it does before any tooltip logic runs at all.
3. Tooltip already degrades correctly for no-hover-capable pointers (tap opens, outside tap or Escape closes, `usePointerCapability()`-gated) — that's the *mechanism*, not a license to put anything essential inside it.

## Hover effects need a touch-reachable equivalent

Every hover-triggered behavior — reveal, preview, dim, spotlight, tilt — needs one of:

- a working tap/focus path to the same outcome, or
- a graceful flatten to its resting, fully-usable state on a pointer that can't hover.

Gate the decision on `usePointerCapability()` (`{ hasHover, isFine, isTouch }`, `@pinky-ui/primitives`) — never `'ontouchstart' in window`, and never a viewport-width breakpoint. Both give false answers on real hardware: a hybrid laptop has `ontouchstart` and a mouse at the same time, and a narrow *desktop* browser window is still a mouse. Full detail, examples and a component-by-component fallback table: [[touch-fallback]].

One known internal exception, not yet reconciled: `useCompactLayout()` (`packages/layouts/src/internal/use-compact-layout.ts`) currently OR's `(max-width: 767px)` with `(pointer: coarse)` — the exact width-based judgment this rule forbids. It predates `usePointerCapability` and hasn't been migrated yet. Don't copy its pattern into new code; new hover-capability decisions go through `usePointerCapability()` only. `scripts/check-hover-coverage.mjs` currently catches direct `matchMedia("(hover: hover)"/"(pointer: fine)")` calls outside the canonical hook file — it does not yet catch this width-OR-pointer pattern.

## A note on hardware coverage

`usePointerCapability`'s live-updating behavior (a two-in-one device gaining or losing a mouse mid-session) is correct by API contract — `matchMedia(...).addEventListener("change", ...)` on both `(hover: hover)` and `(pointer: fine)` — but **this path has not been verified on real two-in-one hardware**, only reasoned about from the spec. If you have a Surface, an iPad with a trackpad, or similar, a manual pass (plug/unplug a mouse mid-session, watch a hover-gated component) is worth doing before leaning on this guarantee for something load-bearing.

## Related

[[touch-fallback]], [[reduced-motion]], [[mobile-gesture-conflicts]], [[thumb-zone]], [[cursor-etiquette]]
