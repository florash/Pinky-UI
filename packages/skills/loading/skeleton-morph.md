# Skeleton Morph

## Purpose
Use a placeholder whose geometry resembles the content that will arrive.

## Use when
Content shape is known and a short wait would otherwise cause layout shift.

## Avoid
Indefinite waits, fabricated content, or shimmer on every surface.

## Accessibility
Expose busy state without reading decorative skeleton children as content.

## Keyboard and touch
Do not trap focus in loading content; preserve controls when they are available.

## Reduced motion and performance
Static fallback is the default under reduced motion; mount only the active placeholder.

## Composition and anti-patterns
Use MultiStepProgress or CircularProgressMorph when actual progress is known.
