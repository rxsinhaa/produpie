"use client";

import React from "react";
import { useApp } from "@/context/AppContext";
import { AuthScreen } from "@/components/AuthScreen";
import { Navbar } from "@/components/Navbar";
import { AmbientDashboard } from "@/components/AmbientDashboard";
import { FinLitInterceptModal } from "@/components/FinLitInterceptModal";
import { OnboardingModal } from "@/components/OnboardingModal";
import { OrderConfirmationDrawer } from "@/components/OrderConfirmationDrawer";
import { Zap } from "lucide-react";

export default function Home() {
  const {
    isAuthenticated,
    profile,
    setProfile,
    goals,
    setGoals,
    selectedGoal,
    setSelectedGoal,
    selectedHolding,
    isOnboardingOpen,
    setIsOnboardingOpen,
    isInterceptModalOpen,
    setIsInterceptModalOpen,
    riskScoreResult,
    handleSelectAlternative,
    failOpenToast,
    confirmationState,
    setConfirmationState,
  } = useApp();

  // If not logged in, render the Frictionless Login & Auth screen as the default landing page
  if (!isAuthenticated) {
    return <AuthScreen />;
  }

  return (
    <div className="min-h-screen bg-[#0c0e12] text-slate-100 pb-20 selection:bg-calm-amber-500/30 selection:text-calm-amber-200">
      {/* Top Consumerized Header */}
      <Navbar />

      {/* Main Container */}
      <main className="mx-auto max-w-7xl px-4 sm:px-6 pt-6 sm:pt-8">
        {/* Fail-Open Alert Banner (SEBI Resilience Fallback) */}
        {failOpenToast.show && (
          <div className="mb-6 flex items-start space-x-3 rounded-2xl border border-blue-500/60 bg-blue-950/60 p-4 text-blue-200 shadow-xl animate-in slide-in-from-top-3">
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
        <AmbientDashboard />
      </main>

      {/* FinLit Intercept Modal (Cognitive Circuit Breaker) */}
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

      {/* Onboarding & Goal Anchoring Flow Modal */}
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

      {/* Order Confirmation & Resolution Drawer */}
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
