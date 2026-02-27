"use client";

import { useEffect, useState } from "react";

interface Dollar {
  id: number;
  left: number;
  delay: number;
  duration: number;
  size: number;
  rotation: number;
}

export default function FlyingDollars() {
  const [dollars, setDollars] = useState<Dollar[]>([]);

  useEffect(() => {
    const arr: Dollar[] = Array.from({ length: 20 }, (_, i) => ({
      id: i,
      left: Math.random() * 100,
      delay: Math.random() * 12,
      duration: 8 + Math.random() * 10,
      size: 16 + Math.random() * 20,
      rotation: Math.random() * 360,
    }));
    setDollars(arr);
  }, []);

  return (
    <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden">
      {dollars.map((d) => (
        <div
          key={d.id}
          className="flying-dollar absolute"
          style={{
            left: `${d.left}%`,
            animationDelay: `${d.delay}s`,
            animationDuration: `${d.duration}s`,
            fontSize: `${d.size}px`,
          }}
        >
          $
        </div>
      ))}
    </div>
  );
}
