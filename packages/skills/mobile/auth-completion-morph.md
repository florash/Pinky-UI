# Auth Completion Morph

## Purpose

Use an auth completion morph when verification should resolve into a welcome state on the same spatial surface.

## Interaction anatomy

- Ready becomes verifying after an explicit action.
- Verification resolves to completion without a full-screen replacement.
- Run again makes the state reversible in the example.

## Good for

Sign-in confirmation, invite acceptance and short account handoffs.

## Avoid

Long asynchronous workflows or success states that need a separate destination.

## Live example

Activate Complete sign in and watch the surface move from ready to verifying to complete.

## Usage

```tsx
<AuthCompletionMorph />
```

## Tune

Keep the delay truthful, preserve the action surface and provide a clear result label.

## Accessibility and reduced motion

Use a polite live status for verifying and complete, keep text independent of color and clean up pending timers. Reduced motion removes travel while preserving all phases.
