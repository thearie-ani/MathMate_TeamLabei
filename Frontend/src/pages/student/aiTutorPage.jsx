import { useState } from "react";
import MascotViewer from "../../components/mascot/MascotViewer";
import ExpressionCarousel, { EXPRESSIONS } from "../../components/mascot/ExpressionCarousel";
import "./aiTutorPage.css";
import { BookIcon, ChipIcon, LeafIcon, RainCloudIcon, PlanetIcon } from "../../components/mascot/TraitIcons";


const TRAITS = [
  { Icon: BookIcon, label: "Loves learning", color: "#c9b6f2" },
  { Icon: ChipIcon, label: "AI-powered helper", color: "#7fd8c4" },
  { Icon: LeafIcon, label: "Kind & supportive", color: "#8fd19e" },
  { Icon: RainCloudIcon, label: "Loves rainy days", color: "#9fb8e8" },
  { Icon: PlanetIcon, label: "Dreams big", color: "#f5b8dd" },
];
const STEPS = [
  {
    title: "You ask a question",
    desc: "Type anything about Calculus, Statistics, or Algebra into the chat.",
  },
  {
    title: "Garlicy searches the textbook",
    desc: "Your question is matched against thousands of textbook chunks using vector search (FAISS), finding the most relevant passages.",
  },
  {
    title: "Relevant chunks are gathered",
    desc: "The top-matching explanations, formulas, and examples are pulled together as context.",
  },
  {
    title: "The AI writes an answer",
    desc: "Garlicy reads that context and generates a clear, step-by-step explanation — grounded in your actual course material, not guesses.",
  },
  {
    title: "You get a real answer",
    desc: "Formulas render properly, explanations are structured, and you can ask a follow-up anytime.",
  },
];

export default function AiTutorPage() {
  const [selectedAvatar, setSelectedAvatar] = useState(
    localStorage.getItem("chatAvatar") || "excited"
  );

  const handleSelect = (id) => {
    setSelectedAvatar(id);
    localStorage.setItem("chatAvatar", id);
  };

  return (
    <div className="ai-tutor-page">
      <section className="mascot-hero">
        <div className="mascot-float-wrap">
          <span className="sparkle s1">✦</span>
          <span className="sparkle s2">✧</span>
          <span className="sparkle s3">✦</span>
          <span className="sparkle s4">✧</span>
          <MascotViewer />
        </div>
        <p className="drag-hint">Drag to spin Garlicy around</p>

        <h1 className="mascot-name">Garlicy</h1>
        <p className="mascot-tagline">(Garlic + Galaxy)</p>

        <p className="mascot-desc">
          Garlicy is your tiny AI study buddy from another galaxy. Always
          curious, kind, and ready to help you learn, solve problems, and
          reach for the stars.
        </p>

        <div className="trait-row">
        {TRAITS.map((t) => (
            <div key={t.label} className="trait" style={{ "--trait-color": t.color }}>
            <div className="trait-icon-circle">
                <t.Icon />
            </div>
            <span className="trait-label">{t.label}</span>
            </div>
        ))}
        </div>
      </section>

      <section className="expr-section">
        <h2>Pick Garlicy's mood</h2>
        <p className="expr-hint">Click one to set it as your chat avatar</p>
        <ExpressionCarousel selectedId={selectedAvatar} onSelect={handleSelect} />
      </section>

      <section className="process-section">
        <h2>How Garlicy answers your questions</h2>
        <div className="process-steps">
          {STEPS.map((step, i) => (
            <div key={step.title} className="process-step">
              <div className="step-number">{i + 1}</div>
              <div>
                <h3>{step.title}</h3>
                <p>{step.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}