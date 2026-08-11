# Image Sequence

## Purpose

`ImageSequence` lets pointer, drag, touch or Arrow keys inspect supplied frames. Use it for compact 360° products, process stages and short animation previews.

Keep frame counts and image dimensions bounded; preload only the first useful frames. Avoid continuous autoplay by default, high-resolution frame dumps or sequences that hide essential information.

The surface exposes slider semantics and current frame position. Mobile drag remains touch-pan friendly and reduced motion disables only optional autoplay. Prefer video when compression and continuous playback matter more than direct frame choice.
