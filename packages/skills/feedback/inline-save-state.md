# Inline Save State

## Purpose
Keep edited, saving, saved and failed persistence feedback beside the field that owns the change.

## Use when
A local edit has a short persistence lifecycle and the user benefits from retaining the surrounding field context.

## Avoid
Replacing validation with a save label, showing a detached notification for every keystroke, or claiming saved before the callback resolves.

## Accessibility
Expose busy state while saving, associate the status with the field, and use an alert only for a genuine save failure. Keep the value readable in every state.

## Keyboard and touch
Enter can save, the Save control is native, and the recovery action remains a full-size touch target. Do not require blur or pointer hover to discover persistence state.

## Reduced motion and performance
Keep the field geometry stable and resolve status immediately when motion is reduced. Cancel or ignore stale persistence work after unmount.

## Composition and anti-patterns
Use local status for local persistence. Inline Feedback can describe a small result, but it should not replace the field's own saving ownership.
