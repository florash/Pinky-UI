# Interactive Gradient

## Purpose

`InteractiveGradient` adds a soft local gradient response using the shared cursor spotlight infrastructure. Use it behind a Hero or feature surface when pointer position should gently change emphasis.

Choose a broad radius and low intensity; text contrast must remain stable at every pointer position. Avoid full-page high-energy tracking, touch-dependent meaning or combining it with Cursor Spotlight as a separate layer.

The wrapper leaves content semantic and pointer interaction optional. Touch and reduced-motion fallbacks stay static, with no React state per pointer frame. Prefer container mode for bounded sections and viewport mode only when the whole page truly benefits.
