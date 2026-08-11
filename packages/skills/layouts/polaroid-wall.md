# Polaroid Wall

## Purpose

Photos pinned to a wall rather than aligned to a grid. Each sits at a small
deterministic angle; focusing one straightens and lifts it while its neighbours
lean away. It solves the problem of a photo grid that feels too corporate for
personal or editorial content.

## Good for

- editorial photo essays and personal galleries
- team and event pages that should feel human
- moodboards and creative portfolios

## Avoid for

- product grids, where rotation makes sizes hard to compare
- large collections — use Masonry Gallery past about two dozen
- images whose critical detail is small

## How many items

Six to twenty-four. Below six the scatter looks accidental rather than
composed; above twenty-four it reads as clutter.

## Mobile

Drop to two columns and `spread="tight"`. Overlap needs horizontal room that
phones do not have, and rotated photos lose more of their edges on a narrow
screen than you expect.

## Motion intensity

`rotation={6}` is the default and close to the ceiling. Past about 10° the wall
tips from "casually pinned" into "scrapbook". `overlap` above `0.2` makes
neighbours visibly shove each other, which reads as a bug.

## Accessibility

- Items respond to **focus** as well as hover, so the wall is browsable by
  keyboard.
- Rotation and offset are transforms; DOM and reading order never change.
- Children keep their own semantics — make photos links or buttons if they act
  like them, and write real alt text. The layout will not invent it.

## Performance

No pointer subscription; the wall listens on the items themselves. Scatter comes
from a hash rather than measurement, so nothing reflows and the server and
client agree. Give images explicit dimensions — the layout cannot prevent a jump
you cause by omitting them.

## Composes with

Plain image cards, or a light surface like Spotlight Card. Do **not** put Jelly
or Tilt cards inside: the wall already rotates and lifts, and a second rotation
system per item fights it.
