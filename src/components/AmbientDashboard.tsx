"use client";

import React from "react";
import { useApp } from "@/context/AppContext";
import { DynamicTradingViewChart } from "@/components/DynamicTradingViewChart";
import { getFriendlyArchetypeInfo } from "@/lib/constants";
import {
  TrendingDown,
  TrendingUp,
  ShieldCheck,
  Pause,
  Sparkles,
  PieChart,
  Target,
  ArrowRight,
  HeartHandshake,
  CheckCircle2,
  Calendar,
  Layers,
  Scissors,
  DollarSign,
  Activity,
  Bot,
  FileText,
} from "lucide-react";

export const AmbientDashboard: React.FC = () => {
  const {
    portfolio,
    profile,
    goals,
    holdings,
    isMarketCrashActive,
    handlePauseClick,
    setIsOnboardingOpen,
    setIsHealthReportModalOpen,
    selectedGoal,
    setSelectedGoal,
  } = useApp();

  const formatInr = (num: number) => {
    if (Math.abs(num) >= 10000000) {
      return `₹${(num / 10000000).toFixed(2)} Cr`;
    }
    if (Math.abs(num) >= 100000) {
      return `₹${(num / 100000).toFixed(2)} L`;
    }
    return `₹${num.toLocaleString("en-IN")}`;
  };

  const activeSipsCount = holdings.filter((h) => h.status === "ACTIVE").length;
  const steppedDownCount = holdings.filter((h) => h.status === "STEPPED_DOWN").length;
  const archetypeInfo = getFriendlyArchetypeInfo(profile.riskBarrier);

  return (
    <div className="space-y-6 sm:space-y-8">
      {/* Top Welcome & Ambient Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1: Total Portfolio Wealth */}
        <div className="rounded-3xl border border-[#282e3e] bg-[#12151d] p-5 sm:p-6 shadow-xl shadow-black/40 relative overflow-hidden flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                Total Wealth Portfolio
              </span>
              <span className="rounded-full bg-[#1e2433] border border-[#282e3e] px-2.5 py-0.5 text-[10px] font-medium text-slate-300">
                5 Active Funds
              </span>
            </div>

            <div className="mt-2.5">
              <span className="text-2xl sm:text-3xl font-extrabold text-slate-100 tracking-tight font-sans">
                {formatInr(portfolio.totalAum)}
              </span>
            </div>
          </div>

          {/* Calm Paper Return Tag (NO ALARMING RED) */}
          <div className="mt-4 pt-2 border-t border-[#242938]">
            {isMarketCrashActive ? (
              <div className="flex items-center space-x-1.5 rounded-xl bg-calm-amber-950/40 border border-calm-amber-600/40 px-2.5 py-1.5 text-xs text-calm-amber-200">
                <TrendingDown className="h-3.5 w-3.5 text-calm-amber-400 shrink-0" />
                <span>Paper Dip: {formatInr(portfolio.paperLoss)} ({portfolio.currentDrawdownPct}%)</span>
              </div>
            ) : (
              <div className="flex items-center space-x-1.5 rounded-xl bg-calm-green-950/40 border border-calm-green-600/40 px-2.5 py-1.5 text-xs text-calm-green-300">
                <TrendingUp className="h-3.5 w-3.5 shrink-0" />
                <span>All-Time Gain: +₹3.42 Lakhs (+18.2%)</span>
              </div>
            )}
          </div>
        </div>

        {/* Card 2: Compounding Health Index with AI Report Button */}
        <div className="rounded-3xl border border-[#282e3e] bg-[#12151d] p-5 sm:p-6 shadow-xl shadow-black/40 flex flex-col justify-between relative overflow-hidden">
          <div>
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                Compounding Health
              </span>
              <span className="rounded-full bg-calm-green-500/20 border border-calm-green-500/40 px-2.5 py-0.5 text-[10px] font-bold text-calm-green-300 uppercase">
                Optimal
              </span>
            </div>

            <div className="mt-2 flex items-center justify-between">
              <div className="flex items-baseline space-x-2">
                <span className="text-2xl sm:text-3xl font-extrabold text-calm-green-400">
                  92<span className="text-base font-normal text-slate-400">/100</span>
                </span>
                <span className="text-xs text-slate-400 font-medium">Habit</span>
              </div>

              {/* Primary AI Health Report CTA Button */}
              <button
                onClick={() => setIsHealthReportModalOpen(true)}
                className="flex items-center space-x-1.5 rounded-xl bg-gradient-to-r from-[#71649C] to-calm-navy-700 px-3 py-1.5 text-xs font-bold text-white shadow-md shadow-[#71649C]/25 hover:brightness-110 active:scale-95 transition"
                title="Generate comprehensive AI Portfolio Health & Risk Audit Report with Gemini 1.5 Pro"
              >
                <Sparkles className="h-3.5 w-3.5 text-calm-amber-300" />
                <span>AI Health Report</span>
              </button>
            </div>
          </div>

          <div className="mt-4 pt-2 border-t border-[#242938] space-y-1.5">
            <div className="h-2 w-full overflow-hidden rounded-full bg-[#1e2433]">
              <div
                className="h-full bg-gradient-to-r from-calm-navy-500 via-[#71649C] to-calm-green-500 rounded-full"
                style={{ width: "92%" }}
              />
            </div>
            <p className="text-[11px] text-slate-400 flex items-center justify-between">
              <span>Regularity: <strong>{portfolio.sipRegularityScore}%</strong></span>
              <span className="text-calm-green-400 font-medium">Unbroken Mandates</span>
            </p>
          </div>
        </div>

        {/* Card 3: Asset Allocation */}
        <div className="rounded-3xl border border-[#282e3e] bg-[#12151d] p-5 sm:p-6 shadow-xl shadow-black/40 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                Asset Balance
              </span>
              <PieChart className="h-4 w-4 text-slate-400" />
            </div>

            <div className="mt-2.5 flex items-baseline space-x-2 text-xs">
              <span className="text-slate-200 font-medium">
                Equity: <strong className="text-calm-amber-300 font-bold">{portfolio.assetAllocation.equity}%</strong> (Target {portfolio.assetAllocation.targetEquity}%)
              </span>
            </div>
          </div>

          <div className="mt-4 pt-2 border-t border-[#242938] space-y-1.5">
            <div className="flex h-2 w-full overflow-hidden rounded-full bg-[#1e2433]">
              <div className="bg-calm-amber-500" style={{ width: `${portfolio.assetAllocation.equity}%` }} />
              <div className="bg-[#71649C]" style={{ width: `${portfolio.assetAllocation.debt}%` }} />
              <div className="bg-yellow-600" style={{ width: `${portfolio.assetAllocation.gold}%` }} />
              <div className="bg-emerald-600" style={{ width: `${portfolio.assetAllocation.liquid}%` }} />
            </div>
            <p className="text-[10px] text-slate-400">
              Equity: 68% • Debt: 22% • Gold: 5% • Liquid: 5%
            </p>
          </div>
        </div>

        {/* Card 4: Calibrated Investment Profile */}
        <div className="rounded-3xl border border-[#282e3e] bg-[#12151d] p-5 sm:p-6 shadow-xl shadow-black/40 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                Your Profile
              </span>
              <button
                onClick={() => setIsOnboardingOpen(true)}
                className="text-[11px] text-calm-amber-400 hover:text-amber-300 font-medium transition"
              >
                Recalibrate
              </button>
            </div>

            <div className="mt-2">
              <span className="text-lg sm:text-xl font-bold text-white block truncate">
                {profile.archetype || archetypeInfo.title}
              </span>
              <p className="text-[11px] text-slate-400 mt-0.5 line-clamp-1">
                {profile.aiProfileSummary || archetypeInfo.tagline}
              </p>
            </div>
          </div>

          <div className="mt-4 pt-2 border-t border-[#242938] flex items-center justify-between text-[11px]">
            <span className="text-slate-400">AI Guardrail:</span>
            <span className="font-semibold text-calm-green-400 flex items-center gap-1">
              <CheckCircle2 className="h-3 w-3" /> Auto-Protect Active
            </span>
          </div>
        </div>
      </div>

      {/* Contrarian Rupee Cost Averaging Guidance Banner */}
      {isMarketCrashActive && (
        <div className="rounded-3xl border border-[#71649C]/40 bg-gradient-to-r from-[#71649C]/15 via-[#161a24] to-[#12151d] p-5 sm:p-6 shadow-xl text-slate-200">
          <div className="flex items-start space-x-3.5">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-[#71649C]/20 border border-[#71649C]/50 text-calm-amber-300 shadow-md">
              <Sparkles className="h-5 w-5" />
            </div>
            <div className="space-y-1">
              <div className="flex flex-wrap items-center gap-2">
                <span className="font-bold text-slate-100 text-sm sm:text-base">
                  Quantitative Co-Pilot Contrarian Insight
                </span>
                <span className="rounded-full bg-calm-amber-500/20 border border-calm-amber-500/40 px-2 py-0.5 text-[10px] font-bold text-calm-amber-300 uppercase">
                  Units on 12.6% Discount
                </span>
              </div>
              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed max-w-4xl">
                The current 7.5% market pullback is purchasing <strong>+14.5% more mutual fund units</strong> per ₹1,000 for your <strong>Nippon Growth Mid-Cap SIP</strong> compared to your 6-month average NAV. Staying invested now builds substantial compound leverage for your {selectedGoal.title}.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Main Grid: Interactive Chart & Life Milestones */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Softened TradingView Chart */}
        <div className="lg:col-span-2">
          <DynamicTradingViewChart
            isMarketCrashActive={isMarketCrashActive}
            selectedFundName={holdings[0].fundName}
          />
        </div>

        {/* Right Col: Anchored Life Milestones Card */}
        <div className="rounded-3xl border border-[#282e3e] bg-[#12151d] p-5 sm:p-6 shadow-xl flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between border-b border-[#242938] pb-3.5">
              <h3 className="text-sm font-bold uppercase tracking-wider text-slate-200 flex items-center gap-2">
                <ShieldCheck className="h-4 w-4 text-calm-amber-400" />
                Anchored Milestones
              </h3>
              <button
                onClick={() => setIsOnboardingOpen(true)}
                className="text-xs text-calm-amber-400 hover:text-amber-300 font-medium transition"
              >
                Edit Goals
              </button>
            </div>

            <div className="mt-4 space-y-3">
              {goals.map((goal) => {
                const isSelected = selectedGoal.id === goal.id;
                const progressPct = Math.min(
                  100,
                  Math.round((goal.currentAccumulated / goal.targetAmount) * 100)
                );

                return (
                  <div
                    key={goal.id}
                    onClick={() => setSelectedGoal(goal)}
                    className={`cursor-pointer rounded-2xl border p-4 transition text-left active:scale-99 ${
                      isSelected
                        ? "border-calm-amber-500/70 bg-calm-amber-950/20 shadow-md ring-1 ring-calm-amber-500/40"
                        : "border-[#282e3e] bg-[#161a24] hover:border-slate-600"
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <h4 className="text-xs sm:text-sm font-bold text-slate-100">{goal.title}</h4>
                      <span className="font-mono text-xs text-calm-amber-400 font-bold">
                        Target {goal.targetYear}
                      </span>
                    </div>

                    <div className="mt-2.5 flex items-baseline justify-between text-xs">
                      <span className="text-slate-400">Accumulated:</span>
                      <span className="font-mono text-slate-200 font-medium">
                        {formatInr(goal.currentAccumulated)} / {formatInr(goal.targetAmount)}
                      </span>
                    </div>

                    {/* Progress Bar */}
                    <div className="mt-2 h-2 w-full overflow-hidden rounded-full bg-[#0c0e12]">
                      <div
                        className="h-full bg-gradient-to-r from-[#71649C] to-calm-amber-500 rounded-full"
                        style={{ width: `${progressPct}%` }}
                      />
                    </div>

                    <div className="mt-2 flex items-center justify-between text-[10px] text-slate-400">
                      <span>Monthly Contribution: ₹{goal.monthlySip.toLocaleString("en-IN")}</span>
                      <span className="font-semibold text-slate-300">{progressPct}% Funded</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="mt-4 rounded-2xl border border-[#282e3e] bg-[#161a24] p-3.5 text-[11px] text-slate-400">
            <span className="text-slate-300 font-semibold">Active Anchor: </span>
            <strong className="text-white font-medium">{selectedGoal.title}</strong>
            <p className="mt-0.5 text-[10px] text-slate-400">
              Behavioral guardrails calculate concrete milestone delays rather than abstract percentage losses.
            </p>
          </div>
        </div>
      </div>

      {/* Active Systematic Investment Plans (SIP) Section */}
      <div className="space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div>
            <h3 className="text-lg font-bold text-slate-100">
              Active Monthly SIP Mandates
            </h3>
            <p className="text-xs text-slate-400">
              Click &quot;Pause SIP&quot; on any holding to experience the FinLit Cognitive Circuit Breaker with Gemini AI insights.
            </p>
          </div>
          <div className="flex items-center space-x-2 text-xs font-mono text-slate-400">
            <span className="rounded-full bg-[#14171f] border border-[#282e3e] px-3 py-1 text-slate-300">
              {activeSipsCount} Active Mandates
            </span>
            {steppedDownCount > 0 && (
              <span className="rounded-full bg-calm-green-950 border border-calm-green-600 px-3 py-1 text-calm-green-300 font-semibold">
                {steppedDownCount} Stepped Down
              </span>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {holdings.map((holding) => {
            const isPaused = holding.status === "PAUSED";
            const isSteppedDown = holding.status === "STEPPED_DOWN";
            const isSkipped = holding.status === "SKIPPED_SINGLE";

            return (
              <div
                key={holding.id}
                className={`flex flex-col justify-between rounded-3xl border p-5 sm:p-6 shadow-xl transition duration-200 ${
                  isPaused
                    ? "border-slate-800 bg-[#0f1118]/70 opacity-60"
                    : isSteppedDown
                    ? "border-calm-green-600/70 bg-gradient-to-b from-calm-green-950/20 to-[#12151d]"
                    : "border-[#282e3e] bg-[#14171f] hover:border-slate-600"
                }`}
              >
                <div>
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <span className="rounded-full bg-[#0c0e12] border border-[#282e3e] px-2.5 py-0.5 text-[10px] font-mono text-purple-300">
                        {holding.category.replace(/_/g, " ")}
                      </span>
                      <h4 className="mt-2.5 text-sm font-bold text-slate-100 leading-snug">
                        {holding.fundName}
                      </h4>
                    </div>

                    {/* Status Badge */}
                    <span
                      className={`rounded-full px-2.5 py-0.5 text-[10px] font-bold ${
                        isPaused
                          ? "bg-slate-800 text-slate-400"
                          : isSteppedDown
                          ? "bg-calm-green-950/80 border border-calm-green-600 text-calm-green-300"
                          : isSkipped
                          ? "bg-blue-950/80 border border-blue-600 text-blue-300"
                          : "bg-calm-navy-900 border border-calm-navy-600 text-slate-200"
                      }`}
                    >
                      {holding.status}
                    </span>
                  </div>

                  {/* Monthly Amount & NAV Metrics */}
                  <div className="mt-4 grid grid-cols-2 gap-2.5 rounded-2xl bg-[#0c0e12] p-3.5 text-xs font-mono">
                    <div>
                      <span className="text-[10px] text-slate-500 block">Monthly SIP</span>
                      <span className="text-sm font-bold text-slate-100">
                        ₹{holding.monthlyAmount.toLocaleString("en-IN")}
                      </span>
                      {isSteppedDown && (
                        <span className="text-[9px] text-calm-green-400 block mt-0.5">
                          (Stepped down from ₹{holding.originalAmount.toLocaleString("en-IN")})
                        </span>
                      )}
                    </div>
                    <div>
                      <span className="text-[10px] text-slate-500 block">Current NAV</span>
                      <span className="text-sm font-bold text-calm-amber-400">
                        ₹{holding.currentNav.toFixed(2)}
                      </span>
                      <span className="text-[9px] text-slate-500 block mt-0.5">
                        6-Mo Avg: ₹{holding.avgNav.toFixed(2)}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Card Actions */}
                <div className="mt-5 pt-3.5 border-t border-[#242938] flex items-center justify-between">
                  <span className="text-[10px] text-slate-500 font-mono">
                    ISIN: {holding.isin}
                  </span>

                  {/* Pause SIP Trigger Button */}
                  {isPaused ? (
                    <span className="text-xs text-slate-500 font-medium">SIP Paused</span>
                  ) : (
                    <button
                      onClick={() => handlePauseClick(holding)}
                      className="flex items-center space-x-1.5 rounded-xl border border-slate-700 bg-[#1e2433] px-3.5 py-1.5 text-xs font-semibold text-slate-200 hover:border-calm-amber-500/70 hover:bg-calm-amber-950/40 hover:text-calm-amber-300 active:scale-95 transition shadow-sm"
                    >
                      <Pause className="h-3.5 w-3.5" />
                      <span>Pause SIP</span>
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default AmbientDashboard;
