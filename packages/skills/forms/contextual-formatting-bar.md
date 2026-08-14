# Contextual Formatting Bar

## Purpose

Use Contextual Formatting Bar when a short editable text surface needs lightweight emphasis controls tied to a real selection.

## Interaction

Render the editable content first. Reveal the small toolbar beside a non-empty selection and keep it attached to the editor bounds; do not create a detached global toolbar.

## Usage

```tsx
<ContextualFormattingBar label="Handoff note" defaultContent="Select a phrase to format." />
```

## Accessibility

Label the editable surface and toolbar, expose Bold and Italic pressed states, and keep the controls keyboard reachable. This pattern is not a substitute for a complete rich-text editor.

## Reduced motion

Show or hide the toolbar immediately. Selection context and formatting state must not depend on travel or fade timing.
