# Morph

## What it does

Morph expands one surface into another as one continuous object. It is a
geometry transition with dialog semantics, not a generic fade between panels.

## Interaction anatomy

- **Trigger:** the collapsed surface, normally a button or equivalent control.
- **State:** closed, opening, open and closing.
- **Motion:** shared layout identity and a spring when motion is enabled.
- **Surface:** the trigger and the expanded dialog share visual identity.
- **Feedback:** Escape, backdrop close and focus restoration explain the exit.

## Good for

- A card becoming a focused detail panel.
- A thumbnail becoming a larger inspection surface.
- A compact navigation trigger becoming a short menu.

## Avoid for

- Destructive confirmations or unrelated route changes.
- States with no visual identity in common.
- Long forms that need a stable page context.

## Live example

Open the live surface above, move focus through the dialog, then press Escape.
The trigger is restored after the object returns.

## Usage

```tsx
<Morph
  label="Project details"
  expanded={<ProjectDetails />}
>
  <ProjectPreview />
</Morph>
```

## Tune

- `maxWidth` should match the reading task, not the largest screen available.
- Keep the collapsed and expanded surfaces close in colour, radius and identity.
- Use `triggerLabel` only when the collapsed child has no visible text.
- Keep expanded content mounted only while open.

## Accessibility

- Preserve `role="dialog"`, `aria-modal`, a useful label and a focus trap.
- Escape and backdrop close must return focus to the trigger.
- The trigger remains a real button; do not make a decorative `div` clickable.
- Touch uses the same explicit trigger and close paths as pointer input.

## Reduced motion

Reduced motion removes the travel and resolves the dialog immediately. Open,
close, focus and state feedback remain fully available.
