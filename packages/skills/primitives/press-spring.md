# Press Spring

## Purpose

Press feedback that answers pointer and keyboard alike, delivered as
spreadable handlers plus a scale motion value — the primitive underneath
every button-shaped surface in Pinky UI.

## Use it when

You are building your own pressable element and want the house press feel
without pulling in a full button component — a custom chip, a card that acts
as a button, a control with layout `Spring` does not already cover.

## API shape

`usePressSpring({ scale })` returns `{ scale, handlers }`. Spread `handlers`
onto the element for pointer and keyboard press states; bind `scale` to a
`motion.*` element's `style`.

```tsx
const press = usePressSpring({ scale: 0.96 });
<motion.button style={{ scale: press.scale }} {...press.handlers} />
```

## Judgment

`0.96` is the house default and covers almost every case. Do not go below
`0.92` outside of small, dense controls — a large surface compressing that
much reads as broken, not tactile. Keyboard Space/Enter presses must trigger
the same scale as a pointer press; that parity is the whole point of the hook.

## Performance

One motion value, no re-renders on press. Safe to attach to every item in a
list.
