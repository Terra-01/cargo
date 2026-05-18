import type { ComponentType } from 'react';
import { ModalDialogExample } from './ModalDialogExample';
import { PaginationVsInfiniteScrollExample } from './PaginationVsInfiniteScrollExample';
import { OptimisticVsPessimisticExample } from './OptimisticVsPessimisticExample';
import { ToastNotificationExample } from './ToastNotificationExample';
import { TooltipExample } from './TooltipExample';
import { AccordionExample } from './AccordionExample';
import { InlineValidationExample } from './InlineValidationExample';
import { SkeletonVsSpinnerExample } from './SkeletonVsSpinnerExample';
import { PopoverExample } from './PopoverExample';
import { DropdownMenuExample } from './DropdownMenuExample';
import { SegmentedVsDropdownExample } from './SegmentedVsDropdownExample';
import { MultiStepFormExample } from './MultiStepFormExample';
import { ConfirmationVsUndoExample } from './ConfirmationVsUndoExample';
import { ProgressiveDisclosureExample } from './ProgressiveDisclosureExample';
import { TabsExample } from './TabsExample';
import { SearchAsYouTypeExample } from './SearchAsYouTypeExample';
import { EmptyStateExample } from './EmptyStateExample';
import { DragAndDropExample } from './DragAndDropExample';

// id (from src/lib/ui-patterns.ts) → its live, interactive example component.
//
// Adding a later-milestone entry is exactly: add a data object in
// ui-patterns.ts, add an example component file here, add one line below.
// Nothing else in the shell or card has to change.
export const patternExamples: Record<string, ComponentType> = {
  // M1
  'modal-dialog': ModalDialogExample,
  'pagination-vs-infinite-scroll': PaginationVsInfiniteScrollExample,
  'optimistic-vs-pessimistic-ui': OptimisticVsPessimisticExample,
  // M2
  'toast-notification': ToastNotificationExample,
  tooltip: TooltipExample,
  accordion: AccordionExample,
  'inline-validation': InlineValidationExample,
  'skeleton-vs-spinner': SkeletonVsSpinnerExample,
  // M3
  popover: PopoverExample,
  'dropdown-menu': DropdownMenuExample,
  'segmented-control-vs-dropdown': SegmentedVsDropdownExample,
  'multi-step-form': MultiStepFormExample,
  'confirmation-vs-undo': ConfirmationVsUndoExample,
  // M4
  'progressive-disclosure': ProgressiveDisclosureExample,
  tabs: TabsExample,
  'search-as-you-type': SearchAsYouTypeExample,
  'empty-state': EmptyStateExample,
  'drag-and-drop': DragAndDropExample,
};
