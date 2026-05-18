// — UI Pattern Library data —
//
// Pure data, no React (mirrors loading-states.ts / moodboards.ts). Each entry
// carries the full pattern anatomy: what it is, when to use it, when NOT to
// (the misuse people actually make), and what to reach for instead.
//
// The live example for an entry is a React component, not a data string. It is
// paired to the entry by `id` through the registry in
// `src/app/tools/ui-pattern-library/examples/index.ts`. Adding a later entry is
// therefore exactly two steps: add a data object here, add an example component
// and one registry line there. Nothing else changes.

export type UiPatternCategory = 'overlays' | 'disclosure' | 'input' | 'content';

export interface UiPattern {
  /** kebab-case, unique. Also the key into the example registry. */
  id: string;
  /** Sentence case. The pattern's name. */
  name: string;
  category: UiPatternCategory;
  /** One or two plain sentences. Orientation, not the point of the entry. */
  whatItIs: string;
  /** The situations the pattern genuinely fits. */
  whenToUse: string;
  /** The situations people wrongly reach for it. Half the value. */
  whenNotToUse: string;
  /** For the "when not to" cases: the better pattern, and why. The other half. */
  useInstead: string;
}

// Fixed order for the filter control; per-category counts are derived at
// runtime from `uiPatterns`, never hard-coded (same as every other library).
export const UI_PATTERN_CATEGORIES: UiPatternCategory[] = [
  'overlays',
  'disclosure',
  'input',
  'content',
];

// Human label for each category value (used by the filter chips / eyebrow).
export const UI_PATTERN_CATEGORY_LABELS: Record<UiPatternCategory, string> = {
  overlays: 'overlays',
  disclosure: 'disclosure',
  input: 'input',
  content: 'content',
};

