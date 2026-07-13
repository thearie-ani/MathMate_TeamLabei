import parse, { domToReact } from 'html-react-parser';
import { InlineMath } from 'react-katex';
import 'katex/dist/katex.min.css';
import { sanitizeQuillHtml } from '../../utils/sanitizeHtml';

/**
 * Design note on why formulas are re-rendered instead of stored pre-rendered:
 *
 * Quill's built-in 'formula' blot renders KaTeX markup (nested <span>/MathML)
 * at insert time and that markup would end up in the saved HTML. We
 * deliberately DON'T persist that rendered markup. Two reasons:
 *
 *   1. The sanitizer allowlist (both client DOMPurify and server
 *      sanitize-html) only allows a narrow, semantic tag set. KaTeX's
 *      rendered output uses dozens of span/MathML tags that would either
 *      have to be allowlisted (weakening the sanitizer) or get stripped
 *      (breaking the formula's visual structure).
 *   2. Storing only the raw LaTeX (`data-value` on a bare
 *      <span class="ql-formula">`) keeps the DB payload small and lets the
 *      *rendering* library evolve independently of stored content.
 *
 * So: editor produces `<span class="ql-formula" data-value="\int_a^b f(x)dx">`,
 * the sanitizer strips everything except that span + its data-value, and
 * THIS component is the single place that turns data-value back into a
 * rendered formula — used identically by the admin PreviewPage and the
 * real student-facing view, so what the admin sees is what students see.
 */
export default function KatexRenderer({ html, className = 'lesson-content' }) {
  const safeHtml = sanitizeQuillHtml(html || '');

  const options = {
    replace: (node) => {
      if (
        node.type === 'tag' &&
        node.name === 'span' &&
        node.attribs?.class?.split(' ').includes('ql-formula')
      ) {
        const latex = node.attribs['data-value'];
        if (!latex) return null;

        try {
          return <InlineMath math={latex} />;
        } catch {
          // Malformed LaTeX shouldn't crash the whole page — fall back to
          // showing the raw expression so an admin notices and fixes it.
          return <code className="lesson-content__formula-error">{latex}</code>;
        }
      }
      return undefined; // let html-react-parser handle everything else normally
    },
  };

  return <div className={className}>{parse(safeHtml, options)}</div>;
}

// Re-exported so callers that need raw dom-to-react access (rare) don't
// need a second import path.
export { domToReact };
