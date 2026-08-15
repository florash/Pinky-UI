# Focus Lift Field

## Purpose

Focus Lift Field gives an active mobile input a little more room and reveals its helper context. The field's relationship stays stable when the keyboard changes the visual viewport.

## Use when

- A field needs a short instruction only while it is being edited.
- Focus should create a local hierarchy change without opening a new screen.

## Interaction

Focus the field to lift its surface and reveal helper copy. Blur returns the compact state while retaining the value.

## Accessibility

Use a real label, preserve the helper text in the accessible description and keep the input focusable at every state.

## Reduced motion

Apply the focused padding and helper copy immediately without lift travel.

## Tune

- Keep helper copy to one or two short lines.
- Pair it with a visual-viewport-aware composer when the form is long.
