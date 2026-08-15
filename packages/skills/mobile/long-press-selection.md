# Long-Press Selection

## Purpose

Long-Press Selection turns a sustained press on a row into a batch-selection mode. Tap, visible check state, keyboard activation and a lower action tray make selection understandable without hover.

## Use when

- A collection needs multi-select but should not show checkboxes at rest.
- The selection mode has a small, local set of batch actions.

## Interaction

Tap or hold an item to select it. Select more items, use Move, or Cancel the mode. The selected count and pressed state update immediately.

## Accessibility

Use `aria-pressed` on each selectable button and expose the action region as a toolbar. Long press must enhance, never replace, the tap and keyboard path.

## Reduced motion

Enter selection mode immediately without press compression or tray travel.

## Tune

- Keep the long-press duration consistent with the product's other hold gestures.
- Make the selected count and destructive consequences explicit.
