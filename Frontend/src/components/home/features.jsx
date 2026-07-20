import { MessagesSquare, SearchCheck, CheckCircle2 } from "lucide-react";

const STEPS = [
  {
    n: "01",
    icon: MessagesSquare,
    accent: "pink",
    title: "Ask",
    body: "Type a question the way you'd ask a classmate — no keyword-perfect search required.",
  },
  {
    n: "02",
    icon: SearchCheck,
    accent: "violet",
    title: "Retrieve",
    body: "MathMate searches indexed OpenStax lessons and pulls the exact passages your question depends on.",
  },
  {
    n: "03",
    icon: CheckCircle2,
    accent: "pink",
    title: "Solve",
    body: "You get a worked answer grounded in those passages, with the source lesson cited underneath.",
  },
];

export default function Features() {
  return (
    <section id="how" className="px-6 py-20 md:py-24 bg-[#f7f6fc]">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-2xl md:text-3xl font-bold text-[#1a1535]">One pipeline, every time</h2>
        <p className="mt-2 text-sm text-gray-500 max-w-md">
          The same three steps run behind every question, in this order.
        </p>

        <div className="mt-12 grid md:grid-cols-3 gap-6">
          {STEPS.map(({ n, icon: Icon, accent, title, body }) => (
            <div
              key={n}
              className="bg-white rounded-2xl border border-[#e8e4f8] shadow-sm p-6 hover:shadow-md transition-shadow"
            >
              <div className="flex items-center justify-between mb-4">
                <div
                  className={`w-11 h-11 rounded-xl flex items-center justify-center ${
                    accent === "pink" ? "bg-[#ec4899]" : "bg-[#8b5cf6]"
                  }`}
                >
                  <Icon size={20} className="text-white" />
                </div>
                <span className="text-xs font-mono text-gray-300 font-semibold">{n}</span>
              </div>
              <h3 className="text-lg font-bold text-[#1a1535]">{title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-gray-500">{body}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
