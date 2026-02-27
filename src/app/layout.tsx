import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "$Printer — Money Printer Go Brrr",
  description:
    "The printer never stops. A meme coin backed by a live, autonomous trading bot on Hyperliquid. Watch it print in real-time.",
  icons: {
    icon: "/favicon.png",
    shortcut: "/favicon.png",
    apple: "/favicon.png",
  },
  openGraph: {
    title: "$Printer — Money Printer Go Brrr",
    description: "Haha money printer go brrr. Watch the bot trade live.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="scanline antialiased">{children}</body>
    </html>
  );
}
