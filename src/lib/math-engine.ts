import { LifeGoal, RiskScorePayload, RiskScoreResult, SipHolding } from "@/types";

export class FinLitMathEngine {
  /**
   * Deterministic Actuarial Math Engine for RiskScore calculation:
   * RiskScore = w1 * (Goal Deficit) + w2 * (Market Drawdown / VIX) + w3 * (Historical Deviation)
   */
  public static calculateRiskScore(
    payload: RiskScorePayload,
    goal: LifeGoal,
    holding: SipHolding,
    simulatedISTHourMinute?: { hour: number; minute: number }
  ): RiskScoreResult {
    const startTime = performance.now();

    // 1. Calculate Time Horizon (Years left to milestone)
    const currentYear = 2026;
    const yearsLeft = Math.max(1, goal.targetYear - currentYear);
    const monthsLeft = yearsLeft * 12;
    const monthlyRate = goal.projectedReturnRate / 12;

    // Dynamic Weights calibration:
    // w1: Weight for Goal Shortfall
    // w2: Weight for Market Fear (Drawdown / VIX)
    // w3: Weight for Historical Deviation (RCA Opportunity)
    const w1 = yearsLeft <= 6 ? 0.45 : 0.40;
    const w2 = 0.35;
    const w3 = 0.20;

    // Actuarial Compound Future Value loss of 3-month pause
    const pauseMonths = 3;
    let compoundedLostCorpus = 0;
    for (let m = 0; m < pauseMonths; m++) {
      compoundedLostCorpus += payload.sipAmount * Math.pow(1 + monthlyRate, monthsLeft - m);
    }

    // Normalized Goal Deficit Score (0.0 to 1.0)
    // Deficit relative to total goal target amount
    const goalDeficitRatio = compoundedLostCorpus / (goal.targetAmount * 0.25);
    const goalDeficitScore = Math.min(1.0, Math.max(0.1, goalDeficitRatio * 0.85));

    // Market Fear Score: (|DrawdownPct| / VIX) normalized
    // e.g. |-7.5%| / 14.8 = 0.506 -> normalized to ~0.75 in severe pullbacks
    const absoluteDrawdown = Math.abs(payload.currentDrawdown);
    const vix = payload.vix > 0 ? payload.vix : 14.8;
    const fearRatio = (absoluteDrawdown / vix) * 1.6;
    const marketFearScore = Math.min(1.0, Math.max(0.1, fearRatio));

    // Historical Deviation Score (RCA discount opportunity)
    // e.g., (101.2 - 88.4) / 101.2 = 12.64% discount
    const navDiscount = Math.max(0, (holding.avgNav - holding.currentNav) / holding.avgNav);
    const histDeviationScore = Math.min(1.0, Math.max(0.1, navDiscount * 5.5));

    // Composite Deterministic Risk Score
    const rawRiskScore = (w1 * goalDeficitScore) + (w2 * marketFearScore) + (w3 * histDeviationScore);
    const riskScore = parseFloat(Math.min(0.99, Math.max(0.05, rawRiskScore)).toFixed(3));
    const isBreached = riskScore >= payload.riskBarrier;

    // RCA Unit Advantage Calculation
    const unitsAtCurrentNav = payload.sipAmount / holding.currentNav;
    const unitsAtAvgNav = payload.sipAmount / holding.avgNav;
    const rcaUnitDiscountPct = parseFloat(
      (((unitsAtCurrentNav - unitsAtAvgNav) / unitsAtAvgNav) * 100).toFixed(1)
    );

    // Deficit Calculations for 1, 3, 6 months
    const calcDeficit = (months: number) => {
      let loss = 0;
      for (let m = 0; m < months; m++) {
        loss += payload.sipAmount * Math.pow(1 + monthlyRate, monthsLeft - m);
      }
      return Math.round(loss);
    };

    const calculatedDeficit1Month = calcDeficit(1);
    const calculatedDeficit3Months = calcDeficit(3);
    const calculatedDeficit6Months = calcDeficit(6);

    // Estimate Milestone Delay in months
    const monthlyAccumulationRate = goal.targetAmount / monthsLeft;
    const projectedMilestoneDelayMonths = Math.max(
      1,
      Math.round(calculatedDeficit3Months / monthlyAccumulationRate)
    );

    // SEBI NAV Time-Stamp Protocol Evaluation
    const now = new Date();
    let istHour = (now.getUTCHours() + 5 + Math.floor((now.getUTCMinutes() + 30) / 60)) % 24;
    let istMinute = (now.getUTCMinutes() + 30) % 60;

    if (simulatedISTHourMinute) {
      istHour = simulatedISTHourMinute.hour;
      istMinute = simulatedISTHourMinute.minute;
    }

    const currentTimeIST = `${String(istHour).padStart(2, "0")}:${String(istMinute).padStart(2, "0")} IST`;
    // Cut-off rush window is between 2:50 PM (14:50) and 3:00 PM (15:00) IST
    const isCutoffRush = (istHour === 14 && istMinute >= 50 && istMinute <= 59);
    const sebiCutoffWarning = isCutoffRush;
    const settlementCycle = isCutoffRush ? "T+1" : (istHour >= 15 ? "T+1" : "T+0");

    const endTime = performance.now();
    const latencyMs = parseFloat((endTime - startTime).toFixed(2));

    // Exchange Algo Audit Tag (SEBI 2025/2026 algorithmic compliance format)
    const algoAuditId = `SEBI-ALG-${Date.now().toString(36).toUpperCase()}-${Math.floor(Math.random() * 8999 + 1000)}`;

    return {
      riskScore,
      isBreached,
      breakdown: {
        w1_goalDeficitWeight: w1,
        goalDeficitScore: parseFloat(goalDeficitScore.toFixed(3)),
        w2_marketFearWeight: w2,
        marketFearScore: parseFloat(marketFearScore.toFixed(3)),
        w3_histDeviationWeight: w3,
        histDeviationScore: parseFloat(histDeviationScore.toFixed(3)),
      },
      xaiAudit: {
        rcaUnitDiscountPct,
        sixMonthAvgNav: holding.avgNav,
        currentNav: holding.currentNav,
        projectedMilestoneDelayMonths,
        calculatedDeficit1Month,
        calculatedDeficit3Months,
        calculatedDeficit6Months,
      },
      sebiCutoffWarning,
      sebiTimestampInfo: {
        currentTimeIST,
        isCutoffRush,
        cutoffTime: "15:00 IST (SEBI 3:00 PM Cut-off)",
        settlementCycle,
        frictionDelayPushToNextDay: isCutoffRush,
      },
      algoAuditId,
      latencyMs,
      failOpen: false,
    };
  }

