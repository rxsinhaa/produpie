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
  Terminal,
  ShieldAlert,
  Cpu,
  X,
} from "lucide-react";

export const DevTelemetryDrawer: React.FC = () => {
  const {
    profile,
    isMarketCrashActive,
    toggleMarketCrash,
    isCutoffSimulated,
    toggleCutoffSimulation,
    failOpenMode,
    toggleFailOpen,
    isDevModeOpen,
    toggleDevMode,
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

  if (!isDevModeOpen) return null;

  return (
    <div className="w-full border-b border-[#38425d] bg-[#0e1118]/95 backdrop-blur-md px-4 py-3 sm:px-6 animate-in slide-in-from-top-2 duration-200">
      <div className="mx-auto max-w-7xl">
        <div className="flex flex-wrap items-center justify-between gap-3 pb-2 border-b border-[#242938]">
          <div className="flex items-center space-x-2">
            <Cpu className="h-4 w-4 text-[#71649C]" />
            <span className="text-xs font-bold font-mono uppercase tracking-wider text-purple-300">
              Developer & Technical Demo Telemetry Drawer
            </span>
            <span className="rounded bg-purple-950/60 border border-purple-600/40 px-1.5 py-0.2 text-[9px] font-mono text-purple-300">
              SEBI Compliant SLA Mode
            </span>
          </div>

          <button
            onClick={toggleDevMode}
            className="flex items-center space-x-1 rounded-lg px-2 py-1 text-xs text-slate-400 hover:text-slate-200 transition"
          >
            <span>Close Dev Bar</span>
            <X className="h-3.5 w-3.5" />
          </button>
        </div>

        {/* Telemetry Controls Grid */}
        <div className="mt-3 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-xs">
          {/* Item 1: SEBI 3PM Cut-off Rush Simulation */}
          <div
            onClick={toggleCutoffSimulation}
            className={`cursor-pointer rounded-xl border p-3 transition ${
              isCutoffSimulated
                ? "border-calm-amber-500/70 bg-calm-amber-950/30 text-calm-amber-200 shadow-sm"
                : "border-[#282e3e] bg-[#14171f] text-slate-300 hover:border-slate-600"
            }`}
          >
            <div className="flex items-center justify-between">
              <span className="font-semibold text-slate-200 flex items-center gap-1.5">
                <Clock className={`h-3.5 w-3.5 ${isCutoffSimulated ? "text-calm-amber-400 animate-pulse" : "text-slate-400"}`} />
                SEBI Cut-off Clock
              </span>
              <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${isCutoffSimulated ? "bg-calm-amber-500/20 text-calm-amber-300 font-mono" : "bg-slate-800 text-slate-400"}`}>
                {isCutoffSimulated ? "2:58 PM Active" : "15:00 IST"}
              </span>
            </div>
            <p className="mt-1 font-mono text-[11px] text-slate-400">{timeStr}</p>
            <p className="mt-1 text-[10px] text-slate-500">
              {isCutoffSimulated
                ? "3-second friction shifts order into T+1 settlement NAV"
                : "Click to simulate 2:50 PM - 3:00 PM rush window"}
            </p>
          </div>

          {/* Item 2: Zero-PII Cryptographic Token */}
          <div className="rounded-xl border border-[#282e3e] bg-[#14171f] p-3 text-slate-300">
            <div className="flex items-center justify-between">
              <span className="font-semibold text-slate-200 flex items-center gap-1.5">
                <Lock className="h-3.5 w-3.5 text-calm-green-400" />
                Zero-PII Session
              </span>
              <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-calm-green-950/80 border border-calm-green-600 text-calm-green-300">
                ACTIVE
              </span>
            </div>
            <p className="mt-1 font-mono text-[11px] text-calm-green-400 truncate">
              {profile.sessionToken}
            </p>
            <p className="mt-1 text-[10px] text-slate-500">
              Zero PAN / Bank PII transmitted to edge models
            </p>
          </div>

          {/* Item 3: Market Crash Scenario Toggle */}
          <div
            onClick={toggleMarketCrash}
            className={`cursor-pointer rounded-xl border p-3 transition ${
              isMarketCrashActive
                ? "border-calm-amber-600/70 bg-calm-amber-950/30 text-calm-amber-200"
                : "border-[#282e3e] bg-[#14171f] text-slate-300 hover:border-slate-600"
            }`}
          >
            <div className="flex items-center justify-between">
              <span className="font-semibold text-slate-200 flex items-center gap-1.5">
                <TrendingDown className={`h-3.5 w-3.5 ${isMarketCrashActive ? "text-calm-amber-400" : "text-slate-400"}`} />
                Market Dip Simulator
              </span>
              <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${isMarketCrashActive ? "bg-calm-amber-500/20 text-calm-amber-300" : "bg-slate-800 text-slate-400"}`}>
                {isMarketCrashActive ? "-7.5% Dip (Active)" : "Normal (+18%)"}
              </span>
            </div>
            <p className="mt-1 text-[11px] text-slate-400">
              {isMarketCrashActive
                ? "Paper Drawdown: -₹22,000 (RCA units +12.6%)"
                : "Steady market conditions"}
            </p>
            <p className="mt-1 text-[10px] text-slate-500">
              Click to toggle 2-week Midcap correction
            </p>
          </div>

          {/* Item 4: Fail-Open & Reset */}
          <div className="flex flex-col justify-between rounded-xl border border-[#282e3e] bg-[#14171f] p-3">
            <div className="flex items-center justify-between">
              <button
                onClick={toggleFailOpen}
                className={`flex items-center space-x-1 px-2 py-1 rounded text-[11px] font-semibold transition ${
                  failOpenMode
                    ? "bg-blue-600 text-white"
                    : "bg-slate-800 text-slate-300 hover:text-white"
                }`}
              >
                <Activity className="h-3 w-3" />
                <span>Fail-Open ({failOpenMode ? "Active" : "200ms Test"})</span>
              </button>

              <button
                onClick={resetDemo}
                className="flex items-center space-x-1 rounded bg-slate-800 px-2 py-1 text-[11px] text-slate-300 hover:text-white transition"
                title="Reset simulation"
              >
                <RefreshCw className="h-3 w-3" />
                <span>Reset</span>
              </button>
            </div>

            <p className="mt-2 text-[10px] text-slate-500">
              Enforces sub-200ms SLA with zero UI blocking fallback
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DevTelemetryDrawer;
