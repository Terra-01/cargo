'use client';

interface LoaderPreviewProps {
  id: string;
}

export function LoaderPreview({ id }: LoaderPreviewProps) {
  switch (id) {
    case 'skeleton-text':
      return (
        <div className="ls-skeleton" style={{ width: '85%' }}>
          <div className="ls-skeleton__line" />
          <div className="ls-skeleton__line" />
          <div className="ls-skeleton__line" />
        </div>
      );
    case 'skeleton-card':
      return (
        <div className="ls-card-skeleton" style={{ width: '88%' }}>
          <div className="ls-card-skeleton__title" />
          <div className="ls-card-skeleton__line" />
          <div className="ls-card-skeleton__line" />
          <div className="ls-card-skeleton__button" />
        </div>
      );
    case 'spinner-classic':
      return <div className="ls-spinner" role="status" aria-label="Loading" />;
    case 'spinner-conic':
      return <div className="ls-spinner-conic" role="status" aria-label="Loading" />;
    case 'pulse-dots':
      return (
        <div className="ls-pulse-dots" role="status" aria-label="Loading">
          <span /><span /><span />
        </div>
      );
    case 'bouncing-dots':
      return (
        <div className="ls-bouncing-dots" role="status" aria-label="Loading">
          <span /><span /><span />
        </div>
      );
    case 'progress-bar':
      return (
        <div className="ls-progress" role="progressbar" aria-label="Loading" style={{ width: '85%' }}>
          <div className="ls-progress__fill" />
        </div>
      );
    case 'wave-bars':
      return (
        <div className="ls-wave" role="status" aria-label="Loading">
          <span /><span /><span /><span /><span />
        </div>
      );
    case 'skeleton-pulse':
      return (
        <div className="ls-skeleton-pulse" style={{ width: '85%' }}>
          <div className="ls-skeleton-pulse__line" />
          <div className="ls-skeleton-pulse__line" />
          <div className="ls-skeleton-pulse__line" />
        </div>
      );
    case 'spinner-dual-ring':
      return (
        <div className="ls-dual-ring" role="status" aria-label="Loading">
          <div className="ls-dual-ring__outer" />
          <div className="ls-dual-ring__inner" />
        </div>
      );
    case 'fading-dots':
      return (
        <div className="ls-fading-dots" role="status" aria-label="Loading">
          <span /><span /><span />
        </div>
      );
    case 'indeterminate-stripes':
      return (
        <div
          className="ls-stripes"
          role="status"
          aria-label="Loading"
          style={{ width: '85%' }}
        />
      );
    case 'progress-percent':
      return (
        <div className="ls-progress-pct" style={{ width: '85%' }}>
          <div
            className="ls-progress-pct__track"
            role="progressbar"
            aria-valuenow={65}
            aria-valuemin={0}
            aria-valuemax={100}
          >
            <div className="ls-progress-pct__fill" />
          </div>
          <span className="ls-progress-pct__label">65%</span>
        </div>
      );
    case 'progress-ring':
      return (
        <div
          className="ls-progress-ring"
          role="progressbar"
          aria-valuenow={65}
          aria-valuemin={0}
          aria-valuemax={100}
        >
          <div className="ls-progress-ring__circle" />
          <span className="ls-progress-ring__label">65%</span>
        </div>
      );
    case 'progress-segments':
      return (
        <div
          className="ls-seg-progress"
          role="progressbar"
          aria-valuenow={3}
          aria-valuemin={0}
          aria-valuemax={5}
          aria-label="Step 3 of 5"
          style={{ width: '85%' }}
        >
          <span className="ls-seg-progress__seg is-filled" />
          <span className="ls-seg-progress__seg is-filled" />
          <span className="ls-seg-progress__seg is-filled is-current" />
          <span className="ls-seg-progress__seg" />
          <span className="ls-seg-progress__seg" />
        </div>
      );
    case 'overlay-spinner':
      return (
        <div className="ls-overlay-host">
          <div className="ls-overlay-bg">
            <span className="ls-overlay-bg__title" />
            <span className="ls-overlay-bg__line" />
            <span className="ls-overlay-bg__line" />
            <span className="ls-overlay-bg__line ls-overlay-bg__line--short" />
          </div>
          <div
            className="ls-overlay-scrim ls-overlay-scrim--plain"
            role="status"
            aria-label="Loading"
          >
            <div className="ls-overlay-scrim__spinner" />
          </div>
        </div>
      );
    case 'overlay-message':
      return (
        <div className="ls-overlay-host">
          <div className="ls-overlay-bg">
            <span className="ls-overlay-bg__title" />
            <span className="ls-overlay-bg__line" />
            <span className="ls-overlay-bg__line" />
            <span className="ls-overlay-bg__line ls-overlay-bg__line--short" />
          </div>
          <div
            className="ls-overlay-scrim ls-overlay-scrim--msg"
            role="status"
            aria-label="Loading"
          >
            <div className="ls-overlay-scrim__spinner" />
            <span className="ls-overlay-scrim__text">Loading</span>
          </div>
        </div>
      );
    case 'overlay-blur':
      return (
        <div className="ls-overlay-host">
          <div className="ls-overlay-bg">
            <span className="ls-overlay-bg__title" />
            <span className="ls-overlay-bg__line" />
            <span className="ls-overlay-bg__line" />
            <span className="ls-overlay-bg__line ls-overlay-bg__line--short" />
          </div>
          <div
            className="ls-overlay-scrim ls-overlay-scrim--blur"
            role="status"
            aria-label="Loading"
          >
            <div className="ls-overlay-scrim__spinner" />
          </div>
        </div>
      );
    case 'inline-button':
      return (
        <span className="ls-btn-loading">
          <span className="ls-btn-loading__spinner" aria-hidden="true" />
          Submitting
        </span>
      );
    case 'inline-text':
      return (
        <span className="ls-inline-loading">
          <span className="ls-inline-loading__spinner" aria-hidden="true" />
          Saving changes
        </span>
      );
    case 'inline-dots':
      return (
        <span className="ls-inline-sentence">
          Sending message
          <span className="ls-inline-dots" role="status" aria-label="Loading">
            <span /><span /><span />
          </span>
        </span>
      );
    default:
      return null;
  }
}
