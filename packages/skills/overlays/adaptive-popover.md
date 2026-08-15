# Adaptive Popover

## Purpose

Use an adaptive popover for short context or actions that should stay next to a trigger and move when the available local space changes.

## Interaction anatomy

- A labelled trigger owns expanded state.
- The surface measures its boundary, then flips or shifts.
- Escape, outside press and an explicit close button dismiss it.

## Good for

Short explanations, compact action clusters and context around a product control.

## Avoid

Primary navigation, long forms or blocking workflows.

## Live example

Open the Adaptive Popover near the edge of its stage and resize or scroll to see the local placement logic.

## Usage

```tsx
<AdaptivePopover title="More context">A short explanation.</AdaptivePopover>
```

## Tune

Tune the preferred placement, offset, estimated surface size and mobile width. Keep collision behaviour deterministic.

## Accessibility and reduced motion

Expose `aria-expanded` and `aria-controls`, keep the surface labelled, restore focus to the trigger, and make every action a real button. Reduced motion removes scale and travel while preserving open state.
