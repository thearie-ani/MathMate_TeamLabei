import { NavLink } from 'react-router-dom';

// Groups a flat lesson list by chapter and renders it as the course's
// table of contents. Chapter/order come straight from the DB so this stays
// in sync with how lessons were imported or authored.
export default function LessonSidebar({ courseSlug, lessons }) {
  const chapters = lessons.reduce((acc, lesson) => {
    (acc[lesson.chapter] ||= []).push(lesson);
    return acc;
  }, {});

  return (
    <nav className="space-y-6">
      {Object.entries(chapters)
        .sort(([a], [b]) => Number(a) - Number(b))
        .map(([chapter, items]) => (
          <div key={chapter}>
            <h4 className="text-xs font-semibold uppercase tracking-wide text-ink/40 mb-2">
              Chapter {chapter}
            </h4>
            <ul className="space-y-1">
              {items
                .sort((a, b) => a.order - b.order)
                .map((lesson) => (
                  <li key={lesson._id}>
                    <NavLink
                      to={`/courses/${courseSlug}/lessons/${lesson.slug}`}
                      className={({ isActive }) =>
                        `block rounded-md px-3 py-1.5 text-sm transition-colors ${
                          isActive
                            ? 'bg-moss bg-pink-500 text-white font-medium'
                            : 'text-ink/70 hover:bg-ink/5 hover:text-ink'
                        }`
                      }
                    >
                      {lesson.title}
                      {lesson.status === 'draft' && (
                        <span className="ml-2 text-[10px] uppercase text-brass">draft</span>
                      )}
                    </NavLink>
                  </li>
                ))}
            </ul>
          </div>
        ))}
    </nav>
  );
}
