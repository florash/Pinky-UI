# Radial Meter

## Purpose

`RadialMeter` presents one bounded value in a soft editorial circle. Use it for completion, capacity or a single score where a compact shape helps scanning.

Avoid speedometer aesthetics, ambiguous scores, many adjacent meters or replacing exact text with arc length. Segments should represent meaningful intervals, not decoration.

The wrapper exposes semantic meter min/max/current values and visible text. Reduced motion updates immediately. Keep color secondary to the numeric value and label, and use Comparison Bars when users need relative comparison.
