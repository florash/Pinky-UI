# Inline Search Reveal

## Purpose

Inline Search Reveal lets a compact search icon become a field inside the local header. Nearby content reflows naturally, so a mobile screen does not reserve desktop-density search space at rest.

## Use when

- A page has a short title and occasional local search.
- Search should push content instead of covering it.

## Interaction

Tap the icon to replace the title row with an input. Type, press Escape or Cancel, and return focus to the icon.

## Accessibility

Give the icon a descriptive accessible name and the input a real label. Keep the title available as context when the input is open.

## Reduced motion

Swap the title and field immediately while retaining the same DOM order and focus path.

## Tune

- Use a short placeholder that names the searchable collection.
- Do not use this for a full search destination with complex filters.
