# Inline Command Field

## Purpose

Use Inline Command Field when authored content can contain structured commands such as dates, people or statuses without leaving the composition surface.

## Interaction

Typing `/` opens a local command list. Choosing a command inserts an explicit removable token and returns focus to the field. This is content composition, not global navigation.

## Usage

```tsx
<InlineCommandField label="Brief" commands={commands} onTokensChange={setTokens} />
```

## Accessibility

Use a labelled combobox/listbox relationship for the command list. Inserted commands need visible names and individual remove buttons; Escape must dismiss suggestions without navigating.

## Reduced motion

Open the command list and insert the token directly. The distinction between raw text, suggestion and inserted command must remain visible.
