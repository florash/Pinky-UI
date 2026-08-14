# Connection State

## Purpose
Make offline, reconnecting and restored states actionable while preserving local product work.

## Use when
The product can continue locally or queue work while a connection is unavailable and needs an explicit recovery path.

## Avoid
Blocking every surface with a browser-style banner, pretending local work synced, or forcing a page refresh to recover.

## Accessibility
Use a polite status for connection changes, state what remains local, and label reconnect actions clearly. Do not announce every network tick.

## Keyboard and touch
Reconnect is a native button with a reachable target. The restored state should not steal focus or make the user repeat the original action.

## Reduced motion and performance
Use a static status indicator when motion is reduced. Cancel stale reconnect callbacks and avoid continuous polling in the component.

## Composition and anti-patterns
Pair with Queued Action or Optimistic Action when work has a local queue or rollback. Do not use it as a decorative online badge.
