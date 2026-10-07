import type { Metadata } from "next";
import "./globals.css";
import { Providers } from "@/components/Providers";

export const metadata: Metadata = {
  title: "FinLit | AI Behavioral Wealth Co-Pilot & Compounding Guardrail",
  description:
    "Empathetic, consumer-first behavioral finance engine preventing retail SIP panic during market drawdowns with deterministic actuarial math, TradingView time-series charts, and SEBI-compliant guardrails.",
  keywords: [
    "FinLit",
    "SIP Leak",
    "Behavioral Finance",
    "Cognitive Circuit Breaker",
    "SEBI 3PM Cutoff",
    "Deterministic Math",
    "Rupee Cost Averaging",
    "Tax Loss Harvesting",
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body className="min-h-screen bg-[#0c0e12] text-slate-100 antialiased selection:bg-calm-amber-500/30 selection:text-calm-amber-200">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}

