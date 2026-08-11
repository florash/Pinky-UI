# Floating Columns

## Purpose

Use for a small editorial archive whose columns move at different scroll rates, creating depth without a scroll takeover.

## Use when

- Photography, fashion or visual archive content has a curated amount of material.
- Static column order remains meaningful.

## Avoid when

- The page is text-first or the feed is unbounded.
- Several other scroll narratives already compete for attention.

## Interaction and accessibility

Keep columns ordinary DOM lists. Hover/focus can quiet neighbours or raise one item, but must not move focus or hide captions.

## Touch, reduced motion and performance

Touch and reduced motion use a clean static grid. One scroll progress source drives all columns; images still need host-owned lazy loading and dimensions.
