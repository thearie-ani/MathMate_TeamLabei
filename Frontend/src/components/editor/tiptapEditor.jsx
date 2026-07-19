import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Image from '@tiptap/extension-image';
import Link from '@tiptap/extension-link';
import Placeholder from '@tiptap/extension-placeholder';
import { useEffect } from 'react';
import * as courseApi from '../../api/courseApi';

function ToolbarButton({ onClick, active, children, title }) {
  return (
    <button
      type="button"
      title={title}
      onClick={onClick}
      className={`px-2.5 py-1.5 rounded text-sm font-medium transition-colors ${
        active ? 'bg-ink text-parchment' : 'text-ink/70 hover:bg-ink/10'
      }`}
    >
      {children}
    </button>
  );
}

/**
 * Rich text editor for admins. Loads existing lesson HTML in (for edit mode)
 * or starts blank (for new lessons / import review), and reports the current
 * HTML back to the parent via onChange so it can be saved to MongoDB.
 */
export default function TiptapEditor({ content, onChange, placeholder = 'Start writing the lesson…' }) {
  const editor = useEditor({
    extensions: [
      StarterKit,
      Image.configure({ HTMLAttributes: { class: 'rounded-md' } }),
      Link.configure({ openOnClick: false }),
      Placeholder.configure({ placeholder }),
    ],
    content: content || '',
    onUpdate: ({ editor: e }) => onChange(e.getHTML()),
    editorProps: {
      attributes: { class: 'prose-lesson focus:outline-none' },
    },
  });

  // If the parent swaps in new content (e.g. an OpenStax import just came
  // back, or a different lesson was selected to edit), sync the editor.
  useEffect(() => {
    if (editor && content !== undefined && content !== editor.getHTML()) {
      editor.commands.setContent(content || '', false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [content, editor]);

  if (!editor) return null;

  const handleImageUpload = async () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';
    input.onchange = async () => {
      const file = input.files?.[0];
      if (!file) return;
      try {
        const { url } = await courseApi.uploadImage(file);
        editor.chain().focus().setImage({ src: url }).run();
      } catch (err) {
        alert(err.response?.data?.message || 'Image upload failed');
      }
    };
    input.click();
  };

  const insertFormula = () => {
    const tex = window.prompt('Enter a LaTeX formula, e.g. f(x) = 2x^2 + 3');
    if (tex) editor.chain().focus().insertContent(` $${tex}$ `).run();
  };

  const addLink = () => {
    const url = window.prompt('Link URL');
    if (url) editor.chain().focus().setLink({ href: url }).run();
  };

  return (
    <div className="border border-ink/15 rounded-lg overflow-hidden bg-white">
      <div className="flex flex-wrap items-center gap-1 border-b border-ink/10 bg-ink/[0.02] px-2 py-1.5">
        <ToolbarButton title="Heading 1" active={editor.isActive('heading', { level: 1 })} onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}>H1</ToolbarButton>
        <ToolbarButton title="Heading 2" active={editor.isActive('heading', { level: 2 })} onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}>H2</ToolbarButton>
        <ToolbarButton title="Heading 3" active={editor.isActive('heading', { level: 3 })} onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}>H3</ToolbarButton>
        <span className="w-px h-5 bg-ink/10 mx-1" />
        <ToolbarButton title="Bold" active={editor.isActive('bold')} onClick={() => editor.chain().focus().toggleBold().run()}><b>B</b></ToolbarButton>
        <ToolbarButton title="Italic" active={editor.isActive('italic')} onClick={() => editor.chain().focus().toggleItalic().run()}><i>I</i></ToolbarButton>
        <ToolbarButton title="Inline code" active={editor.isActive('code')} onClick={() => editor.chain().focus().toggleCode().run()}>{'</>'}</ToolbarButton>
        <span className="w-px h-5 bg-ink/10 mx-1" />
        <ToolbarButton title="Bullet list" active={editor.isActive('bulletList')} onClick={() => editor.chain().focus().toggleBulletList().run()}>• List</ToolbarButton>
        <ToolbarButton title="Numbered list" active={editor.isActive('orderedList')} onClick={() => editor.chain().focus().toggleOrderedList().run()}>1. List</ToolbarButton>
        <ToolbarButton title="Blockquote" active={editor.isActive('blockquote')} onClick={() => editor.chain().focus().toggleBlockquote().run()}>&ldquo;&rdquo;</ToolbarButton>
        <span className="w-px h-5 bg-ink/10 mx-1" />
        <ToolbarButton title="Insert link" onClick={addLink}>Link</ToolbarButton>
        <ToolbarButton title="Insert image" onClick={handleImageUpload}>Image</ToolbarButton>
        <ToolbarButton title="Insert LaTeX formula" onClick={insertFormula}>∑ Formula</ToolbarButton>
      </div>
      <div className="px-4 py-3 max-h-[60vh] overflow-y-auto">
        <EditorContent editor={editor} />
      </div>
    </div>
  );
}
