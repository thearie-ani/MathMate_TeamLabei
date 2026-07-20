import { Link } from "react-router-dom";
import { ArrowUpRight } from "lucide-react";
import { useAuth } from "../../context/AuthContext.jsx";

const SUBJECTS = [
  { id: "calc1", label: "Calculus I", lessons: 41, note: "Limits → Integrals", accent: "pink" },
  { id: "calc2", label: "Calculus II", lessons: 44, note: "Series → Vectors", accent: "violet" },
  { id: "stats", label: "Statistics", lessons: 28, note: "Distributions → Inference", accent: "violet" },
  { id: "algebra", label: "Algebra", lessons: 22, note: "Foundations → Functions", accent: "pink" },
];

export default function CourseCatalog() {
  const { user, loading, isAuthenticated } = useAuth();

  const getTarget = () => {
    if (loading || !isAuthenticated) {
      return "/login";
    }

    return user.role === "admin" ? "/admin/courses" : "/courses";
  };

  const target = getTarget();

  return (
    <section id="subjects" className="px-6 py-20 md:py-24">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-2xl md:text-3xl font-bold text-[#1a1535]">Indexed, not summarized</h2>
        <p className="mt-2 text-sm text-gray-500 max-w-md">
          Every lesson below is chunked and embedded — MathMate cites the section it drew from.
        </p>

        <div className="mt-12 grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {SUBJECTS.map((s) => (
            <Link
              key={s.id}
              to={target}
              className="group rounded-2xl border border-[#e8e4f8] bg-white p-5 hover:border-violet-300 hover:shadow-md transition-all"
            >
              <div className="flex items-center justify-between">
                <span className="font-bold text-[#1a1535]">{s.label}</span>
                <ArrowUpRight
                  size={16}
                  className="text-gray-300 group-hover:text-[#ec4899] transition-colors"
                />
              </div>
              <p className="mt-2 text-xs text-gray-500">{s.note}</p>
              <span
                className={`mt-4 inline-flex items-center rounded-full px-2.5 py-1 text-[11px] font-semibold ${
                  s.accent === "pink" ? "bg-pink-50 text-pink-600" : "bg-violet-50 text-violet-600"
                }`}
              >
                {s.lessons} lessons
              </span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}