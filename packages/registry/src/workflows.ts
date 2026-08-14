import type { DiscoveryMetadata, Status } from "./types";

export type WorkflowFamily = "feedback" | "search" | "loading" | "lists" | "drag" | "onboarding" | "mobile";
export type WorkflowEntry = {
  slug: string;
  name: string;
  family: WorkflowFamily;
  description: string;
  status: Status;
  tags: string[];
  component: string;
  builtOn: string[];
  importPath: string;
  usage: string;
  demoPath: string;
  skill: string;
  accessibility: string[];
  reducedMotion: string;
  performance: string[];
  whenToUse: string[];
  whenNotToUse: string[];
  related: string[];
  discovery?: DiscoveryMetadata;
};

const defaults = (item: Omit<WorkflowEntry, "status" | "importPath" | "demoPath" | "skill" | "accessibility" | "reducedMotion" | "performance" | "whenToUse" | "whenNotToUse" | "related"> & Partial<Pick<WorkflowEntry, "accessibility" | "reducedMotion" | "performance" | "whenToUse" | "whenNotToUse" | "related">>): WorkflowEntry => ({
  ...item,
  status: "ready",
  importPath: `import { ${item.component} } from "@pinky/systems";`,
  demoPath: `/workflows#${item.slug}`,
  skill: item.slug,
  accessibility: item.accessibility ?? ["Pointer and keyboard paths expose the same state change.", "Status and focus remain meaningful when motion is disabled."],
  reducedMotion: item.reducedMotion ?? "Resolves state changes without layout animation while preserving semantics.",
  performance: item.performance ?? ["Uses local state and transforms; no per-frame React pointer loop."],
  whenToUse: item.whenToUse ?? ["Product workflows with a clear reversible or inspectable state."],
  whenNotToUse: item.whenNotToUse ?? ["Decorative motion without a user task."],
  related: item.related ?? [],
});

const item = (family: WorkflowFamily, slug: string, name: string, component: string, description: string, tags: string[], usage: string, builtOn: string[] = ["Motion", "native semantics"], discovery?: DiscoveryMetadata) => defaults({ family, slug, name, component, description, tags, usage, builtOn, discovery });

