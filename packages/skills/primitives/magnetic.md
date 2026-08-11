# Magnetic

## Purpose

Pulls its child toward the pointer as the pointer approaches, with a smoothstep
falloff and a hard travel cap.

## Use it when

You want proximity response on something that is not a Pinky component — your
own button, a logo, an icon.

## API shape

`strength` is the fraction of pointer offset followed; `range` is how far beyond
the element the field extends; `maxOffset` caps travel.

## Judgment

`maxOffset={8}` is the house rule. The element must still read as anchored to
its position — if it appears to chase the cursor, reduce strength before you
reduce range. A wide, weak field feels considered; a narrow, strong one feels
twitchy.

Never put two magnetic fields on the same element or on nested elements you
control together — the movements add up and become unpredictable.

## Performance

Subscribes to the shared pointer store, and caches its rect between resizes and
scrolls. Dozens of instances are fine.
