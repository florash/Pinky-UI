# Stack to Grid

## Purpose

Shows that a small collection has more inside it. Cards sit as a pile, then
unpack into a grid — the same elements moving, not one view replaced by another.

## Good for

- revealing a curated set from a compact starting point
- onboarding and feature walkthroughs
- a section that should reward one click

## Avoid for

- primary navigation of a large catalogue
- anywhere users must scan everything immediately — start in `grid` mode instead

## How many items

Three to twelve. A stack cannot suggest what it contains past a dozen, and the
grid it becomes gets unwieldy.

## Mobile

One or two columns in grid mode. The stack state is unchanged and works well on
narrow screens, which makes this a good mobile-first pattern.

## Motion intensity

The default spring is `soft` and should stay there — this is a large spatial
change, and overshoot on a dozen cards at once is chaos.

## Accessibility

- Both arrangements are the same list in the same DOM order.
- The toggle is a real button with `aria-pressed`.
- Nothing leaves the accessibility tree in either state.

## Performance

The shared layout animation measures each card once per transition, never per
frame. Only the top five cards render offset in the stack; the rest sit behind
them. Keep card content light — every card is mounted in both states.

## Composes with

Spotlight Card is the best partner: calm surfaces let the arrangement itself be
the interaction. Avoid Jelly or Liquid cards here — during the transition you
would have twelve surfaces animating for two different reasons.
