interface ManifestStripProps {
  shipped: number;
  planned: number;
  version: string;
}

export function ManifestStrip({ shipped, planned, version }: ManifestStripProps) {
  return (
    <div className="manifest">
      <div className="manifest__item">
        <span className="manifest__label">Manifest</span>
        <span className="manifest__value">CARGO / 2026</span>
      </div>
      <div className="manifest__item">
        <span className="manifest__label">Tools shipped</span>
        <span className="manifest__value">{String(shipped).padStart(2, '0')} / {planned} planned</span>
      </div>
      <div className="manifest__item">
        <span className="manifest__label">License</span>
        <span className="manifest__value">Free, forever</span>
      </div>
      <div className="manifest__item">
        <span className="manifest__label">Version</span>
        <span className="manifest__value">{version}</span>
      </div>
    </div>
  );
}
