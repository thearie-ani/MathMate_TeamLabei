import { useRef, useState } from "react";
import garlicyFront from "../../assets/garlicy.png";

let garlicySide = null;
let garlicyBack = null;
try { garlicySide = new URL("../../assets/side_view.png", import.meta.url).href; } catch {}
try { garlicyBack = new URL("../../assets/back_view.png", import.meta.url).href; } catch {}

const VIEWS = [garlicyFront, garlicySide, garlicyBack].filter(Boolean);

export default function MascotViewer() {
  const [viewIndex, setViewIndex] = useState(0);
  const [dragX, setDragX] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const dragging = useRef(false);
  const startX = useRef(0);
  const accum = useRef(0);

  const onPointerDown = (e) => {
    dragging.current = true;
    setIsDragging(true);
    startX.current = e.clientX;
  };

  const onPointerMove = (e) => {
    if (!dragging.current) return;
    const delta = e.clientX - startX.current;
    startX.current = e.clientX;
    accum.current += delta;
    setDragX(accum.current);

    const threshold = 80;
    if (VIEWS.length > 1 && Math.abs(accum.current) > threshold) {
      setViewIndex((i) => {
        const dir = accum.current > 0 ? -1 : 1;
        return (i + dir + VIEWS.length) % VIEWS.length;
      });
      accum.current = 0;
    }
  };

  const onPointerUp = () => {
    dragging.current = false;
    setIsDragging(false);
    accum.current = 0;
    setDragX(0);
  };

  const tilt = Math.max(-30, Math.min(30, dragX / 3));

  return (
    <div
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={onPointerUp}
      onPointerLeave={onPointerUp}
      style={{
        width: 340, height: 340, margin: "0 auto",
        cursor: isDragging ? "grabbing" : "grab",
        display: "flex", alignItems: "center", justifyContent: "center",
        userSelect: "none", touchAction: "none",
        position: "relative",
      }}
    >
      <div
        style={{
          position: "absolute",
          width: 260, height: 260,
          borderRadius: "50%",
          background: "radial-gradient(circle, rgba(201,182,242,0.45) 0%, rgba(245,184,221,0.15) 55%, transparent 75%)",
          filter: "blur(6px)",
          transform: `scale(${isDragging ? 1.08 : 1})`,
          transition: "transform 0.6s cubic-bezier(0.22, 1, 0.36, 1)",
        }}
      />
      <img
        src={VIEWS[viewIndex]}
        alt="Garlicy — drag to rotate"
        draggable={false}
        style={{
          width: 280, height: 280, objectFit: "contain",
          position: "relative",
          transform: `rotateY(${VIEWS.length > 1 ? 0 : tilt}deg) rotate(${VIEWS.length > 1 ? 0 : tilt / 3}deg) scale(${isDragging ? 1.05 : 1})`,
          transition: isDragging
            ? "transform 0.08s linear"
            : "transform 0.7s cubic-bezier(0.34, 1.56, 0.64, 1)",
          pointerEvents: "none",
        }}
      />
    </div>
  );
}