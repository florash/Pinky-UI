# Scroll Progress

## Purpose

`ScrollProgress` is a small page or local-container progress bar that tells the reader where they are in a long experience. It supports horizontal top bars and vertical section indicators.

Use it on long editorial pages, documentation or a contained story. Keep thickness around 2–4px and contrast clear but quiet. Do not add it to short pages or use it as the only navigation for a long document.

The indicator is decorative and must not block pointer input. It updates through shared motion values without React renders per scroll frame; reduced motion may still show instantaneous progress. Provide headings/landmarks for the actual navigation.