export const feedbackSystems = [
  item("feedback", "morph-toast", "Morph Toast", "ToastProvider", "A capped, pausable notification stack with action and swipe dismissal.", ["toast", "notification", "undo"], `<ToastProvider>{children}</ToastProvider>`, ["AnimatePresence", "live regions"]),
  item("feedback", "status-pill", "Status Pill", "StatusPill", "A compact state indicator that carries progress and semantic status.", ["status", "progress", "state"], `<StatusPill label="Uploading" state="working" progress={42} />`),
  item("feedback", "inline-feedback", "Inline Feedback", "InlineFeedback", "Local success, warning, info and error feedback beside the action that caused it.", ["feedback", "validation", "forms"], `<InlineFeedback tone="success">Saved</InlineFeedback>`),
  item("feedback", "action-undo-bar", "Action Undo Bar", "ActionUndoBar", "A temporary recovery surface for reversible actions.", ["undo", "recovery", "action"], `<ActionUndoBar message="Item deleted" onUndo={restore} />`, ["native button", "timer cleanup"], { role: "preset", canonicalSlug: "undoable-action", note: "Use Undoable Action when the removed object must reflow and return to its original position." }),
  item("feedback", "optimistic-action", "Optimistic Action", "OptimisticAction", "Reflects a user action immediately, then confirms it or rolls the visible state back without a fake backend.", ["optimistic", "pending", "rollback", "recovery"], `<OptimisticAction label="Follow" onAction={confirmFollow} />`, ["local state", "aria-pressed"], { role: "canonical", note: "A domain action leads with its likely result while acknowledgement and rollback remain explicit." }),
  item("feedback", "undoable-action", "Undoable Action", "UndoableAction", "Removes an item and closes the gap while a bounded recovery surface restores the exact item position.", ["undo", "reflow", "recovery", "destructive"], `<UndoableAction items={items} onUndo={restore} />`, ["AnimatePresence", "timer cleanup"], { role: "canonical", note: "The recoverable object and its spatial reflow are the interaction, not a toast skin." }),
  item("feedback", "inline-save-state", "Inline Save State", "InlineSaveState", "Keeps edited, saving, saved and failed persistence feedback beside the field that owns the change.", ["save", "persistence", "inline", "retry"], `<InlineSaveState label="Project title" onSave={saveTitle} />`, ["contextual status", "async callback"], { role: "canonical", note: "Persistence feedback stays attached to the edited surface instead of moving to a detached notification." }),
  item("feedback", "async-action-control", "Async Action Control", "AsyncActionControl", "A stable action control that owns pending, success, failure and retry without collapsing into a spinner-only button.", ["async", "action", "success", "failure"], `<AsyncActionControl label="Publish" onAction={publish} />`, ["stable geometry", "async callback"], { role: "canonical", note: "Async Button remains a compact preset; this control makes the complete action lifecycle legible." }),
  item("feedback", "retry-surface", "Retry Surface", "RetrySurface", "Transforms a failed content region into localized recovery with retry and an explicit alternate path.", ["retry", "error", "recovery", "context"], `<RetrySurface title="Preview unavailable" onRetry={reload} />`, ["native button", "local state"], { role: "canonical", note: "Recovery belongs to the surface that failed, so the user keeps context and a next action." }),
  item("feedback", "completion-morph", "Completion Morph", "CompletionMorph", "Transforms a working action surface into its result while preserving spatial ownership and a reset path.", ["completion", "morph", "upload", "continuity"], `<CompletionMorph label="Upload brief" resultLabel="Brief ready" />`, ["Motion layout", "AnimatePresence"], { role: "canonical", note: "The working object becomes the completed object; it does not disappear into a separate success message." }),
  item("feedback", "partial-success-summary", "Partial Success Summary", "PartialSuccessSummary", "Summarizes mixed batch outcomes, preserves successful items and isolates only the failures for retry.", ["batch", "partial", "retry", "summary"], `<PartialSuccessSummary items={results} />`, ["batch state", "retry recovery"], { role: "canonical", note: "A mixed result is neither falsely successful nor needlessly framed as a total failure." }),
  item("feedback", "conflict-resolution", "Conflict Resolution", "ConflictResolution", "Keeps local and external values visible together until the user chooses which version continues.", ["conflict", "compare", "local", "external"], `<ConflictResolution localValue={draft} remoteValue={latest} />`, ["comparison state", "explicit choice"], { role: "canonical", note: "Small, contextual conflict choice without pretending to be a full version-control interface." }),
  item("feedback", "connection-state", "Connection State", "ConnectionState", "Makes offline, reconnecting and restored states actionable while keeping local work available.", ["offline", "reconnect", "sync", "status"], `<ConnectionState defaultMode="offline" onReconnect={reconnect} />`, ["status semantics", "async callback"], { role: "canonical", note: "A product connection state is recoverable and scoped to the work surface, not a browser-style interruption banner." }),
  item("feedback", "delayed-feedback-escalation", "Delayed Feedback Escalation", "DelayedFeedbackEscalation", "Keeps fast actions quiet, then escalates to useful status only when work crosses perceived-performance thresholds.", ["delay", "loading", "perceived performance", "status"], `<DelayedFeedbackEscalation />`, ["threshold timers", "timer cleanup"], { role: "canonical", note: "Avoids flashing a loader for fast work while still telling the truth when an operation takes longer." }),
];
export const searchSystems = [
  item("search", "morph-search", "Morph Search", "MorphSearch", "A compact search trigger expands into an autofocus query surface and restores focus.", ["search", "morph", "focus"], `<MorphSearch query={query} onQueryChange={setQuery} />`, ["Morph", "focus restoration"]),
  item("search", "command-palette", "Command Palette", "CommandPalette", "A reusable keyboard-first command surface with groups, filtering and activation.", ["command", "keyboard", "combobox"], `<CommandPalette items={commands} open={open} onOpenChange={setOpen} />`, ["listbox semantics", "focus restoration"]),
  item("search", "search-results-morph", "Search Results Morph", "SearchResultsMorph", "Stable-identity result transitions with quiet loading and empty states.", ["results", "loading", "filter"], `<SearchResultsMorph items={results} renderItem={renderResult} />`, ["AnimatePresence", "stable keys"]),
];
export const loadingSystems = [
  item("loading", "skeleton-morph", "Skeleton Morph", "SkeletonMorph", "A quiet loading placeholder that resolves into the loaded content geometry.", ["skeleton", "loading", "content"], `<SkeletonMorph loading={loading} skeleton={<CardSkeleton />}>{content}</SkeletonMorph>`),
  item("loading", "shimmer-surface", "Shimmer Surface", "ShimmerSurface", "A low-contrast optional shimmer with a static reduced-motion fallback.", ["shimmer", "skeleton", "performance"], `<ShimmerSurface className="h-20 rounded-2xl" />`),
  item("loading", "multi-step-progress", "Multi-Step Progress", "MultiStepProgress", "A visual progress preset for completed, current, upcoming and error states in a staged workflow.", ["progress", "steps", "checkout"], `<MultiStepProgress steps={steps} />`, undefined, { role: "preset", canonicalSlug: "progressive-step-workflow", note: "Use Progressive Step Workflow when completed decisions and the active task need to remain in one product surface." }),
  item("loading", "circular-progress-morph", "Circular Progress Morph", "CircularProgressMorph", "A compact spinner-to-percentage-to-check task indicator.", ["progress", "upload", "status"], `<CircularProgressMorph value={72} state="progress" />`),
  item("loading", "async-button", "Async Button", "AsyncButton", "A width-preserving idle, loading, success and error action pattern.", ["button", "async", "action"], `<AsyncButton onAction={save}>Save changes</AsyncButton>`, ["PressSpring", "stable width"], { role: "preset", canonicalSlug: "async-action-control", note: "Use Async Action Control when the full lifecycle and recovery state need to stay visible." }),
  item("loading", "progressive-status", "Progressive Status", "ProgressiveStatus", "Reveals increasingly specific operational detail only when a single operation takes long enough to need it.", ["status", "processing", "delay", "detail"], `<ProgressiveStatus autoStart steps={steps} />`, ["deterministic timers", "status semantics"], { role: "canonical", note: "The operation starts quiet, then earns detail as elapsed time changes what the user needs to know." }),
  item("loading", "multi-stage-progress", "Multi-Stage Progress", "MultiStageProgress", "Shows system execution moving through named stages with a detailed current stage, failure and retry.", ["progress", "stages", "execution", "retry"], `<MultiStageProgress stages={stages} />`, ["stage state", "responsive layout"], { role: "canonical", note: "This is system execution, not a user-facing wizard; the current stage owns the next operational action." }),
  item("loading", "background-task-row", "Background Task Row", "BackgroundTaskRow", "Keeps a long-running task compact and persistent while the user continues working elsewhere.", ["background", "task", "queued", "progress"], `<BackgroundTaskRow label="Generating preview" />`, ["task state", "progress semantics"], { role: "canonical", note: "A task row preserves status and retry access without blocking the main product surface." }),
  item("loading", "queued-action", "Queued Action", "QueuedAction", "Makes accepted-but-not-yet-started work visible before it enters active processing.", ["queue", "pending", "processing", "position"], `<QueuedAction label="Export report" queuePosition={2} />`, ["queue state", "progress semantics"], { role: "canonical", note: "Queue acceptance is a distinct state from background execution and should not look like an idle button." }),
  item("loading", "resumable-progress", "Resumable Progress", "ResumableProgress", "Preserves progress across an interruption so a long operation can resume instead of restarting.", ["resume", "pause", "long-running", "progress"], `<ResumableProgress label="Importing archive" />`, ["progress state", "resume action"], { role: "canonical", note: "The paused position is part of the product state and remains readable without motion." }),
];
export const listSystems = [
  item("lists", "reorderable-list", "Reorderable List", "ReorderableList", "A controlled list with pointer drag handles, arrow-key moves and announcements.", ["list", "reorder", "keyboard"], `<ReorderableList items={items} onReorder={setItems} />`, ["Motion Reorder", "live region"]),
  item("lists", "expandable-list-row", "Expandable List Row", "ExpandableListRow", "A lightweight list or feed row disclosure for secondary settings, files or task details.", ["list", "disclosure", "details"], `<ExpandableListRow summary="Invoice · #1042">{details}</ExpandableListRow>`, undefined, { role: "solid", note: "Independent list/feed semantics; Expandable Data Row is the structured table pattern." }),
  item("lists", "swipe-action-row", "Swipe Action Row", "SwipeActionRow", "A mobile row that reveals actions while keeping an explicit actions button.", ["swipe", "mobile", "actions"], `<SwipeActionRow actions={actions}>{row}</SwipeActionRow>`, ["touch gesture", "button alternative"]),
  item("lists", "sticky-data-header", "Sticky Data Header", "StickyDataHeader", "A small sticky header surface that preserves list or table context.", ["sticky", "table", "scroll"], `<StickyDataHeader>Project · Owner · Status</StickyDataHeader>`),
  item("lists", "row-spotlight", "Row Spotlight", "RowSpotlight", "A hover and focus state that connects related values without hiding information.", ["table", "focus", "comparison"], `<RowSpotlight><span>Plan · $24 · Active</span></RowSpotlight>`),
];
export const dragSystems = [
  defaults({ family: "drag", slug: "drag-reorder-grid", name: "Drag Reorder Grid", component: "DragReorderGrid", description: "A controlled dashboard grid reordered by keyboard, with native HTML5 mouse dragging as a desktop accelerator.", tags: ["grid", "drag", "dashboard", "keyboard"], usage: `<DragReorderGrid items={widgets} onReorder={setWidgets} />`, builtOn: ["Motion layout", "native HTML5 drag-and-drop", "keyboard movement"],
    accessibility: ["Every item exposes a labelled handle that moves it with the arrow keys.", "Moves are announced through a live region."],
    // Native HTML5 drag-and-drop does not fire on touch. Do not claim touch drag here.
    whenNotToUse: ["Touch-first surfaces — there is no touch drag path; use Reorderable List or Sortable Chips instead."] }),
  item("drag", "drop-indicator", "Drop Indicator", "DropIndicator", "A destination marker that distinguishes insertion from inside-container drops.", ["drop", "insertion", "destination"], `<DropIndicator position="between" active={isOver} />`),
  item("drag", "drag-ghost", "Drag Ghost", "DragGhost", "A restrained preview surface intended to be mounted by a drag integration.", ["drag", "preview", "ghost"], `<DragGhost active={dragging}>{snapshot}</DragGhost>`, ["transform", "drag integration"]),
  item("drag", "sortable-chips", "Sortable Chips", "SortableChips", "A compact tag collection with reorder, remove and add hooks.", ["chips", "tags", "reorder"], `<SortableChips items={tags} onReorder={setTags} onRemove={removeTag} />`),
];
export const onboardingSystems = [
  item("onboarding", "stepper", "Stepper", "Stepper", "A basic horizontal, vertical or compact accessible workflow stepper for explicit progress.", ["steps", "workflow", "progress"], `<Stepper steps={steps} active={active} />`, undefined, { role: "solid", note: "Use Progressive Step Workflow when completed decisions should remain editable context." }),
  item("onboarding", "spotlight-tour", "Spotlight Tour", "SpotlightTour", "A skippable, focus-managed target tour with next, back and Escape paths.", ["tour", "onboarding", "focus"], `<SpotlightTour steps={tourSteps} open={open} onOpenChange={setOpen} />`),
  item("onboarding", "coach-mark", "Coach Mark", "CoachMark", "A single attached teaching surface for a new contextual feature.", ["coach", "teaching", "context"], `<CoachMark target="#new-filter" title="New filters">Try saved views here.</CoachMark>`),
  item("onboarding", "progressive-disclosure", "Progressive Disclosure", "ProgressiveDisclosure", "A small pattern for revealing advanced controls only when requested.", ["disclosure", "settings", "forms"], `<ProgressiveDisclosure>{advancedOptions}</ProgressiveDisclosure>`),
];
export const mobileSystems = [
  item("mobile", "bottom-sheet", "Bottom Sheet", "BottomSheet", "A snap-point sheet with drag, backdrop, Escape and focus restoration.", ["sheet", "mobile", "touch"], `<BottomSheet open={open} onOpenChange={setOpen}>Filters</BottomSheet>`, ["Motion drag", "focus restoration"]),
  item("mobile", "swipeable-tabs", "Swipeable Tabs", "SwipeableTabs", "Fluid Tabs companion with touch swiping and desktop keyboard controls.", ["tabs", "swipe", "mobile"], `<SwipeableTabs tabs={tabs} index={index} onIndexChange={setIndex} />`, ["Fluid Tabs vocabulary", "touch gesture"]),
  item("mobile", "pull-to-refresh", "Pull to Refresh", "PullToRefresh", "A resistance-driven refresh chamber with threshold, armed, refreshing and complete states plus an accessible button path.", ["refresh", "pull", "tension", "mobile"], `<PullToRefresh onRefresh={reload}>{content}</PullToRefresh>`, ["requestAnimationFrame", "pointer capture", "callback-owned data"]),
  item("mobile", "edge-swipe-panel", "Edge Swipe Panel", "EdgeSwipePanel", "A progressive edge reveal that follows the gesture, displaces the underlying surface and settles by distance plus velocity.", ["panel", "edge", "reveal", "gesture"], `<EdgeSwipePanel label="Filters">{filters}</EdgeSwipePanel>`, ["pointer tracking", "velocity settlement", "dialog semantics"]),
  item("mobile", "long-press-action", "Long Press Action", "LongPressAction", "A cancellable long press with click, keyboard and context-menu alternatives.", ["long press", "context", "touch"], `<LongPressAction onLongPress={select}>{item}</LongPressAction>`, ["timer cleanup", "button semantics"]),
];

