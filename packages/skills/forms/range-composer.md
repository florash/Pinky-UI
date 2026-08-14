# Range Composer

## Purpose

Use Range Composer when two endpoints form one logical value such as a price, duration or dimension range.

## Interaction

Keep From and To editors paired on one track. Editing either endpoint clamps the pair so the relationship stays ordered and the summary remains readable.

## Usage

```tsx
<RangeComposer label="Canvas width" defaultStart={320} defaultEnd={960} unit="px" />
```

## Accessibility

Label both native number inputs and repeat the ordered range in text. The visual band is supplementary; endpoints and their values must remain understandable without it.

## Reduced motion

Update the band and summary directly. Do not rely on animated endpoint travel to explain the new range.
