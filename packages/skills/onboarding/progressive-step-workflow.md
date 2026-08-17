# Progressive Step Workflow

## Purpose

A staged product workflow keeps completed decisions compact, the active decision large and the next context visible, so the whole path stays legible as it's built.

## Good for

- Short product workflows where completed decisions should remain editable context

## Avoid for

- Long branching processes that need routing, persistence or a dedicated review screen

## Usage

```tsx
<ProgressiveStepWorkflow steps={steps} onActiveIdChange={setActive} />
```

## Accessibility

- The current task uses aria-current while completed decisions remain explicit edit buttons.
- Continue, Back and blocked states use text labels, and state changes are announced only after an action.

## Performance

- Only the current task content renders; updates are discrete and host controlled.

Related: stepper, progressive-disclosure.
