# Partial Success Summary

## Purpose
Explain mixed batch outcomes without framing successful work as failed or hiding the items that need recovery.

## Use when
Uploads, imports, exports or batch edits complete with both successful and failed items.

## Avoid
One red banner for an otherwise successful batch, a success message that hides failures, or a retry that repeats every item.

## Accessibility
State the success and failure counts in text, give each item a readable status, and label retry as applying only to failed items.

## Keyboard and touch
Retry is a native button and failed rows stack cleanly on mobile. Item status must remain readable without hover, color or an icon.

## Reduced motion and performance
Resolve item updates without animated reordering when motion is reduced. Retry only the failed subset and avoid duplicate batch requests.

## Composition and anti-patterns
Keep the summary and failed-item list together. Use Completion Morph when one working object becomes one result rather than a mixed collection outcome.
