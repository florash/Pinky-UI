# Ripple Button

## Purpose

Use Ripple Button when a button should answer **where** it was pressed. One soft
surface expands from the press point under a whole-button compression that
rebounds on a spring. It is not a Material ripple: no hard circle, no long fade.

## Good for

- form submits and primary actions
- dense toolbars, where magnetism would fight neighbouring buttons
- touch-first interfaces, where press feedback matters most

## Avoid for

- isolated hero CTAs — Magnetic Button suits those better
- designs where a ripple would read as Material and clash

## Recommended defaults

`pressScale={0.96}`. Below about `0.92` the button feels like it is collapsing
rather than compressing. Keep the ripple colour low-contrast against the button
surface; it is feedback, not decoration.

## Accessibility

- A real `<button>` with all native attributes forwarded.
- Keyboard activation produces the same compression and a centred ripple, so
  Space and a click feel like the same button. This is the detail most ripple
  implementations skip.
- Ripples are `aria-hidden` and cannot intercept clicks.
- Disabled buttons produce no ripple and no press response.

## Performance

Each ripple is one element with a fixed lifetime, removed on a timer rather than
on animation end so an unmounted button leaves nothing behind. Rapid clicking
produces a bounded number of short-lived elements.

## Composition

Choose one press language per screen: Ripple Button for dense or touch-first
UI, Magnetic Button for spacious hero moments. Mixing them in the same toolbar
makes buttons feel inconsistent.
