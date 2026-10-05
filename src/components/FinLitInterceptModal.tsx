"use client";

import React, { useState, useEffect, useRef } from "react";
import {
  LifeGoal,
  RiskScoreResult,
  SipHolding,
  BehavioralProfile,
} from "@/types";
import { DeficitSimulatorSVG } from "@/components/DeficitSimulatorSVG";
import { FinLitMathEngine } from "@/lib/math-engine";
import {
  ShieldAlert,
  Clock,
  Sparkles,
  ArrowRight,
  TrendingUp,
  AlertTriangle,
  HelpCircle,
  Scissors,
  Calendar,
  CheckCircle2,
  DollarSign,
  Info,
  ChevronDown,
  ChevronUp,
  Cpu,
  Lock,
} from "lucide-react";

interface FinLitInterceptModalProps {
  isOpen: boolean;
  onClose: () => void;
  holding: SipHolding;
  goal: LifeGoal;
  profile: BehavioralProfile;
  riskResult: RiskScoreResult | null;
  onSelectAlternative: (
    type: "STEP_DOWN" | "SKIP_SINGLE" | "CONTINUE_SIP" | "PAUSE_ANYWAY" | "HARVEST_TLH",
    details?: { stepDownAmount?: number; months?: number }
  ) => void;
}

export const FinLitInterceptModal: React.FC<FinLitInterceptModalProps> = ({
  isOpen,
  onClose,
  holding,
  goal,
  profile,
  riskResult,
  onSelectAlternative,
}) => {
  // Calculated Friction: 3-second execution countdown
  const [countdown, setCountdown] = useState<number>(3);
  const [canExecutePause, setCanExecutePause] = useState<boolean>(false);
  const [pauseMonths, setPauseMonths] = useState<number>(3);
  const [showLiquidityDiagnostic, setShowLiquidityDiagnostic] = useState<boolean>(false);
  const [isCashflowEmergency, setIsCashflowEmergency] = useState<boolean | null>(null);
  const [showTlhBreakdown, setShowTlhBreakdown] = useState<boolean>(false);
  const [showMathInspector, setShowMathInspector] = useState<boolean>(false);

  const modalRef = useRef<HTMLDivElement>(null);

  // Reset countdown and friction timer whenever modal opens
  useEffect(() => {
    if (isOpen) {
      setCountdown(3);
      setCanExecutePause(false);
      setIsCashflowEmergency(null);
      setShowLiquidityDiagnostic(false);
      setShowTlhBreakdown(false);

      const timer = setInterval(() => {
        setCountdown((prev) => {
          if (prev <= 1) {
            clearInterval(timer);
            setCanExecutePause(true);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);

      return () => clearInterval(timer);
    }
  }, [isOpen]);

  if (!isOpen || !riskResult) return null;

  // TLH Calculation
  const tlh = FinLitMathEngine.calculateTaxLossHarvesting(holding);

  const rcaPercentage = riskResult.xaiAudit.rcaUnitDiscountPct;
  const currentUnitsPurchased = (holding.monthlyAmount / holding.currentNav).toFixed(2);
  const avgUnitsPurchased = (holding.monthlyAmount / holding.avgNav).toFixed(2);

  const stepDownMonthlyAmount = Math.round(holding.monthlyAmount * 0.5);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 overflow-y-auto bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      <div
        ref={modalRef}
        className="relative w-full max-w-4xl max-h-[92vh] overflow-y-auto rounded-2xl border border-calm-amber-600/40 bg-[#12151d] p-5 sm:p-7 shadow-2xl text-slate-100"
      >
        {/* Top Header: Calm Cognitive Circuit Breaker Banner (NO PANIC RED) */}
        <div className="flex flex-wrap items-start justify-between gap-3 border-b border-[#242938] pb-4">
          <div className="flex items-start space-x-3">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-calm-amber-900/40 border border-calm-amber-500/50 text-calm-amber-400 shadow-sm">
              <ShieldAlert className="h-6 w-6" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="rounded bg-calm-amber-900/60 border border-calm-amber-600/60 px-2 py-0.5 text-[11px] font-bold text-calm-amber-300 uppercase tracking-wider">
                  Cognitive Circuit Breaker
                </span>
                <span className="rounded bg-calm-navy-800/80 border border-calm-navy-600 px-2 py-0.5 text-[11px] font-mono text-slate-300">
                  Sub-200ms Latency SLA: {riskResult.latencyMs}ms
                </span>
              </div>
              <h2 className="mt-1 text-xl font-bold tracking-tight text-slate-100">
                FinLit Compounding Intercept: {holding.fundName}
              </h2>
              <p className="text-xs text-slate-400">
                Deterministic math intervention anchored to your{" "}
                <span className="text-slate-200 font-semibold">{goal.title}</span> ({goal.targetYear})
              </p>
            </div>
          </div>

          {/* Close / Dismiss */}
          <button
            onClick={onClose}
            className="rounded-lg border border-slate-700 bg-[#1a1e29] p-2 text-slate-400 hover:text-slate-200 transition"
          >
            ✕
          </button>
        </div>

        {/* Real-time SEBI Cut-off Alert (Triggered if 2:50 PM - 3:00 PM IST) */}
        {riskResult.sebiCutoffWarning && (
          <div className="mt-4 flex items-start space-x-3 rounded-xl border border-calm-amber-500/70 bg-calm-amber-950/40 p-3.5 text-calm-amber-200">
            <Clock className="h-5 w-5 shrink-0 text-calm-amber-400 mt-0.5 animate-spin" />
            <div className="text-xs space-y-1">
              <div className="flex items-center space-x-2">
                <span className="font-bold text-calm-amber-300 text-sm">
                  ⚠️ SEBI 3:00 PM Cut-off Warning ({riskResult.sebiTimestampInfo.currentTimeIST})
                </span>
                <span className="rounded bg-calm-amber-500/20 px-1.5 py-0.5 text-[10px] font-mono font-bold text-calm-amber-300">
                  T+1 SETTLEMENT SHIFT
                </span>
              </div>
              <p className="text-calm-amber-100/90 leading-relaxed">
                You initiated this pause during the SEBI 2:50 PM - 3:00 PM mutual fund cut-off window. The deliberate 3-second friction verification delay will push transaction transmission past 3:00 PM IST into a <strong>T+1 settlement cycle</strong> at tomorrow's unknown closing NAV!
              </p>
            </div>
          </div>
        )}

        {/* Explainable AI (XAI) Mathematical Reality Banner */}
        <div className="mt-4 rounded-xl border border-calm-navy-600/70 bg-calm-navy-900/40 p-4">
          <div className="flex items-center space-x-2 text-xs font-semibold text-calm-amber-400 uppercase tracking-wide">
            <Sparkles className="h-4 w-4" />
            <span>Deterministic XAI Unit-Accumulation Fact</span>
          </div>
          <p className="mt-1 text-sm text-slate-200 font-medium leading-relaxed">
            &ldquo;Your <span className="text-calm-amber-300 font-bold font-mono">₹{holding.monthlyAmount.toLocaleString("en-IN")}</span> contribution acquires{" "}
            <span className="text-calm-green-400 font-bold font-mono">+{rcaPercentage}% more units</span> today ({currentUnitsPurchased} units @ ₹{holding.currentNav}) than your 6-month average NAV ({avgUnitsPurchased} units @ ₹{holding.avgNav}).&rdquo;
          </p>
          <div className="mt-2 flex flex-wrap items-center gap-3 text-xs text-slate-400 font-mono">
            <span className="bg-[#14171f] px-2 py-0.5 rounded border border-[#282e3e]">
              Current NAV: ₹{holding.currentNav.toFixed(2)}
            </span>
            <span className="bg-[#14171f] px-2 py-0.5 rounded border border-[#282e3e]">
              6-Mo Avg NAV: ₹{holding.avgNav.toFixed(2)}
            </span>
            <span className="text-calm-green-400">
              Rupee Cost Averaging (RCA) in contrarian effect
            </span>
          </div>
        </div>

        {/* Interactive Deficit Simulator SVG (Micro-slider from 1 to 6 months) */}
        <div className="mt-4">
          <DeficitSimulatorSVG
            goal={goal}
            monthlySip={holding.monthlyAmount}
            pauseMonths={pauseMonths}
            onPauseMonthsChange={setPauseMonths}
          />
        </div>

        {/* Smart Liquidity & Root-Cause Diagnostic Prompt */}
        <div className="mt-4 rounded-xl border border-[#282e3e] bg-[#161a24] p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <HelpCircle className="h-4 w-4 text-calm-amber-400" />
              <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-300">
                Diagnostic Probing: Root Cause Evaluation
              </h4>
            </div>
            <button
              onClick={() => setShowLiquidityDiagnostic(!showLiquidityDiagnostic)}
              className="text-xs text-slate-400 hover:text-slate-200 flex items-center gap-1"
            >
              {showLiquidityDiagnostic ? "Hide Diagnostic" : "Why are you pausing?"}{" "}
              {showLiquidityDiagnostic ? <ChevronUp className="h-3.5 w-3.5" /> : <ChevronDown className="h-3.5 w-3.5" />}
            </button>
          </div>

          {showLiquidityDiagnostic && (
            <div className="mt-3 space-y-3 pt-2 border-t border-[#242938]">
              <p className="text-xs text-slate-300">
                Is this pause driven by temporary market anxiety or an acute cash-flow/emergency cash constraint?
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                <button
                  onClick={() => setIsCashflowEmergency(false)}
                  className={`rounded-lg border p-2.5 text-left text-xs transition ${
                    isCashflowEmergency === false
                      ? "border-calm-navy-500 bg-calm-navy-800 text-slate-100"
                      : "border-[#282e3e] bg-[#14171f] text-slate-400 hover:border-slate-600"
                  }`}
                >
                  <span className="font-semibold block text-slate-200">
                    📉 Market Drawdown Anxiety
                  </span>
                  <span className="text-[11px] text-slate-400 mt-0.5 block">
                    Concerned by negative paper returns (-7.5% crash).
                  </span>
                </button>

                <button
                  onClick={() => setIsCashflowEmergency(true)}
                  className={`rounded-lg border p-2.5 text-left text-xs transition ${
                    isCashflowEmergency === true
                      ? "border-calm-amber-500 bg-calm-amber-900/40 text-calm-amber-200"
                      : "border-[#282e3e] bg-[#14171f] text-slate-400 hover:border-slate-600"
                  }`}
                >
                  <span className="font-semibold block text-calm-amber-300">
                    💸 Lack of Funds / Cashflow Constraint
                  </span>
                  <span className="text-[11px] text-slate-400 mt-0.5 block">
                    Immediate liquidity required for urgent living expenses.
                  </span>
                </button>
              </div>

              {/* Dynamic Virtual Accountant Guidance Based on Diagnostic */}
              {isCashflowEmergency === true && (
                <div className="rounded-lg border border-calm-green-700/60 bg-calm-green-950/30 p-3 text-xs text-calm-green-200 space-y-1">
                  <div className="flex items-center space-x-1.5 font-bold text-calm-green-300">
                    <CheckCircle2 className="h-4 w-4" />
                    <span>Virtual Accountant Cashflow Strategy:</span>
                  </div>
                  <p className="text-[11px] leading-relaxed">
                    We recommend pausing this high-beta Midcap SIP, but keeping your{" "}
                    <strong>ICICI Liquid Fund</strong> and <strong>ELSS Tax Saver (Sec 80C)</strong> mandates active. This frees up ₹15,000 in monthly cashflow while safeguarding your ₹46,800 tax deduction and emergency liquidity buffer!
                  </p>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Structured Smart Financial Alternatives */}
        <div className="mt-5 space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold uppercase tracking-wider text-slate-300 flex items-center gap-1.5">
              <Sparkles className="h-4 w-4 text-calm-amber-400" />
              Structured Financial Alternatives (Protect Compounding)
            </h3>
            <span className="text-[11px] text-slate-400">Select an action</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {/* Alternative 1: Step-Down (Recommended) */}
            <div
              onClick={() =>
                onSelectAlternative("STEP_DOWN", {
                  stepDownAmount: stepDownMonthlyAmount,
                  months: 3,
                })
              }
              className="group relative cursor-pointer rounded-xl border border-calm-green-600/70 bg-gradient-to-b from-calm-green-950/40 to-[#12151d] p-4 text-left shadow-lg hover:border-calm-green-500 hover:shadow-calm-green-900/30 transition"
            >
              <div className="absolute top-3 right-3 rounded bg-calm-green-500/20 border border-calm-green-500/40 px-1.5 py-0.5 text-[9px] font-bold text-calm-green-300 uppercase">
                Recommended (P1)
              </div>
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-calm-green-900/60 text-calm-green-400 border border-calm-green-700/60 mb-2">
                <Scissors className="h-4 w-4" />
              </div>
              <h4 className="text-sm font-bold text-slate-100 group-hover:text-calm-green-300 transition">
                Step-Down SIP (3 Months)
              </h4>
              <p className="mt-1 text-xs text-slate-300">
                Reduce from <span className="line-through text-slate-500">₹{holding.monthlyAmount.toLocaleString("en-IN")}</span> to{" "}
                <strong className="text-calm-green-400 font-mono">₹{stepDownMonthlyAmount.toLocaleString("en-IN")}/mo</strong> for 3 months.
              </p>
              <div className="mt-3 flex items-center justify-between border-t border-[#242938] pt-2 text-[11px] text-calm-green-400 font-medium">
                <span>Preserves 70% of trajectory</span>
                <ArrowRight className="h-3.5 w-3.5 group-hover:translate-x-1 transition" />
              </div>
            </div>

            {/* Alternative 2: Skip Single Month */}
            <div
              onClick={() => onSelectAlternative("SKIP_SINGLE")}
              className="group cursor-pointer rounded-xl border border-calm-navy-500/70 bg-gradient-to-b from-calm-navy-900/40 to-[#12151d] p-4 text-left shadow hover:border-calm-navy-400 transition"
            >
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-calm-navy-800 text-calm-navy-100 border border-calm-navy-600 mb-2">
                <Calendar className="h-4 w-4" />
              </div>
              <h4 className="text-sm font-bold text-slate-100 group-hover:text-blue-300 transition">
                Skip Current Month Only
              </h4>
              <p className="mt-1 text-xs text-slate-300">
                Skip this month&apos;s debit without cancelling the bank NACH mandate or breaking your compounding habit.
              </p>
              <div className="mt-3 flex items-center justify-between border-t border-[#242938] pt-2 text-[11px] text-blue-400 font-medium">
                <span>Resumes next month</span>
                <ArrowRight className="h-3.5 w-3.5 group-hover:translate-x-1 transition" />
              </div>
            </div>

            {/* Alternative 3: Contrarian Continuation */}
            <div
              onClick={() => onSelectAlternative("CONTINUE_SIP")}
              className="group cursor-pointer rounded-xl border border-calm-amber-600/70 bg-gradient-to-b from-calm-amber-950/40 to-[#12151d] p-4 text-left shadow hover:border-calm-amber-500 transition"
            >
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-calm-amber-900/60 text-calm-amber-400 border border-calm-amber-700 mb-2">
                <TrendingUp className="h-4 w-4" />
              </div>
              <h4 className="text-sm font-bold text-slate-100 group-hover:text-calm-amber-300 transition">
                Continue Full SIP
              </h4>
              <p className="mt-1 text-xs text-slate-300">
                Keep the ₹{holding.monthlyAmount.toLocaleString("en-IN")}/mo compounding engine active to lock in discounted NAV units.
              </p>
              <div className="mt-3 flex items-center justify-between border-t border-[#242938] pt-2 text-[11px] text-calm-amber-400 font-medium">
                <span>Max compounding velocity</span>
                <ArrowRight className="h-3.5 w-3.5 group-hover:translate-x-1 transition" />
              </div>
            </div>
          </div>
        </div>

        {/* Tax Loss Harvesting (TLH) Opportunity State (If user demands full redemption) */}
        {tlh.hasHarvestableLosses && (
          <div className="mt-4 rounded-xl border border-[#282e3e] bg-[#14171f] p-3.5">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <DollarSign className="h-4 w-4 text-calm-green-400" />
                <span className="text-xs font-semibold text-slate-200">
                  Tax-Loss Harvesting (TLH) Available:{" "}
                  <span className="text-calm-green-400 font-mono font-bold">
                    ₹{tlh.totalPotentialTaxSaved.toLocaleString("en-IN")}
                  </span>{" "}
                  tax liability offset
                </span>
              </div>
              <button
                onClick={() => setShowTlhBreakdown(!showTlhBreakdown)}
                className="text-xs text-slate-400 hover:text-slate-200"
              >
                {showTlhBreakdown ? "Hide Tranches" : "View Tranches"}
              </button>
            </div>

            {showTlhBreakdown && (
              <div className="mt-3 space-y-2 border-t border-[#242938] pt-2 text-xs">
                <p className="text-[11px] text-slate-400">
                  If insisting on capital liquidation, harvest these underwater unit tranches to strategically offset current-year Short-Term Capital Gains (STCG @ 20%):
                </p>
                <div className="overflow-x-auto">
                  <table className="w-full text-left font-mono text-[11px]">
                    <thead>
                      <tr className="border-b border-[#282e3e] text-slate-400">
                        <th className="py-1">Purchase Date</th>
                        <th className="py-1">Units</th>
                        <th className="py-1">Buy NAV</th>
                        <th className="py-1">Current NAV</th>
                        <th className="py-1">Unrealized Loss</th>
                        <th className="py-1">Tax Shield</th>
                      </tr>
                    </thead>
                    <tbody>
                      {holding.underwaterTranches.map((tranche, idx) => (
                        <tr key={idx} className="border-b border-[#1e2433]">
                          <td className="py-1">{tranche.purchaseDate}</td>
                          <td className="py-1">{tranche.units.toFixed(2)}</td>
                          <td className="py-1">₹{tranche.purchaseNav.toFixed(2)}</td>
                          <td className="py-1 text-calm-amber-400">₹{tranche.currentNav.toFixed(2)}</td>
                          <td className="py-1 text-slate-300">-₹{tranche.unrealizedLoss.toFixed(1)}</td>
                          <td className="py-1 text-calm-green-400 font-bold">
                            ₹{(tranche.unrealizedLoss * 0.2).toFixed(1)}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Calculated Friction Section: Primary "Pause Anyway" Button */}
        <div className="mt-6 flex flex-col sm:flex-row items-center justify-between gap-4 border-t border-[#242938] pt-4">
          <div className="flex items-center space-x-2 text-xs text-slate-400">
            <Lock className="h-3.5 w-3.5 text-slate-500" />
            <span>
              SEBI Algo-ID: <span className="font-mono text-slate-300">{riskResult.algoAuditId}</span>
            </span>
          </div>

          <div className="flex items-center space-x-3 w-full sm:w-auto">
            {/* Primary "Pause Anyway" Action Button with Calculated 3-Second Delay Friction */}
            <button
              onClick={() => onSelectAlternative("PAUSE_ANYWAY", { months: pauseMonths })}
              disabled={!canExecutePause}
              className={`flex flex-1 sm:flex-initial items-center justify-center space-x-2 rounded-xl px-5 py-2.5 text-xs font-semibold transition ${
                canExecutePause
                  ? "border border-slate-600 bg-slate-800 text-slate-300 hover:bg-slate-700 hover:text-white"
                  : "border border-slate-800 bg-slate-900/60 text-slate-600 cursor-not-allowed"
              }`}
            >
              <Clock className={`h-3.5 w-3.5 ${!canExecutePause ? "animate-spin text-slate-500" : ""}`} />
              <span>
                {canExecutePause
                  ? `Execute Pause (${pauseMonths} Months)`
                  : `Calculated Friction (${countdown}s delay)...`}
              </span>
            </button>
          </div>
        </div>

        {/* Math Inspector Toggle */}
        <div className="mt-4 text-center">
          <button
            onClick={() => setShowMathInspector(!showMathInspector)}
            className="text-[11px] text-slate-500 hover:text-slate-300 font-mono flex items-center justify-center gap-1 mx-auto"
          >
            <Cpu className="h-3 w-3" />
            {showMathInspector ? "Hide Deterministic Math Breakdown" : "Inspect RiskScore Algorithm"}
          </button>

          {showMathInspector && (
            <div className="mt-2 rounded-lg border border-[#282e3e] bg-[#0c0e12] p-3 text-left font-mono text-[11px] text-slate-400 space-y-1">
              <div className="text-calm-amber-400 font-bold">
                Formula: RiskScore = w1(Goal Deficit) + w2(Market Drawdown / VIX) + w3(Historical Deviation)
              </div>
              <div>
                • w1 = {riskResult.breakdown.w1_goalDeficitWeight} × Goal Deficit ({riskResult.breakdown.goalDeficitScore}) ={" "}
                {(riskResult.breakdown.w1_goalDeficitWeight * riskResult.breakdown.goalDeficitScore).toFixed(3)}
              </div>
              <div>
                • w2 = {riskResult.breakdown.w2_marketFearWeight} × Fear (|-7.5%| / 14.8) ({riskResult.breakdown.marketFearScore}) ={" "}
                {(riskResult.breakdown.w2_marketFearWeight * riskResult.breakdown.marketFearScore).toFixed(3)}
              </div>
              <div>
                • w3 = {riskResult.breakdown.w3_histDeviationWeight} × Deviation ({riskResult.breakdown.histDeviationScore}) ={" "}
                {(riskResult.breakdown.w3_histDeviationWeight * riskResult.breakdown.histDeviationScore).toFixed(3)}
              </div>
              <div className="text-slate-200 font-bold pt-1 border-t border-[#1e2433]">
                Total RiskScore: {riskResult.riskScore} (Breached Baseline Risk Barrier: {profile.riskBarrier.toFixed(2)})
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
