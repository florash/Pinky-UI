# Scroll-Compact Bottom Navigation

## Purpose

Use scroll-compact navigation when reading content benefits from a quieter lower edge, but navigation must return when the user reverses direction.

## Interaction anatomy

- Meaningful downward travel contracts the bar.
- Upward travel restores the full navigation language.
- Hysteresis prevents tiny scroll changes from making the surface jitter.

## Good for

Content feeds, editorial reading and long mobile collections.

## Avoid

Short screens, critical always-visible actions or scroll containers without a stable owner.

## Live example

Scroll down to contract the bar, then move back up to restore it.

## Usage

```tsx
<ScrollCompactBottomNav items={items} />
```

## Tune

Use a meaningful threshold, restore on reversal and never remove the only path to a destination.

## Accessibility and reduced motion

Keep labels available to assistive technology and preserve focusable buttons in compact mode. Reduced motion removes travel while the compact state remains understandable.
