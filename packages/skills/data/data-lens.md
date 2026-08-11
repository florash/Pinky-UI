# Data Lens

## Purpose

`DataLens` adds chart-agnostic local inspection around custom SVG, canvas or DOM data surfaces. Use it when the host visualization already exists but needs consistent pointer, touch and keyboard selection.

Supply ordered items and a compact textual lens. Avoid coupling essential meaning only to the floating overlay, or wrapping a chart whose own inspection model already works well.

The wrapper exposes slider semantics and Arrow/Home/End selection. Touch may tap or drag. Keep updates to index changes rather than raw pointer frames, and ensure a non-visual summary exists outside the overlay.
