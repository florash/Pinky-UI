# Token Field

## Purpose

Use Token Field for small, confirmed multi-value input such as recipients, tags or filter values.

## Interaction

Keep the next value in a native input. Enter or comma confirms a token; Backspace removes the previous token when the draft is empty. Existing tokens expose focus and individual remove actions.

## Usage

```tsx
<TokenField label="Recipients" tokens={recipients} onTokensChange={setRecipients} />
```

## Accessibility

Provide a visible label, keyboard removal and a separate remove button for every token. Tokens must wrap on narrow screens instead of forcing horizontal scrolling.

## Reduced motion

Add or remove tokens immediately. Confirmation must remain visible through text and focus, not an insertion animation.
