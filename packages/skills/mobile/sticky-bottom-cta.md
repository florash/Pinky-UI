# Sticky Bottom CTA

## Purpose

Use a sticky bottom CTA when the next product decision should stay reachable while a mobile surface scrolls.

## Interaction anatomy

- A short description explains the next step.
- The action remains inside a safe-area-aware lower region.
- Pending and disabled states keep the button geometry honest.

## Good for

Checkout steps, short forms, review screens and progressive product flows.

## Avoid

Several competing primary actions or pages where the footer would cover content.

## Live example

Activate the CTA and compare the stable action surface with its pending state.

## Usage

```tsx
<StickyBottomCTA label="Continue" onAction={continueFlow} />
```

## Tune

Keep the copy concise, reserve content padding and make pending truthfully disable repeated submission.

## Accessibility and reduced motion

Use a labelled region, a native button and visible pending text. Reduced motion does not change the action or its status language.
