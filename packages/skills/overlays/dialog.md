# Dialog

## Purpose

A standard modal dialog — scrim, focus trap, Escape, focus restoration — with
no shared-element continuity to whatever opened it. Use it for confirmations,
settings and anything that can be opened from more than one place.

## Interaction anatomy

- Opens as a plain fade-and-scale surface, not a shared-layout expansion.
- Escape closes it; clicking the scrim closes it; a visible close button
  closes it.
- Focus moves into the panel on open and returns to whatever triggered it on
  close.
- Tab is trapped inside the panel while open.

## Good for

- Confirmations, especially destructive ones
- Settings panels and forms opened from more than one entry point
- Any modal content where "this is the same object as the trigger" isn't true

## Avoid for

- A surface that should read as the same object as what opened it — that's
  [[morph]]
- Content large enough to need its own scroll region and a persistent
  trigger relationship — consider a sheet instead on mobile

## Usage

```tsx
<Dialog
  open={open}
  onOpenChange={setOpen}
  title="Delete project?"
  description="This cannot be undone."
  footer={<button onClick={confirmDelete}>Delete</button>}
/>
```

## Accessibility

- `role="dialog"`, `aria-modal="true"` and an accessible label are set
  automatically from `title`.
- Focus moves to the first focusable element on open and Tab cannot escape
  the panel.
- Closing — by Escape, scrim click or the close button — always returns
  focus to whatever had it before the dialog opened.

## Performance

The panel and its scrim mount only while `open` is true; no scroll-lock,
listener or trapped-tab handler persists once it's closed.

## Composes with

Nothing needs to nest inside a Dialog beyond ordinary form and button
content — it doesn't compose with other primitives so much as host them.
Don't nest a Dialog inside a Morph panel or vice versa; pick one modal
system for a given flow.
