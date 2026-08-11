# Mask Reveal

## Purpose

`MaskReveal` reveals a heading, image or editorial surface through a directional clipping mask. It is best when the boundary of the content is part of the composition.

Use one direction and a restrained duration for a hero image or section transition. Do not mask long paragraphs, interactive controls, or many nested children; clipping can make content feel unavailable and can complicate layout.

Keep the final content in the DOM and remove the mask animation for reduced motion. Verify that focusable descendants are not clipped while focused and that the static layout still reads in the source order.
