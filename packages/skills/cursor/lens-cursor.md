# Lens Cursor

## Purpose

`LensCursor` provides a small local magnifier over an image or media surface. It is useful for a product detail, material sample or image-led portfolio where a little inspection is helpful without opening a full lightbox.

Use a lens around 56–84px radius and zoom around 1.3–1.8. Keep the source image visible underneath and avoid magnifying text, controls or an entire page. For detailed inspection, a real zoomable media view is more honest than a cursor lens.

The lens is decorative and pointer-transparent; the child image keeps its meaningful alt text. It is disabled when motion is reduced or a fine pointer is unavailable, leaving normal media and focus behavior intact. Check keyboard focus and touch fallbacks explicitly.
