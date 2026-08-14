# Section-Aware Navigation

## Purpose

`SectionAwareNavigation` is a local reading index whose active destination follows the section currently entering the viewport. It ties navigation state to content position without polling scroll on every frame.

## Interaction anatomy

- **Anchors:** each item points to a real section id.
- **Observer:** the active section is chosen from the reading window.
- **Indicator:** one supplemental rule follows the current anchor.
- **Fallback:** anchors still work if observation is unavailable.

## Live example

Scroll the preview through its sections or activate an anchor directly. The active label follows the content and can also be reached by keyboard.

## Usage

```tsx
import { SectionAwareNavigation } from "@pinky/experiences";

<SectionAwareNavigation
  sections={[
    { id: "intro", label: "Intro", href: "#intro" },
    { id: "materials", label: "Materials", href: "#materials" },
  ]}
/>;
```

## Tune

- Match every navigation id to a unique meaningful section.
- Use a reading-window threshold that does not flicker between short sections.
- Keep the index local and lightweight on mobile.

## Accessibility

Use real anchors and `aria-current="location"` for the active section. The indicator must never be the only cue, and the page must remain navigable when observers are unavailable.

## Reduced motion

Change the active indicator without travel. Anchor scrolling remains native and section state remains readable.
