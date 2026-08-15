# Ripple Button

## What it does

Ripple Button answers where a button was pressed with one soft expanding
surface and a whole-button compression. It is tactile feedback, not a Material
ripple or a second action.

## Interaction anatomy

- **Trigger:** a native button receiving pointer, keyboard or touch input.
- **State:** idle, pressed, released and disabled.
- **Motion:** a short pressure wave under a bounded press spring; it is a
  surface response, not a detached ink circle.
- **Surface:** the button keeps its size while the feedback stays clipped inside.
- **Feedback:** pointer position is reflected; keyboard activation uses a centred response.

## Good for

- Form submits and primary product actions.
- Dense toolbars where magnetic proximity would fight neighbours.
- Touch-first controls where the press itself needs acknowledgement.

## Avoid for

- Isolated hero CTAs that benefit from approach feedback instead.
- Long-lived decoration or a screen full of simultaneous ripples.
- Any control whose action is unclear without the effect.

## Live example

Press either live button above with a pointer, touch or Space. The feedback
stays inside the real button and does not intercept the click.

## Usage

```tsx
<RippleButton pressScale={0.96}>
  Save changes
</RippleButton>
```

## Tune

- Keep `pressScale` near `0.96`; below `0.92` reads as collapse.
- Use a low-contrast `rippleColor` that supports the button surface.
- Choose one press language per screen instead of mixing it with many tactile variants.

## Accessibility

- Keep the native label, keyboard activation, disabled state and focus ring.
- Keyboard activation gets the same compression and a centred ripple.
- Ripple elements are decorative and must stay `aria-hidden` and pointer-inert.
- Touch needs no hidden gesture; the whole visible button is the target.

## Reduced motion

Reduced motion removes the expanding surface while preserving a clear pressed
state, focus and activation result.
