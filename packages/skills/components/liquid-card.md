# Liquid Card

## Purpose

Use Liquid Card for premium feature surfaces where transparency, depth and
pointer-responsive lighting add meaningful hierarchy. It is glass used as a
hierarchy tool, not as a texture.

## Good for

- landing page feature cards
- product highlights and pricing surfaces
- creative portfolios
- cards floating over imagery or a coloured field

## Avoid for

- dense admin dashboards
- long text-heavy blocks
- critical forms
- large repeated data grids

## Recommended defaults

`intensity={0.2} blur={18} tint="clear"`. Prefer the Soft preset
(`blur={10} intensity={0.14}`) over busy backgrounds.

Never make content readability depend on transparency. If the card sits over
unpredictable user content, either raise the tint or set `blur={0}` and use an
opaque surface — an unreadable card is a failed card regardless of how it looks
in a screenshot.

Do not reach for rainbow chromatic aberration, animated wobble, or a large
mouse-following gradient. Liquid Card is about light on a surface, not about the
surface pretending to be water.

## Accessibility

- Preserve readable contrast; the tint exists so text is not sitting on raw
  transparency.
- Support reduced motion: the light stops tracking, everything else stays.
- Never require pointer movement to understand the card.
- Maintain semantic content structure inside.

## Performance

`backdrop-filter` is the single most expensive thing in this library. One or two
Liquid Cards per screen is fine; a grid of them will drop frames on mobile
Safari and low-end Android. When in doubt, set `blur={0}` — the highlight and
edge refraction still work, and the card still looks like Pinky UI.

## Composition

Works well with Glow Border, Magnetic and Spotlight.

Avoid combining every effect at maximum intensity — a liquid, tilting, glowing,
magnetic card is four ideas competing for the same attention.
