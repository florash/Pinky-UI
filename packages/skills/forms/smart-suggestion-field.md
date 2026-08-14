# Smart Suggestion Field

## Purpose

Use Smart Suggestion Field when typed content can be completed from a known set, but the proposed value must remain distinct from the user's raw draft.

## Interaction

Filter a small suggestion set as the user types. Show a ghost completion when it is unambiguous, but require Enter or an explicit suggestion click to accept it. Escape dismisses the list without changing the draft.

## Usage

```tsx
<SmartSuggestionField label="City" options={cities} onSelect={setCity} />
```

## Accessibility

Implement the combobox/listbox relationship with `aria-expanded`, `aria-controls`, `aria-activedescendant` and labelled options. Arrow keys, Enter, Escape and pointer selection must agree.

## Reduced motion

Remove suggestion movement, not the suggestion state. The active option and accepted value must remain readable in place.
