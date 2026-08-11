# Spotlight Grid

## Purpose

`SpotlightGrid` combines a quiet grid with a local reveal, suitable for developer Heroes, documentation intros and structured product sections.

Use low-contrast lines and a broad, restrained spotlight. Avoid neon cyber styling, fine grids behind body copy or using the grid as the only indication of interactivity. Pair it with simple content, not another pointer-following background.

The surface is decorative and pointer-transparent while foreground semantics stay unchanged. Keyboard, touch and reduced-motion users receive a readable static grid. Shared pointer infrastructure avoids per-frame React work; keep the covered area bounded when possible.
