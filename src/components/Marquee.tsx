"use client";

interface MarqueeProps {
  items: string[];
  reverse?: boolean;
  className?: string;
}

export default function Marquee({
  items,
  reverse = false,
  className = "",
}: MarqueeProps) {
  const repeated = [...items, ...items, ...items, ...items];
  return (
    <div
      className={`overflow-hidden border-y border-brrr-border bg-white/70 py-3 backdrop-blur-sm ${className}`}
    >
      <div
        className={`flex w-max gap-8 ${
          reverse ? "animate-marquee-reverse" : "animate-marquee"
        }`}
      >
        {repeated.map((text, i) => (
          <span
            key={i}
            className="whitespace-nowrap font-[family-name:var(--font-pixel)] text-[10px] uppercase tracking-widest text-brrr-green"
          >
            {text}
          </span>
        ))}
      </div>
    </div>
  );
}
