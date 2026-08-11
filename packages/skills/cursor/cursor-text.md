# Cursor Text

## Purpose

`CursorProvider`, `CursorTarget` and `CursorText` let meaningful regions expose a short contextual label such as “View”, “Open” or “Drag”. The label should repeat an existing action, never introduce the only explanation.

Wrap a project list or drag surface in one provider and give each focusable region a concise target label. Use it for a few high-value regions, not ordinary navigation, forms or every card. Keep the follower small enough to leave the target readable.

The label is decorative (`aria-hidden`); focus and native accessible names carry the real message. `CursorTarget` claims on focus as well as pointer entry and cleans up on blur/unmount. The layer disappears for touch and reduced motion, with no loss of functionality.
