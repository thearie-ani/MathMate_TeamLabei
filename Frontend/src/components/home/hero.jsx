import { Link } from "react-router-dom";
import { Play } from "lucide-react";
import { useAuth } from "../../context/AuthContext.jsx";

function RetrievalGraph() {
  // ...unchanged, keep exactly as you have it
}

export default function Hero() {
  const { user, loading, isAuthenticated } = useAuth();

  const getCtaTarget = () => {
    if (loading || !isAuthenticated) {
      return "/login";
    }

    return user.role === "admin" ? "/admin" : "/courses";
  };

  const getCtaLabel = () => {
    if (loading) {
      return "Loading...";
    }

    if (!isAuthenticated) {
      return "Start Your Journey";
    }

    return user.role === "admin" ? "Go to Dashboard" : "Continue Learning";
  };

  const ctaTarget = getCtaTarget();

  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-pink-200 via-pink-100 to-[#3b2fa3] px-6 py-20 md:py-28">
      <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-12 items-center">
        <div>
          <span className="inline-flex items-center gap-2 rounded-full bg-white/60 px-3 py-1.5 text-xs font-semibold text-[#3b2fa3]">
            <span className="h-1.5 w-1.5 rounded-full bg-[#ec4899]" />
            Built on OpenStax · Answers by Claude
          </span>

          <h1 className="mt-6 text-4xl md:text-5xl font-extrabold leading-[1.1] text-[#1a1535]">
            Ask the question.
            <br />
            Trace the proof.
          </h1>

          <p className="mt-5 max-w-md text-sm leading-relaxed text-gray-600">
            MathMate retrieves the exact textbook passage behind every answer, so you're
            not trusting a guess — you're reading the source. Calculus I &amp; II,
            Statistics, and Algebra, indexed lesson by lesson.
          </p>

          <div className="mt-8 flex flex-wrap items-center gap-3">
            <Link
              to={ctaTarget}
              className="rounded-lg bg-[#3b2fa3] px-6 py-3 text-sm font-semibold text-white hover:bg-[#2f2482] transition-colors"
            >
              {getCtaLabel()}
            </Link>
            <button
              type="button"
              onClick={() => document.getElementById("how")?.scrollIntoView({ behavior: "smooth" })}
              className="flex items-center gap-2 rounded-lg bg-white/90 px-6 py-3 text-sm font-semibold text-[#1a1535] hover:bg-white transition-colors"
            >
              <Play size={14} fill="currentColor" />
              See how it retrieves
            </button>
          </div>

          <dl className="mt-12 grid grid-cols-3 gap-6 max-w-sm">
            {[
              ["135", "lessons indexed"],
              ["4", "subjects"],
              ["<2s", "avg. retrieval"],
            ].map(([n, l]) => (
              <div key={l}>
                <dt className="sr-only">{l}</dt>
                <dd className="text-2xl font-bold text-[#1a1535]">{n}</dd>
                <dd className="text-xs text-white/70 mt-1">{l}</dd>
              </div>
            ))}
          </dl>
        </div>

        <div className="relative flex items-center justify-center">
          <div className="relative w-72 h-72 md:w-96 md:h-96 rounded-full bg-white/10 backdrop-blur-sm flex items-center justify-center">
            <RetrievalGraph />
            <span className="absolute -top-2 left-1/3 text-2xl text-white/70 font-bold">+</span>
            <span className="absolute top-1/4 -left-8 rounded-xl bg-white/10 px-4 py-3 text-xl text-white/80 font-serif">π</span>
            <span className="absolute top-10 -right-4 text-2xl text-white/70 font-bold">∞</span>
            <span className="absolute bottom-1/4 -left-10 rounded-xl bg-white/10 px-4 py-3 text-xl text-white/80 font-serif">Σ</span>
            <span className="absolute bottom-8 -right-8 rounded-xl bg-white/10 px-4 py-3 text-xl text-white/80">√</span>
            <span className="absolute bottom-0 left-1/2 text-xl text-white/70 font-bold">÷</span>
          </div>
        </div>
      </div>
    </section>
  );
}