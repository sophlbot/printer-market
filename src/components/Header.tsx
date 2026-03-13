"use client";

import { useState } from "react";
import { BUY_URL } from "@/lib/constants";

const NAV_LINKS = [
  { label: "Home", href: "#hero" },
  { label: "Terminal", href: "#terminal" },
  { label: "About", href: "#about" },
  { label: "How", href: "#how" },
  { label: "Story", href: "#story" },
];

const TWITTER_URL = "https://x.com/liamscalzulli";

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false);

  const scroll = (href: string) => {
    setMenuOpen(false);
    const el = document.querySelector(href);
    el?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <header className="fixed left-0 right-0 top-0 z-50 border-b-3 border-brrr-border/60 bg-white/85 backdrop-blur-md">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-2">
        {/* LOGO */}
        <button
          onClick={() => scroll("#hero")}
          className="flex items-center gap-2 text-[11px] font-bold tracking-wider text-brrr-green transition-colors hover:text-brrr-cyan"
        >
Trader Bot
        </button>

        {/* NAV — desktop */}
        <nav className="hidden items-center gap-5 md:flex">
          {NAV_LINKS.map((link) => (
            <button
              key={link.href}
              onClick={() => scroll(link.href)}
              className="text-[8px] uppercase tracking-widest text-brrr-muted transition-colors hover:text-brrr-text"
            >
              {link.label}
            </button>
          ))}
        </nav>

        {/* RIGHT: Twitter + Buy */}
        <div className="flex items-center gap-3">
          <a
            href={TWITTER_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 text-[8px] uppercase tracking-widest text-brrr-muted transition-colors hover:text-brrr-cyan"
          >
            <svg viewBox="0 0 24 24" className="h-4 w-4 fill-current" aria-hidden="true">
              <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
            </svg>
            Twitter
          </a>

          <a
            href={BUY_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="border-2 border-brrr-green bg-brrr-green px-4 py-1.5 text-[8px] uppercase tracking-widest text-white shadow-[2px_2px_0_#15803d] transition-all hover:brightness-110"
          >
            Buy $Trader
          </a>

          {/* Hamburger — mobile */}
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="flex flex-col gap-[3px] md:hidden"
            aria-label="Menu"
          >
            <span className={`block h-[2px] w-4 bg-brrr-text transition-transform ${menuOpen ? "translate-y-[5px] rotate-45" : ""}`} />
            <span className={`block h-[2px] w-4 bg-brrr-text transition-opacity ${menuOpen ? "opacity-0" : ""}`} />
            <span className={`block h-[2px] w-4 bg-brrr-text transition-transform ${menuOpen ? "-translate-y-[5px] -rotate-45" : ""}`} />
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <nav className="flex flex-col gap-2 border-t border-brrr-border/40 bg-white/95 px-4 py-3 backdrop-blur-md md:hidden">
          {NAV_LINKS.map((link) => (
            <button
              key={link.href}
              onClick={() => scroll(link.href)}
              className="py-1 text-left text-[9px] uppercase tracking-widest text-brrr-muted transition-colors hover:text-brrr-text"
            >
              {link.label}
            </button>
          ))}
        </nav>
      )}
    </header>
  );
}
