# Progressive Disclosure Field

## Purpose

Use Progressive Disclosure Field when one field choice determines a small, local set of dependent inputs.

## Interaction

Start with the primary choice. When the user chooses a branch such as Ship, reveal only its address fields in the same document flow; switching back closes them without changing unrelated fields.

## Usage

```tsx
<ProgressiveDisclosureField label="Delivery" defaultMode="ship" />
```

## Accessibility

Use native radio semantics for the primary choice and a labelled dependent region. Do not hide required fields only behind colour or an unexplained animation.

## Reduced motion

Resolve the dependent region immediately while preserving the same ordering, labels and live state message.
