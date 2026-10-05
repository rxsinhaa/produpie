export interface LifeGoal {
  id: string;
  title: string;
  targetYear: number;
  targetAmount: number; // in Rupees
  currentAccumulated: number; // in Rupees
  monthlySip: number; // in Rupees
  category: "HOUSING" | "RETIREMENT" | "EDUCATION" | "WEALTH";
  projectedReturnRate: number; // e.g., 0.135 (13.5% CAGR for Midcap)
}

export interface BehavioralProfile {
  name: string;
  archetype: "Anxious Aarav" | "Disciplined Compounder" | "Contrarian Accumulator";
  monthlyDisposableIncome: number;
  riskBarrier: number; // continuous scale from 0.0 to 1.0 (e.g., 0.60)
  answers: Record<string, number>;
  sessionToken: string; // Cryptographic anonymized Zero-PII token
}

export interface SipHolding {
  id: string;
  fundName: string;
  isin: string;
  category: "MID_CAP" | "SMALL_CAP" | "FLEXI_CAP" | "DEBT_LIQUID" | "ELSS_TAX_SAVER";
  monthlyAmount: number; // e.g. 15000 or 7500
  originalAmount: number;
  unitsAccumulated: number;
  avgNav: number; // 6-month average NAV
  currentNav: number; // Current NAV (discounted during dip)
  status: "ACTIVE" | "STEPPED_DOWN" | "SKIPPED_SINGLE" | "PAUSED";
  stepDownMonthsRemaining?: number;
  underwaterTranches: {
    purchaseDate: string;
    units: number;
    purchaseNav: number;
    currentNav: number;
    unrealizedLoss: number;
    holdingType: "STCG" | "LTCG";
  }[];
}

export interface PortfolioHealth {
  totalAum: number;
  currentInvestment: number;
  paperLoss: number;
  currentDrawdownPct: number; // e.g., -7.5
  sipRegularityScore: number; // 0 - 100
  assetAllocation: {
    equity: number; // e.g., 68%
    targetEquity: number; // 70%
    debt: number; // 22%
    gold: number; // 5%
    liquid: number; // 5%
  };
  compoundingMomentumIndex: number; // 0 - 100
  vix: number; // India VIX, e.g. 14.8
}

export interface RiskScorePayload {
  sessionToken: string;
  fundIsin: string;
  sipAmount: number;
  targetGoalId: string;
  currentDrawdown: number;
  vix: number;
  riskBarrier: number;
  forceTimeout?: boolean; // For testing fail-open protocol
}

export interface RiskScoreResult {
  riskScore: number; // 0.0 - 1.0
  isBreached: boolean;
  breakdown: {
    w1_goalDeficitWeight: number;
    goalDeficitScore: number;
    w2_marketFearWeight: number;
    marketFearScore: number; // Drawdown / VIX
    w3_histDeviationWeight: number;
    histDeviationScore: number;
  };
  xaiAudit: {
    rcaUnitDiscountPct: number; // e.g. +12.4% more units acquired
    sixMonthAvgNav: number;
    currentNav: number;
    projectedMilestoneDelayMonths: number;
    calculatedDeficit1Month: number;
    calculatedDeficit3Months: number;
    calculatedDeficit6Months: number;
  };
  sebiCutoffWarning: boolean;
  sebiTimestampInfo: {
    currentTimeIST: string;
    isCutoffRush: boolean; // Between 2:50 PM and 3:00 PM
    cutoffTime: string;
    settlementCycle: "T+0" | "T+1" | "T+2";
    frictionDelayPushToNextDay: boolean;
  };
  algoAuditId: string;
  latencyMs: number;
  failOpen: boolean;
}

export interface QuestionItem {
  id: string;
  scenario: string;
  description: string;
  options: {
    label: string;
    description: string;
    weight: number; // contributing to risk barrier (0.0 = ultra risk averse, 1.0 = ultra resilient)
  }[];
}