  /**
   * Generates dynamic SVG trajectory coordinates for 1 to 6 months pause vs baseline compounding
   */
  public static generateTrajectoryData(
    goal: LifeGoal,
    monthlySip: number,
    pauseMonths: number
  ) {
    const years = Math.max(2, goal.targetYear - 2026);
    const totalMonths = years * 12;
    const monthlyRate = goal.projectedReturnRate / 12;

    const baselinePoints: { month: number; year: number; corpus: number }[] = [];
    const pausedPoints: { month: number; year: number; corpus: number }[] = [];
    const stepDownPoints: { month: number; year: number; corpus: number }[] = [];

    let baseCorpus = goal.currentAccumulated;
    let pauseCorpus = goal.currentAccumulated;
    let stepDownCorpus = goal.currentAccumulated;

    const stepDownMonths = Math.min(3, pauseMonths);
    const stepDownAmount = monthlySip * 0.5; // 50% step-down

    for (let m = 1; m <= totalMonths; m++) {
      // 1. Baseline: unbroken SIP
      baseCorpus = (baseCorpus + monthlySip) * (1 + monthlyRate);

      // 2. Paused: 0 SIP for pauseMonths, then resumes
      const currentPauseSip = m <= pauseMonths ? 0 : monthlySip;
      pauseCorpus = (pauseCorpus + currentPauseSip) * (1 + monthlyRate);

      // 3. Step-down: 50% SIP for stepDownMonths, then resumes
      const currentStepDownSip = m <= stepDownMonths ? stepDownAmount : monthlySip;
      stepDownCorpus = (stepDownCorpus + currentStepDownSip) * (1 + monthlyRate);

      if (m % 3 === 0 || m === totalMonths) {
        const yearFraction = 2026 + parseFloat((m / 12).toFixed(1));
        baselinePoints.push({ month: m, year: yearFraction, corpus: Math.round(baseCorpus) });
        pausedPoints.push({ month: m, year: yearFraction, corpus: Math.round(pauseCorpus) });
        stepDownPoints.push({ month: m, year: yearFraction, corpus: Math.round(stepDownCorpus) });
      }
    }

    const finalBaseline = baselinePoints[baselinePoints.length - 1].corpus;
    const finalPaused = pausedPoints[pausedPoints.length - 1].corpus;
    const finalStepDown = stepDownPoints[stepDownPoints.length - 1].corpus;

    const totalDeficit = finalBaseline - finalPaused;
    const stepDownDeficit = finalBaseline - finalStepDown;
    const protectedCorpus = totalDeficit - stepDownDeficit;

    return {
      baselinePoints,
      pausedPoints,
      stepDownPoints,
      finalBaseline,
      finalPaused,
      finalStepDown,
      totalDeficit,
      stepDownDeficit,
      protectedCorpus,
    };
  }

  /**
   * Evaluates Tax-Loss Harvesting (TLH) opportunities for underwater tranches
   */
  public static calculateTaxLossHarvesting(holding: SipHolding) {
    let totalUnrealizedLoss = 0;
    let stcgLoss = 0;
    let ltcgLoss = 0;

    holding.underwaterTranches.forEach((tranche) => {
      totalUnrealizedLoss += tranche.unrealizedLoss;
      if (tranche.holdingType === "STCG") {
        stcgLoss += tranche.unrealizedLoss;
      } else {
        ltcgLoss += tranche.unrealizedLoss;
      }
    });

    // Indian Income Tax Act 2024/2026:
    // STCG Tax Rate on Equity MF: 20%
    // LTCG Tax Rate on Equity MF: 12.5% (above ₹1.25 Lakh exemption)
    const stcgTaxSaved = stcgLoss * 0.20;
    const ltcgTaxSaved = ltcgLoss * 0.125;
    const totalPotentialTaxSaved = Math.round(stcgTaxSaved + ltcgTaxSaved);

    return {
      totalUnderwaterUnits: holding.underwaterTranches.reduce((acc, t) => acc + t.units, 0),
      totalUnrealizedLoss: Math.round(totalUnrealizedLoss),
      stcgLoss: Math.round(stcgLoss),
      ltcgLoss: Math.round(ltcgLoss),
      totalPotentialTaxSaved,
      hasHarvestableLosses: holding.underwaterTranches.length > 0,
    };
  }
}
