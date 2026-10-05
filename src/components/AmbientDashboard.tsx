"use client";

import React from "react";
import {
  LifeGoal,
  PortfolioHealth,
  SipHolding,
  BehavioralProfile,
} from "@/types";
import { DynamicTradingViewChart } from "@/components/DynamicTradingViewChart";
import {
  TrendingDown,
  TrendingUp,
  Activity,
  ShieldCheck,
  Pause,
  AlertCircle,
  Sparkles,
  ArrowUpRight,
  PieChart,
  Calendar,
  Layers,
  ChevronRight,
  CheckCircle2,
  Lock,
  Scissors,
} from "lucide-react";

interface AmbientDashboardProps {
  portfolio: PortfolioHealth;
  profile: BehavioralProfile;
  goals: LifeGoal[];
  holdings: SipHolding[];
  isMarketCrashActive: boolean;
  onPauseClick: (holding: SipHolding) => void;
  onOpenOnboarding: () => void;
  selectedGoal: LifeGoal;
  onSelectGoal: (goal: LifeGoal) => void;
}

export const AmbientDashboard: React.FC<AmbientDashboardProps> = ({
  portfolio,
  profile,
  goals,
  holdings,
  isMarketCrashActive,
  onPauseClick,
  onOpenOnboarding,
  selectedGoal,
  onSelectGoal,
}) => {
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

  return (
    <div className="space-y-6">
      {/* Portfolio Health Index & Ambient Metric Bar */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {/* Metric 1: Total Portfolio Valuation & Paper Loss */}
        <div className="rounded-2xl border border-[#242938] bg-[#12151d] p-5 shadow-lg relative overflow-hidden">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
              Total Portfolio AUM
            </span>
            <span className="rounded bg-calm-navy-900 border border-calm-navy-700 px-2 py-0.5 text-[10px] font-mono text-slate-300">
              5 Funds
            </span>
          </div>

          <div className="mt-2 flex items-baseline space-x-2">
            <span className="text-2xl font-black text-slate-100 font-mono tracking-tight">
              {formatInr(portfolio.totalAum)}
            </span>
          </div>

          {/* Localized Paper Loss indicator (Calm Amber/Slate tone, NO PANIC RED) */}
          <div className="mt-3 flex items-center space-x-1.5 text-xs">
            {isMarketCrashActive ? (
              <div className="flex items-center space-x-1.5 rounded-md bg-calm-amber-900/30 border border-calm-amber-600/40 px-2 py-1 text-calm-amber-300 font-mono">
                <TrendingDown className="h-3.5 w-3.5 text-calm-amber-400" />
                <span>Paper Drawdown: {formatInr(portfolio.paperLoss)} ({portfolio.currentDrawdownPct}%)</span>
              </div>
            ) : (
              <div className="flex items-center space-x-1.5 rounded-md bg-calm-green-900/30 border border-calm-green-600/40 px-2 py-1 text-calm-green-400 font-mono">
                <TrendingUp className="h-3.5 w-3.5" />
                <span>All-time Gains: +₹3.42 L (+18.2%)</span>
              </div>
            )}
          </div>
        </div>

        {/* Metric 2: Portfolio Health Index Gauge */}
        <div className="rounded-2xl border border-[#242938] bg-[#12151d] p-5 shadow-lg">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
              Portfolio Health Index
            </span>
            <span className="rounded-full bg-calm-green-500/20 px-2 py-0.5 text-[10px] font-bold text-calm-green-300">
              OPTIMAL
            </span>
          </div>

          <div className="mt-2 flex items-baseline space-x-2">
            <span className="text-2xl font-black text-calm-green-400 font-mono">
              92<span className="text-sm font-normal text-slate-400">/100</span>
            </span>
            <span className="text-xs text-slate-400">Compounding Velocity</span>
          </div>

          {/* Progress Bar */}
          <div className="mt-3 h-2 w-full overflow-hidden rounded-full bg-[#1e2433]">
            <div
              className="h-full bg-gradient-to-r from-calm-navy-500 to-calm-green-500 rounded-full"
              style={{ width: "92%" }}
            />
          </div>
          <p className="mt-1.5 text-[11px] text-slate-400">
            Regularity: <strong className="text-slate-200">{portfolio.sipRegularityScore}%</strong> • Zero intrusive alerts
          </p>
        </div>

        {/* Metric 3: Asset Allocation Drift & Auto-Rebalancing */}
        <div className="rounded-2xl border border-[#242938] bg-[#12151d] p-5 shadow-lg">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
              Asset Allocation
            </span>
            <PieChart className="h-4 w-4 text-slate-400" />
          </div>

          <div className="mt-2 flex items-center space-x-2 text-xs font-mono">
            <span className="text-slate-200">
              Equity: <strong className="text-calm-amber-300">{portfolio.assetAllocation.equity}%</strong> (Target {portfolio.assetAllocation.targetEquity}%)
            </span>
          </div>

          {/* Allocation Bar */}
          <div className="mt-2 flex h-2 w-full overflow-hidden rounded-full bg-[#1e2433]">
            <div className="bg-calm-amber-500" style={{ width: `${portfolio.assetAllocation.equity}%` }} />
            <div className="bg-calm-navy-500" style={{ width: `${portfolio.assetAllocation.debt}%` }} />
            <div className="bg-yellow-600" style={{ width: `${portfolio.assetAllocation.gold}%` }} />
            <div className="bg-emerald-600" style={{ width: `${portfolio.assetAllocation.liquid}%` }} />
          </div>

          <p className="mt-2 text-[10px] text-slate-400">
            Equity: 68% • Debt: 22% • Gold: 5% • Liquid: 5%
          </p>
        </div>

        {/* Metric 4: Calibrated Baseline Risk Barrier */}
        <div className="rounded-2xl border border-[#242938] bg-[#12151d] p-5 shadow-lg">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
              Risk Barrier Baseline
            </span>
            <button
              onClick={onOpenOnboarding}
              className="text-[10px] text-calm-amber-400 hover:underline"
            >
              Recalibrate
            </button>
          </div>

          <div className="mt-2 flex items-baseline space-x-2">
            <span className="text-2xl font-black text-calm-amber-400 font-mono">
              {profile.riskBarrier.toFixed(2)}
            </span>
            <span className="text-xs text-slate-400">/ 1.00 Scale</span>
          </div>

          <p className="mt-2 text-xs text-slate-300">
            Archetype: <strong className="text-white">{profile.archetype}</strong>
          </p>
          <p className="mt-0.5 text-[10px] text-slate-500">
            Interception deploys if RiskScore &gt; {profile.riskBarrier.toFixed(2)}
          </p>
        </div>
      </div>

      {/* Auto-Rebalancing Contreras Recommendation Prompt (If Organic Drift Occurred) */}
      {isMarketCrashActive && (
        <div className="rounded-xl border border-calm-navy-500/60 bg-gradient-to-r from-calm-navy-950/60 via-[#14171f] to-[#12151d] p-4 text-xs text-slate-200 shadow-md">
          <div className="flex items-start space-x-3">
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-calm-navy-800 text-calm-amber-400 border border-calm-navy-600">
              <Sparkles className="h-4 w-4" />
            </div>
            <div className="space-y-1">
              <div className="flex items-center space-x-2">
                <span className="font-bold text-slate-100 text-sm">
                  Virtual Accountant Auto-Rebalancing Opportunity
                </span>
                <span className="rounded bg-calm-navy-900 border border-calm-navy-600 px-1.5 py-0.5 text-[10px] font-mono text-calm-amber-300">
                  CONTRARIAN TACTIC
                </span>
              </div>
              <p className="text-slate-300 leading-relaxed">
                The 7.5% market pullback organically lowered your equity allocation from 70% to 68%. The engine recommends redirecting ₹5,000 from upcoming debt liquidity into your <strong>Nippon Growth Mid-Cap SIP</strong> to purchase units at a 12.6% discount.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Main Grid: Chart & Goal Milestones */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: TradingView Interactive Chart */}
        <div className="lg:col-span-2">
          <DynamicTradingViewChart
            isMarketCrashActive={isMarketCrashActive}
            selectedFundName={holdings[0].fundName}
          />
        </div>

        {/* Right Col: Anchored Life Milestones Card */}
        <div className="rounded-2xl border border-[#242938] bg-[#12151d] p-5 shadow-lg flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between border-b border-[#242938] pb-3">
              <h3 className="text-sm font-bold uppercase tracking-wider text-slate-200 flex items-center gap-2">
                <ShieldCheck className="h-4 w-4 text-calm-amber-400" />
                Anchored Milestones
              </h3>
              <button
                onClick={onOpenOnboarding}
                className="text-xs text-calm-amber-400 hover:text-calm-amber-300"
              >
                Edit
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
                    onClick={() => onSelectGoal(goal)}
                    className={`cursor-pointer rounded-xl border p-3.5 transition text-left ${
                      isSelected
                        ? "border-calm-amber-500/70 bg-calm-amber-950/20 shadow-md"
                        : "border-[#282e3e] bg-[#161a24] hover:border-slate-600"
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <h4 className="text-xs font-bold text-slate-100">{goal.title}</h4>
                      <span className="font-mono text-xs text-calm-amber-400 font-semibold">
                        {goal.targetYear}
                      </span>
                    </div>

                    <div className="mt-2 flex items-baseline justify-between text-xs">
                      <span className="text-slate-400">Accumulated:</span>
                      <span className="font-mono text-slate-200 font-medium">
                        {formatInr(goal.currentAccumulated)} / {formatInr(goal.targetAmount)}
                      </span>
                    </div>

                    {/* Progress Bar */}
                    <div className="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-[#10131a]">
                      <div
                        className="h-full bg-calm-amber-500 rounded-full"
                        style={{ width: `${progressPct}%` }}
                      />
                    </div>

                    <div className="mt-1.5 flex items-center justify-between text-[10px] text-slate-400">
                      <span>Monthly SIP: ₹{goal.monthlySip.toLocaleString("en-IN")}</span>
                      <span>{progressPct}% Funded</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="mt-4 rounded-xl border border-[#242938] bg-[#161a24] p-3 text-[11px] text-slate-400">
            <span>Selected Anchor: </span>
            <strong className="text-slate-200">{selectedGoal.title}</strong>
            <p className="mt-0.5 text-[10px] text-slate-500">
              Interception mathematical formulas dynamically anchor against this milestone horizon.
            </p>
          </div>
        </div>
      </div>

      {/* Active Systematic Investment Plans (SIP) List & Pause Triggers */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-bold text-slate-100">
              Active SIP Compounding Mandates
            </h3>
            <p className="text-xs text-slate-400">
              Click &quot;Pause SIP&quot; to test the FinLit Cognitive Circuit Breaker intercept flow.
            </p>
          </div>
          <div className="flex items-center space-x-2 text-xs font-mono text-slate-400">
            <span>{activeSipsCount} Active</span>
            {steppedDownCount > 0 && (
              <span className="rounded bg-calm-green-900/60 border border-calm-green-600 px-2 py-0.5 text-calm-green-300">
                {steppedDownCount} Stepped-Down
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
                className={`flex flex-col justify-between rounded-2xl border p-5 shadow-lg transition ${
                  isPaused
                    ? "border-slate-800 bg-[#0f1118]/70 opacity-60"
                    : isSteppedDown
                    ? "border-calm-green-600/60 bg-[#131a1e]"
                    : "border-[#282e3e] bg-[#14171f] hover:border-slate-600"
                }`}
              >
                <div>
                  <div className="flex items-start justify-between">
                    <div>
                      <span className="rounded bg-calm-navy-900 border border-calm-navy-700 px-1.5 py-0.5 text-[10px] font-mono text-slate-300">
                        {holding.category.replace(/_/g, " ")}
                      </span>
                      <h4 className="mt-2 text-sm font-bold text-slate-100 leading-snug">
                        {holding.fundName}
                      </h4>
                    </div>

                    {/* Status Badge */}
                    <span
                      className={`rounded-full px-2 py-0.5 text-[10px] font-bold ${
                        isPaused
                          ? "bg-slate-800 text-slate-400"
                          : isSteppedDown
                          ? "bg-calm-green-900/80 border border-calm-green-600 text-calm-green-300"
                          : isSkipped
                          ? "bg-blue-900/80 border border-blue-600 text-blue-300"
                          : "bg-calm-navy-900 border border-calm-navy-600 text-calm-navy-100"
                      }`}
                    >
                      {holding.status}
                    </span>
                  </div>

                  {/* Monthly Amount & NAV */}
                  <div className="mt-4 grid grid-cols-2 gap-2 rounded-xl bg-[#0c0e12] p-3 text-xs font-mono">
                    <div>
                      <span className="text-[10px] text-slate-500 block">Monthly SIP</span>
                      <span className="text-sm font-bold text-slate-100">
                        ₹{holding.monthlyAmount.toLocaleString("en-IN")}
                      </span>
                      {isSteppedDown && (
                        <span className="text-[9px] text-calm-green-400 block">
                          (Stepped down from ₹{holding.originalAmount.toLocaleString("en-IN")})
                        </span>
                      )}
                    </div>
                    <div>
                      <span className="text-[10px] text-slate-500 block">Current NAV</span>
                      <span className="text-sm font-bold text-calm-amber-400">
                        ₹{holding.currentNav.toFixed(2)}
                      </span>
                      <span className="text-[9px] text-slate-500 block">
                        6-Mo: ₹{holding.avgNav.toFixed(2)}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Actions */}
                <div className="mt-5 pt-3 border-t border-[#242938] flex items-center justify-between">
                  <div className="text-[11px] text-slate-400">
                    ISIN: <span className="font-mono text-slate-300">{holding.isin}</span>
                  </div>

                  {/* Native "Pause SIP" button which triggers the Interception Event Listener */}
                  {isPaused ? (
                    <span className="text-xs text-slate-500 font-medium">SIP Paused</span>
                  ) : (
                    <button
                      onClick={() => onPauseClick(holding)}
                      className="flex items-center space-x-1.5 rounded-lg border border-slate-700 bg-slate-800/90 px-3 py-1.5 text-xs font-semibold text-slate-300 hover:border-calm-amber-500/70 hover:bg-calm-amber-950/40 hover:text-calm-amber-300 transition shadow"
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
