"use client";

import dynamic from "next/dynamic";
import React from "react";
import { Loader2 } from "lucide-react";

// Explicitly disabled SSR for TradingView client-side DOM manipulation
export const DynamicTradingViewChart = dynamic(
  () => import("@/components/TradingViewChart").then((mod) => mod.TradingViewChart),
  {
    ssr: false,
    loading: () => (
      <div className="flex h-[380px] w-full flex-col items-center justify-center rounded-xl border border-[#71649C]/30 bg-[#222222] text-slate-400">
        <Loader2 className="h-8 w-8 animate-spin text-calm-amber-400 mb-2" />
        <p className="text-xs font-mono text-slate-300">
          Mounting Institutional Chart Canvas (Lightweight-Charts SDK)...
        </p>
        <span className="text-[10px] text-slate-500 mt-1">
          SSR Disabled • #222 Dark Theme Initializer
        </span>
      </div>
    ),
  }
);
