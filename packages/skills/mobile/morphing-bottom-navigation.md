# Morphing Bottom Navigation

## Purpose

Morphing Bottom Navigation gives the active destination a raised, labelled surface while the surrounding destinations stay compact and reachable. It is useful when a mobile product needs stronger current-location language without changing routes or making the bar jump.

## Use when

- Four or fewer primary destinations need persistent thumb access.
- The active destination deserves geometry and label priority, not only a colour change.

## Interaction

Tap a destination to move the active surface. The inactive items retain a 44px hit area and the bar keeps its lower-edge ownership.

## Accessibility

Use `aria-current="page"` for the active destination and keep the label available to assistive technology when the visual label is compact. Provide real links when destinations change routes.

## Reduced motion

Remove the lift and width transition; swap the active geometry immediately while preserving the active label and current-location semantics.

## Tune

- Keep the destination count short.
- Reserve enough width for the longest active label.
