# Liquid Cursor

## Purpose

`LiquidCursor` is a small follower that stretches along pointer velocity and springs back to a circle. It gives a product or portfolio cursor a tactile signature without a fluid simulation.

Use it as the one primary cursor gesture on a spacious desktop surface. Keep `stretch` around 0.2–0.4 and the size near 20–32px; large elongation reads as a smear. Do not combine it with a large blob, heavy trail and hidden native cursor unless the page has a very clear hierarchy.

It is `aria-hidden`, pointer-transparent, disabled for reduced motion and absent on coarse pointers. Native pointer, hover, focus and keyboard paths remain the real interface. A static circle is preferable to making reduced-motion users follow deformation.
