# Pointer Glow

## Purpose

The hook underneath the light: writes pointer position into CSS variables so
lighting stays pure CSS, with no per-frame JavaScript paint. This is the
low-level primitive; [[cursor]] (Cursor Glow) is the complete wrapper most
call sites should reach for instead.

## Use it when

You are building a custom surface — not a plain region — that needs
pointer-position lighting and `CursorGlow`'s wrapper assumptions (owns the
container, owns sizing) do not fit. If a `<div>` wrapper would do the job,
use `CursorGlow` instead.

## API shape

```tsx
const ref = usePointerGlow<HTMLDivElement>({ range: 80 });
```

Attach `ref` to the element that should track the pointer; the hook writes
position into CSS custom properties on that node, and your own CSS reads them
to render the light.

## Judgment

This is a secondary, low-level tool by design — reach for it only when
composing a custom surface, not as a default. Pulling it into a component
that could just render `<CursorGlow>` around its children adds indirection
for no benefit.

## Performance

Writes CSS variables directly, no React re-render and no per-frame JS paint
work — the cost is whatever CSS you write to consume the variables.
