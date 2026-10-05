"use client";

import React, { useState, useEffect } from "react";
import {
  LifeGoal,
  PortfolioHealth,
  SipHolding,
  BehavioralProfile,
  RiskScoreResult,
  RiskScorePayload,
} from "@/types";
import {
  DEFAULT_GOALS,
  DEFAULT_SIP_HOLDINGS,
  DEFAULT_PORTFOLIO_HEALTH,
  DEFAULT_PROFILE,
} from "@/lib/constants";
import { FinLitMathEngine } from "@/lib/math-engine";
import { Navbar } from "@/components/Navbar";
import { AmbientDashboard } from "@/components/AmbientDashboard";
import { FinLitInterceptModal } from "@/components/FinLitInterceptModal";
import { OnboardingModal } from "@/components/OnboardingModal";
import { OrderConfirmationDrawer } from "@/components/OrderConfirmationDrawer";
import {
  ShieldAlert,
  Zap,
  Activity,
  CheckCircle2,
  Clock,
  Layers,
  Sparkles,
  Sliders,
  AlertTriangle,
  Play,
  RotateCcw,
} from "lucide-react";

export default function Home() {
  // Global Application State
  const [profile, setProfile] = useState<BehavioralProfile>(DEFAULT_PROFILE);
  const [goals, setGoals] = useState<LifeGoal[]>(DEFAULT_GOALS);
  const [selectedGoal, setSelectedGoal] = useState<LifeGoal>(DEFAULT_GOALS[0]);
  const [holdings, setHoldings] = useState<SipHolding[]>(DEFAULT_SIP_HOLDINGS);
  const [portfolio, setPortfolio] = useState<PortfolioHealth>(DEFAULT_PORTFOLIO_HEALTH);

  // Simulation Toggles
  const [isMarketCrashActive, setIsMarketCrashActive] = useState<boolean>(true); // Simulated -7.5% crash
  const [isCutoffSimulated, setIsCutoffSimulated] = useState<boolean>(false); // 2:58 PM cut-off simulation
  const [failOpenMode, setFailOpenMode] = useState<boolean>(false); // Test sub-200ms latency timeout

  // Modal & Interception States
  const [isOnboardingOpen, setIsOnboardingOpen] = useState<boolean>(false);
  const [isInterceptModalOpen, setIsInterceptModalOpen] = useState<boolean>(false);
  const [selectedHolding, setSelectedHolding] = useState<SipHolding | null>(null);
  const [riskScoreResult, setRiskScoreResult] = useState<RiskScoreResult | null>(null);
  const [isEvaluatingRisk, setIsEvaluatingRisk] = useState<boolean>(false);

  // Fail-Open Toast Notification
  const [failOpenToast, setFailOpenToast] = useState<{
    show: boolean;
    reason: string;
  }>({ show: false, reason: "" });

  // Order Confirmation Drawer State
  const [confirmationState, setConfirmationState] = useState<{
    isOpen: boolean;
    actionType: "STEP_DOWN" | "SKIP_SINGLE" | "CONTINUE_SIP" | "PAUSE_ANYWAY" | "HARVEST_TLH" | null;
    fundName: string;
    algoId: string;
    details?: { stepDownAmount?: number; months?: number };
  }>({
    isOpen: false,
    actionType: null,
    fundName: "",
    algoId: "",
  });

  // Toggle Market Crash Scenario
  const handleToggleMarketCrash = () => {
    setIsMarketCrashActive((prev) => {
      const nextState = !prev;
      setPortfolio((p) => ({
        ...p,
        paperLoss: nextState ? -22000 : 342000,
        currentDrawdownPct: nextState ? -7.5 : 1.8,
        totalAum: nextState ? 2210000 : 2574000,
        vix: nextState ? 14.8 : 11.2,
      }));
      return nextState;
    });
  };

  // Toggle Cutoff Simulation
  const handleToggleCutoffSimulation = () => {
    setIsCutoffSimulated((prev) => !prev);
  };

  // Reset Demo State
  const handleResetDemo = () => {
    setProfile(DEFAULT_PROFILE);
    setGoals(DEFAULT_GOALS);
    setSelectedGoal(DEFAULT_GOALS[0]);
    setHoldings(DEFAULT_SIP_HOLDINGS);
    setPortfolio(DEFAULT_PORTFOLIO_HEALTH);
    setIsMarketCrashActive(true);
    setIsCutoffSimulated(false);
    setFailOpenMode(false);
    setIsInterceptModalOpen(false);
    setConfirmationState({ isOpen: false, actionType: null, fundName: "", algoId: "" });
  };

  // PHASE 3: Intercept Flow on "Pause SIP" Click
  const handlePauseClick = async (holding: SipHolding) => {
    setSelectedHolding(holding);
    setIsEvaluatingRisk(true);

    const payload: RiskScorePayload & {
      simulatedISTHourMinute?: { hour: number; minute: number };
    } = {
      sessionToken: profile.sessionToken,
      fundIsin: holding.isin,
      sipAmount: holding.monthlyAmount,
      targetGoalId: selectedGoal.id,
      currentDrawdown: isMarketCrashActive ? -7.5 : 1.2,
      vix: portfolio.vix,
      riskBarrier: profile.riskBarrier,
      forceTimeout: failOpenMode,
      simulatedISTHourMinute: isCutoffSimulated ? { hour: 14, minute: 58 } : undefined,
    };

    try {
      // Execute Edge Function with sub-200ms latency evaluation & Fail-Open timeout
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 200); // 200ms strict client timeout SLA

      let response: Response | null = null;
      try {
        response = await fetch("/api/risk-score", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
          signal: controller.signal,
        });
      } catch (fetchErr: any) {
        // Fail-Open Protocol: Network or timeout abort
        clearTimeout(timeoutId);
        triggerFailOpen(
          holding,
          "Latency SLA > 200ms. In accordance with SEBI resilience protocols, order defaulted to standard routing."
        );
        setIsEvaluatingRisk(false);
        return;
      }

      clearTimeout(timeoutId);

      if (!response.ok) {
        const errorData = await response.json();
        if (errorData.failOpen) {
          triggerFailOpen(
            holding,
            `Edge inference timeout (${errorData.latencyMs}ms). Fail-Open routing executed without modal intervention.`
          );
          setIsEvaluatingRisk(false);
          return;
        }
      }

      const result: RiskScoreResult = await response.json();
      setRiskScoreResult(result);
      setIsEvaluatingRisk(false);

      // Evaluate RiskScore vs User's Risk Barrier
      if (result.isBreached) {
        // Cognitive Circuit Breaker Interception Triggered!
        setIsInterceptModalOpen(true);
      } else {
        // Did not breach barrier -> proceed directly to standard order
        triggerStandardOrder(
          holding,
          `RiskScore (${result.riskScore}) is below your Risk Barrier (${profile.riskBarrier}). Standard pause routed.`
        );
      }
    } catch (err) {
      // Universal Fail-Open Fallback
      triggerFailOpen(
        holding,
        "Systemic fail-safe triggered: Direct exchange order routing executed."
      );
      setIsEvaluatingRisk(false);
    }
  };

  // Fail-Open Handler
  const triggerFailOpen = (holding: SipHolding, reason: string) => {
    setFailOpenToast({ show: true, reason });
    setTimeout(() => {
      setFailOpenToast({ show: false, reason: "" });
    }, 6000);

    // Update holding to paused directly (Fail-Open)
    setHoldings((prev) =>
      prev.map((h) => (h.id === holding.id ? { ...h, status: "PAUSED" } : h))
    );
  };

  // Standard Order Handler
  const triggerStandardOrder = (holding: SipHolding, message: string) => {
    setConfirmationState({
      isOpen: true,
      actionType: "PAUSE_ANYWAY",
      fundName: holding.fundName,
      algoId: `STD-ORD-${Date.now().toString(36).toUpperCase()}`,
      details: { months: 3 },
    });

    setHoldings((prev) =>
      prev.map((h) => (h.id === holding.id ? { ...h, status: "PAUSED" } : h))
    );
  };

  // User Resolves Interception with an Alternative or Pause
  const handleSelectAlternative = (
    type: "STEP_DOWN" | "SKIP_SINGLE" | "CONTINUE_SIP" | "PAUSE_ANYWAY" | "HARVEST_TLH",
    details?: { stepDownAmount?: number; months?: number }
  ) => {
    if (!selectedHolding || !riskScoreResult) return;

    setIsInterceptModalOpen(false);

    if (type === "STEP_DOWN") {
      setHoldings((prev) =>
        prev.map((h) =>
          h.id === selectedHolding.id
            ? {
                ...h,
                status: "STEPPED_DOWN",
                monthlyAmount: details?.stepDownAmount || Math.round(h.originalAmount * 0.5),
                stepDownMonthsRemaining: details?.months || 3,
              }
            : h
        )
      );
    } else if (type === "SKIP_SINGLE") {
      setHoldings((prev) =>
        prev.map((h) =>
          h.id === selectedHolding.id ? { ...h, status: "SKIPPED_SINGLE" } : h
        )
      );
    } else if (type === "CONTINUE_SIP") {
      setHoldings((prev) =>
        prev.map((h) =>
          h.id === selectedHolding.id ? { ...h, status: "ACTIVE" } : h
        )
      );
    } else if (type === "PAUSE_ANYWAY") {
      setHoldings((prev) =>
        prev.map((h) =>
          h.id === selectedHolding.id ? { ...h, status: "PAUSED" } : h
        )
      );
    }

    // Open confirmation drawer
    setConfirmationState({
      isOpen: true,
      actionType: type,
      fundName: selectedHolding.fundName,
      algoId: riskScoreResult.algoAuditId,
      details,
    });
  };

  return (
    <div className="min-h-screen bg-[#0a0c10] text-slate-100 pb-16">
      {/* Top Institutional Header */}
      <Navbar
        profile={profile}
        isCutoffSimulated={isCutoffSimulated}
        onToggleCutoffSimulation={handleToggleCutoffSimulation}
        onOpenOnboarding={() => setIsOnboardingOpen(true)}
        onResetDemo={handleResetDemo}
        isMarketCrashActive={isMarketCrashActive}
        onToggleMarketCrash={handleToggleMarketCrash}
        failOpenMode={failOpenMode}
        onToggleFailOpen={() => setFailOpenMode(!failOpenMode)}
      />

      {/* Main Container */}
      <main className="mx-auto max-w-7xl px-4 sm:px-6 pt-6">
        {/* Fail-Open Alert Banner */}
        {failOpenToast.show && (
          <div className="mb-6 flex items-start space-x-3 rounded-2xl border border-blue-500/60 bg-blue-950/50 p-4 text-blue-200 shadow-xl animate-in slide-in-from-top-3">
            <Zap className="h-5 w-5 text-blue-400 shrink-0 mt-0.5" />
            <div className="text-xs space-y-1">
              <div className="flex items-center space-x-2">
                <span className="font-bold text-sm text-blue-300">
                  Fail-Open Resilience Protocol Triggered
                </span>
                <span className="rounded bg-blue-500/20 px-2 py-0.5 font-mono text-[10px] font-bold text-blue-300">
                  ZERO UI BLOCKING
                </span>
              </div>
              <p className="text-blue-100/90 leading-relaxed">{failOpenToast.reason}</p>
            </div>
          </div>
        )}

        {/* Ambient Dashboard View */}
        <AmbientDashboard
          portfolio={portfolio}
          profile={profile}
          goals={goals}
          holdings={holdings}
          isMarketCrashActive={isMarketCrashActive}
          onPauseClick={handlePauseClick}
          onOpenOnboarding={() => setIsOnboardingOpen(true)}
          selectedGoal={selectedGoal}
          onSelectGoal={setSelectedGoal}
        />
      </main>

      {/* FinLit Intercept Modal (Phase 3 & 4 Cognitive Circuit Breaker) */}
      {selectedHolding && (
        <FinLitInterceptModal
          isOpen={isInterceptModalOpen}
          onClose={() => setIsInterceptModalOpen(false)}
          holding={selectedHolding}
          goal={selectedGoal}
          profile={profile}
          riskResult={riskScoreResult}
          onSelectAlternative={handleSelectAlternative}
        />
      )}

      {/* Onboarding & Goal Anchoring Flow Modal (Phase 1) */}
      <OnboardingModal
        isOpen={isOnboardingOpen}
        onClose={() => setIsOnboardingOpen(false)}
        profile={profile}
        goals={goals}
        onSaveProfile={(newProfile, newGoals) => {
          setProfile(newProfile);
          setGoals(newGoals);
          if (!newGoals.some((g) => g.id === selectedGoal.id)) {
            setSelectedGoal(newGoals[0]);
          }
        }}
      />

      {/* Order Confirmation & Compliance Audit Drawer */}
      <OrderConfirmationDrawer
        isOpen={confirmationState.isOpen}
        onClose={() =>
          setConfirmationState({
            isOpen: false,
            actionType: null,
            fundName: "",
            algoId: "",
          })
        }
        actionType={confirmationState.actionType}
        fundName={confirmationState.fundName}
        algoId={confirmationState.algoId}
        details={confirmationState.details}
      />
    </div>
  );
}
