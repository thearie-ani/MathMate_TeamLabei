import katex from 'katex';

// Quill's built-in 'formula' format (the Katex blot) looks for a global
// `window.katex` at registration time — this is a Quill/KaTeX integration
// requirement, not a stylistic choice. Doing it here (module load time,
// imported once by RichTextEditor) keeps the global assignment in exactly
// one place instead of scattered across the app.
if (typeof window !== 'undefined') {
  window.katex = katex;
}

export const QUILL_TOOLBAR_MODULE = [
  [{ header: [2, 3, false] }],
  ['bold', 'italic', 'underline', 'strike'],
  [{ list: 'ordered' }, { list: 'bullet' }],
  ['blockquote', 'code-block'],
  ['link'],
  ['formula'], // <-- inserts a KaTeX-rendered LaTeX blot: \int_a^b f(x)\,dx
  ['clean'],
];

export const QUILL_MODULES = {
  toolbar: QUILL_TOOLBAR_MODULE,
  clipboard: {
    // OpenStax HTML is frequently pasted in wholesale; matchVisual off
    // avoids Quill inserting extra <p> wrappers that fight our own
    // sanitizer allowlist.
    matchVisual: false,
  },
};

export const QUILL_FORMATS = [
  'header', 'bold', 'italic', 'underline', 'strike',
  'list', 'bullet', 'blockquote', 'code-block', 'link', 'formula',
];