# Spotlight Overlay

## Purpose

Use a spotlight overlay when one local source should become the clear focus while surrounding content remains part of the same workspace.

## Interaction anatomy

- The source opens a bounded soft scrim.
- A context panel explains or acts on the selected source.
- The source identity remains visible behind the layer.

## Good for

Focused workspace explanation, a selected object or a short contextual action.

## Avoid

Multi-step onboarding tours, global modal work or decorative dimming without a useful action.

## Live example

Choose a target to lower the surrounding noise and keep that target as the context anchor.

## Usage

```tsx
<SpotlightOverlay />
```

## Tune

Use the lightest scrim that establishes focus, keep the context panel short, and ensure the source remains understandable underneath.

## Accessibility and reduced motion

Provide a labelled dialog or region, a close button and Escape. The focus path must not depend on seeing the scrim. Reduced motion preserves the scrim and context immediately.
