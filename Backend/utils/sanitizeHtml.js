import sanitizeHtml from 'sanitize-html';


const ALLOWED_TAGS = [
  'p', 'br', 'strong', 'em', 'u', 's', 'blockquote',
  'h1', 'h2', 'h3', 'h4',
  'ul', 'ol', 'li',
  'a', 'span', 'sub', 'sup', 'code', 'pre',
  'table', 'thead', 'tbody', 'tr', 'th', 'td',
];

const ALLOWED_ATTRIBUTES = {
  a: ['href', 'target', 'rel'],
  span: ['class', 'data-value'], // data-value carries the raw LaTeX for ql-formula spans
  '*': ['class'],
};

export function sanitizeContentHtml(dirtyHtml = '') {
  return sanitizeHtml(dirtyHtml, {
    allowedTags: ALLOWED_TAGS,
    allowedAttributes: ALLOWED_ATTRIBUTES,
    // Prevent `javascript:` / `data:` URI injection in links.
    allowedSchemes: ['http', 'https', 'mailto'],
    // Strip any style attributes entirely — formatting should come from
    // Quill's semantic classes (ql-*), not inline style injection.
    allowedStyles: {},
    transformTags: {
      a: sanitizeHtml.simpleTransform('a', { rel: 'noopener noreferrer', target: '_blank' }),
    },
  });
}

