# Animated Number

## Purpose

`AnimatedNumber` explains a discrete numeric update with a short direction-aware interpolation. Use it for occasional KPI, progress and summary changes.

Keep duration below roughly 700ms and preserve locale, decimals, prefix and suffix. Avoid constant live feeds, slot-machine columns or delaying the first readable value.

The visual interpolation is hidden from assistive technology while one stable final value is exposed. Reduced motion resolves immediately. Use tabular numerals for comparison and pair the number with a meaningful label and change context.
