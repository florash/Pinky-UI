# Scroll Reveal

## Purpose

`ScrollReveal` enters content once it reaches the viewport using a small opacity/translate/scale change. It is the default scroll effect for sections that benefit from a gentle rhythm.

Use it for section-level blocks and small groups, with a shared observer and a once-only trigger. Do not hide the first screen’s essential content, reveal every nested node, or make reading depend on scrolling to an exact threshold.

Reduced motion renders content directly. The observer pool limits overhead and the DOM order stays normal. Check that no focusable item becomes unreachable while it waits for observation.
