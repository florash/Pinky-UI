# Progressive Form

## Purpose

Completed form sections condense into context while only the next useful section opens — the form narrows attention without hiding what was already answered.

## Good for

- Short setup flows where completed answers should remain visible

## Avoid for

- Long forms that need a full review page or arbitrary branching

## Usage

```tsx
<ProgressiveForm steps={steps} onCompletedIdsChange={setCompleted} />
```

## Accessibility

- Completed sections remain editable buttons; current content and next context have stable headings.
- Continue, Back and Complete form are explicit controls with a live completion announcement.

## Performance

- Only the active section renders its form content; reduced motion preserves the same structure.

Related: progressive-disclosure, stepper.
