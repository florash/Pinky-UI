# Floating Tab Bar

## Purpose

Use a floating tab bar when the active mobile destination needs a little more context without turning the navigation into a full-width desktop header.

## Interaction anatomy

- One active destination expands in place.
- Neighbouring destinations remain visible and reachable.
- The lower edge reserves safe-area space for the device gesture region.

## Good for

Small product shells with three to five peer destinations.

## Avoid

Deep navigation, more than five peers or a desktop navigation bar compressed into a phone.

## Live example

Activate Search, Saved or Profile and watch the active destination take more room.

## Usage

```tsx
<FloatingTabBar items={items} value={activeId} onValueChange={setActiveId} />
```

## Tune

Keep labels short, use stable order and let the active label carry the context. Preserve a minimum 44px target.

## Accessibility and reduced motion

Use `aria-current` for the active destination and keep every item a real button. Reduced motion keeps the active state and resolves width changes immediately.
