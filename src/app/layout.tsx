import type { Metadata } from "next";
import "./globals.css";
import WalletProvider from "@/components/WalletProvider";

export const metadata: Metadata = {
  title: "Trader Bot",
  description:
    "Pump.fun Tokenized Agent backed by a live, high-frequency trading bot on Hyperliquid. All profits go to $Trader buybacks.",
  icons: {
    icon: "/favicon.png",
    shortcut: "/favicon.png",
    apple: "/favicon.png",
  },
  openGraph: {
    title: "Trader Bot",
    description: "Pump.fun Tokenized Agent. HFT bot on Hyperliquid. All profits → $Trader buybacks.",
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
      <body className="scanline antialiased">
        <WalletProvider>{children}</WalletProvider>
      </body>
    </html>
  );
}
