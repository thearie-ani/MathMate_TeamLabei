export default function LessonTableOfContents({ sections = [], activeId, onSelect }) {
  return (
    <nav className="toc">
      <h3 className="toc-title">Contents</h3>
      <ul className="toc-list">
        {sections.map((sec) => (
          <li key={sec.id}>
            <button
              className={`toc-item ${activeId === sec.id ? "toc-item--active" : ""}`}
              onClick={() => onSelect(sec.id)}
            >
              {sec.title}
            </button>
          </li>
        ))}
      </ul>
    </nav>
  );
}
