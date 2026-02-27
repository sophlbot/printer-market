"use client";

interface StatCardProps {
  value: string;
  label: string;
  sub?: string;
}

export default function StatCard({ value, label, sub }: StatCardProps) {
  return (
    <div className="flex flex-col items-center gap-1 rounded-lg border border-brrr-border bg-white/80 px-6 py-3 text-center shadow-sm backdrop-blur-sm">
      <span className="font-[family-name:var(--font-pixel)] text-2xl text-brrr-green md:text-3xl">
        {value}
      </span>
      <span className="font-[family-name:var(--font-pixel)] text-[10px] uppercase tracking-widest text-brrr-muted">
        {label}
      </span>
      {sub && (
        <span className="text-sm text-brrr-muted">{sub}</span>
      )}
    </div>
  );
}
