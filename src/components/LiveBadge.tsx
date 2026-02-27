"use client";

export default function LiveBadge({ className = "" }: { className?: string }) {
  return (
    <span
      className={`inline-flex items-center gap-2 rounded border border-brrr-green/40 bg-brrr-green/10 px-3 py-1 font-[family-name:var(--font-pixel)] text-[10px] uppercase tracking-widest text-brrr-green ${className}`}
    >
      <span className="relative flex h-2 w-2">
        <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-brrr-green opacity-75" />
        <span className="relative inline-flex h-2 w-2 rounded-full bg-brrr-green" />
      </span>
      LIVE
    </span>
  );
}
