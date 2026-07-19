export function parseOpenstaxUrl(rawUrl) {
  const url = new URL(rawUrl);
  const parts = url.pathname.split('/').filter(Boolean); // e.g. ['books','calculus-volume-1','pages','1-2-basic-classes-of-functions']

  const booksIdx = parts.indexOf('books');
  const pagesIdx = parts.indexOf('pages');

  if (booksIdx === -1 || pagesIdx === -1 || !parts[booksIdx + 1] || !parts[pagesIdx + 1]) {
    throw new Error(
      'URL does not look like an OpenStax book page. Expected format: https://openstax.org/books/<book>/pages/<page>'
    );
  }

  const bookSlug = parts[booksIdx + 1];
  const pageSlug = parts[pagesIdx + 1];

  // Try "<chapter>-<order>-<rest>" first, e.g. "1-2-basic-classes-of-functions"
  let match = pageSlug.match(/^(\d+)-(\d+)-(.+)$/);
  if (match) {
    return {
      bookSlug,
      pageSlug,
      chapter: Number(match[1]),
      order: Number(match[2]),
      slugWords: match[3],
    };
  }

  // Fall back to "<chapter>-<rest>", e.g. "3-introduction" (order defaults to 0
  // so introduction/overview pages sort first within their chapter)
  match = pageSlug.match(/^(\d+)-(.+)$/);
  if (match) {
    return {
      bookSlug,
      pageSlug,
      chapter: Number(match[1]),
      order: 0,
      slugWords: match[2],
    };
  }

  // No leading numbers at all (rare) - treat as chapter 0
  return { bookSlug, pageSlug, chapter: 0, order: 0, slugWords: pageSlug };
}

