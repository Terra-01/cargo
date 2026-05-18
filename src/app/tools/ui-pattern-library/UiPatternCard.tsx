import type { UiPattern } from '@/lib/ui-patterns';
import { UI_PATTERN_CATEGORY_LABELS } from '@/lib/ui-patterns';
import { patternExamples } from './examples';

interface Props {
  pattern: UiPattern;
}

// One entry: the full anatomy on the left, the real live example on the right
// (they stack on narrow screens). Every field of the data structure is shown,
// so a later-milestone entry renders correctly with zero card changes.
export function UiPatternCard({ pattern }: Props) {
  const Example = patternExamples[pattern.id];

  return (
    <article
      className="upl-card"
      data-testid={`upl-card-${pattern.id}`}
      data-category={pattern.category}
    >
      <header className="upl-card__head">
        <p className="eyebrow upl-card__eyebrow">
          {'// '}{UI_PATTERN_CATEGORY_LABELS[pattern.category]}
        </p>
        <h2 className="upl-card__name">{pattern.name}</h2>
        <p className="upl-card__what">{pattern.whatItIs}</p>
      </header>

      <div className="upl-card__body">
        <div className="upl-card__anatomy">
          <div className="upl-anat" data-kind="use">
            <span className="upl-anat__label">when to use</span>
            <p>{pattern.whenToUse}</p>
          </div>
          <div className="upl-anat" data-kind="avoid">
            <span className="upl-anat__label">when not to use</span>
            <p>{pattern.whenNotToUse}</p>
          </div>
          <div className="upl-anat" data-kind="instead">
            <span className="upl-anat__label">use instead</span>
            <p>{pattern.useInstead}</p>
          </div>
        </div>

        <div className="upl-card__example" data-testid={`upl-example-${pattern.id}`}>
          <span className="upl-card__example-tag">live example</span>
          {/* Containment for D1: a wide demo scrolls inside its own box
              instead of widening the card and the page. The tag sits
              outside this wrapper so it is never clipped. D2 fixes each
              demo's internals so this scroll is rarely needed. */}
          <div className="upl-card__example-scroll">
            {Example ? (
              <Example />
            ) : (
              <p className="upl-card__example-missing">
                No example wired for “{pattern.id}”.
              </p>
            )}
          </div>
        </div>
      </div>
    </article>
  );
}
