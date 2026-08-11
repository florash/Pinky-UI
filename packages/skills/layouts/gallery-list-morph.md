# Gallery ↔ List Morph

## Purpose

Use when the same collection needs both visual discovery and fast list scanning. Stable item ids let media and titles travel into their list positions.

## Use when

- Portfolio visitors benefit from gallery browsing and metadata scanning.
- Both modes represent the same information, not two separate products.

## Avoid when

- Gallery and list expose different data or actions.
- A simple responsive grid is already sufficient.

## Interaction and accessibility

Expose Gallery/List as a real pressed control; G and L are optional shortcuts. Keep links, titles and metadata in both modes, preserve DOM order and do not hide the list behind hover.

## Reduced motion and performance

Reduced motion switches immediately but keeps keyed identity. Supply stable keys and let the host own lazy media; do not mount duplicate gallery and list trees.
