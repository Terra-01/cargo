import Link from 'next/link';
import type { Tool } from '@/lib/tools';

interface ToolCardProps {
  tool: Tool;
}

export function ToolCard({ tool }: ToolCardProps) {
  const { Preview } = tool;
  const isComingSoon = tool.status === 'coming_soon';

  const content = (
    <>
      <span className="tool-card__manifest">CARGO/{tool.number}</span>
      <div>
        <p className="tool-card__category">[ {tool.category} ]</p>
        <h3 className="tool-card__title">{tool.title}</h3>
        <p className="tool-card__desc">{tool.description}</p>
        <div className="tag-group">
          {tool.tags.map((tag) => (
            <span key={tag} className="tag">{tag}</span>
          ))}
          {isComingSoon && (
            <span className="tag tag--soon" aria-label="Coming soon">soon</span>
          )}
        </div>
      </div>
      <div className="tool-card__preview">
        <Preview />
      </div>
    </>
  );

  if (isComingSoon) {
    return (
      <div
        className="tool-card tool-card--coming-soon"
        aria-disabled="true"
        data-status="coming_soon"
        data-tool-id={tool.id}
      >
        {content}
      </div>
    );
  }

  return (
    <Link
      href={tool.href}
      className="tool-card"
      data-status="shipped"
      data-tool-id={tool.id}
    >
      {content}
    </Link>
  );
}
