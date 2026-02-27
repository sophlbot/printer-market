"use client";

import { useState } from "react";
import { TOKEN_CA } from "@/lib/constants";

export default function CopyAddress() {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(TOKEN_CA);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      /* clipboard not available */
    }
  };

  return (
    <div className="flex flex-col items-center gap-2">
      <span className="font-[family-name:var(--font-pixel)] text-[9px] uppercase tracking-[0.2em] text-brrr-muted">
        Contract Address
      </span>
      <div className="flex items-center gap-2 rounded-lg border border-brrr-border bg-white/80 px-4 py-2 shadow-sm backdrop-blur-sm">
        <code className="max-w-[200px] truncate text-sm font-bold text-brrr-cyan sm:max-w-none">
          {TOKEN_CA}
        </code>
        <button
          onClick={handleCopy}
          className="shrink-0 rounded border border-brrr-border bg-brrr-bg px-3 py-1 font-[family-name:var(--font-pixel)] text-[9px] text-brrr-text transition-colors hover:border-brrr-green hover:text-brrr-green"
        >
          {copied ? "Copied!" : "Copy"}
        </button>
      </div>
    </div>
  );
}
