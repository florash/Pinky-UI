# Progressive Status

## Purpose
Reveal increasingly specific operational detail only as one operation takes long enough to need it.

## Use when
Processing can move from a generic wait to meaningful sub-status such as preparing, optimizing and checking.

## Avoid
Showing implementation detail immediately, faking progress with unrelated percentages, or leaving a static Processing label forever.

## Accessibility
Expose the current stage and total stage count in text and announce only meaningful stage changes through a polite status.

## Keyboard and touch
Start and restart are native buttons. The readable current status must remain visible on a narrow screen without a hover explanation.

## Reduced motion and performance
Keep the same stage sequence while removing travel and opacity animation. Clean each delayed transition on restart and unmount.

## Composition and anti-patterns
Use Multi-Stage Progress when named execution stages need a persistent track. Progressive Status is about earning detail over time.
