# Selection Tray

## Purpose

A contextual action tray appears when multiple data items are selected and stays out of the way otherwise — batch actions without a permanent toolbar.

## Good for

- Batch actions on lists, tables and collection management screens

## Avoid for

- One-off actions that do not benefit from multi-select

## Usage

```tsx
<SelectionTray items={items} actions={[{ id: "archive", label: "Archive", onAction: archive }]} />
```

## Accessibility

- Native checkboxes provide an explicit selection path and the tray exposes a named action region.
- Clear and batch actions remain visible and keyboard reachable when selection is active.

## Performance

- The tray mounts only with a non-empty selection and actions receive the selected records directly.

Related: filter-rail, reorderable-list.
