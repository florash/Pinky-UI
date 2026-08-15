# Mobile Validation Morph

## Purpose

Mobile Validation Morph changes the field surface, status marker and message as a value becomes valid or invalid. Correction stays in the same place and the state is readable without relying on a red or green border.

## Use when

- Local validation can be computed from the current field value.
- The next action depends on the user understanding what to correct.

## Interaction

Type a value and watch the field move from idle to invalid or ready. The input remains editable in every state.

## Accessibility

Use `aria-invalid`, `aria-describedby` and a polite status region. Pair symbols and copy with any surface colour change.

## Reduced motion

Switch the status geometry immediately while keeping the same message and input focus.

## Tune

- Validate at a calm point in the editing cycle, not on every remote request.
- Keep error copy actionable and short.
