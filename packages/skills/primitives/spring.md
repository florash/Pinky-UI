# Spring

## Purpose

The shared motion vocabulary, plus hover, focus and press feedback in one
wrapper. `Spring` is the fastest way to give an ordinary element the house
feel without composing `usePressSpring` and hover state by hand.

## Use it when

An element needs baseline tactile feedback — hover lift, focus ring, press
scale — and nothing more expressive. Reach for `Jelly`, `Tilt` or
`LiquidSurface` when the surface should carry its own personality; reach for
`Spring` when it should just feel alive.

## API shape

```tsx
<Spring hoverScale={1.03} preset="snappy">
  <Chip />
</Spring>
```

`preset` picks one of the four house springs (`soft`, `responsive`, `snappy`,
`elastic`) instead of inventing physics per component. `hoverScale` stays
subtle by default.

## Judgment

`hoverScale` above `1.06` starts to look like a bug on anything wider than a
chip or small button. `snappy` is the right preset for buttons and small
affordances; reach for `soft` on larger surfaces where `Spring` wraps a card.

## Performance

Wraps children in one motion component with shared spring config; no pointer
subscription beyond ordinary hover/focus/press events.
