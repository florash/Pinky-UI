# Card Fan

## Purpose

Cards held like a hand of playing cards: gathered when idle, fanned out on
approach, with the selected card lifted forward.

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

Reduce `spread`, and consider `collapsible={false}` — there is no hover on
touch, so a fan that only opens on hover opens for nobody.

## Motion intensity

`rotation={8}` across the whole fan, not per card. Past about 12° the outer
cards turn far enough that their content becomes hard to read.

## Accessibility

- Roving tab stop with arrow keys, Home and End.
- Fanning triggers on focus as well as hover.
- The fan is a list; the spatial arrangement is presentation only.

Because cards overlap, make sure the selected card is distinguishable by more
than z-order — the lift is not visible to everyone.

## Performance

One spring per card and no pointer subscription. Every card renders in every
state, so keep the set small and the content light.

## Composes with

Tilt Card works well for photo hands. Avoid Jelly — the fan already rotates each
card, and two rotation systems on one element fight.
