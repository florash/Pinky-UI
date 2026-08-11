# Blur Reveal

## Purpose

`BlurReveal` brings content from a small blur, opacity and translate offset into focus. It is a quiet entrance for editorial sections, cards and supporting copy.

Use low blur (about 4–10px), short travel (12–24px) and one in-view trigger. Do not use it on every nested element or for content that must be visible before an observer runs. Pair it with a static layout and let the hierarchy come from timing, not large movement.

The shared observer pool avoids one observer per child. Reduced motion renders sharp content immediately; the final DOM remains readable and semantic. Avoid blur-heavy stacks because they are expensive to paint.
