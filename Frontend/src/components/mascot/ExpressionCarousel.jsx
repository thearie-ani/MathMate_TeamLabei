import { useState } from "react";
import excited from "../../assets/excited.png";
import studying from "../../assets/studying.png";
import gotAnIdea from "../../assets/got_an_idea.png";
import thankYou from "../../assets/thank_you.png";
import angry from "../../assets/angry.png";
import sulking from "../../assets/sulking.png";
import mad from "../../assets/mad.png";
import furious from "../../assets/furious.png";

export const EXPRESSIONS = [
  { id: "excited", label: "Excited", img: excited },
  { id: "studying", label: "Studying", img: studying },
  { id: "got_an_idea", label: "Got an idea!", img: gotAnIdea },
  { id: "thank_you", label: "Thank you!", img: thankYou },
  { id: "angry", label: "Angry", img: angry },
  { id: "sulking", label: "Sulking", img: sulking },
  { id: "mad", label: "Mad", img: mad },
  { id: "furious", label: "Furious", img: furious },
];

// duplicate the list so the marquee loop feels seamless
const LOOP = [...EXPRESSIONS, ...EXPRESSIONS];

export default function ExpressionCarousel({ selectedId, onSelect }) {
  const [paused, setPaused] = useState(false);

  return (
    <div
      className="expr-track-wrap"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      <div className={`expr-track ${paused ? "paused" : ""}`}>
        {LOOP.map((e, i) => (
          <button
            key={`${e.id}-${i}`}
            className={`expr-item ${selectedId === e.id ? "selected" : ""}`}
            onClick={() => {
              setPaused(true);
              onSelect(e.id);
               window.dispatchEvent(new CustomEvent("avatarChange", { detail: e.id }));
            }}
          >
            <img src={e.img} alt={e.label} draggable={false} />
            <span>{e.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
}