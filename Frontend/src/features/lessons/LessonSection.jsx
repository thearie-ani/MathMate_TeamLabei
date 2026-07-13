export default function LessonSection({ section }) {
  return (
    <section id={section.id} className="lesson-section">
      <h2 className="lesson-section-title">{section.title}</h2>
      <div className="lesson-section-body">{section.content}</div>
    </section>
  );
}