// The library is built in batches against the M1 architecture: M1 (3 entries),
// M2 (+5), M3 (+5), M4 (+5, this batch). Each entry is built around a genuine
// tension (a real rival pattern or a real misuse case), never a bare
// definition. Complete: 18 of 18.
export const uiPatterns: UiPattern[] = [
  {
    id: 'modal-dialog',
    name: 'Modal dialog',
    category: 'overlays',
    whatItIs:
      'A window layered over the page that blocks interaction with everything behind it until it is dismissed.',
    whenToUse:
      'A focused decision or short task that genuinely must be resolved before the user continues: confirming a destructive action, a short required form, an interruption the user must acknowledge before anything else makes sense.',
    whenNotToUse:
      'Transient messages ("Saved", "Copied"), error or validation feedback, loading states, or anything complex enough to deserve its own page. A modal for a success toast traps the user in a dialog to tell them everything worked.',
    useInstead:
      'A toast for transient confirmation (it informs without blocking), an inline error for validation (it sits next to the field that is wrong), a dedicated page for any flow with more than a couple of steps.',
  },
  {
    id: 'pagination-vs-infinite-scroll',
    name: 'Pagination vs infinite scroll',
    category: 'content',
    whatItIs:
      'Two ways to reveal a long list: fixed pages with explicit controls, or one stream that keeps loading as you scroll.',
    whenToUse:
      'Pagination when users need to find, return to, reference, or bookmark a specific position: search results, data tables, anything where "the third result" or "page 4" is a real thing a user needs to get back to. Infinite scroll when the content is a casual feed built for open-ended browsing and no single item needs to be found again.',
    whenNotToUse:
      'Infinite scroll when users need the footer (it keeps running away), when they need to find an item again (position is not addressable), or when losing your place mid-list is costly. Pagination when the content is a lean-back feed where page boundaries are pure friction.',
    useInstead:
      'This entry is the decision itself: choose by whether position has to be addressable. If a user will ever say "it was about halfway down" or needs the footer, paginate. If they will only ever scroll and skim, infinite is fine.',
  },
  {
    id: 'optimistic-vs-pessimistic-ui',
    name: 'Optimistic vs pessimistic UI',
    category: 'content',
    whatItIs:
      'When a user acts, does the interface update immediately and reconcile if the server later fails (optimistic), or wait for the server to confirm before showing any change (pessimistic)?',
    whenToUse:
      'Optimistic for frequent, low-stakes actions that almost always succeed and are cheap to reverse: liking, toggling, reordering, marking read. Pessimistic for high-stakes or failure-prone actions: payments, irreversible changes, anything where a false "success" followed by a silent revert would mislead the user about the real state.',
    whenNotToUse:
      'Optimistic when a wrong-then-reverted state is dangerous or confusing (a payment that "went through" then quietly did not). Pessimistic for a like button, where a spinner on every tap makes a fluid interaction feel broken.',
    useInstead:
      'This entry is the tradeoff itself: perceived speed against honesty about failure. Pick optimistic when the lie is brief and harmless; pick pessimistic when being wrong, even for a second, costs the user trust.',
  },

  // — Milestone 2: the first batch of five —
  {
    id: 'toast-notification',
    name: 'Toast / notification',
    category: 'overlays',
    whatItIs:
      'A small, transient message that appears briefly and dismisses itself, without blocking the interface.',
    whenToUse:
      'Confirming a low-stakes action succeeded ("Saved", "Copied", "Link sent"), or brief non-critical status the user does not have to act on. It informs in passing and gets out of the way.',
    whenNotToUse:
      'Anything the user must act on. A toast dismisses itself before a slower reader finishes it, so an "Undo" or a decision living only in a toast is a thing the user can simply miss. Not for errors that need a choice, and not for critical information.',
    useInstead:
      'A persistent inline banner or a modal for anything that requires action (it stays until resolved), and an inline error for validation (it sits with the field and does not time out).',
  },
  {
    id: 'tooltip',
    name: 'Tooltip',
    category: 'overlays',
    whatItIs:
      'A small text label that appears on hover or focus, giving a brief hint about an element.',
    whenToUse:
      'A short, supplementary, text-only hint: naming an icon-only button, clarifying a control. Non-essential information the UI is fine without.',
    whenNotToUse:
      'Essential information (tooltips are hidden by default and unreliable on touch and keyboard), anything interactive (a tooltip cannot hold a button or link, it closes the moment you move toward it), or anything more than a few words.',
    useInstead:
      'A popover for interactive or richer content (it is click-triggered and stays open so its controls are reachable), and visible inline text for anything essential.',
  },
  {
    id: 'accordion',
    name: 'Accordion',
    category: 'disclosure',
    whatItIs:
      'A set of stacked sections, each expandable, usually with one or few open at a time.',
    whenToUse:
      'Genuinely optional or secondary content, or a long page of independent sections the user wants one at a time (FAQs, advanced settings). The collapse earns its keep only when most sections are noise to most users.',
    whenNotToUse:
      'Content users need to compare side by side (collapsing it forces them to expand, memorise, collapse, expand, comparing from memory), content short enough that the expand click is pure friction, or primary content that should simply be visible.',
    useInstead:
      'Tabs when the sections are peers the user switches between (still one at a time, but framed as equals), and just showing the content when it is short, primary, or has to be compared. An accordion that hides what the task needs on screen together is fighting the user.',
  },
  {
    id: 'inline-validation',
    name: 'Inline validation',
    category: 'input',
    whatItIs:
      'Form validation that gives feedback as the user fills a field, rather than only on submit.',
    whenToUse:
      'Fields where early feedback genuinely helps and can be checked mid-flow: a username\'s availability, a password meeting visible rules, a confirm-password match. Fired at the right moment, it saves a round trip.',
    whenNotToUse:
      'Validating on every keystroke (an email marked invalid while the user is still three characters into typing it is hostile, it is wrong about an unfinished field), or fields whose correctness cannot be known until submit.',
    useInstead:
      'The same inline validation, fired on blur rather than on keystroke (quiet while typing, helpful once the user leaves the field), and submit-time validation for anything that cannot be meaningfully judged mid-entry. The skill is not whether, it is when.',
  },
  {
    id: 'skeleton-vs-spinner',
    name: 'Skeleton vs spinner',
    category: 'content',
    whatItIs:
      'Two ways to show a loading state: a skeleton placeholder that mimics the layout that is coming, or a spinner indicating indeterminate activity.',
    whenToUse:
      'A skeleton when the content has a known structure that will populate (a feed, a dashboard, a profile, a list) so the wait reads as "almost here". A spinner for short or structureless waits, or an action in progress, where there is no layout to preview.',
    whenNotToUse:
      'A skeleton for a very short wait (it flashes in and out and reads as a glitch) or for content whose layout is unknown (a skeleton that does not match is worse than none). A spinner for a long structured load, where it is just a blank wait.',
    useInstead:
      'This entry is the choice itself: match the loader to the wait. Known layout and a real wait, skeleton; short or shapeless, spinner. See the Loading States tool for the loaders themselves.',
  },

  // — Milestone 3: the second batch of five —
  {
    id: 'popover',
    name: 'Popover',
    category: 'overlays',
    whatItIs:
      'A small overlay anchored to an element, holding richer or interactive content, shown on click.',
    whenToUse:
      'A short, optional, interactive cluster anchored to a control: a small menu of actions, a compact filter, a brief form. Click-triggered and persistent so its controls are actually reachable.',
    whenNotToUse:
      'Essential always-needed content (it is hidden until triggered), large or complex content that overflows the bubble and breaks the anchor, or a plain non-interactive hint.',
    useInstead:
      'A tooltip for a non-interactive hint (simpler, hover or focus, no controls), a panel or a page for large or complex content, and inline content for anything essential. The popover is not the container for everything.',
  },
  {
    id: 'dropdown-menu',
    name: 'Dropdown menu',
    category: 'disclosure',
    whatItIs:
      'A control that reveals a list of options or actions on click, collapsed by default.',
    whenToUse:
      'Many options (a country list), or secondary and overflow actions, or when space is genuinely tight and the options do not need to be compared. Collapsing the list is the whole point, and it earns the click.',
    whenNotToUse:
      'A small set of mutually exclusive options (2 to 5) the user should see and compare at once, a primary choice central to the task, or anywhere hiding the options behind a click is pure friction with nothing gained.',
    useInstead:
      'A segmented control or radio group for a small, visible, comparable set, and plain visible buttons for a primary action. The same dropdown that is wrong for three options is right for two hundred — the test is whether collapsing buys anything.',
  },
  {
    id: 'segmented-control-vs-dropdown',
    name: 'Segmented control vs dropdown',
    category: 'input',
    whatItIs:
      'Two ways to present one set of mutually exclusive options: all visible as a segmented control, or collapsed into a dropdown.',
    whenToUse:
      'A segmented control when the options are few (2 to 5), short-labelled, and benefit from being seen and compared at once. A dropdown when they are many, long, or secondary, where always showing them only costs space.',
    whenNotToUse:
      'A segmented control once the set grows past a handful or the labels get long (it becomes an unscannable wall that eats the layout), and a dropdown for the two or three options central to a decision (it hides what should be compared).',
    useInstead:
      'This entry is the decision itself, and it pairs with the dropdown entry from the other side: choose by option count and label length. Few and short, show them; many or long, collapse them. The threshold is a handful.',
  },
  {
    id: 'multi-step-form',
    name: 'Multi-step form / wizard',
    category: 'input',
    whatItIs:
      'A long form broken into sequential steps with progress, rather than one long page.',
    whenToUse:
      'A genuinely long or complex form where steps reduce overwhelm, where inputs have a natural order or branch, or where visible progress reassures the user through a heavy task.',
    whenNotToUse:
      'A short form, where steps add clicks and hide how little is actually left, forms where users want to see everything or jump around, and above all padding a four-field form into a three-step wizard for the look of it.',
    useInstead:
      'A single well-grouped form for anything short, and a single page with clear sections when users need the overview. Steps are a cost that only a genuinely long or branching form earns back.',
  },
  {
    id: 'confirmation-vs-undo',
    name: 'Confirmation dialog vs undo',
    category: 'content',
    whatItIs:
      'Two ways to protect against mistakes: ask the user to confirm before an action, or let it happen with an easy undo.',
    whenToUse:
      'Undo for most reversible actions: it is frictionless and trusts the user. A confirmation dialog for the genuinely destructive and irreversible, where one deliberate moment of friction is worth it.',
    whenNotToUse:
      'A confirmation on routine reversible actions. Constant "are you sure" dialogs train the user to click through them without reading, so the dialog stops protecting anything precisely when you needed it to.',
    useInstead:
      'This entry is the choice: friction-now versus reversible-later. Default to undo and reserve the confirmation for the irreversible, so that when a dialog does appear it still carries weight.',
  },

  // — Milestone 4: the final five, the tool complete at 18 of 18 —
  {
    id: 'progressive-disclosure',
    name: 'Progressive disclosure / "show more"',
    category: 'disclosure',
    whatItIs:
      'Revealing secondary content or controls only when the user asks, keeping the default view simple.',
    whenToUse:
      'Advanced or optional settings most users never touch, long content where a preview plus an honest "show more" respects the reader, and genuinely secondary detail that would only clutter the common path.',
    whenNotToUse:
      'Hiding content users routinely need (the reveal click becomes constant friction), hiding so much that the default view is uninformative, or using disclosure to disguise an overloaded interface instead of actually simplifying it.',
    useInstead:
      'Just show the content when most users need it, and give genuinely large secondary content its own page or section. Disclosure earns its place only when most users would skip what it hides.',
  },
  {
    id: 'tabs',
    name: 'Tabs',
    category: 'disclosure',
    whatItIs:
      'A row of labels that switch between peer panels in the same space, one visible at a time.',
    whenToUse:
      'A few peer sections of the same object that users view one at a time (a product\'s description, specs and reviews; a settings page), where no two sections need to be seen together.',
    whenNotToUse:
      'Content users must compare across sections (tabs hide all but one, forcing memory, this is the accordion problem from the tab side), a sequence that is really a wizard, too many tabs (the content wants another structure), or primary content that should just be visible.',
    useInstead:
      'Show the content together when sections must be compared or are short, a multi-step form for a sequence, and sub-navigation or separate pages for many distinct areas.',
  },
  {
    id: 'search-as-you-type',
    name: 'Search-as-you-type',
    category: 'input',
    whatItIs:
      'A search field that filters or suggests results live as the user types, rather than on submit.',
    whenToUse:
      'A bounded, fast, local dataset where instant filtering genuinely helps: filtering a visible list, a command palette, anything where feedback is immediate and predictable.',
    whenNotToUse:
      'Slow or expensive queries where every keystroke fires a request (wasteful and janky), large or remote datasets where live results lag or mislead, or when the user is better off composing a full query before searching.',
    useInstead:
      'A submit or search button for expensive or remote queries, and debounced search-as-you-type as the middle ground when live feedback is wanted but each query has a real cost.',
  },
  {
    id: 'empty-state',
    name: 'Empty state',
    category: 'content',
    whatItIs:
      'The designed state of a screen or section when it has no content yet: a new account, a cleared list, no results.',
    whenToUse:
      'It is not optional. Any view that can be empty has an empty state whether you design it or not. The only question is whether it is a designed moment or an accident.',
    whenNotToUse:
      'A literal blank space (the user thinks it is broken or unfinished), an empty state that only states the emptiness ("No items") with no path forward, or a discouraging dead end where a first run could have been an onboarding moment.',
    useInstead:
      'An empty state that does a job: orient the user, explain why it is empty, and offer the next step. Treat the first-run empty state as onboarding, a doorway, not a dead end.',
  },
  {
    id: 'drag-and-drop',
    name: 'Drag-and-drop',
    category: 'content',
    whatItIs:
      'Letting users move or reorder items by dragging them directly.',
    whenToUse:
      'Direct manipulation that genuinely fits the task: reordering a short list, moving a card between columns, where dragging is intuitive and the items are few enough to drag comfortably.',
    whenNotToUse:
      'As the only way to perform the action. Drag is invisible (nothing signals an item is draggable), hard or impossible on touch and keyboard, and clumsy for long lists. Drag-only locks out anyone who cannot or does not discover the drag.',
    useInstead:
      'Keep the drag as an enhancement, but make the same action reachable another way: up and down controls, a "move to" menu, a position input. The genuine tension is drag-as-only-affordance versus drag-plus-a-visible-fallback, and the fallback is not optional.',
  },
];
