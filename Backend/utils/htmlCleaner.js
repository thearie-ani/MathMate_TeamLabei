import sanitizeHtml from "sanitize-html";
// Tags/attributes we keep. This intentionally keeps MathML tags so KaTeX
// (or a MathML-aware renderer) can render formulas that OpenStax embeds
// as <math>...</math>, plus the standard rich-text tags Tiptap understands.
const ALLOWED_TAGS = [
  'h1', 'h2', 'h3', 'h4', 'h5', 'h6',
  'p', 'br', 'hr', 'blockquote',
  'ul', 'ol', 'li',
  'strong', 'em', 'b', 'i', 'u', 's', 'code', 'pre', 'mark', 'sub', 'sup',
  'a', 'img', 'figure', 'figcaption',
  'table', 'thead', 'tbody', 'tr', 'th', 'td',
  'span', 'div',
  // MathML for formulas
  'math', 'mrow', 'mi', 'mn', 'mo', 'msup', 'msub', 'msubsup', 'mfrac',
  'msqrt', 'mroot', 'mtext', 'mspace', 'mtable', 'mtr', 'mtd', 'mover',
  'munder', 'munderover', 'semantics', 'annotation',
];

const ALLOWED_ATTRIBUTES = {
  a: ['href', 'name', 'target', 'rel'],
  img: ['src', 'alt', 'width', 'height'],
  span: ['class'],
  div: ['class'],
  '*': ['id'],
};

/**
 * Strips scripts, styles, nav chrome, tracking attributes, inline event
 * handlers, etc, and returns clean HTML safe to store and render.
 */
export function cleanHtml(rawHtml) {
  return sanitizeHtml(rawHtml, {
    allowedTags: ALLOWED_TAGS,
    allowedAttributes: ALLOWED_ATTRIBUTES,
    allowedSchemes: ['http', 'https', 'data'],
    // Drop empty paragraphs/divs left behind after stripping nav/aside content
    exclusiveFilter: (frame) =>
      ['p', 'div'].includes(frame.tag) && !frame.text.trim() && !frame.attribs['class'],
    transformTags: {
      // OpenStax uses semantic <section>/<article>; fold them into <div>
      section: 'div',
      article: 'div',
    },
  }).trim();
}

