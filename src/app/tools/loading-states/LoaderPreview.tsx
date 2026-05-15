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
    default:
      return null;
  }
}
