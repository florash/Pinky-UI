# Async Action Control

## Purpose
Give one action control a complete idle, pending, success, failure and retry lifecycle while preserving intent.

## Use when
Publish, invite, submit or retry has a meaningful short asynchronous result that belongs to the initiating control.

## Avoid
A button that only swaps in a spinner, a disabled control with no recovery path, or a full task that should become a Background Task Row.

## Accessibility
Expose `aria-busy` while pending, keep success and error text available, and never rely on icon or color alone to communicate the result.

## Keyboard and touch
Use a native button with stable dimensions. Enter and Space share the pointer path, repeated activation is guarded while pending, and retry stays reachable.

## Reduced motion and performance
Use immediate state swaps when motion is reduced. Ignore late callbacks after unmount and prevent duplicate requests while pending.

## Composition and anti-patterns
Let the control own a concise lifecycle; add Inline Save State when detailed field persistence or validation needs to remain beside an editor.
