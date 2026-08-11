# Glow Border

## Purpose

Use Glow Border to make a surface's edge respond to an approaching pointer. It
frames something without moving it, which makes it the safest way to add life to
a card that must stay still.

## Good for

- pricing and plan cards
- the selected item in a set
- framing a single hero surface

## Avoid for

- every card on a page — the effect stops meaning anything
- the sole indicator of selection or focus
- low-contrast text, where the light reduces legibility

## Recommended defaults

`thickness={1.5} size={260} intensity={1}`. Match `radius` to the content it
wraps or the ring will not sit on the border.

Scale `size` to the element: on a small chip, a 260px pool lights the whole
outline at once and the "local illumination" idea is lost. Roughly two-thirds of
the element's width is a good starting point.

Use `active` for selected states, and always pair it with a real signal —
`aria-selected`, `aria-current`, or text.

## Accessibility

- The lit ring is `aria-hidden` and `pointer-events: none`.
- It adds no layout box, so it cannot shift content.
- Never the only signal for selection or focus.

## Performance

The ring is one masked gradient element. The pointer writes two CSS variables;
opacity is rounded so a resting pointer produces no style writes at all. Idle
cost is effectively zero.

## Composition

Wrap Jelly Card, Liquid Card or a plain surface. Distinguish it from Spotlight
Card: Glow Border lights the *edge*, Spotlight lights the *face*. Using both on
the same card is usually one effect too many.
