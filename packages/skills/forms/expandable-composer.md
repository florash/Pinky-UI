# Expandable Composer

## Purpose

Use Expandable Composer when a message, note or content prompt starts small and needs a richer editor only after intent increases.

## Interaction

Begin with one attached line. Focus, typing or Enter opens the multiline surface in place; tools and submit actions appear below the draft. Escape closes the richer state without discarding text.

## Usage

```tsx
<ExpandableComposer value={draft} onValueChange={setDraft} onSubmit={send} />
```

## Accessibility

Use a labelled input or textarea, real buttons for tools and submit, and preserve the draft when the composer contracts. Do not turn the expansion into an unlabelled dialog.

## Reduced motion

Resolve height and opacity immediately while keeping the richer editing surface, tools and submit path available.
