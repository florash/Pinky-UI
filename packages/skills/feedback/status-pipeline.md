# Status Pipeline

## Purpose

A queued-to-active-to-complete status path keeps failure and retry on the same spatial track, instead of replacing the track with an error state.

## Good for

- Operational flows where queued, active, failed and completed states need spatial continuity

## Avoid for

- A single indeterminate task or decorative percentage meter

## Usage

```tsx
<StatusPipeline stages={stages} failedId={failedId} onRetry={retry} />
```

## Accessibility

- Every stage exposes its named state and the current stage uses aria-current.
- Failure, retry and completion are written as text as well as shown through colour and symbols.

## Performance

- A small fixed stage list updates on explicit actions without timers or continuous work.

Related: multi-step-progress, status-pill.
