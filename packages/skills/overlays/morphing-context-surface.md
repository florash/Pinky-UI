# Morphing Context Surface

## Purpose

Use a morphing context surface when a compact source should become its own short editor while retaining identity and a clear return path.

## Interaction anatomy

- The resting source becomes a focused input surface.
- The label and value persist across the transformation.
- Enter or Done commits the local edit; Escape returns without losing context.

## Good for

Short contextual notes, names and local values that do not need a full form.

## Avoid

Long forms, dependent validation workflows or unrelated modal content.

## Live example

Open the context note, edit the value, then press Enter, Escape or Done.

## Usage

```tsx
<MorphingContextSurface />
```

## Tune

Keep the editor compact, preserve the source label, validate locally and make the return action obvious.

## Accessibility and reduced motion

Focus the native input on open, keep the label associated, and support Enter and Escape. Reduced motion renders the editor immediately without changing its semantics.
