# Choosing a card

Pinky has five card behaviours. Picking the right one matters more than tuning
the one you picked.

## Decision order

1. **Does the card need to become something else?** → **Morph Card**
2. **Is it one hero surface that should feel soft?** → **Jelly Card**
3. **Is it floating over imagery or colour, and should feel premium?** →
   **Liquid Card**
4. **Is it a solid object — a cover, a product shot — that should catch light?**
   → **Tilt Card**
5. **Anything else, especially a grid** → **Spotlight Card**

## The five, in one line each

- **Jelly Card** — soft body, leans and settles. Expressive; use sparingly.
- **Liquid Card** — translucent, light gathers under the pointer. Expensive
  (`backdrop-filter`); one or two per screen.
- **Tilt Card** — rigid plane, rotates to face you, optional parallax layer.
- **Spotlight Card** — nothing moves, the face just lights up. The safe default.
- **Morph Card** — expands into its own detail view with dialog semantics.

## Common mistakes

- Using Jelly Card for every card in a grid. Use one, then Spotlight Cards.
- Using Liquid Card in a dashboard. The blur cost is real and the contrast is
  unpredictable.
- Nesting Jelly inside Tilt. Two rotation systems fight and the result reads as
  a bug.
- Reaching for Morph Card when the detail deserves a URL. If it should be
  linkable, it should be a page.
