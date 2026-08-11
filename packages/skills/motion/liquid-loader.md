# Liquid Loader

## Purpose

`LiquidLoader` is a small loading or progress indicator using dots, a soft blob or a liquid pill. It communicates waiting without turning the loading state into a visual event.

Use it beside a short status label or inside a button whose action is genuinely pending. Prefer the pill variant when progress is known. Do not use a loader to disguise slow navigation or leave it spinning after work completes.

The component exposes `role=status`, an accessible label and `aria-busy`. Reduced motion leaves a static indicator; the status text remains available. Keep dimensions stable so the loading state does not move surrounding controls.
