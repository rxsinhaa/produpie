import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "FinLit Engine | Cognitive Circuit Breaker & Behavioral Wealth Guardrail",
  description:
    "Sub-200ms latency behavioral finance engine preventing retail SIP panic during market drawdowns with deterministic actuarial math, TradingView time-series charts, and SEBI-compliant guardrails.",
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
      <body className="min-h-screen bg-[#0a0c10] text-slate-100 antialiased selection:bg-calm-amber-500/30 selection:text-calm-amber-200">
        {children}
      </body>
    </html>
  );
}
