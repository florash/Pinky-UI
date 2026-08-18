# Inline Edit Field

## Purpose

A product field keeps its label, help text and validation attached while entering edit mode, so context never disappears behind a modal.

## Good for

- Settings and profile fields that benefit from local context

## Avoid for

- Long multi-field forms or inline table cells with many dependencies

## Usage

```tsx
<InlineEditField label="Workspace name" value={name} onValueChange={setName} description="Shown to collaborators." />
```

## Accessibility

- The resting value and edit action have an explicit label; Save and Cancel are real buttons.
- Escape cancels and validation is announced beside the field without removing the draft.

## Performance

- Only one small native input is active; no pointer-frame work is required.

Related: inline-edit-morph, validation-field.
