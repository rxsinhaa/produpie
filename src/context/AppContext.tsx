"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import {
  BehavioralProfile,
  LifeGoal,
  PortfolioHealth,
  RiskScorePayload,
  RiskScoreResult,
  SipHolding,
} from "@/types";
import {
  DEFAULT_GOALS,
  DEFAULT_PORTFOLIO_HEALTH,
  DEFAULT_PROFILE,
  DEFAULT_SIP_HOLDINGS,
} from "@/lib/constants";

export interface UserSession {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  createdAt: string;
}

interface AppContextType {
  // Authentication
  isAuthenticated: boolean;
  user: UserSession | null;
  login: (email?: string, name?: string) => void;
  signup: (email: string, name: string) => void;
  loginAsDemo: () => void;
  logout: () => void;

  // Behavioral & Financial State
  profile: BehavioralProfile;
  setProfile: React.Dispatch<React.SetStateAction<BehavioralProfile>>;
  updateProfile: (updates: Partial<BehavioralProfile>) => void;
  goals: LifeGoal[];
  setGoals: React.Dispatch<React.SetStateAction<LifeGoal[]>>;
  selectedGoal: LifeGoal;
  setSelectedGoal: (goal: LifeGoal) => void;
  holdings: SipHolding[];
  setHoldings: React.Dispatch<React.SetStateAction<SipHolding[]>>;
  portfolio: PortfolioHealth;
  setPortfolio: React.Dispatch<React.SetStateAction<PortfolioHealth>>;

  // Simulation & Pro Telemetry
  isMarketCrashActive: boolean;
  toggleMarketCrash: () => void;
  isCutoffSimulated: boolean;
  toggleCutoffSimulation: () => void;
  failOpenMode: boolean;
  toggleFailOpen: () => void;
  isProModeOpen: boolean;
  toggleProMode: () => void;
  // Legacy aliases
  isDevModeOpen: boolean;
  toggleDevMode: () => void;
  resetDemo: () => void;

  // Interception Flow
  isOnboardingOpen: boolean;
  setIsOnboardingOpen: (open: boolean) => void;
  isInterceptModalOpen: boolean;
  setIsInterceptModalOpen: (open: boolean) => void;
  selectedHolding: SipHolding | null;
  setSelectedHolding: (holding: SipHolding | null) => void;
  riskScoreResult: RiskScoreResult | null;
  setRiskScoreResult: (result: RiskScoreResult | null) => void;
  isEvaluatingRisk: boolean;
  handlePauseClick: (holding: SipHolding) => Promise<void>;
  handleSelectAlternative: (
    type: "STEP_DOWN" | "SKIP_SINGLE" | "CONTINUE_SIP" | "PAUSE_ANYWAY" | "HARVEST_TLH",
    details?: { stepDownAmount?: number; months?: number }
  ) => void;

  // AI Health Report Modal
  isHealthReportModalOpen: boolean;
  setIsHealthReportModalOpen: (open: boolean) => void;

  // Toasts & Drawers
  failOpenToast: { show: boolean; reason: string };
  confirmationState: {
    isOpen: boolean;
    actionType: "STEP_DOWN" | "SKIP_SINGLE" | "CONTINUE_SIP" | "PAUSE_ANYWAY" | "HARVEST_TLH" | null;
    fundName: string;
    algoId: string;
    details?: { stepDownAmount?: number; months?: number };
  };
  setConfirmationState: React.Dispatch<
    React.SetStateAction<{
      isOpen: boolean;
      actionType: "STEP_DOWN" | "SKIP_SINGLE" | "CONTINUE_SIP" | "PAUSE_ANYWAY" | "HARVEST_TLH" | null;
      fundName: string;
      algoId: string;
      details?: { stepDownAmount?: number; months?: number };
    }>
  >;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Auth state - default to false so landing page is Login screen
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [user, setUser] = useState<UserSession | null>(null);

  // Financial State
  const [profile, setProfile] = useState<BehavioralProfile>(DEFAULT_PROFILE);
  const [goals, setGoals] = useState<LifeGoal[]>(DEFAULT_GOALS);
  const [selectedGoal, setSelectedGoal] = useState<LifeGoal>(DEFAULT_GOALS[0]);
  const [holdings, setHoldings] = useState<SipHolding[]>(DEFAULT_SIP_HOLDINGS);
  const [portfolio, setPortfolio] = useState<PortfolioHealth>(DEFAULT_PORTFOLIO_HEALTH);

  // Pro Telemetry & Simulation Toggles
  const [isMarketCrashActive, setIsMarketCrashActive] = useState<boolean>(true);
  const [isCutoffSimulated, setIsCutoffSimulated] = useState<boolean>(false);
  const [failOpenMode, setFailOpenMode] = useState<boolean>(false);
  const [isProModeOpen, setIsProModeOpen] = useState<boolean>(false);

  // Modals & Interceptions
  const [isOnboardingOpen, setIsOnboardingOpen] = useState<boolean>(false);
  const [isInterceptModalOpen, setIsInterceptModalOpen] = useState<boolean>(false);
  const [isHealthReportModalOpen, setIsHealthReportModalOpen] = useState<boolean>(false);
  const [selectedHolding, setSelectedHolding] = useState<SipHolding | null>(null);
  const [riskScoreResult, setRiskScoreResult] = useState<RiskScoreResult | null>(null);
  const [isEvaluatingRisk, setIsEvaluatingRisk] = useState<boolean>(false);

