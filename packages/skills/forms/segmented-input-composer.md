# Segmented Input Composer

## Purpose

Use Segmented Input Composer when one logical value has meaningful fixed parts, such as a date, time, version or dimension.

## Interaction

Keep the segments grouped under one legend. Move with Arrow keys, advance after a complete segment and distribute sensible pasted content across the parts.

## Usage

```tsx
<SegmentedInputComposer label="Release date" segments={parts} onSegmentsChange={setParts} />
```

## Accessibility

Give each native input a visible label and preserve the logical group relationship. Paste and keyboard movement must work without requiring pointer selection.

## Reduced motion

Advance focus directly and update all segments immediately. The grouped labels and current parts carry the meaning without transition effects.
