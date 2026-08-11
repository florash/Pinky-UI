# Proximity

## Purpose

Shares one pointer subscription across a set of items and gives each a springed
0–1 closeness value.

## Use it when

Several sibling elements need to react to pointer distance — a dock, a magnified
row, a set of reactive chips.

## API shape

`<Proximity distance axis>` wraps the set; each item calls `useProximityItem()`
to get a ref and its own `proximity` motion value.

## Judgment

Use `axis="x"` for horizontal rows: measuring diagonal distance in a dock makes
items react as the pointer moves *away* vertically, which feels wrong.

Anything you drive from proximity should degrade to a sensible resting state,
because it will be at rest for touch users and reduced-motion users permanently.

## Performance

This primitive exists for performance. The naive approach — a listener, a rect
cache and a frame callback per item — is how docks become the slowest thing on a
page. Here a ten-item dock costs the same as a one-item dock, and rects are
re-measured only when layout can actually have changed.
