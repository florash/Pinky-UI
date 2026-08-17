# Tooltip

## Purpose

A short, non-interactive label for a control — nothing more. Use it to
clarify an icon-only button or an ambiguous action, and nothing that needs
its own actions or focus.

## Interaction anatomy

- A single trigger element owns the tooltip via `aria-describedby`.
- Opens on hover after a short delay, and immediately on focus.
- Closes on blur, mouse leave, or the trigger unmounting.
- Position is measured once on open and clamped to the viewport; it does not
  track continuously.

## Good for

- Clarifying an icon-only button, a truncated label, or an abbreviation
- Supplementary context that is genuinely optional to read

## Avoid for

- Anything interactive — links, buttons, forms — inside the bubble; that's
  [[adaptive-popover]]
- Content a touch user must be able to reach; hover has no touch equivalent,
  so nothing essential can live only in a tooltip
- Long explanations; if it needs more than a line, it needs a popover

## Usage

```tsx
<Tooltip content="Copy to clipboard">
  <button aria-label="Copy">
    <CopyIcon />
  </button>
</Tooltip>
```

## Accessibility

- `role="tooltip"` and `aria-describedby` connect the label to its trigger
  the standard way — no custom ARIA pattern to learn.
- Keyboard focus opens it exactly like hover does; there is no
  keyboard-only path that misses it.
- Because it's non-interactive, nothing essential should ever live only
  inside a tooltip.

## Performance

Position is measured once per open, not on every frame or scroll event —
there's no `ResizeObserver` or continuous tracking loop running while it's
visible.

## Composes with

Magnetic Button and other icon-only controls, where the label clarifies an
action without adding visible chrome. Reach for Adaptive Popover the moment
the bubble needs to do more than label something.
