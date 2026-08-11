# Bubble Field

## Purpose

`BubbleField` creates a small deterministic set of slowly drifting soft orbs. Use it for friendly campaign sections, playful product intros and decorative empty states.

Six to twelve bubbles is usually enough; the component caps the total at eighteen. Avoid data-dense screens, multiple fields on one page, high-contrast bubbles or treating it as a general particle engine. Pointer repulsion should be rare and subtle.

The DOM order is deterministic for SSR, motion pauses offscreen and mobile reduces density. Reduced motion renders a static field and the layer is hidden from assistive technology. Keep foreground contrast high and do not add filter-heavy effects to each bubble.
