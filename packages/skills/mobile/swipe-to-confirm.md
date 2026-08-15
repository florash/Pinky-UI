# Swipe to Confirm

## Purpose

Use swipe-to-confirm when commitment should be expressed through bounded distance, while a keyboard and focus path must perform the same action.

## Interaction anatomy

- A track shows progress toward commitment.
- The threshold is visible before confirmation.
- Enter and Space provide an explicit non-gesture fallback.

## Good for

Reversible archive, publish or handoff actions where distance adds useful intention.

## Avoid

Hidden destructive controls, irreversible actions without review or desktop-only workflows.

## Live example

Drag the track to the right, or focus it and press Enter.

## Usage

```tsx
<SwipeToConfirm label="Archive project" onConfirm={archive} />
```

## Tune

Use a generous track, a clear threshold and a reset path. Do not require pixel-perfect dragging.

## Accessibility and reduced motion

Expose slider progress, status text and keyboard activation. Reduced motion removes track travel while preserving progress, threshold and confirmation language.
