import { marked } from 'marked';

/**
 * Configure marked options for clean GitHub-like markdown
 */
marked.setOptions({
  gfm: true,
  breaks: true,
});

/**
 * Transform raw Markdown containing [[wikilinks]] and #tags into HTML.
 */
export function renderMarkdown(
  markdown: string,
  existingTitles: Set<string>
): string {
  // 1. Replace [[Target]] or [[Target|Alias]] with custom span/link tags
  const processed = markdown.replace(/\[\[([^[\]]+?)\]\]/g, (_, match) => {
    const parts = match.split('|');
    const target = parts[0].trim();
    const alias = (parts[1] ? parts[1].trim() : target);
    const exists = existingTitles.has(target.toLowerCase());

    const statusClass = exists
      ? 'text-primary hover:underline bg-primary/10 border-primary/30'
      : 'text-amber-500 hover:underline bg-amber-500/10 border-dashed border-amber-500/40';

    return `<span class="inline-flex items-center px-1.5 py-0.5 rounded text-xs font-medium cursor-pointer border wikilink-pill ${statusClass}" data-wikilink="${escapeHtml(target)}">[[${escapeHtml(alias)}]]</span>`;
  });

  // 2. Parse using marked
  const rawHtml = marked.parse(processed, { async: false }) as string;
  return rawHtml;
}

function escapeHtml(str: string): string {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}
