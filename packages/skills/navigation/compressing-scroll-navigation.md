# Compressing Scroll Navigation

## Purpose

`CompressingScrollNavigation` gives a long page some reading space back by reducing header height after deliberate downward scroll. The header remains present, so navigation does not disappear just when someone is moving through content.

## Interaction anatomy

- **Full state:** title, context and destinations are visible at the top.
- **Compact state:** the same destinations remain in a shorter header.
- **Hysteresis:** separate thresholds prevent rapid toggling near the boundary.
- **Controlled mode:** previews and coordinated shells can provide their own compressed state.

## Live example

Scroll the page or use the preview's controlled state to compare the two header heights. The destination links remain available in both states.

## Usage

```tsx
import { CompressingScrollNavigation } from "@pinky-ui/experiences";

<CompressingScrollNavigation items={items} title="Pinky UI" compactAfter={96} />;
```

## Tune

- Choose a threshold after the first meaningful reading region.
- Keep compact labels short and preserve the full route set.
- Avoid pairing it with a second scroll-collapsing island.

## Accessibility

Never remove focused links during compression. Keep DOM order, labels and visible focus stable, and ensure the compact state is still understandable to screen magnification users.

## Reduced motion

Switch height and scale immediately. The persistent header and its labels remain available without animated travel.
