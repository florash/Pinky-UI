# Editable Property Rail

## Purpose

Use Editable Property Rail for compact object metadata where one property at a time should become an attached editor.

## Interaction

Keep the property rows stable. Edit changes one row into an input or select with Save and Cancel; Enter saves and Escape restores the row. Other properties remain visible for context.

## Usage

```tsx
<EditablePropertyRail items={properties} onItemsChange={setProperties} />
```

## Accessibility

Give every row a named Edit action and keep the property label attached to its editor. Only one editor should be active, with a clear focus target and keyboard save/cancel path.

## Reduced motion

Skip row interpolation while keeping the active editor, stable labels and returned focus obvious.