export const productWorkflowSystems = [
  defaults({ family: "onboarding", slug: "progressive-step-workflow", name: "Progressive Step Workflow", component: "ProgressiveStepWorkflow", description: "A staged product workflow keeps completed decisions compact, the active decision large and the next context visible.", tags: ["workflow", "steps", "progressive"], usage: `<ProgressiveStepWorkflow steps={steps} onActiveIdChange={setActive} />`, builtOn: ["controlled state", "Motion layout"], accessibility: ["The current task uses aria-current while completed decisions remain explicit edit buttons.", "Continue, Back and blocked states use text labels, and state changes are announced only after an action."], reducedMotion: "Removes layout travel while completed, current, blocked and upcoming structure stays visible.", performance: ["Only the current task content renders; updates are discrete and host controlled."], whenToUse: ["Short product workflows where completed decisions should remain editable context."], whenNotToUse: ["Long branching processes that need routing, persistence or a dedicated review screen."], related: ["stepper", "progressive-disclosure"], discovery: { role: "canonical", note: "Canonical product workflow for progressive decision continuity." } }),
  defaults({ family: "feedback", slug: "status-pipeline", name: "Status Pipeline", component: "StatusPipeline", description: "A queued-to-active-to-complete status path keeps failure and retry on the same spatial track.", tags: ["status", "pipeline", "progress"], usage: `<StatusPipeline stages={stages} failedId={failedId} onRetry={retry} />`, builtOn: ["Motion layout", "semantic state"], accessibility: ["Every stage exposes its named state and the current stage uses aria-current.", "Failure, retry and completion are written as text as well as shown through color and symbols."], reducedMotion: "Keeps the complete status track and swaps state immediately without animated travel.", performance: ["A small fixed stage list updates on explicit actions without timers or continuous work."], whenToUse: ["Operational flows where queued, active, failed and completed states need spatial continuity."], whenNotToUse: ["A single indeterminate task or decorative percentage meter."], related: ["multi-step-progress", "status-pill"] }),
];

export const workflowSystems = [...feedbackSystems, ...searchSystems, ...loadingSystems, ...listSystems, ...dragSystems, ...onboardingSystems, ...mobileSystems, ...productWorkflowSystems] satisfies WorkflowEntry[];
export const allWorkflowSystems = workflowSystems;
export function getWorkflowSystem(slug: string) { return allWorkflowSystems.find((entry) => entry.slug === slug); }
export function filterWorkflowSystems(family: WorkflowFamily | "all" = "all", query = "") { const needle = query.trim().toLowerCase(); return allWorkflowSystems.filter((entry) => (family === "all" || entry.family === family) && (!needle || [entry.name, entry.description, ...entry.tags].join(" ").toLowerCase().includes(needle))); }
