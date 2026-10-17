import React, { useMemo } from 'react';
import { renderMarkdown } from '../../core/markdown/parser';

interface MarkdownPreviewProps {
  content: string;
  existingTitles: Set<string>;
  onNavigateWikilink: (targetTitle: string) => void;
}

export const MarkdownPreview: React.FC<MarkdownPreviewProps> = ({
  content,
  existingTitles,
  onNavigateWikilink,
}) => {
  const html = useMemo(() => {
    return renderMarkdown(content, existingTitles);
  }, [content, existingTitles]);

  const handleClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const target = (e.target as HTMLElement).closest('.wikilink-pill');
    if (target) {
      const linkTarget = target.getAttribute('data-wikilink');
      if (linkTarget) {
        onNavigateWikilink(linkTarget);
      }
    }
  };

  return (
    <div
      onClick={handleClick}
      className="markdown-body p-6 overflow-y-auto max-w-4xl mx-auto h-full"
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
};
