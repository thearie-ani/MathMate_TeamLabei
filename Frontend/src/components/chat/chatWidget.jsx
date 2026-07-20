import { useState, useEffect } from "react";
import { marked } from "marked";
import katex from "katex";
import "katex/dist/katex.min.css";
import { useChat } from "../../hooks/useChat";
import { EXPRESSIONS } from "../mascot/ExpressionCarousel";

const SUBJECTS = [
  { value: "1", label: "Calculus 1" },
  { value: "2", label: "Statistics" },
  { value: "3", label: "Algebra" },
  { value: "4", label: "Calculus 2" },
];

// Renders $$...$$ (block) and $...$ (inline) LaTeX, then runs the rest through marked
function renderContent(text) {
  let processed = text
    .replace(/\$\$([\s\S]+?)\$\$/g, (_, expr) => {
      try {
        return katex.renderToString(expr, { displayMode: true, throwOnError: false });
      } catch {
        return expr;
      }
    })
    .replace(/\$([^\$\n]+?)\$/g, (_, expr) => {
      try {
        return katex.renderToString(expr, { displayMode: false, throwOnError: false });
      } catch {
        return expr;
      }
    });

  return marked(processed);
}

export default function ChatWidget() {
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState("");
  const [topic, setTopic] = useState(SUBJECTS[0].value);
  const { messages, sendMessage, loading } = useChat(topic);

  const [avatarId, setAvatarId] = useState(
    localStorage.getItem("chatAvatar") || "excited"
  );

  useEffect(() => {
    const handler = (e) => setAvatarId(e.detail);
    window.addEventListener("avatarChange", handler);
    return () => window.removeEventListener("avatarChange", handler);
  }, []);

  const avatarImg = EXPRESSIONS.find(e => e.id === avatarId)?.img ?? EXPRESSIONS[0].img;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!input.trim()) return;
    sendMessage(input);
    setInput("");
  };

  return (
    <div style={{ position: "fixed", bottom: 20, right: 20, zIndex: 1000 }}>
      {open && (
        <div style={{
          width: 340, height: 480, marginBottom: 12,
          background: "#1a1928", border: "1px solid #2d2b42",
          borderRadius: 12, display: "flex", flexDirection: "column",
          overflow: "hidden"
        }}>
          <div style={{ padding: 12, borderBottom: "1px solid #2d2b42" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8 }}>
              <img
                src={avatarImg}
                alt="MathMate"
                style={{ width: 28, height: 28, borderRadius: "50%", objectFit: "cover" }}
              />
              <span style={{ color: "#fff" }}>MathMate Assistant</span>
            </div>
            <select
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              style={{ width: "100%", padding: 6, background: "#2d2b42", color: "#fff", border: "none", borderRadius: 6 }}
            >
              {SUBJECTS.map(s => (
                <option key={s.value} value={s.value}>{s.label}</option>
              ))}
            </select>
          </div>

          <div style={{ flex: 1, overflowY: "auto", padding: 12 }}>
            {messages.map((m, i) => (
              <div key={i} style={{ marginBottom: 10, textAlign: m.role === "user" ? "right" : "left" }}>
                <div
                  style={{
                    display: "inline-block", padding: "8px 12px", borderRadius: 8,
                    background: m.role === "user" ? "#e6a8d7" : "#2d2b42",
                    color: m.role === "user" ? "#1a1928" : "#fff", maxWidth: "90%",
                    textAlign: "left", overflowX: "auto"
                  }}
                  dangerouslySetInnerHTML={{ __html: renderContent(m.content) }}
                />
              </div>
            ))}
            {loading && <div style={{ color: "#999" }}>Typing...</div>}
          </div>

          <form onSubmit={handleSubmit} style={{ display: "flex", borderTop: "1px solid #2d2b42" }}>
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask a question..."
              style={{ flex: 1, padding: 10, background: "transparent", color: "#fff", border: "none", outline: "none" }}
            />
            <button type="submit" disabled={loading} style={{ padding: "0 14px", background: "none", border: "none", color: "#e6a8d7" }}>
              ➤
            </button>
          </form>
        </div>
      )}

      <button
        onClick={() => setOpen(o => !o)}
        style={{
          width: 120, height: 120, borderRadius: "50%",
          background: "#fff", border: "none", cursor: "pointer",
          boxShadow: "0 4px 12px rgba(0,0,0,0.25)",
          display: "flex", alignItems: "center", justifyContent: "center",
          padding: 4, overflow: "hidden"
        }}
      >
        <img
          src={avatarImg}
          alt="Chat with MathMate"
          style={{ width: "100%", height: "100%", objectFit: "cover", borderRadius: "50%" }}
        />
      </button>
    </div>
  );
}