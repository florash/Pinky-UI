# Split Text Reveal

## Purpose

`SplitTextReveal` reveals a short text block by word, character or line while keeping the final text in stable DOM order. It is intended for display headings and compact editorial statements.

Choose words by default; use lines only when the line breaks are intentionally authored. Use characters for short headings, never for a paragraph or a long navigation label. Keep stagger under about 50ms and travel small.

The final characters are present from the start and are not replaced with placeholder glyphs. Reduced motion renders them immediately. Keep the heading selectable and ensure the surrounding semantic heading remains a real `h1`/`h2` when the component is placed inside one.
