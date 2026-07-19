import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import TiptapEditor from '../../components/editor/tiptapEditor';
import {courseApi} from '../../api/courseApi';

export default function AdminImportPage() {
  const navigate = useNavigate();
  const [url, setUrl] = useState('');
  const [fetching, setFetching] = useState(false);
  const [error, setError] = useState(null);
  const [preview, setPreview] = useState(null); // result from POST /api/import/openstax
  const [courseTitle, setCourseTitle] = useState('');

  const handleFetch = async (e) => {
    e.preventDefault();
    setFetching(true);
    setError(null);
    setPreview(null);
    try {
      const data = await courseApi.importFromOpenstax(url);
      setPreview(data);
      setCourseTitle(data.suggestedCourseTitle);
    } catch (err) {
      console.log(err.response?.data);
      setError(err.response?.data?.message || 'Import failed');
    } finally {
      setFetching(false);
    }
  };

  const handleContentChange = (html) => setPreview((p) => ({ ...p, contentHtml: html }));
  const handleTitleChange = (e) => setPreview((p) => ({ ...p, suggestedTitle: e.target.value }));

  const handleContinue = async () => {
    let course = preview.existingCourse;
    if (!course) {
      course = await courseApi.createCourse({
        title: courseTitle,
        slug: preview.bookSlug,
        description: `Imported from OpenStax ${preview.bookSlug}`,
        sourceUrl: preview.sourceUrl,
        status: "draft",
      });
    }

    navigate(`/admin/lessons/new?courseId=${course._id}`, {
      state: {
        prefill: {
          title: preview.suggestedTitle,
          slug: preview.pageSlug,
          chapter: preview.chapter,
          order: preview.order,
          content: preview.contentHtml,
          sourceUrl: preview.sourceUrl,
        },
      },
    });
  };

  return (
    <div className="max-w-4xl mx-auto px-6 py-12">
      <h1 className="font-display text-2xl font-semibold text-ink mb-1">Import from OpenStax</h1>
      <p className="text-ink/60 text-sm mb-6">
        Paste a book page URL (e.g. https://openstax.org/books/calculus-volume-1/pages/1-2-basic-classes-of-functions).
        We'll fetch it, clean it up, and let you review before anything is saved.
      </p>

      <form onSubmit={handleFetch} className="flex gap-3 mb-8">
        <input
          required
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          placeholder="https://openstax.org/books/.../pages/..."
          className="flex-1 rounded-md border border-ink/20 px-3 py-2 text-sm"
        />
        <button type="submit" disabled={fetching} className="bg-violet-700 text-white px-5 py-2 rounded-md bg-moss text-parchment text-sm font-medium hover:bg-moss/90 disabled:opacity-50">
          {fetching ? 'Fetching…' : 'Fetch page'}
        </button>
      </form>

      {error && <p className="text-sm text-red-600 mb-6">{error}</p>}

      {preview && (
        <div className="space-y-6">
          <div className="rounded-lg border border-brass/30 bg-brass/5 px-4 py-3 text-sm text-ink/70">
            Detected book <strong>{preview.bookSlug}</strong>, chapter <strong>{preview.chapter}</strong>, position <strong>{preview.order}</strong>.{' '}
            {preview.existingCourse ? (
              <>This will be added to the existing course <strong>{preview.existingCourse.title}</strong>.</>
            ) : (
              <>A new course will be created for this book.</>
            )}
          </div>

          {!preview.existingCourse && (
            <div>
              <label className="block text-sm font-medium text-ink/70 mb-1">New course title</label>
              <input
                value={courseTitle}
                onChange={(e) => setCourseTitle(e.target.value)}
                className="w-full rounded-md border border-ink/20 px-3 py-2 text-sm"
              />
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-ink/70 mb-1">Lesson title</label>
            <input
              value={preview.suggestedTitle}
              onChange={handleTitleChange}
              className="w-full rounded-md border border-ink/20 px-3 py-2 text-sm"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-ink/70 mb-1">Review &amp; edit content</label>
            <TiptapEditor content={preview.contentHtml} onChange={handleContentChange} />
          </div>

          <button onClick={handleContinue} className="bg-violet-600 text-white px-5 py-2 rounded-md bg-moss text-parchment text-sm font-medium hover:bg-moss/90">
            Continue to lesson editor
          </button>
        </div>
      )}
    </div>
  );
}
