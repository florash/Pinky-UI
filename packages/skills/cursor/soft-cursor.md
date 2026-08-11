# Soft Cursor

## Purpose

`SoftCursor` adds a small pointer core and a larger spring-lagging follower for fine-pointer desktop interfaces. It is a gentle enhancement for a portfolio, hero or project surface, not a replacement for the browser cursor.

Use it when the page has one calm signature interaction and enough whitespace for a follower to be legible. Use `followerOnly` when the native pointer should remain especially prominent. Do not use it over dense forms, data tables, text editing, or every component on a page.

Keep `followerSize` around 28–48px and `hoverScale` near 1–1.7. Leave `hideNative` off unless the design genuinely benefits and form controls still retain their native cursor. The effect is `aria-hidden` and pointer-transparent; the underlying controls must remain complete.

It disables itself for coarse pointers and reduced motion. Never make cursor decoration the only hover or focus affordance. Pair it with `CursorProvider`/`CursorText` only for short, redundant labels.
