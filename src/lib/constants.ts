import { BehavioralProfile, LifeGoal, PortfolioHealth, QuestionItem, SipHolding } from "@/types";

export const DEFAULT_GOALS: LifeGoal[] = [
  {
    id: "goal-house-2032",
    title: "2032 House Downpayment",
    targetYear: 2032,
    targetAmount: 2500000, // ₹25 Lakhs
    currentAccumulated: 640000, // ₹6.4 Lakhs
    monthlySip: 15000, // ₹15,000/mo
    category: "HOUSING",
    projectedReturnRate: 0.135, // 13.5% historical Midcap CAGR
  },
  {
    id: "goal-child-2038",
    title: "2038 Child Higher Ed",
    targetYear: 2038,
    targetAmount: 3500000, // ₹35 Lakhs
    currentAccumulated: 320000,
    monthlySip: 8000,
    category: "EDUCATION",
    projectedReturnRate: 0.125,
  },
  {
    id: "goal-retire-2045",
    title: "2045 Early Retirement Corpus",
    targetYear: 2045,
    targetAmount: 18000000, // ₹1.8 Crore
    currentAccumulated: 1250000,
    monthlySip: 12000,
    category: "RETIREMENT",
    projectedReturnRate: 0.12,
  },
];

export const DEFAULT_SIP_HOLDINGS: SipHolding[] = [
  {
    id: "sip-midcap-1",
    fundName: "Nippon India Growth Mid-Cap Fund - Direct (G)",
    isin: "INF204K01129",
    category: "MID_CAP",
    monthlyAmount: 15000,
    originalAmount: 15000,
    unitsAccumulated: 3418.5,
    avgNav: 101.2,
    currentNav: 88.4, // -12.6% discount vs 6-month average
    status: "ACTIVE",
    underwaterTranches: [
      {
        purchaseDate: "2026-08-10",
        units: 148.22,
        purchaseNav: 101.2,
        currentNav: 88.4,
        unrealizedLoss: 1897.2,
        holdingType: "STCG",
      },
      {
        purchaseDate: "2026-07-10",
        units: 151.36,
        purchaseNav: 99.1,
        currentNav: 88.4,
        unrealizedLoss: 1619.5,
        holdingType: "STCG",
      },
      {
        purchaseDate: "2026-06-10",
        units: 154.0,
        purchaseNav: 97.4,
        currentNav: 88.4,
        unrealizedLoss: 1386.0,
        holdingType: "STCG",
      },
    ],
  },
  {
    id: "sip-smallcap-2",
    fundName: "Quant Small Cap Fund - Direct Plan (G)",
    isin: "INF966L01AA4",
    category: "SMALL_CAP",
    monthlyAmount: 7500,
    originalAmount: 7500,
    unitsAccumulated: 1240.2,
    avgNav: 248.5,
    currentNav: 228.1,
    status: "ACTIVE",
    underwaterTranches: [
      {
        purchaseDate: "2026-08-05",
        units: 30.18,
        purchaseNav: 248.5,
        currentNav: 228.1,
        unrealizedLoss: 615.6,
        holdingType: "STCG",
      },
    ],
  },
  {
    id: "sip-flexicap-3",
    fundName: "Parag Parikh Flexi Cap Direct Plan (G)",
    isin: "INF879O01019",
    category: "FLEXI_CAP",
    monthlyAmount: 7500,
    originalAmount: 7500,
    unitsAccumulated: 890.4,
    avgNav: 74.5,
    currentNav: 71.8,
    status: "ACTIVE",
    underwaterTranches: [],
  },
  {
    id: "sip-liquid-4",
    fundName: "ICICI Prudential Liquid Direct Plan (G)",
    isin: "INF109K01464",
    category: "DEBT_LIQUID",
    monthlyAmount: 5000,
    originalAmount: 5000,
    unitsAccumulated: 1388.1,
    avgNav: 360.2,
    currentNav: 360.2,
    status: "ACTIVE",
    underwaterTranches: [],
  },
  {
    id: "sip-elss-5",
    fundName: "Mirae Asset ELSS Tax Saver Direct Plan (G)",
    isin: "INF769K01DJ0",
    category: "ELSS_TAX_SAVER",
    monthlyAmount: 3500,
    originalAmount: 3500,
    unitsAccumulated: 512.6,
    avgNav: 48.2,
    currentNav: 46.1,
    status: "ACTIVE",
    underwaterTranches: [],
  },
];

export const DEFAULT_PORTFOLIO_HEALTH: PortfolioHealth = {
  totalAum: 2210000, // ₹22.1 Lakhs
  currentInvestment: 2232000,
  paperLoss: -22000, // ₹22,000 paper loss (localized crash simulation)
  currentDrawdownPct: -7.5, // Nifty Midcap 150 -7.5% drop over 2 weeks
  sipRegularityScore: 94, // 94% on-time execution consistency
  assetAllocation: {
    equity: 68,
    targetEquity: 70,
    debt: 22,
    gold: 5,
    liquid: 5,
  },
  compoundingMomentumIndex: 88,
  vix: 14.8, // India VIX
};

export const DEFAULT_PROFILE: BehavioralProfile = {
  name: "Aarav Sharma",
  archetype: "Anxious Aarav",
  monthlyDisposableIncome: 85000,
  riskBarrier: 0.6, // Default baseline 0.60
  answers: {
    q1: 0.4,
    q2: 0.6,
    q3: 0.7,
    q4: 0.7,
  },
  sessionToken: "anon_sec_9f83a28c11e04b779bb65da1102e389b",
};

