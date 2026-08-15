# Tilt Card

## Purpose

Use Tilt Card when a surface should behave like a solid object catching light.
Where Jelly Card is soft, Tilt Card is rigid: it rotates to face the pointer and
can float a foreground layer above its face.

## Good for

- media covers, album art, product shots
- cards with a badge or title that benefits from separation
- one showcase surface in a section

## Avoid for

- text-heavy cards
- grids where several would tilt at once
- small cards, where rotation reads as a wobble

## Recommended defaults

`max={4}`, the house limit. Larger rotations make body text measurably harder to
read and start to look like a template effect rather than a considered one. Use
`parallax={0.6}` for a badge or title; higher values separate the layer so far it
stops belonging to the card.

## Accessibility

- Transform-only, so surrounding layout never shifts.
- Glare and parallax layers are decorative and non-interactive.
- Pointer tilt is skipped for touch input; the layered card remains stable and
  readable while the page keeps its vertical pan.
- Reduced motion keeps the same flat layered fallback.
- Keep rotation low when the card carries reading content.

## Performance

One pointer handler drives both the tilt and every parallax layer, so a
multi-layer card costs the same as a flat one. The glare is a single gradient.

## Composition

Do not nest Jelly inside Tilt or vice versa — two rotation systems on one
surface fight, and the result reads as a bug. Tilt plus a Spotlight face light
is a good pairing; Tilt plus Glow Border plus Spotlight is too much.
