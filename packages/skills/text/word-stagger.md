# Word Stagger

## Purpose

`WordStagger` is a **named preset, not a separate implementation**: it is exactly
`<SplitTextReveal {...props} by="word" />` and accepts every `SplitTextReveal` prop except `by`.
Reach for it when you want the word-level rhythm without restating the option; reach for
`SplitTextReveal` directly when the split mode is itself a decision, or when you need `by="line"`.
There is no behaviour here that `SplitTextReveal` does not have.

It gives editorial text a readable rhythm without the fragility of character splitting.

Use it for one short statement at a section boundary. Do not use it for long copy, rapidly changing text or text that must be scanned as a compact label. Keep the default stagger and trigger once in view.

Words remain final, selectable content in the DOM, and reduced motion is immediate. Do not use the effect to communicate a required sequence; the sentence must make sense before animation.
