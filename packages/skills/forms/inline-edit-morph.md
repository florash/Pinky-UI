# Inline Edit Morph

## Purpose

`InlineEditMorph` is the motion-focused preset of the canonical `InlineEditField`: it changes a small read-only value into an editing control without a disruptive layout jump. Use it for profile names, labels, titles and compact settings where that morph is the intended cue.

Avoid long-form content, complex validation workflows or fields that should already be visibly editable. The resting button must clearly announce what it edits.

Opening focuses and selects the input; Enter saves and Escape cancels. Validation errors are announced and invalid values stay in edit mode. Reduced motion removes layout interpolation while preserving focus. Pair with an explicit full form for dependent fields.
