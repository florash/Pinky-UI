# Image Trail

## Purpose

`ImageTrail` briefly cycles images along a fast pointer sweep inside a defined region. It is a signature treatment for a creative portfolio, editorial index or image-led introduction where the images add context rather than carry required information.

Use a meaningful sequence of 3–8 images and a velocity threshold around 80–160px/s. Keep the pool capped and the lifetime near 600–850ms. Do not trigger it on slow browsing, on a catalogue where every image matters, or alongside another trail/particle system.

The source content remains in normal DOM order and the trail images are empty-alt decorative layers. It disables on touch and reduced motion, cleans up animations, and never creates nodes per movement. Provide the same work links and image information through the underlying semantic content.
