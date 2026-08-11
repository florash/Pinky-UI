# Spotlight Card

## Purpose

Use Spotlight Card when a surface should acknowledge the pointer without moving.
Light falls on the face of the card and nothing else happens. It is the calm
member of the card family and usually the correct default in a grid.

## Good for

- grids of many cards, where per-card motion would be noise
- documentation and content surfaces
- anywhere Jelly Card would be too much

## Avoid for

- hero surfaces — it is deliberately quiet
- photography, where the light gets lost against the image

## Recommended defaults

`size={300} intensity={0.5}`. Use `color="var(--color-cloud-100)"` for a cooler
surface. Keep intensity below about `0.7` — past that the light stops reading as
illumination and starts reading as a coloured overlay.

## Accessibility

- The light layer is `aria-hidden` and non-interactive.
- Nothing moves, so it is safe next to body text and in dense layouts.
- Never used as the only signal of state.

## Performance

The cheapest interactive surface in the library: one gradient, two CSS
variables, no transforms and no layout reads. Safe to use on many cards at once
— which is exactly why it exists.

## Composition

The natural partner to Jelly Card: use one Jelly Card as the feature and
Spotlight Cards for the rest of the grid. Do not add Glow Border on top —
lighting the face and the edge at once doubles the effect and halves the point.
