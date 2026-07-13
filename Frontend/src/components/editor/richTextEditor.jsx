import { useMemo } from 'react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import 'katex/dist/katex.min.css';
import { QUILL_MODULES, QUILL_FORMATS } from './quillConfig';
import { sanitizeQuillHtml } from '../../utils/sanitizeHtml';


export default function RichTextEditor({ value, onChange, placeholder, error, id }) {
  const modules = useMemo(() => QUILL_MODULES, []);

  const handleChange = (html) => {
    onChange(sanitizeQuillHtml(html));
  };

  return (
    <div className="rich-text-editor">
      <ReactQuill
        id={id}
        theme="snow"
        value={value}
        onChange={handleChange}
        modules={modules}
        formats={QUILL_FORMATS}
        placeholder={placeholder}
        aria-invalid={!!error}
      />
      {error && (
        <p className="rich-text-editor__error" role="alert">
          {error}
        </p>
      )}
    </div>
  );
}