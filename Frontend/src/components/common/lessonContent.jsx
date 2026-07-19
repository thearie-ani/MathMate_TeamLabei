import { useEffect, useRef } from 'react';
import renderMathInElement from 'katex/contrib/auto-render';

/**
 * Read-only renderer for a lesson's stored HTML.
 *
 * Two kinds of math can appear in `html`:
 *  1. Native <math>...</math> (MathML) - this is what OpenStax pages embed,
 *     and modern browsers (Chrome, Firefox, Safari) render it natively, so
 *     it needs no extra work here.
 *  2. Inline TeX written by an admin directly in the Tiptap editor, e.g.
 *     "the derivative is $f'(x) = 2x$" - KaTeX's auto-render extension scans
 *     the rendered DOM for $...$ / \(...\) / \[...\] delimiters and swaps
 *     them for typeset formulas.
 */
export default function LessonContent({ html }) {
  const containerRef = useRef(null);

  useEffect(() => {
    if (!containerRef.current) return;
    renderMathInElement(containerRef.current, {
      delimiters: [
        { left: '$$', right: '$$', display: true },
        { left: '\\[', right: '\\]', display: true },
        { left: '$', right: '$', display: false },
        { left: '\\(', right: '\\)', display: false },
      ],
      throwOnError: false,
    });
  }, [html]);

  return (
    <div
      ref={containerRef}
      className="prose-lesson max-w-none"
      // Content is sanitized server-side (services/htmlCleaner.js) before
      // it's ever saved, so it's safe to render here.
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
}
