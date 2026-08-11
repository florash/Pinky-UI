# Cursor Trail

## Purpose

`CursorTrail` leaves a short recycled trail of dots, bubbles or soft marks behind a fine pointer. It suits a creative landing section or a quiet portfolio gesture where a little motion helps the surface feel tactile.

Keep the pool small (roughly 8–18 nodes), lifetime short (400–750ms), and spacing high enough that the trail disappears while the pointer rests. Do not use it beside text-heavy reading, forms, or another dominant cursor signature; it becomes visual noise quickly.

The trail is decorative, `pointer-events: none`, disabled for reduced motion and simplified away on touch. It uses a fixed node pool and Web Animations rather than React state per pointer frame. Content and focus must work exactly without it.
