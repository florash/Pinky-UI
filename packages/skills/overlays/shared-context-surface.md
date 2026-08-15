# Shared Context Surface

## Purpose

Use a shared context surface when several peer sources should rebind one persistent explanation or preview region.

## Interaction anatomy

- Peer buttons select one source.
- One region stays mounted in the same place.
- Only its content and selected relationship change.

## Good for

Product overviews, compact source comparisons and expensive preview content.

## Avoid

Independent inspectors that need separate ownership or simultaneous comparison.

## Live example

Switch Overview, Signals and History to see one surface preserve its position.

## Usage

```tsx
<SharedContextSurface />
```

## Tune

Keep the shared region stable, use concise source labels, announce meaningful changes and avoid mounting duplicate heavy previews.

## Accessibility and reduced motion

Use selected state and a labelled, politely live region when the content changes. Keyboard and touch select the same sources. Reduced motion updates content in place.
