# Filter Rail

## Purpose

A grouped filter rail keeps active choices, removal and result context in one compact surface instead of a sprawling filter sidebar.

## Good for

- Collection and data views with a few mutually exclusive filter groups

## Avoid for

- Complex boolean query builders or dozens of options

## Usage

```tsx
<FilterRail groups={groups} value={filters} onValueChange={setFilters} />
```

## Accessibility

- Each option is a real button with pressed state and a visible All reset.
- Active filters can be removed individually or cleared together on touch and keyboard.

## Performance

- Only discrete selection changes update the rail; horizontal option lists stay native scrollable on small screens.

Related: morph-select, selection-tray.
