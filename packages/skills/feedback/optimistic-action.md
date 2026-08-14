# Optimistic Action

## Purpose
Reflect a likely user action immediately, then keep acknowledgement and rollback explicit.

## Use when
Follow, save, react, archive or toggle actions have a predictable local result and a remote confirmation can arrive afterward.

## Avoid
Irreversible transactions, payments or actions where showing success before authority exists would mislead the user.

## Accessibility
Expose the optimistic state with `aria-pressed` or an equivalent semantic value, keep the action label meaningful, and announce confirmation or rollback once.

## Keyboard and touch
Use a native button with a comfortable target. Enter and Space must trigger the same optimistic path, and retry must remain available without hover.

## Reduced motion and performance
Keep the state change immediate when motion is reduced. Abort stale promises and never update state after unmount.

## Composition and anti-patterns
Keep pending acknowledgement close to the action. Do not hide a failed rollback in a global toast or imply that a network request succeeded merely because the UI changed.
