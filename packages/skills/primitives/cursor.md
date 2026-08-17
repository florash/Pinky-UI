# Cursor Glow

## Purpose

Ambient light that follows the pointer across a region — the complete,
canonical wrapper for pointer-following light. Reach for this before reaching
for the underlying hook.

## Use it when

A section, panel or hero should feel like it is lit from the pointer's
position, as ambient atmosphere rather than a highlight on one specific
surface — that narrower job belongs to `Spotlight`.

## API shape

```tsx
<CursorGlow size={420}>
  <section>…</section>
</CursorGlow>
```

`size` is the light's diameter in px. `CursorGlow` owns the pointer
subscription and region measurement for you.

## Judgment

One `CursorGlow` per visually distinct region. Nesting two — or pairing it
with `Spotlight` on the same surface — doubles the ambient light and reads as
a mistake, not atmosphere. If you need a custom surface that only `Spotlight`
or a bespoke effect can express, drop to `usePointerGlow` (see [[glow]])
instead of fighting this wrapper's assumptions.

## Performance

Pure CSS custom properties under the hood; the pointer subscription is
regional, not global, so multiple glows on one page stay cheap.
