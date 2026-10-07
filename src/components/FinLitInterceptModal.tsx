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
  X,
  Zap,
  Bot,
  RefreshCw,
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
  // Calculated Friction: 3-second deliberate review countdown
  const [countdown, setCountdown] = useState<number>(3);
  const [canExecutePause, setCanExecutePause] = useState<boolean>(false);
  const [pauseMonths, setPauseMonths] = useState<number>(3);
  const [showLiquidityDiagnostic, setShowLiquidityDiagnostic] = useState<boolean>(false);
  const [isCashflowEmergency, setIsCashflowEmergency] = useState<boolean | null>(null);
  const [showTlhBreakdown, setShowTlhBreakdown] = useState<boolean>(false);
  const [showMathInspector, setShowMathInspector] = useState<boolean>(false);

  // Gemini AI Consequence Report State
  const [aiReport, setAiReport] = useState<string>("");
  const [isAiLoading, setIsAiLoading] = useState<boolean>(true);
  const [aiModelUsed, setAiModelUsed] = useState<string>("gemini-1.5-flash");

  const modalRef = useRef<HTMLDivElement>(null);

  // Dynamic calculated metrics
  const rcaPercentage = riskResult?.xaiAudit.rcaUnitDiscountPct || 14.5;
  const currentUnitsPurchased = ((holding?.monthlyAmount || 15000) / (holding?.currentNav || 88.4)).toFixed(2);
  const avgUnitsPurchased = ((holding?.monthlyAmount || 15000) / (holding?.avgNav || 101.2)).toFixed(2);
  const stepDownMonthlyAmount = Math.round((holding?.monthlyAmount || 15000) * 0.5);

  const estimatedDelayMonths = Math.max(
    1,
    Math.round((riskResult?.xaiAudit.projectedMilestoneDelayMonths || 3) * (pauseMonths / 3))
  );

  const dynamicDeficit = Math.round(
    (riskResult?.xaiAudit.calculatedDeficit3Months || 99583) * (pauseMonths / 3)
  );

  // Fetch AI Consequence Report via Gemini 1.5 Flash
  const fetchAiPrePauseReport = async () => {
    if (!holding || !goal || !riskResult) return;
    setIsAiLoading(true);

    try {
      const payload = {
        fundName: holding.fundName,
        monthlyAmount: holding.monthlyAmount,
        currentNav: holding.currentNav,
        avgNav: holding.avgNav,
        rcaUnitDiscountPct: rcaPercentage,
        goalTitle: goal.title,
        goalYear: goal.targetYear,
        targetCorpus: goal.targetAmount,
        pauseMonths,
        projectedMilestoneDelayMonths: estimatedDelayMonths,
        calculatedDeficit: dynamicDeficit,
        currentDrawdownPct: -7.5,
        vix: 14.8,
      };

      const res = await fetch("/api/ai/pre-pause-report", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        const data = await res.json();
        setAiReport(data.report);
        setAiModelUsed(data.modelUsed || "gemini-1.5-flash");
      } else {
        throw new Error("API error");
      }
    } catch (e) {
      console.warn("AI Pre-pause report fetch error:", e);
      setAiReport(
        `• **Rupee Cost Averaging Penalty:** Halting your ₹${holding.monthlyAmount.toLocaleString("en-IN")} contribution forfeits acquiring fund units at a **+${rcaPercentage}% unit discount** (NAV ₹${holding.currentNav.toFixed(2)} vs 6-month avg ₹${holding.avgNav.toFixed(2)}).\n• **Milestone Timeline Fracture:** Pausing for ${pauseMonths} months creates a **-₹${dynamicDeficit.toLocaleString("en-IN")} compounded deficit**, directly delaying your **${goal.title} (${goal.targetYear}) by ~${estimatedDelayMonths} months**.\n• **Pro Wealth Recommendation:** Instead of an outright pause, activate the **Step-Down SIP (₹${stepDownMonthlyAmount.toLocaleString("en-IN")}/mo)** to alleviate cashflow while preserving over 70% of your compounding trajectory.`
      );
      setAiModelUsed("deterministic-math-engine");
    } finally {
      setIsAiLoading(false);
    }
  };

  // Reset countdown, friction timer, and trigger AI report on open
  useEffect(() => {
    if (isOpen) {
      setCountdown(3);
      setCanExecutePause(false);
      setIsCashflowEmergency(null);
      setShowLiquidityDiagnostic(false);
      setShowTlhBreakdown(false);

      fetchAiPrePauseReport();

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
  }, [isOpen, pauseMonths]);

  if (!isOpen || !riskResult) return null;

  // TLH Calculation
  const tlh = FinLitMathEngine.calculateTaxLossHarvesting(holding);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 overflow-y-auto bg-black/85 backdrop-blur-md animate-in fade-in duration-200">
      <div
        ref={modalRef}
        className="relative w-full max-w-4xl max-h-[92vh] overflow-y-auto rounded-3xl border border-calm-amber-600/40 bg-[#12151d] p-5 sm:p-8 shadow-2xl text-slate-100"
      >
        {/* Top Header: Calm Cognitive Circuit Breaker Banner (NO ALARMING RED) */}
        <div className="flex flex-wrap items-start justify-between gap-3 border-b border-[#242938] pb-4">
          <div className="flex items-start space-x-3.5">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-calm-amber-900/40 border border-calm-amber-500/50 text-calm-amber-400 shadow-md">
              <ShieldAlert className="h-6 w-6" />
            </div>
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <span className="rounded-full bg-calm-amber-500/20 border border-calm-amber-500/50 px-2.5 py-0.5 text-[11px] font-bold text-calm-amber-300 uppercase tracking-wider">
                  Cognitive Circuit Breaker
                </span>
                <span className="rounded-full bg-[#1e2433] border border-[#282e3e] px-2.5 py-0.5 text-[11px] font-mono text-slate-300">
                  Execution Latency: {riskResult.latencyMs}ms
                </span>
              </div>
              <h2 className="mt-1.5 text-xl sm:text-2xl font-extrabold tracking-tight text-slate-100">
                Wait! Pausing delays your {goal.title} ({goal.targetYear})
              </h2>
              <p className="text-xs text-slate-400 mt-0.5">
                Targeting <span className="text-slate-200 font-semibold">{holding.fundName}</span> • Anchored to your {goal.title}
              </p>
            </div>
          </div>

          {/* Dismiss Button */}
          <button
            onClick={onClose}
            className="rounded-xl border border-slate-700 bg-[#1a1e29] p-2 text-slate-400 hover:text-slate-200 transition"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Large Prominent Goal Deficit & Impact Callout */}
        <div className="mt-5 rounded-2xl border border-calm-amber-500/50 bg-gradient-to-r from-calm-amber-950/40 via-[#181c26] to-[#14171f] p-4 sm:p-5 shadow-lg">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="space-y-1">
              <span className="text-xs font-bold text-calm-amber-400 uppercase tracking-wider">
                Milestone Impact Reality
              </span>
              <div className="text-xl sm:text-2xl font-black text-slate-50 tracking-tight">
                Pausing for {pauseMonths} {pauseMonths === 1 ? "month" : "months"} delays your{" "}
                <span className="text-calm-amber-300">{goal.title}</span> by ~{estimatedDelayMonths} months
              </div>
              <p className="text-xs text-slate-300 leading-relaxed pt-0.5">
                During market drawdowns, pausing halts buying units at discounted prices, creating a <strong>-₹{dynamicDeficit.toLocaleString("en-IN")} compounded deficit</strong> at your {goal.targetYear} milestone horizon.
              </p>
            </div>

            <div className="shrink-0 rounded-2xl bg-[#0c0e12] border border-[#282e3e] p-3 text-center sm:min-w-[150px]">
              <span className="text-[10px] text-slate-400 block uppercase font-medium">Unit Discount</span>
              <span className="text-xl font-extrabold text-calm-green-400 font-mono">
                +{rcaPercentage}%
              </span>
              <span className="text-[10px] text-slate-400 block mt-0.5">More units per ₹1k</span>
            </div>
          </div>
        </div>

        {/* Real-time SEBI Cut-off Alert (Triggered if 2:50 PM - 3:00 PM IST) */}
        {riskResult.sebiCutoffWarning && (
          <div className="mt-4 flex items-start space-x-3 rounded-2xl border border-calm-amber-500/70 bg-calm-amber-950/40 p-4 text-calm-amber-200 shadow-md">
            <Clock className="h-5 w-5 shrink-0 text-calm-amber-400 mt-0.5 animate-spin" />
            <div className="text-xs space-y-1">
              <div className="flex items-center space-x-2">
                <span className="font-bold text-calm-amber-300 text-sm">
                  ⚠️ SEBI 3:00 PM Cut-off Warning ({riskResult.sebiTimestampInfo.currentTimeIST})
                </span>
                <span className="rounded-full bg-calm-amber-500/20 px-2 py-0.5 text-[9px] font-mono font-bold text-calm-amber-300 uppercase">
                  T+1 SETTLEMENT SHIFT
                </span>
              </div>
              <p className="text-calm-amber-100/90 leading-relaxed">
                You initiated this request during the 2:50 PM - 3:00 PM cut-off window. The deliberate 3-second friction review delay pushes transmission past 3:00 PM IST into a <strong>T+1 settlement cycle</strong> at tomorrow's unknown closing NAV.
              </p>
            </div>
          </div>
        )}

        {/* FEATURE 3A: Pre-Pause AI Consequence Report Panel (Gemini 1.5 Flash) */}
        <div className="mt-4 rounded-2xl border border-[#71649C] bg-gradient-to-r from-[#71649C]/20 via-[#161a24] to-[#12151d] p-4 sm:p-5 shadow-xl shadow-[#71649C]/10 relative overflow-hidden">
          <div className="flex items-center justify-between border-b border-[#38425d] pb-2.5 mb-3">
            <div className="flex items-center space-x-2">
              <div className="flex h-6 w-6 items-center justify-center rounded-lg bg-[#71649C]/30 text-purple-200">
                <Sparkles className="h-3.5 w-3.5" />
              </div>
              <span className="text-xs font-bold text-purple-200 uppercase tracking-wider">
                The LIT Buddy: Pre-Pause Consequence Analysis
              </span>
              <span className="rounded-full bg-[#71649C]/30 border border-[#71649C]/60 px-2 py-0.2 text-[9px] font-mono font-bold text-purple-300 uppercase">
                {aiModelUsed}
              </span>
            </div>

            <button
              onClick={fetchAiPrePauseReport}
              disabled={isAiLoading}
              className="text-[11px] text-purple-300 hover:text-white flex items-center gap-1 transition"
              title="Refresh The LIT Buddy analysis"
            >
              <RefreshCw className={`h-3 w-3 ${isAiLoading ? "animate-spin" : ""}`} />
              <span className="hidden sm:inline">Refresh</span>
            </button>
          </div>

          {isAiLoading ? (
            <div className="py-4 space-y-2 text-xs">
              <div className="flex items-center space-x-2 text-purple-300 font-medium">
                <div className="h-3.5 w-3.5 rounded-full border-2 border-purple-400 border-t-transparent animate-spin" />
                <span>The LIT Buddy is analyzing actuarial compounding impact on your {goal.title}...</span>
              </div>
              <div className="space-y-1.5 pt-1">
                <div className="h-3.5 bg-[#202638] rounded-full animate-pulse w-full" />
                <div className="h-3.5 bg-[#202638] rounded-full animate-pulse w-5/6" />
                <div className="h-3.5 bg-[#202638] rounded-full animate-pulse w-3/4" />
              </div>
            </div>
          ) : (
            <div className="text-xs sm:text-sm text-slate-200 leading-relaxed space-y-2 font-sans">
              {aiReport.split("\n").map((line, idx) => {
                const clean = line.replace(/^[•\-*]\s*/, "");
                if (!clean.trim()) return null;
                const parts = clean.split(/(\*\*[^*]+\*\*)/g);
                return (
                  <div key={idx} className="flex items-start space-x-2">
                    <span className="text-calm-amber-400 font-bold mt-0.5">•</span>
                    <p className="text-slate-200">
                      {parts.map((p, pIdx) => {
                        if (p.startsWith("**") && p.endsWith("**")) {
                          return (
                            <strong key={pIdx} className="text-white font-bold">
                              {p.slice(2, -2)}
                            </strong>
                          );
                        }
                        return p;
                      })}
                    </p>
                  </div>
                );
              })}
            </div>
          )}
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
        <div className="mt-4 rounded-2xl border border-[#282e3e] bg-[#161a24] p-4 sm:p-5">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <HelpCircle className="h-4 w-4 text-calm-amber-400" />
              <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-300">
                Diagnostic: Why are you pausing?
              </h4>
            </div>
            <button
              onClick={() => setShowLiquidityDiagnostic(!showLiquidityDiagnostic)}
              className="text-xs text-calm-amber-400 hover:text-amber-300 flex items-center gap-1 font-medium"
            >
              {showLiquidityDiagnostic ? "Hide Diagnostic" : "Help Me Decide"}{" "}
              {showLiquidityDiagnostic ? <ChevronUp className="h-3.5 w-3.5" /> : <ChevronDown className="h-3.5 w-3.5" />}
            </button>
          </div>

          {showLiquidityDiagnostic && (
            <div className="mt-3.5 space-y-3 pt-3 border-t border-[#242938]">
              <p className="text-xs text-slate-300">
                Is this pause driven by temporary market anxiety or an immediate cash-flow / emergency need?
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                <button
                  onClick={() => setIsCashflowEmergency(false)}
                  className={`rounded-xl border p-3 text-left text-xs transition ${
                    isCashflowEmergency === false
                      ? "border-calm-navy-500 bg-calm-navy-800 text-slate-100 ring-1 ring-calm-navy-500"
                      : "border-[#282e3e] bg-[#14171f] text-slate-400 hover:border-slate-600"
                  }`}
                >
                  <span className="font-semibold block text-slate-200">
                    📉 Market Drop Unease
                  </span>
                  <span className="text-[11px] text-slate-400 mt-1 block">
                    Concerned by recent negative returns (-7.5% pullback).
                  </span>
                </button>

                <button
                  onClick={() => setIsCashflowEmergency(true)}
                  className={`rounded-xl border p-3 text-left text-xs transition ${
                    isCashflowEmergency === true
                      ? "border-calm-amber-500 bg-calm-amber-950/40 text-calm-amber-200 ring-1 ring-calm-amber-500"
                      : "border-[#282e3e] bg-[#14171f] text-slate-400 hover:border-slate-600"
                  }`}
                >
                  <span className="font-semibold block text-calm-amber-300">
                    💸 Urgent Cash Need
                  </span>
                  <span className="text-[11px] text-slate-400 mt-1 block">
                    Need immediate cashflow relief for unexpected living expenses.
                  </span>
                </button>
              </div>

              {/* Dynamic Virtual Accountant Guidance */}
              {isCashflowEmergency === true && (
                <div className="rounded-xl border border-calm-green-700/60 bg-calm-green-950/30 p-3.5 text-xs text-calm-green-200 space-y-1.5 animate-in fade-in">
                  <div className="flex items-center space-x-1.5 font-bold text-calm-green-300">
                    <CheckCircle2 className="h-4 w-4" />
                    <span>Virtual Accountant Cashflow Strategy:</span>
                  </div>
                  <p className="text-[11px] leading-relaxed">
                    We recommend pausing this high-beta Midcap SIP, but keeping your{" "}
                    <strong>ICICI Liquid Fund</strong> and <strong>ELSS Tax Saver (Sec 80C)</strong> active. This frees up ₹15,000 monthly cashflow while preserving your ₹46,800 tax deduction!
                  </p>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Structured Smart Financial Alternatives (Protect Compounding) */}
        <div className="mt-5 space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold uppercase tracking-wider text-slate-200 flex items-center gap-1.5">
              <Sparkles className="h-4 w-4 text-calm-amber-400" />
              Smart Alternatives (Recommended)
            </h3>
            <span className="text-[11px] text-slate-400">Choose the best path for your goals</span>
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
              className="group relative cursor-pointer rounded-2xl border border-calm-green-600/70 bg-gradient-to-b from-calm-green-950/40 to-[#12151d] p-4 sm:p-5 text-left shadow-lg hover:border-calm-green-500 hover:shadow-calm-green-900/30 transition active:scale-98"
            >
              <div className="absolute top-3 right-3 rounded-full bg-calm-green-500/20 border border-calm-green-500/40 px-2 py-0.5 text-[9px] font-bold text-calm-green-300 uppercase">
                Recommended
              </div>
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-calm-green-900/60 text-calm-green-400 border border-calm-green-700/60 mb-3">
                <Scissors className="h-5 w-5" />
              </div>
              <h4 className="text-sm font-bold text-slate-100 group-hover:text-calm-green-300 transition">
                Step-Down SIP (3 Months)
              </h4>
              <p className="mt-1 text-xs text-slate-300 leading-relaxed">
                Reduce contribution from <span className="line-through text-slate-500">₹{holding.monthlyAmount.toLocaleString("en-IN")}</span> to{" "}
                <strong className="text-calm-green-400 font-mono">₹{stepDownMonthlyAmount.toLocaleString("en-IN")}/mo</strong> for 3 months.
              </p>
              <div className="mt-3.5 flex items-center justify-between border-t border-[#242938] pt-2 text-[11px] text-calm-green-400 font-semibold">
                <span>Protects 70%+ compounding</span>
                <ArrowRight className="h-3.5 w-3.5 group-hover:translate-x-1 transition" />
              </div>
            </div>

            {/* Alternative 2: Skip Single Month */}
            <div
              onClick={() => onSelectAlternative("SKIP_SINGLE")}
              className="group cursor-pointer rounded-2xl border border-calm-navy-500/70 bg-gradient-to-b from-calm-navy-900/40 to-[#12151d] p-4 sm:p-5 text-left shadow hover:border-calm-navy-400 transition active:scale-98"
            >
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-calm-navy-800 text-slate-100 border border-calm-navy-600 mb-3">
                <Calendar className="h-5 w-5" />
              </div>
              <h4 className="text-sm font-bold text-slate-100 group-hover:text-blue-300 transition">
                Skip This Month Only
              </h4>
              <p className="mt-1 text-xs text-slate-300 leading-relaxed">
                Skip just this single monthly debit without cancelling your auto-debit mandate or breaking your investment habit.
              </p>
              <div className="mt-3.5 flex items-center justify-between border-t border-[#242938] pt-2 text-[11px] text-blue-400 font-semibold">
                <span>Resumes next month</span>
                <ArrowRight className="h-3.5 w-3.5 group-hover:translate-x-1 transition" />
              </div>
            </div>

            {/* Alternative 3: Contrarian Continuation */}
            <div
              onClick={() => onSelectAlternative("CONTINUE_SIP")}
              className="group cursor-pointer rounded-2xl border border-calm-amber-600/70 bg-gradient-to-b from-calm-amber-950/40 to-[#12151d] p-4 sm:p-5 text-left shadow hover:border-calm-amber-500 transition active:scale-98"
            >
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-calm-amber-900/60 text-calm-amber-400 border border-calm-amber-700 mb-3">
                <TrendingUp className="h-5 w-5" />
              </div>
              <h4 className="text-sm font-bold text-slate-100 group-hover:text-calm-amber-300 transition">
                Continue Full SIP
              </h4>
              <p className="mt-1 text-xs text-slate-300 leading-relaxed">
                Keep the ₹{holding.monthlyAmount.toLocaleString("en-IN")}/mo engine running to capture maximum discounted units during this dip.
              </p>
              <div className="mt-3.5 flex items-center justify-between border-t border-[#242938] pt-2 text-[11px] text-calm-amber-400 font-semibold">
                <span>Maximum compounding speed</span>
                <ArrowRight className="h-3.5 w-3.5 group-hover:translate-x-1 transition" />
              </div>
            </div>
          </div>
        </div>

        {/* Tax Loss Harvesting (TLH) Opportunity State (If user demands liquidation) */}
        {tlh.hasHarvestableLosses && (
          <div className="mt-4 rounded-2xl border border-[#282e3e] bg-[#14171f] p-4">
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
                className="text-xs text-calm-amber-400 hover:text-amber-300 font-medium"
              >
                {showTlhBreakdown ? "Hide Tranches" : "View Tranches"}
              </button>
            </div>

            {showTlhBreakdown && (
              <div className="mt-3 space-y-2 border-t border-[#242938] pt-2 text-xs">
                <p className="text-[11px] text-slate-400">
                  If you insist on liquidating capital, harvest these underwater tranches to strategically offset current-year capital gains:
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

        {/* Calculated Friction Section: Primary "Pause Anyway" Button (NO PANIC RED) */}
        <div className="mt-6 flex flex-col sm:flex-row items-center justify-between gap-4 border-t border-[#242938] pt-5">
          <div className="flex items-center space-x-2 text-xs text-slate-400">
            <Lock className="h-3.5 w-3.5 text-slate-500" />
            <span>
              Algo-ID: <span className="font-mono text-slate-300">{riskResult.algoAuditId}</span>
            </span>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-3 w-full sm:w-auto">
            {/* Calming Helper Text during countdown */}
            {!canExecutePause && (
              <span className="text-[11px] text-slate-400 text-center sm:text-right">
                Please take a moment to review the impact above...
              </span>
            )}

            {/* Primary "Pause Anyway" Button with Calculated 3-Second Friction (Strictly NO RED) */}
            <button
              onClick={() => onSelectAlternative("PAUSE_ANYWAY", { months: pauseMonths })}
              disabled={!canExecutePause}
              className={`flex items-center justify-center space-x-2 rounded-2xl px-6 py-3 text-xs font-semibold transition shadow-md w-full sm:w-auto ${
                canExecutePause
                  ? "border border-slate-600 bg-slate-800 text-slate-200 hover:bg-slate-700 hover:text-white active:scale-98"
                  : "border border-slate-800 bg-slate-900/60 text-slate-500 cursor-not-allowed"
              }`}
            >
              <Clock className={`h-3.5 w-3.5 ${!canExecutePause ? "animate-spin text-calm-amber-400" : ""}`} />
              <span>
                {canExecutePause
                  ? `Pause Anyway (${pauseMonths} Months)`
                  : `Please Review (${countdown}s delay)...`}
              </span>
            </button>
          </div>
        </div>

        {/* Subtle Math Inspector Toggle for compliance review */}
        <div className="mt-4 text-center">
          <button
            onClick={() => setShowMathInspector(!showMathInspector)}
            className="text-[11px] text-slate-500 hover:text-slate-300 font-mono flex items-center justify-center gap-1 mx-auto"
          >
            <Cpu className="h-3 w-3" />
            {showMathInspector ? "Hide Math Formula Breakdown" : "Inspect Explainable AI Math"}
          </button>

          {showMathInspector && (
            <div className="mt-2.5 rounded-2xl border border-[#282e3e] bg-[#0c0e12] p-4 text-left font-mono text-[11px] text-slate-400 space-y-1.5 animate-in fade-in">
              <div className="text-calm-amber-400 font-bold">
                Formula: RiskScore = w1(Goal Deficit) + w2(Market Drawdown / VIX) + w3(Historical Deviation)
              </div>
              <div>
                • w1 = {riskResult.breakdown.w1_goalDeficitWeight} × Deficit ({riskResult.breakdown.goalDeficitScore}) ={" "}
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
              <div className="text-slate-200 font-bold pt-1.5 border-t border-[#1e2433]">
                Total RiskScore: {riskResult.riskScore} (Breached Baseline Risk Barrier: {profile.riskBarrier.toFixed(2)})
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default FinLitInterceptModal;