export const ONBOARDING_QUESTIONS: QuestionItem[] = [
  {
    id: "q1",
    scenario: "Reaction to Unanticipated Market Pullbacks",
    description: "If your ₹15,000 monthly equity SIP drops by 8% to 10% in two weeks showing a ₹20,000+ paper loss, what is your intuitive reaction?",
    options: [
      {
        label: "Pause SIP immediately to prevent further paper drawdown",
        description: "Focuses on stopping immediate loss (High Myopic Loss Aversion).",
        weight: 0.25,
      },
      {
        label: "Feel nervous and check portfolio multiple times daily, debating a pause",
        description: "Moderate loss aversion; seeks reassurance and guidance.",
        weight: 0.55,
      },
      {
        label: "Acknowledge the drawdown as routine volatility; keep SIP running",
        description: "Disciplined compounding mindset.",
        weight: 0.75,
      },
      {
        label: "Actively deploy surplus liquidity to accumulate discounted units",
        description: "Contrarian value accumulator (High risk resilience).",
        weight: 0.95,
      },
    ],
  },
  {
    id: "q2",
    scenario: "Portfolio Checking Frequency",
    description: "How frequently do you log in to check your mutual fund valuation or daily NAV?",
    options: [
      {
        label: "Multiple times a day on mobile apps",
        description: "Severe exposure to daily noise and Prospect Theory pain asymmetry.",
        weight: 0.35,
      },
      {
        label: "Once a week or after market news headlines",
        description: "Periodic monitoring with emotional sensitivity to drawdowns.",
        weight: 0.6,
      },
      {
        label: "Once a month during monthly SIP debit date",
        description: "Healthy compounding posture with minimal noise distraction.",
        weight: 0.8,
      },
      {
        label: "Quarterly or semi-annually during tax/milestone reviews",
        description: "Institutional hands-off compounding posture.",
        weight: 0.95,
      },
    ],
  },
  {
    id: "q3",
    scenario: "Primary Milestone Horizon & Buffer",
    description: "What is the timeline for your most critical life milestone (e.g., House Downpayment, Child's Education)?",
    options: [
      {
        label: "Within the next 1 to 2 years (Near-term capital lock)",
        description: "Low risk tolerance needed; high sensitivity to short-term volatility.",
        weight: 0.3,
      },
      {
        label: "3 to 6 years away (Medium-term milestone)",
        description: "Balanced horizon requiring asset allocation discipline.",
        weight: 0.6,
      },
      {
        label: "6 to 12 years away (e.g., 2032 House or 2038 Higher Ed)",
        description: "Long horizon capable of riding out multi-year market cycles.",
        weight: 0.8,
      },
      {
        label: "15+ years away (Long-term retirement corpus)",
        description: "Maximum compounding duration; drawdowns are accumulation boons.",
        weight: 0.95,
      },
    ],
  },
  {
    id: "q4",
    scenario: "Emergency Cash Buffer & Liquidity Runway",
    description: "In case of sudden income disruption or unforeseen expenses, how many months of living expenses are in liquid/debt funds?",
    options: [
      {
        label: "Less than 1 month (Tight cash-flow)",
        description: "SIPs might be vulnerable to acute liquidity constraints.",
        weight: 0.3,
      },
      {
        label: "2 to 3 months of emergency runway",
        description: "Moderate safety buffer; may need step-down flexibility.",
        weight: 0.6,
      },
      {
        label: "4 to 6 months in liquid & overnight instruments",
        description: "Robust liquidity runway protecting equity compounding chain.",
        weight: 0.85,
      },
      {
        label: "6+ months plus active family medical/term coverage",
        description: "Fortress balance sheet allowing unhindered contrarian SIPs.",
        weight: 0.95,
      },
    ],
  },
];

// Historical time-series generator for TradingView lightweight-charts
export const GENERATE_TIME_SERIES = () => {
  const data: { time: string; value: number }[] = [];
  const baseNav = 100.0;
  const startDate = new Date("2026-04-01");

  // 180 trading days
  let currentVal = baseNav;
  for (let i = 0; i < 165; i++) {
    const d = new Date(startDate);
    d.setDate(d.getDate() + i);
    const dateStr = d.toISOString().split("T")[0];

    // Steady growth with normal volatility
    const drift = 0.0006;
    const noise = (Math.sin(i / 8) * 0.004) + ((i % 5 === 0 ? 0.008 : -0.003));
    currentVal = currentVal * (1 + drift + noise);
    data.push({
      time: dateStr,
      value: parseFloat(currentVal.toFixed(2)),
    });
  }

  // Peak around 112.5 before 2-week localized crash (-7.5%) down to ~88.4
  const peakVal = data[data.length - 1].value;
  const crashSteps = 15;
  for (let j = 1; j <= crashSteps; j++) {
    const d = new Date(startDate);
    d.setDate(d.getDate() + 165 + j);
    const dateStr = d.toISOString().split("T")[0];
    
    // Sharp descent
    const factor = 1 - (0.075 * (j / crashSteps)) - (Math.random() * 0.005);
    const crashVal = peakVal * factor;
    data.push({
      time: dateStr,
      value: parseFloat(crashVal.toFixed(2)),
    });
  }

  return data;
};
