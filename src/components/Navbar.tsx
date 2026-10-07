"use client";

import React, { useState } from "react";
import { useApp } from "@/context/AppContext";
import {
  ShieldCheck,
  ShieldAlert,
  Sparkles,
  SlidersHorizontal,
  ChevronRight,
  TrendingDown,
  TrendingUp,
  Gauge,
  User,
  LogOut,
  Target,
  Bell,
  CheckCircle2,
} from "lucide-react";
import { ProTelemetryDrawer } from "@/components/ProTelemetryDrawer";

export const Navbar: React.FC = () => {
  const {
    profile,
    goals,
    selectedGoal,
    setSelectedGoal,
    isMarketCrashActive,
    isProModeOpen,
    toggleProMode,
    setIsOnboardingOpen,
    user,
    logout,
  } = useApp();

  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);

  return (
    <>
      <header className="sticky top-0 z-40 w-full border-b border-[#242938] bg-[#0c0e12]/90 backdrop-blur-xl">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6">
          {/* Brand & Subtitle */}
          <div className="flex items-center space-x-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-gradient-to-br from-[#71649C] via-calm-navy-700 to-[#0c0e12] border border-[#71649C]/50 shadow-md shadow-[#71649C]/20">
              <ShieldCheck className="h-5 w-5 text-calm-amber-300" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="text-lg font-extrabold tracking-tight text-slate-100">
                  FinLit <span className="text-calm-amber-400">The LIT Buddy</span>
                </span>
                <span className="hidden sm:inline-block rounded-full bg-[#71649C]/20 border border-[#71649C]/40 px-2 py-0.5 text-[10px] font-bold text-purple-200">
                  PRO WEALTH
                </span>
              </div>
              <p className="text-[11px] text-slate-400 hidden xs:block">
                The LIT Buddy • AI Behavioral Wealth Guardrail
              </p>
            </div>
          </div>

          {/* Center: Market Status & Active Goal Anchor */}
          <div className="hidden md:flex items-center space-x-3">
            {/* Stress Test / Market Mood Status Chip */}
            <div
              className={`flex items-center space-x-2 rounded-xl border px-3 py-1.5 text-xs font-medium transition ${
                isMarketCrashActive
                  ? "border-calm-amber-500/50 bg-calm-amber-950/30 text-calm-amber-200 shadow-sm"
                  : "border-calm-green-600/40 bg-calm-green-950/20 text-calm-green-300"
              }`}
            >
              {isMarketCrashActive ? (
                <>
                  <TrendingDown className="h-4 w-4 text-calm-amber-400 animate-pulse" />
                  <span>Stress Test: <strong>-7.5% Dip</strong> (Units on Sale)</span>
                </>
              ) : (
                <>
                  <TrendingUp className="h-4 w-4 text-calm-green-400" />
                  <span>Markets Steady • Compounding Normal</span>
                </>
              )}
            </div>

            {/* Anchored Goal Selector */}
            <div className="flex items-center space-x-1.5 rounded-xl border border-[#282e3e] bg-[#14171f] px-3 py-1.5 text-xs text-slate-300">
              <Target className="h-3.5 w-3.5 text-calm-amber-400" />
              <span className="text-slate-400">Anchor:</span>
              <select
                value={selectedGoal.id}
                onChange={(e) => {
                  const g = goals.find((item) => item.id === e.target.value);
                  if (g) setSelectedGoal(g);
                }}
                className="bg-transparent text-slate-100 font-semibold focus:outline-none cursor-pointer"
              >
                {goals.map((g) => (
                  <option key={g.id} value={g.id} className="bg-[#12151d] text-slate-200">
                    {g.title} ({g.targetYear})
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Right Controls: Archetype Badge, Pro Mode Toggle, User Menu */}
          <div className="flex items-center space-x-2 sm:space-x-3">
            {/* Friendly Archetype Pill */}
            <button
              onClick={() => setIsOnboardingOpen(true)}
              className="flex items-center space-x-2 rounded-xl border border-[#71649C]/40 bg-[#71649C]/10 px-3 py-1.5 text-xs text-slate-200 hover:bg-[#71649C]/20 hover:border-[#71649C] transition shadow-sm"
              title="Click to recalibrate your investment style & life milestones with Gemini"
            >
              <SlidersHorizontal className="h-3.5 w-3.5 text-calm-amber-400" />
              <div className="text-left hidden sm:block">
                <span className="block text-[10px] text-slate-400">Your Style</span>
                <span className="font-semibold text-calm-amber-300">
                  {profile.archetype.split(" ")[0]} {profile.archetype.split(" ")[1] || ""}
                </span>
              </div>
              <ChevronRight className="h-3.5 w-3.5 text-slate-400" />
            </button>

            {/* Pro Mode Telemetry Drawer Toggle */}
            <button
              onClick={toggleProMode}
              className={`flex items-center space-x-1.5 rounded-xl border px-3 py-1.5 text-xs font-semibold transition ${
                isProModeOpen
                  ? "border-[#71649C] bg-[#71649C]/30 text-purple-200 shadow-md shadow-[#71649C]/20"
                  : "border-[#282e3e] bg-[#14171f] text-slate-300 hover:text-white hover:border-slate-500"
              }`}
              title="Toggle Institutional Analytics & Pro Telemetry Suite"
            >
              <Gauge className="h-3.5 w-3.5 text-purple-400" />
              <span className="font-medium">Pro Mode</span>
            </button>

            {/* User Profile & Logout */}
            <div className="relative">
              <button
                onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                className="flex h-9 w-9 items-center justify-center rounded-xl border border-[#282e3e] bg-[#161a24] text-slate-300 hover:border-slate-500 transition"
              >
                <User className="h-4 w-4" />
              </button>

              {isUserMenuOpen && (
                <div className="absolute right-0 mt-2 w-56 rounded-2xl border border-[#282e3e] bg-[#14171f] p-2 shadow-2xl z-50 text-xs animate-in fade-in zoom-in-95">
                  <div className="px-3 py-2 border-b border-[#242938]">
                    <p className="font-semibold text-slate-200">{user?.name || profile.name || "Rouneet Raj Sinha"}</p>
                    <p className="text-[11px] text-slate-400 truncate">{user?.email || "rouneet.sinha@example.com"}</p>
                  </div>

                  <div className="py-1">
                    <button
                      onClick={() => {
                        setIsUserMenuOpen(false);
                        setIsOnboardingOpen(true);
                      }}
                      className="flex w-full items-center space-x-2 rounded-lg px-3 py-2 text-slate-300 hover:bg-[#1e2433] hover:text-white transition"
                    >
                      <SlidersHorizontal className="h-4 w-4 text-calm-amber-400" />
                      <span>Investment Style Setup</span>
                    </button>
                    <button
                      onClick={() => {
                        setIsUserMenuOpen(false);
                        toggleProMode();
                      }}
                      className="flex w-full items-center space-x-2 rounded-lg px-3 py-2 text-slate-300 hover:bg-[#1e2433] hover:text-white transition"
                    >
                      <Gauge className="h-4 w-4 text-purple-400" />
                      <span>{isProModeOpen ? "Hide Pro Telemetry" : "Show Pro Telemetry"}</span>
                    </button>
                  </div>

                  <div className="border-t border-[#242938] pt-1">
                    <button
                      onClick={() => {
                        setIsUserMenuOpen(false);
                        logout();
                      }}
                      className="flex w-full items-center space-x-2 rounded-lg px-3 py-2 text-rose-300 hover:bg-rose-950/40 transition font-medium"
                    >
                      <LogOut className="h-4 w-4" />
                      <span>Sign Out</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Expandable Institutional Analytics & Pro Telemetry Bar */}
      <ProTelemetryDrawer />
    </>
  );
};

export default Navbar;
