# Keyboard-Aware Composer

## Purpose

Use a keyboard-aware composer when text entry should stay above the mobile visual viewport instead of being hidden behind the on-screen keyboard.

## Interaction anatomy

- The visual viewport reports the keyboard offset.
- The composer grows only when focused or populated.
- Send remains a visible native submit action.

## Good for

Notes, messages, comments and small creation surfaces.

## Avoid

Long-form editing that needs a dedicated screen or a composer with many unrelated controls.

## Live example

Focus the composer, type a note and send with the button or Ctrl/Command + Enter.

## Usage

```tsx
<KeyboardAwareComposer onSubmit={sendMessage} />
```

## Tune

Use a short placeholder, keep the input readable above the keyboard and reserve safe-area padding at the bottom.

## Accessibility and reduced motion

Use a native labelled textarea and submit button. Reduced motion does not remove keyboard offset handling or the visible send path.
