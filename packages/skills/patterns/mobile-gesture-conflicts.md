# Mobile gesture conflicts

## The problem

A touch surface has one input stream per finger. Two components that both
want to interpret the same drag — a horizontal swipe-to-reveal row inside a
horizontally-scrolling carousel, an edge back-gesture under a chart that
pans on drag — cannot both win. Left unresolved, the loser either eats
input the winner needed or fires unpredictably depending on angle and
speed. This is a design decision to make explicitly, not a bug to discover
in QA.

## Known conflict pairs in this library

- **Swipe Back Gesture vs. horizontal scroll/carousel content.** Both start
  from a horizontal drag. Swipe Back Gesture resolves this by only arming
  inside `edgeWidth` (24px by default) from the left edge — a drag starting
  anywhere else in the content is never claimed, so horizontal scrolling
  elsewhere on the screen is untouched.
- **Swipe Actions vs. Long-Press Context Menu on the same row.** A
  horizontal drag and a stationary hold are different gestures, but placing
  both on one element means a slightly-diagonal press can trigger either.
  Don't combine them on the same surface — pick swipe *or* long-press for a
  given row's secondary actions, never both.
- **Pull to Refresh vs. nested horizontal carousels near the top of a
  list.** Pull to Refresh only arms when `scrollTop === 0` and reads
  vertical movement; a horizontal carousel as the first list item is safe
  because the two read different axes, but a *diagonal* drag can feel
  ambiguous to the user even when the code resolves it correctly — avoid
  putting a horizontal carousel as the literal first scrollable element.
- **Pinch Zoom Image vs. a swipeable gallery around it.** Pinch reads two
  pointers; the outer gallery's swipe-between-photos reads one. Keep the
  zoom viewer as a distinct, focused mode (opened from the gallery, not
  overlaid on it) so the two never compete for the same pointer stream.

## The general rule

1. **One gesture owns one axis on one surface at a time.** If two
   interactions could plausibly both claim a drag, pick the one with
   higher intent specificity (an edge-anchored start, a second pointer, a
   held duration) to arm first, and make the other explicitly ignore that
   input.
2. **Prefer geometry over speed heuristics.** "Only within 24px of the
   edge" is more reliable and more explainable than "only if the drag was
   fast." Reach for velocity thresholds only when no positional signal is
   available.
3. **A movement threshold cancels ambiguous starts.** Long-Press Context
   Menu cancels its hold timer the moment the pointer moves past ~10px —
   the same idea as a browser treating a moved pointerdown as a scroll, not
   a click.
4. **When in doubt, don't add the second gesture.** A visible button is
   always a safe fallback that never conflicts with anything.

## Related

[[touch-fallback]], [[thumb-zone]]