  // Fail-Open Toast
  const [failOpenToast, setFailOpenToast] = useState<{ show: boolean; reason: string }>({
    show: false,
    reason: "",
  });

  // Confirmation Drawer
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

  // Check Local Storage on mount for saved auth session
  useEffect(() => {
    try {
      const savedAuth = localStorage.getItem("finlit_user_auth");
      if (savedAuth) {
        const parsed = JSON.parse(savedAuth);
        setUser(parsed);
        setIsAuthenticated(true);
      }
    } catch (e) {
      // Ignore
    }
  }, []);

  const login = (email = "rouneet.sinha@example.com", name = "Rouneet Raj Sinha") => {
    const session: UserSession = {
      id: "usr_rouneet_2026",
      name,
      email,
      avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80",
      createdAt: new Date().toISOString(),
    };
    setUser(session);
    setIsAuthenticated(true);
    try {
      localStorage.setItem("finlit_user_auth", JSON.stringify(session));
    } catch (e) {}
  };

  const signup = (email: string, name: string) => {
    login(email, name);
    setIsOnboardingOpen(true);
  };

  const loginAsDemo = () => {
    login("rouneet.sinha@example.com", "Rouneet Raj Sinha");
  };

  const logout = () => {
    setUser(null);
    setIsAuthenticated(false);
    try {
      localStorage.removeItem("finlit_user_auth");
    } catch (e) {}
  };

  const updateProfile = (updates: Partial<BehavioralProfile>) => {
    setProfile((prev) => ({ ...prev, ...updates }));
  };

  const toggleMarketCrash = () => {
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

  const toggleCutoffSimulation = () => {
    setIsCutoffSimulated((prev) => !prev);
  };

  const toggleFailOpen = () => {
    setFailOpenMode((prev) => !prev);
  };

  const toggleProMode = () => {
    setIsProModeOpen((prev) => !prev);
  };

  const resetDemo = () => {
    setProfile(DEFAULT_PROFILE);
    setGoals(DEFAULT_GOALS);
    setSelectedGoal(DEFAULT_GOALS[0]);
    setHoldings(DEFAULT_SIP_HOLDINGS);
    setPortfolio(DEFAULT_PORTFOLIO_HEALTH);
    setIsMarketCrashActive(true);
    setIsCutoffSimulated(false);
    setFailOpenMode(false);
    setIsInterceptModalOpen(false);
    setIsHealthReportModalOpen(false);
    setConfirmationState({ isOpen: false, actionType: null, fundName: "", algoId: "" });
  };

  // Pause SIP interception trigger
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
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 200);

      let response: Response | null = null;
      try {
        response = await fetch("/api/risk-score", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
          signal: controller.signal,
        });
      } catch (fetchErr: any) {
        clearTimeout(timeoutId);
        triggerFailOpen(
          holding,
          "Execution SLA timeout > 200ms. In accordance with SEBI resilience protocols, direct order routed."
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
            `Edge inference timeout (${errorData.latencyMs}ms). Direct fail-open routing executed.`
          );
          setIsEvaluatingRisk(false);
          return;
        }
      }

      const result: RiskScoreResult = await response.json();
      setRiskScoreResult(result);
      setIsEvaluatingRisk(false);

      if (result.isBreached) {
        setIsInterceptModalOpen(true);
      } else {
        triggerStandardOrder(
          holding,
          `RiskScore (${result.riskScore}) is below your Risk Barrier (${profile.riskBarrier}). Standard pause routed.`
        );
      }
    } catch (err) {
      triggerFailOpen(
        holding,
        "Systemic fail-safe triggered: Direct exchange order routing executed."
      );
      setIsEvaluatingRisk(false);
    }
  };

  const triggerFailOpen = (holding: SipHolding, reason: string) => {
    setFailOpenToast({ show: true, reason });
    setTimeout(() => {
      setFailOpenToast({ show: false, reason: "" });
    }, 6000);

    setHoldings((prev) =>
      prev.map((h) => (h.id === holding.id ? { ...h, status: "PAUSED" } : h))
    );
  };

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

    setConfirmationState({
      isOpen: true,
      actionType: type,
      fundName: selectedHolding.fundName,
      algoId: riskScoreResult.algoAuditId,
      details,
    });
  };

  return (
    <AppContext.Provider
      value={{
        isAuthenticated,
        user,
        login,
        signup,
        loginAsDemo,
        logout,
        profile,
        setProfile,
        updateProfile,
        goals,
        setGoals,
        selectedGoal,
        setSelectedGoal,
        holdings,
        setHoldings,
        portfolio,
        setPortfolio,
        isMarketCrashActive,
        toggleMarketCrash,
        isCutoffSimulated,
        toggleCutoffSimulation,
        failOpenMode,
        toggleFailOpen,
        isProModeOpen,
        toggleProMode,
        isDevModeOpen: isProModeOpen,
        toggleDevMode: toggleProMode,
        resetDemo,
        isOnboardingOpen,
        setIsOnboardingOpen,
        isInterceptModalOpen,
        setIsInterceptModalOpen,
        isHealthReportModalOpen,
        setIsHealthReportModalOpen,
        selectedHolding,
        setSelectedHolding,
        riskScoreResult,
        setRiskScoreResult,
        isEvaluatingRisk,
        handlePauseClick,
        handleSelectAlternative,
        failOpenToast,
        confirmationState,
        setConfirmationState,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error("useApp must be used within an AppProvider");
  }
  return context;
};
