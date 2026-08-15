# Nested Surface Stack

## Purpose

Use a nested surface stack when a local context has one or two related child surfaces and users need a clear Back path without losing the parent.

## Interaction anatomy

- The first surface establishes local context.
- A child replaces the visible layer while parent state stays available.
- Back removes one layer; Escape closes the stack.

## Good for

Related settings, object actions and compact configuration branches.

## Avoid

Deep application navigation, arbitrary dialog nesting or a full wizard.

## Live example

Open layered settings, then move through Access and Billing before using Back.

## Usage

```tsx
<NestedSurfaceStack />
```

## Tune

Keep depth shallow, label the current layer, preserve a stable close position and make parent context apparent.

## Accessibility and reduced motion

Use a labelled region or dialog, focus the current layer, expose Back and Close as buttons, and restore focus to the original trigger. Reduced motion keeps the same stack semantics without sliding layers.
