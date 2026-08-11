# Bottom Sheet

## Purpose
Use for mobile-focused filters, actions, or detail that can rise from the bottom without losing context.

## Use when
The task is short and spatially related to the current screen.

## Avoid
Nested scroll traps, giant forms, or replacing desktop dialogs without checking viewport behavior.

## Accessibility
Use dialog semantics, labelled title, close button, Escape, backdrop behavior, and focus restoration.

## Keyboard and touch
Snap points and drag are optional acceleration; close remains an explicit button.

## Reduced motion and performance
Animate the sheet transform only and clean drag/listener state on unmount.

## Composition and anti-patterns
Keep scroll ownership inside the sheet and do not stack sheets without a strong reason.
