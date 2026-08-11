# Hover Video Scrubber

## Purpose

`HoverVideoScrubber` maps horizontal pointer or drag position to a preview video timeline. Use it for a few portfolio reels, product demos or creative clips where rapid inspection matters.

Always provide a poster and a keyboard alternative; use `preload="metadata"` or `none` in lists. Avoid autoplaying galleries, long-form video, essential audio or dozens of simultaneous video downloads.

Touch uses drag or explicit play, and Arrow keys seek while Space/Enter can toggle playback. Seeking writes directly to the video element rather than React per frame. Pause or unmount offscreen media in the host gallery.
