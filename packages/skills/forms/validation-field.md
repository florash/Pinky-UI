# Validation Field

## Purpose

A field communicates idle, correcting, valid, warning and invalid states as readable feedback, so the field itself carries the state instead of a separate banner.

## Good for

- Local validation where the next action depends on a field being legible and complete

## Avoid for

- Remote validation that needs an async request state without a host adapter

## Usage

```tsx
<ValidationField label="Email" value={email} onValueChange={setEmail} validate={validateEmail} />
```

## Accessibility

- Invalid state uses aria-invalid and an adjacent status message; colour is not the only signal.
- The field remains editable while correcting and status changes are announced politely.

## Performance

- Validation is synchronous and host-owned; the component adds no debounce or network assumption.

Related: inline-edit-field, morph-select.
