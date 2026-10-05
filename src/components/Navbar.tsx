"use client";

import React, { useState, useEffect } from "react";
import {
  ShieldAlert,
  Clock,
  Lock,
  RefreshCw,
  SlidersHorizontal,
  ChevronRight,
  TrendingDown,
  Activity,
  CheckCircle2,
  AlertTriangle,
} from "lucide-react";
import { BehavioralProfile } from "@/types";

interface NavbarProps {
  profile: BehavioralProfile;
  isCutoffSimulated: boolean;
  onToggleCutoffSimulation: () => void;
  onOpenOnboarding: () => void;
  onResetDemo: () => void;
  isMarketCrashActive: boolean;
  onToggleMarketCrash: () => void;
  failOpenMode: boolean;
  onToggleFailOpen: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  profile,
  isCutoffSimulated,
  onToggleCutoffSimulation,
  onOpenOnboarding,
  onResetDemo,
  isMarketCrashActive,
  onToggleMarketCrash,
  failOpenMode,
  onToggleFailOpen,
}) => {
  const [timeStr, setTimeStr] = useState<string>("14:55:00 IST");

  useEffect(() => {
    const updateTime = () => {
      if (isCutoffSimulated) {
        setTimeStr("14:58:24 IST (Cutoff Window)");
        return;
      }
      const now = new Date();
      // Calculate IST (UTC + 5:30)
      const utc = now.getTime() + now.getTimezoneOffset() * 60000;
      const istDate = new Date(utc + 3600000 * 5.5);
      const hours = String(istDate.getHours()).padStart(2, "0");
      const minutes = String(istDate.getMinutes()).padStart(2, "0");
      const seconds = String(istDate.getSeconds()).padStart(2, "0");
      setTimeStr(`${hours}:${minutes}:${seconds} IST`);
    };

    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, [isCutoffSimulated]);

  return (
    <header className="sticky top-0 z-40 w-full border-b border-[#242938] bg-[#0c0e12]/90 backdrop-blur-md">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6">
        {/* Brand & Mission */}
        <div className="flex items-center space-x-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br from-calm-navy-600 via-calm-navy-700 to-[#0c0e12] border border-calm-navy-500 shadow-md">
            <ShieldAlert className="h-5 w-5 text-calm-amber-400" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <span className="text-lg font-bold tracking-tight text-slate-100">
                FinLit <span className="text-calm-amber-400">Engine</span>
              </span>
              <span className="rounded bg-calm-navy-900/80 border border-calm-navy-600 px-1.5 py-0.5 text-[10px] font-semibold text-calm-navy-100">
                PROTOTYPE v2.6
              </span>
            </div>
            <p className="text-[11px] text-slate-400">
              Cognitive Circuit Breaker & Compounding Guardrail
            </p>
          </div>
        </div>

        {/* Live SEBI NAV Protocol & Protocol Status */}
        <div className="hidden lg:flex items-center space-x-4">
          {/* SEBI 3PM Cut-off Clock */}
          <div
            onClick={onToggleCutoffSimulation}
            className={`flex items-center space-x-2 rounded-lg border px-3 py-1.5 text-xs transition cursor-pointer ${
              isCutoffSimulated
                ? "border-calm-amber-500/60 bg-calm-amber-900/30 text-calm-amber-300 shadow-sm shadow-amber-900/40"
                : "border-[#282e3e] bg-[#14171f] text-slate-300 hover:border-slate-600"
            }`}
            title="Click to toggle SEBI 2:50 PM - 3:00 PM cut-off simulation window"
          >
            <Clock
              className={`h-3.5 w-3.5 ${
                isCutoffSimulated ? "text-calm-amber-400 animate-pulse" : "text-slate-400"
              }`}
            />
            <div className="text-left">
              <div className="flex items-center space-x-1.5">
                <span className="font-mono font-medium">{timeStr}</span>
                {isCutoffSimulated && (
                  <span className="inline-block rounded bg-calm-amber-500/20 px-1 text-[9px] font-bold text-calm-amber-400 uppercase">
                    2:58 PM Simulation
                  </span>
                )}
              </div>
              <p className="text-[10px] text-slate-400">
                {isCutoffSimulated
                  ? "SEBI 3:00 PM Cut-off Rush Active (T+1 Impact)"
                  : "SEBI Cut-off: 15:00 IST (Click to simulate rush)"}
              </p>
            </div>
          </div>

          {/* Zero-PII Anonymized Session Token */}
          <div className="flex items-center space-x-2 rounded-lg border border-[#282e3e] bg-[#14171f] px-3 py-1.5 text-xs">
            <Lock className="h-3.5 w-3.5 text-calm-green-400" />
            <div>
              <div className="flex items-center space-x-1">
                <span className="text-slate-400">Zero-PII Token:</span>
                <span className="font-mono text-slate-200">
                  {profile.sessionToken.slice(0, 14)}...
                </span>
              </div>
              <p className="text-[10px] text-calm-green-400 flex items-center gap-1">
                <CheckCircle2 className="h-2.5 w-2.5" /> SEBI Tech Vendor Exemption Compliant
              </p>
            </div>
          </div>
        </div>

        {/* Controls & Archetype */}
        <div className="flex items-center space-x-2 sm:space-x-3">
          {/* Market Crash Simulator Toggle */}
          <button
            onClick={onToggleMarketCrash}
            className={`flex items-center space-x-1.5 rounded-lg border px-2.5 py-1.5 text-xs font-medium transition ${
              isMarketCrashActive
                ? "border-calm-amber-600/60 bg-calm-amber-900/30 text-calm-amber-300"
                : "border-slate-700 bg-slate-800/60 text-slate-400 hover:text-slate-200"
            }`}
            title="Toggle Nifty Midcap 150 simulated -7.5% crash"
          >
            <TrendingDown className={`h-3.5 w-3.5 ${isMarketCrashActive ? "text-calm-amber-400" : ""}`} />
            <span className="hidden sm:inline">
              {isMarketCrashActive ? "Crash Active (-7.5%)" : "Normal Market"}
            </span>
          </button>

          {/* Fail-Open Toggle */}
          <button
            onClick={onToggleFailOpen}
            className={`hidden md:flex items-center space-x-1.5 rounded-lg border px-2.5 py-1.5 text-xs font-medium transition ${
              failOpenMode
                ? "border-blue-500/50 bg-blue-950/40 text-blue-300"
                : "border-slate-700 bg-slate-800/60 text-slate-400 hover:text-slate-200"
            }`}
            title="Test sub-200ms fail-open timeout bypass"
          >
            <Activity className="h-3.5 w-3.5" />
            <span>{failOpenMode ? "Fail-Open Test (On)" : "Fail-Open (200ms SLA)"}</span>
          </button>

          {/* Profile / Risk Barrier Anchor */}
          <button
            onClick={onOpenOnboarding}
            className="flex items-center space-x-2 rounded-lg border border-calm-navy-500/70 bg-calm-navy-900/60 px-3 py-1.5 text-xs text-slate-200 hover:bg-calm-navy-800 transition"
          >
            <SlidersHorizontal className="h-3.5 w-3.5 text-calm-amber-400" />
            <div className="text-left hidden sm:block">
              <span className="block text-[10px] text-slate-400">Risk Barrier</span>
              <span className="font-semibold text-calm-amber-400">
                {profile.riskBarrier.toFixed(2)} ({profile.archetype.split(" ")[0]})
              </span>
            </div>
            <ChevronRight className="h-3.5 w-3.5 text-slate-400" />
          </button>

          {/* Reset Demo */}
          <button
            onClick={onResetDemo}
            className="rounded-lg border border-slate-700 bg-slate-800/80 p-2 text-slate-400 hover:text-slate-200 transition"
            title="Reset simulation parameters"
          >
            <RefreshCw className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>
    </header>
  );
};
