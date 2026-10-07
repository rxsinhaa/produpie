"use client";

import React, { useState, useEffect } from "react";
import { useApp } from "@/context/AppContext";
import {
  Clock,
  Lock,
  Zap,
  TrendingDown,
  Activity,
  RefreshCw,
  CheckCircle2,
  SlidersHorizontal,
  Gauge,
  ShieldCheck,
  Cpu,
  X,
  Sparkles,
} from "lucide-react";

export const ProTelemetryDrawer: React.FC = () => {
  const {
    profile,
    isMarketCrashActive,
    toggleMarketCrash,
    isCutoffSimulated,
    toggleCutoffSimulation,
    failOpenMode,
    toggleFailOpen,
    isProModeOpen,
    toggleProMode,
    resetDemo,
  } = useApp();

  const [timeStr, setTimeStr] = useState<string>("14:55:00 IST");

  useEffect(() => {
    const updateTime = () => {
      if (isCutoffSimulated) {
        setTimeStr("14:58:24 IST (Cutoff Window Active)");
        return;
      }
      const now = new Date();
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

  if (!isProModeOpen) return null;

  return (
    <div className="w-full border-b border-[#38425d] bg-[#0c0e12]/98 backdrop-blur-xl px-4 py-4 sm:px-6 animate-in slide-in-from-top-2 duration-200">
      <div className="mx-auto max-w-7xl">
        {/* Header */}
        <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-[#242938]">
          <div className="flex items-center space-x-2.5">
            <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-[#71649C]/20 border border-[#71649C]/50 text-purple-300">
              <Gauge className="h-4 w-4" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-100 font-sans">
                  Institutional Analytics & Pro Telemetry
                </span>
                <span className="rounded-full bg-[#71649C]/20 border border-[#71649C]/50 px-2 py-0.2 text-[9px] font-bold text-purple-200 uppercase">
                  Pro Investor Suite
                </span>
              </div>
              <p className="text-[11px] text-slate-400">
                Institutional-Grade Privacy & Compliance Guardrails • Real-Time Market Simulation
              </p>
            </div>
          </div>

          <button
            onClick={toggleProMode}
            className="flex items-center space-x-1.5 rounded-xl border border-[#282e3e] bg-[#14171f] px-2.5 py-1 text-xs text-slate-400 hover:text-slate-200 hover:border-slate-500 transition"
          >
            <span>Close Pro Bar</span>
            <X className="h-3.5 w-3.5" />
          </button>
        </div>

        {/* 4 Core Pro Telemetry Tiles */}
        <div className="mt-3.5 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5 text-xs">
          {/* Tile 1: SEBI Cut-Off Window */}
          <div
            onClick={toggleCutoffSimulation}
            className={`cursor-pointer rounded-2xl border p-3.5 transition ${
              isCutoffSimulated
                ? "border-calm-amber-500/70 bg-calm-amber-950/30 text-calm-amber-200 shadow-sm"
                : "border-[#282e3e] bg-[#14171f] text-slate-300 hover:border-slate-600"
            }`}
          >
            <div className="flex items-center justify-between">
              <span className="font-bold text-slate-200 flex items-center gap-1.5">
                <Clock className={`h-4 w-4 ${isCutoffSimulated ? "text-calm-amber-400 animate-pulse" : "text-slate-400"}`} />
                SEBI Cut-off Clock
              </span>
              <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${isCutoffSimulated ? "bg-calm-amber-500/20 text-calm-amber-300 font-mono" : "bg-[#1e2433] text-slate-400"}`}>
                {isCutoffSimulated ? "2:58 PM Active" : "15:00 IST"}
              </span>
            </div>
            <p className="mt-1.5 font-mono text-[11px] text-slate-300 font-semibold">{timeStr}</p>
            <p className="mt-1 text-[10px] text-slate-400 leading-snug">
              {isCutoffSimulated
                ? "3-second friction shifts order into T+1 settlement NAV cycle"
                : "Simulate 2:50 PM - 3:00 PM rush window (Settlement NAV impact)"}
            </p>
          </div>

          {/* Tile 2: Zero-PII Tokenized Session */}
          <div className="rounded-2xl border border-[#282e3e] bg-[#14171f] p-3.5 text-slate-300">
            <div className="flex items-center justify-between">
              <span className="font-bold text-slate-200 flex items-center gap-1.5">
                <Lock className="h-4 w-4 text-calm-green-400" />
                Zero-PII Session
              </span>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-calm-green-950/80 border border-calm-green-600 text-calm-green-300">
                ENCRYPTED
              </span>
            </div>
            <p className="mt-1.5 font-mono text-[11px] text-calm-green-400 truncate">
              {profile.sessionToken}
            </p>
            <p className="mt-1 text-[10px] text-slate-400 leading-snug">
              Zero PAN / Bank credentials ingested; compliant with SEBI data privacy protocols.
            </p>
          </div>

          {/* Tile 3: Stress Test Simulator (Market Dip) */}
          <div
            onClick={toggleMarketCrash}
            className={`cursor-pointer rounded-2xl border p-3.5 transition ${
              isMarketCrashActive
                ? "border-calm-amber-600/70 bg-calm-amber-950/30 text-calm-amber-200"
                : "border-[#282e3e] bg-[#14171f] text-slate-300 hover:border-slate-600"
            }`}
          >
            <div className="flex items-center justify-between">
              <span className="font-bold text-slate-200 flex items-center gap-1.5">
                <TrendingDown className={`h-4 w-4 ${isMarketCrashActive ? "text-calm-amber-400" : "text-slate-400"}`} />
                Stress Test Simulator
              </span>
              <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${isMarketCrashActive ? "bg-calm-amber-500/20 text-calm-amber-300" : "bg-[#1e2433] text-slate-400"}`}>
                {isMarketCrashActive ? "-7.5% Downturn" : "Normal Market"}
              </span>
            </div>
            <p className="mt-1.5 text-[11px] text-slate-300 font-medium">
              {isMarketCrashActive
                ? "Paper Drawdown: -₹22,000 (RCA units +12.6%)"
                : "Steady Market (+18.2% all-time)"}
            </p>
            <p className="mt-1 text-[10px] text-slate-400 leading-snug">
              Click to visualize portfolio resilience & unit discount dynamics.
            </p>
          </div>

          {/* Tile 4: Execution Latency (Sub-200ms SLA) */}
          <div className="flex flex-col justify-between rounded-2xl border border-[#282e3e] bg-[#14171f] p-3.5">
            <div>
              <div className="flex items-center justify-between">
                <span className="font-bold text-slate-200 flex items-center gap-1.5">
                  <Zap className="h-4 w-4 text-blue-400" />
                  Execution Latency
                </span>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-blue-950/80 border border-blue-600 text-blue-300">
                  SUB-200MS SLA
                </span>
              </div>
              <p className="mt-1.5 text-[10px] text-slate-400 leading-snug">
                Lightning-fast trade routing with automatic fail-open fallback.
              </p>
            </div>

            <div className="mt-2.5 flex items-center justify-between gap-2 pt-2 border-t border-[#242938]">
              <button
                onClick={toggleFailOpen}
                className={`flex items-center space-x-1 px-2 py-1 rounded-lg text-[10px] font-semibold transition ${
                  failOpenMode
                    ? "bg-blue-600 text-white"
                    : "bg-[#1e2433] text-slate-300 hover:text-white"
                }`}
              >
                <Activity className="h-3 w-3" />
                <span>Test SLA Timeout</span>
              </button>

              <button
                onClick={resetDemo}
                className="flex items-center space-x-1 rounded-lg bg-[#1e2433] px-2 py-1 text-[10px] text-slate-300 hover:text-white transition"
                title="Reset simulation parameters"
              >
                <RefreshCw className="h-3 w-3" />
                <span>Reset</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProTelemetryDrawer;
