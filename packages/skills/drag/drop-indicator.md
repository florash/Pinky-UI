# Drop Indicator

## Purpose
Use to make an insertion or inside-container destination explicit during drag.

## Use when
Rows, cards, or folders have more than one plausible drop location.

## Avoid
A decorative line that is not connected to reorder/collision state.

## Accessibility
Expose the destination in an announcement or visible status text.

## Keyboard and touch
Keyboard reorder should communicate the same destination without a pointer.

## Reduced motion and performance
Toggle visibility from drag state and use opacity/transform, not layout thrash.

## Composition and anti-patterns
Mount it from DragReorderGrid or a host DnD integration; it is not a standalone drop zone.
