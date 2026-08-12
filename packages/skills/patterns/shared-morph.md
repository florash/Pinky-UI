# Shared Morph

## What it does

Shared Morph is a system pattern, not a second component. It names the rule
for using Pinky’s existing `Morph` primitive for thumbnail-to-detail,
card-to-panel and avatar-to-profile flows.

## Interaction anatomy

- **Trigger:** one semantic surface with a stable visual identity.
- **State:** resting object, focused dialog and return path.
- **Motion:** one shared layout identity supplied by `Morph`.
- **Surface:** the object persists; unrelated page regions do not morph.
- **Feedback:** focus, Escape and the restored trigger explain continuity.

## Good for

- A thumbnail becoming a detail view.
- A card becoming a focused panel.
- A compact control becoming a short, related surface.

## Avoid for

- A normal route change with unrelated content.
- A second layout-ID or animation engine.
- Destructive confirmations where continuity would soften the consequence.

## Usage

```tsx
<Morph label="Project detail" expanded={<ProjectDetail />}>
  <ProjectThumbnail />
</Morph>
```

## Accessibility

Keep the expanded state a real dialog with Escape, focus management and a return path. Reduced motion removes the travel while preserving the open/close behavior. The trigger must remain a native button or an equivalent semantic control.
