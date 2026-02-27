"use client";

import { useEffect, useState, useCallback } from "react";

type Corner = "bottom-left" | "bottom-right" | "top-left" | "top-right";

const CORNERS: Corner[] = ["bottom-left", "bottom-right", "top-left", "top-right"];

const cornerStyles: Record<Corner, React.CSSProperties> = {
  "bottom-left": { bottom: 0, left: 0 },
  "bottom-right": { bottom: 0, right: 0, transform: "scaleX(-1)" },
  "top-left": { top: 60, left: 0 },
  "top-right": { top: 60, right: 0, transform: "scaleX(-1)" },
};

export default function BrrrGuy() {
  const [visible, setVisible] = useState(false);
  const [corner, setCorner] = useState<Corner>("bottom-right");

  const show = useCallback(() => {
    const c = CORNERS[Math.floor(Math.random() * CORNERS.length)];
    setCorner(c);
    setVisible(true);
    setTimeout(() => setVisible(false), 4000 + Math.random() * 3000);
  }, []);

  useEffect(() => {
    const scheduleNext = () => {
      const delay = 8000 + Math.random() * 15000;
      return setTimeout(() => {
        show();
        timerRef = scheduleNext();
      }, delay);
    };

    // Show once initially after a short delay
    const initial = setTimeout(() => {
      show();
    }, 3000);

    let timerRef = scheduleNext();

    return () => {
      clearTimeout(initial);
      clearTimeout(timerRef);
    };
  }, [show]);

  return (
    <div
      className="brrr-guy-wrapper"
      style={{
        ...cornerStyles[corner],
        opacity: visible ? 1 : 0,
        transform: `${cornerStyles[corner].transform || ""} translateY(${visible ? "0" : "80px"})`,
      }}
    >
      <div className="brrr-guy-sprite" />
      {/* flying money bills */}
      {visible && (
        <div className="brrr-money-container">
          {[...Array(6)].map((_, i) => (
            <span
              key={i}
              className="brrr-money"
              style={{
                left: `${40 + Math.random() * 60}%`,
                animationDelay: `${i * 0.3}s`,
                fontSize: `${10 + Math.random() * 8}px`,
              }}
            >
              💵
            </span>
          ))}
        </div>
      )}
    </div>
  );
}
