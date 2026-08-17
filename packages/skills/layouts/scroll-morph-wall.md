# Scroll Morph Wall

## Purpose

A gallery whose arrangement is a function of scroll. Items read as a plain
grid at rest, gather into a ring mid-scroll, and settle into a fanned deck by
the end — one continuous interpolation off `scrollYProgress`, not three
layouts swapped at a breakpoint.

## Good for

- a signature hero or showcase moment for a small curated set
- sections meant to reward scrolling with a payoff, not just reveal content
- portfolio, launch and story pages where one memorable scroll beat earns its
  screen space

## Avoid for

- long or unbounded collections — use Masonry Gallery
- utility browsing where people need to compare items quickly, not watch them
  move
- anywhere the page is already scroll-heavy with other pinned sections; one
  scroll-driven set piece per page is the house limit

## How many items

Four to nine. The ring and fan positions are legible in that range; past it
the deck crowds and the transformation stops reading as deliberate.

## Mobile

Falls back to a static two-column grid — no sticky section, no scroll
hijacking. The transformation is the enhancement; the collection itself is
the content, and touch scroll should never be intercepted.

## Motion intensity

High, but bounded to a single shared motion value. Position, scale, rotation
and stacking order all read off one `scrollYProgress` — nothing computes off
per-item scroll listeners or causes a React re-render while scrolling.

## Accessibility

- Touch, reduced motion and narrow viewports render the plain static grid.
- Positions are transform-only; DOM order and any semantics inside `content`
  are untouched.
- Native page scroll stays in charge throughout — the section never traps or
  redirects scroll input.

## Performance

One `useScroll` target and one set of `useTransform` chains per item, all
motion-value-driven. Keep `content` cheap — the wall itself adds no
measurement pass, but nine simultaneously-visible pointer-driven children
would.

## Composes with

Plain photo tiles or `SoftSurface`-style panels, not Jelly or Tilt children —
the wall already supplies motion; a second independent motion system on the
same item reads as a bug, the same rule as Masonry Gallery.
