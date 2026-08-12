# Card Fan

## Purpose

Treat a small collection as a compressed, inspectable layered deck. The resting
stack exposes uneven edges and depth; the selected card separates, corrects its
orientation and lets the residual collection reflow around it.

## Good for

- small curated sets — plans, categories, featured pieces
- a playful entry point into a few options

## Avoid for

- anything needing careful comparison; overlap hides content by design
- more than about seven items
- dense or text-heavy cards

## How many items

Three to seven. A fan of twelve is a mess in any hand.

## Mobile

Reduce `spread` for narrow cards. Touch does not depend on hover: tap selects a
card and a horizontal drag advances or reverses the deck without turning it
into a regular carousel.

## Motion intensity

`rotation={8}` is only the ceiling for the outer cards. The resting stack uses
small authored offsets and the inspection state keeps the selected card close
to level; past about 12° content becomes hard to read.

## Accessibility

- Roving tab stop with arrow keys, Home and End.
- Focus opens the inspection state and the selected card has a roving tab stop.
- ArrowLeft/ArrowRight, Home and End browse the collection; selection is
  announced separately from the visual depth cue.
- The fan is a list; the spatial arrangement is presentation only.

Because cards overlap, make sure the selected card is distinguishable by more
than z-order — the lift is not visible to everyone.

## Performance

The pointer proximity signal is scoped to the fan surface. Cards use transform
and opacity/depth cues, so keep the set small and the content light.

## Composes with

Tilt Card works well for photo hands. Avoid Jelly — the fan already rotates each
card, and two rotation systems on one element fight.
