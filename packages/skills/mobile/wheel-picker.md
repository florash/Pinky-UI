# Wheel Picker

## Purpose

A scrollable value picker with a fixed centre selection window — the
familiar time/date picker interaction, built on native scroll-snap rather
than a custom physics loop.

## Use when

Choosing one value from a short, ordered set — hours, quantities, durations
— where scrolling through options feels more natural than a dropdown or a
row of buttons.

## Avoid

- Long or unbounded option sets; scroll-snap stays legible for a few dozen
  items, not hundreds
- Multi-select — this is a single-value picker
- Free-form numeric entry where a native number input is more direct

## Interaction

Momentum and inertia are the browser's own `scroll-snap-type: y mandatory`
behaviour, not simulated physics — this is deliberate: the platform already
does this correctly and consistently across touch and trackpad. A short
debounce after scrolling settles reads the centred item and commits it.

## Accessibility

`role="listbox"` with `role="option"` children and `aria-selected` on the
current value. Arrow Up/Down move one item, Home/End jump to the ends —
the picker is fully usable without a scroll gesture.

## Reduced motion

Programmatic scrolling (keyboard selection, `value` changes) uses instant
scroll rather than smooth scroll when motion is reduced; the centre
selection window itself never animates.

## Composition and anti-patterns

Don't wrap picker items in Jelly or Tilt — a wheel full of independently
wobbling rows fights the platform-native scroll feel this component exists
to preserve.
