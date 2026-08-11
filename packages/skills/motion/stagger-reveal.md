# Stagger Reveal

## Purpose

`StaggerReveal` sequences the entrance of sibling content without requiring manual delay props. It works for a small card row, feature list or navigation group with an obvious reading order.

Use 3–8 children and a stagger around 40–90ms. Do not stagger a long list, every element on a page, or items whose order changes rapidly; the delay becomes friction. Preserve semantic children inside the generated wrappers.

The shared in-view observer triggers the group, and reduced motion shows every child immediately. Never make a child’s meaning depend on waiting for its turn; content and keyboard access must exist before or without motion.
