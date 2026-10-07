import { GoogleGenerativeAI } from "@google/generative-ai";
import { LifeGoal, PortfolioHealth, SipHolding, BehavioralProfile } from "@/types";

// Dynamically retrieve Gemini Client to ensure fresh environment variable resolution
function getGenAIClient(): GoogleGenerativeAI | null {
  const key = (
    process.env.GEMINI_API_KEY ||
    process.env.NEXT_PUBLIC_GEMINI_API_KEY ||
    ""
  ).trim();
  if (!key || key === "your_google_gemini_api_key_here") {
    return null;
  }
  try {
    return new GoogleGenerativeAI(key);
  } catch (err) {
    console.warn("Failed to instantiate GoogleGenerativeAI:", err);
    return null;
  }
}

export interface PrePauseReportParams {
  fundName: string;
  monthlyAmount: number;
  currentNav: number;
  avgNav: number;
  rcaUnitDiscountPct: number;
  goalTitle: string;
  goalYear: number;
  targetCorpus: number;
  pauseMonths: number;
  projectedMilestoneDelayMonths: number;
  calculatedDeficit: number;
  currentDrawdownPct: number;
  vix: number;
}

export interface PortfolioHealthReportParams {
  userName: string;
  profile: BehavioralProfile;
  portfolio: PortfolioHealth;
  goals: LifeGoal[];
  holdings: SipHolding[];
  isMarketCrashActive: boolean;
}

export interface ArchetypeClassificationParams {
  userName: string;
  answers: Record<string, number>;
  goals: LifeGoal[];
}

export interface ArchetypeClassificationResult {
  archetypeTitle: string;
  badge: string;
  psychologicalProfile: string;
  behavioralStrength: string;
  riskMitigationRule: string;
  riskBarrierScore: number;
}

export class GeminiFinancialAIService {
  /**
   * FEATURE 3A: Pre-Pause AI Consequence Report (gemini-1.5-flash)
   * High-speed, empathetic, deterministic consequence analysis
   */
  public static async generatePrePauseReport(
    params: PrePauseReportParams
  ): Promise<{ report: string; modelUsed: string; isAiGenerated: boolean }> {
    const formatInr = (n: number) => `₹${n.toLocaleString("en-IN")}`;
    const prompt = `
System Role: You are The LIT Buddy — an elite, certified behavioral finance advisor and AI co-pilot for retail investors.
Compliance Mandate: Under SEBI guidelines, NEVER hallucinate numbers, make speculative price predictions, or give individual fund endorsements. Strictly explain the provided deterministic actuarial math.

User Context:
- Target Fund: ${params.fundName} (Monthly Contribution: ${formatInr(params.monthlyAmount)})
- Current Discounted NAV: ₹${params.currentNav.toFixed(2)} vs 6-Month Average NAV: ₹${params.avgNav.toFixed(2)}
- Rupee Cost Averaging Advantage: Acquires +${params.rcaUnitDiscountPct}% more units today per ₹1,000.
- Anchored Milestone: ${params.goalTitle} (Target Year: ${params.goalYear}, Target Corpus: ${formatInr(params.targetCorpus)})
- Proposed Action: Pausing SIP for ${params.pauseMonths} month(s).
- Deterministic Math Impact:
  * Milestone Delay: ~${params.projectedMilestoneDelayMonths} months delay to achieve ${params.goalTitle}.
  * Lost Compounded Value: -${formatInr(params.calculatedDeficit)} terminal shortfall.
  * Current Market Pullback: ${params.currentDrawdownPct}% (India VIX: ${params.vix}).

Task:
Write a crisp, high-impact, 3-bullet point "The LIT Buddy Consequence Report" explaining why pausing now damages their milestone and destroys the Rupee Cost Averaging advantage.
Structure requirements:
- Point 1: Explain the Rupee Cost Averaging penalty (units on sale at +${params.rcaUnitDiscountPct}% discount).
- Point 2: Explain the concrete milestone delay (~${params.projectedMilestoneDelayMonths} months delay on their ${params.goalTitle}).
- Point 3: Recommend the Step-Down alternative (saving 70%+ compounding while offering cashflow relief).
- Keep total length under 140 words. Use empathetic but firm, professional tone. Avoid generic filler.
`;

    const genAI = getGenAIClient();
    if (genAI) {
      try {
        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
        const result = await model.generateContent(prompt);
        const text = result.response.text();
        if (text && text.trim().length > 30) {
          return { report: text.trim(), modelUsed: "gemini-1.5-flash", isAiGenerated: true };
        }
      } catch (err) {
        console.warn("Gemini Flash call failed, attempting fallback:", err);
        try {
          const modelPro = genAI.getGenerativeModel({ model: "gemini-1.5-pro" });
          const resultPro = await modelPro.generateContent(prompt);
          const textPro = resultPro.response.text();
          if (textPro && textPro.trim().length > 30) {
            return { report: textPro.trim(), modelUsed: "gemini-1.5-pro", isAiGenerated: true };
          }
        } catch (err2) {
          console.warn("Gemini API call failed, falling back to deterministic response:", err2);
        }
      }
    }

    // High-fidelity fallback generated directly from deterministic math
    const fallbackReport = `• **Rupee Cost Averaging Penalty:** Halting your ${formatInr(params.monthlyAmount)} contribution forfeits acquiring fund units at a **+${params.rcaUnitDiscountPct}% unit discount** (NAV ₹${params.currentNav.toFixed(2)} vs 6-month avg ₹${params.avgNav.toFixed(2)}).
• **Milestone Timeline Fracture:** Pausing for ${params.pauseMonths} months creates a **-${formatInr(params.calculatedDeficit)} compounded deficit**, directly delaying your **${params.goalTitle} (${params.goalYear}) by ~${params.projectedMilestoneDelayMonths} months**.
• **The LIT Buddy Recommendation:** Instead of an outright pause, activate the **Step-Down SIP (₹${Math.round(params.monthlyAmount * 0.5).toLocaleString("en-IN")}/mo)** to alleviate cashflow while preserving over 70% of your compounding trajectory.`;

    return { report: fallbackReport, modelUsed: "The LIT Buddy Engine", isAiGenerated: false };
  }

  /**
   * FEATURE 3B: On-Demand AI Portfolio Health & Risk Report (gemini-1.5-pro)
   * In-depth reasoning and portfolio audit
   */
  public static async generatePortfolioHealthReport(
    params: PortfolioHealthReportParams
  ): Promise<{ report: string; modelUsed: string; isAiGenerated: boolean }> {
    const formatInr = (n: number) => {
      if (Math.abs(n) >= 10000000) return `₹${(n / 10000000).toFixed(2)} Cr`;
      if (Math.abs(n) >= 100000) return `₹${(n / 100000).toFixed(2)} Lakhs`;
      return `₹${n.toLocaleString("en-IN")}`;
    };

    const goalsSummary = params.goals
      .map(
        (g) =>
          `- ${g.title} (${g.targetYear}): Target ${formatInr(g.targetAmount)}, Current Accumulated ${formatInr(g.currentAccumulated)} (${Math.round((g.currentAccumulated / g.targetAmount) * 100)}% funded), Monthly SIP: ₹${g.monthlySip.toLocaleString("en-IN")}`
      )
      .join("\n");

    const holdingsSummary = params.holdings
      .map(
        (h) =>
          `- ${h.fundName} [${h.category}]: ₹${h.monthlyAmount.toLocaleString("en-IN")}/mo (Status: ${h.status}, Current NAV ₹${h.currentNav} vs Avg ₹${h.avgNav})`
      )
      .join("\n");

    const prompt = `
System Role: You are The LIT Buddy — Chief Quantitative Strategist and AI Wealth Co-Pilot.
Compliance Mandate: Adhere strictly to SEBI technology advisory guidelines. NEVER hallucinate metrics or recommend individual stock tips. Evaluate solely the provided deterministic portfolio state.

Investor Profile:
- Investor: ${params.userName}
- Archetype: ${params.profile.archetype} (Calibrated Risk Barrier: ${params.profile.riskBarrier.toFixed(2)}/1.00)
- Total Portfolio AUM: ${formatInr(params.portfolio.totalAum)}
- Paper Gain/Loss Status: ${formatInr(params.portfolio.paperLoss)} (${params.portfolio.currentDrawdownPct}% drawdown in simulated stress test)
- Compounding Regularity Score: ${params.portfolio.sipRegularityScore}%
- Current Asset Allocation: Equity ${params.portfolio.assetAllocation.equity}% (Target: ${params.portfolio.assetAllocation.targetEquity}%), Debt ${params.portfolio.assetAllocation.debt}%, Gold ${params.portfolio.assetAllocation.gold}%, Liquid Cash ${params.portfolio.assetAllocation.liquid}%
- India VIX Volatility: ${params.portfolio.vix}

Anchored Life Milestones:
${goalsSummary}

Active Systematic Investment Mandates:
${holdingsSummary}

Task:
Generate a comprehensive, beautifully structured **The LIT Buddy Portfolio Health & Risk Audit Report** in Markdown format.
Include these exact sections:
1. ### 🔍 Executive Risk Classification & Health Diagnostic
   - Classify overall risk level (e.g., "Optimal Compounding Velocity / Moderate Volatility Exposure").
   - Comment on the 92/100 Health Score and ${params.portfolio.sipRegularityScore}% execution regularity.
2. ### 🎯 Life Milestone Horizon Audit
   - Evaluate progress toward ${params.goals[0]?.title || "Primary Goal"} and other goals.
   - Explain why maintaining SIP continuity safeguards the target corpus timeline.
3. ### ⚖️ Asset Allocation & Contrarian Drift Analysis
   - Analyze the 68% equity vs 70% target drift during market drawdowns.
   - Highlight the Rupee Cost Averaging advantage of buying discounted units in mid-caps today.
4. ### 🛡️ The LIT Buddy Action Protocol
   - 3 actionable, compliant wealth principles (e.g. automated step-down safety valve, maintaining liquid emergency buffer, utilizing tax-loss harvesting if rebalancing).

Tone: Sophisticated, quantitative, empathetic, and encouraging. Use bold key metrics.
`;

    const genAI = getGenAIClient();
    if (genAI) {
      try {
        const model = genAI.getGenerativeModel({ model: "gemini-1.5-pro" });
        const result = await model.generateContent(prompt);
        const text = result.response.text();
        if (text && text.trim().length > 100) {
          return { report: text.trim(), modelUsed: "gemini-1.5-pro", isAiGenerated: true };
        }
      } catch (err) {
        console.warn("Gemini 1.5 Pro call failed, attempting flash fallback:", err);
        try {
          const modelFlash = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
          const resultFlash = await modelFlash.generateContent(prompt);
          const textFlash = resultFlash.response.text();
          if (textFlash && textFlash.trim().length > 100) {
            return { report: textFlash.trim(), modelUsed: "gemini-1.5-flash", isAiGenerated: true };
          }
        } catch (e2) {
          console.warn("Gemini Flash fallback failed:", e2);
        }
      }
    }

    // High-fidelity fallback
    const fallbackReport = `### 🔍 Executive Risk Classification & Health Diagnostic
- **Portfolio Health Status:** **92/100 (Optimal Velocity)**. Your portfolio demonstrates institutional-grade compounding consistency with a **${params.portfolio.sipRegularityScore}% on-time debit regularity**.
- **Risk Posture:** Classified as **${params.profile.archetype}**. During current market stress (${params.portfolio.currentDrawdownPct}% drawdown, VIX ${params.portfolio.vix}), your portfolio remains well-insulated against irreversible capital impairment.

### 🎯 Life Milestone Horizon Audit
- **${params.goals[0]?.title || "Primary Milestone"}:** Currently on track with **${formatInr(params.goals[0]?.currentAccumulated || 640000)} accumulated** towards your **${formatInr(params.goals[0]?.targetAmount || 2500000)}** target by ${params.goals[0]?.targetYear || 2032}.
- **Compounding Runway:** Uninterrupted monthly contributions of ₹${params.goals[0]?.monthlySip.toLocaleString("en-IN") || "15,000"} compound at a projected historical ${(params.goals[0]?.projectedReturnRate * 100 || 13.5).toFixed(1)}% CAGR. Any temporary pause introduces compounding friction that requires exponential catch-up capital later.

### ⚖️ Asset Allocation & Contrarian Drift Analysis
- **Current Allocation:** Equity **${params.portfolio.assetAllocation.equity}%** | Debt **${params.portfolio.assetAllocation.debt}%** | Gold **${params.portfolio.assetAllocation.gold}%** | Liquid **${params.portfolio.assetAllocation.liquid}%**.
- **Tactical Buying Window:** The -7.5% market pullback has created a **12.6% discount** in your **Nippon Growth Mid-Cap SIP** NAV (₹88.40 vs 6-mo average ₹101.20). Your fixed monthly debit acquires **+14.5% more fund units** per cycle.

### 🛡️ The LIT Buddy Action Protocol
1. **Maintain Equity Accumulation:** Do not halt SIPs during market stress; Rupee Cost Averaging produces maximum alpha during drawdowns.
2. **Step-Down Flexibility:** If liquidity tightens, utilize the **50% Step-Down option** rather than an outright pause to protect 70%+ of your compounding habit.
3. **Preserve Liquid Runway:** Keep your ₹5,000/mo liquid fund debit active to protect your emergency buffer without forced equity liquidations.`;

    return { report: fallbackReport, modelUsed: "The LIT Buddy Engine", isAiGenerated: false };
  }

  /**
   * FEATURE 3C: Smart Archetype Classification for Onboarding (gemini-1.5-flash)
   */
  public static async classifyInvestorArchetype(
    params: ArchetypeClassificationParams
  ): Promise<ArchetypeClassificationResult> {
    const weights = Object.values(params.answers);
    const avgScore = weights.length > 0 ? weights.reduce((a, b) => a + b, 0) / weights.length : 0.6;
    const baseBarrier = parseFloat(avgScore.toFixed(2));

    const prompt = `
System Role: You are The LIT Buddy — a behavioral finance AI psychologist and investment persona classifier.
Task: Analyze the user's responses to 4 behavioral financial scenarios and output a JSON profile.

User Context:
- Name: ${params.userName}
- Scenario Answer Weights (0.0 to 1.0 scale): ${JSON.stringify(params.answers)}
- Calculated Mathematical Baseline: ${baseBarrier}
- Primary Milestone: ${params.goals[0]?.title || "Wealth Creation"} (${params.goals[0]?.targetYear || 2032})

Output Requirements: Return ONLY a valid raw JSON object with these exact keys:
{
  "archetypeTitle": "e.g. Pragmatic Horizon Compounder | Resilient Value Accumulator | Steady Milestone Builder",
  "badge": "e.g. BALANCED DISCIPLINE | CONTRARIAN COMPOUNDER | STEADY ACCUMULATOR",
  "psychologicalProfile": "2 concise sentences explaining their psychological comfort with market volatility and long-term compounding.",
  "behavioralStrength": "1 key psychological asset (e.g. High milestone commitment)",
  "riskMitigationRule": "1 actionable rule to protect their wealth during drawdowns",
  "riskBarrierScore": ${baseBarrier}
}
`;

    const genAI = getGenAIClient();
    if (genAI) {
      try {
        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
        const result = await model.generateContent(prompt);
        const text = result.response.text();
        const jsonMatch = text.match(/\{[\s\S]*\}/);
        if (jsonMatch) {
          const parsed = JSON.parse(jsonMatch[0]);
          return {
            archetypeTitle: parsed.archetypeTitle || (baseBarrier >= 0.75 ? "Dynamic Opportunity Seeker" : baseBarrier >= 0.55 ? "Disciplined Wealth Builder" : "Long-Term Steady"),
            badge: parsed.badge || "THE LIT BUDDY VERIFIED",
            psychologicalProfile: parsed.psychologicalProfile || "You maintain a steady, milestone-anchored compounding posture capable of navigating routine market drawdowns with automated safeguards.",
            behavioralStrength: parsed.behavioralStrength || "Milestone-oriented discipline",
            riskMitigationRule: parsed.riskMitigationRule || "Utilize Step-Down safety valves rather than stopping SIPs during drawdowns.",
            riskBarrierScore: baseBarrier,
          };
        }
      } catch (err) {
        console.warn("Gemini Archetype classification failed, using deterministic fallback:", err);
      }
    }

    // Deterministic fallback
    if (baseBarrier >= 0.75) {
      return {
        archetypeTitle: "Dynamic Opportunity Seeker",
        badge: "CONTRARIAN COMPOUNDER",
        psychologicalProfile: "You perceive market pullbacks as prime unit accumulation opportunities. Your high behavioral resilience allows you to deploy capital aggressively when valuations are discounted.",
        behavioralStrength: "Contrarian value accumulation mindset",
        riskMitigationRule: "Ensure cash reserves remain buffered before increasing mid-cap allocations.",
        riskBarrierScore: baseBarrier,
      };
    }
    if (baseBarrier >= 0.55) {
      return {
        archetypeTitle: "Disciplined Wealth Builder",
        badge: "BALANCED DISCIPLINE",
        psychologicalProfile: "You have a solid, long-term compounding posture. You recognize that short-term volatility is normal and stay focused on your target milestone dates without emotional panic.",
        behavioralStrength: "Consistency and patience across market cycles",
        riskMitigationRule: "Rely on explainable milestone math to navigate short-term negative headlines.",
        riskBarrierScore: baseBarrier,
      };
    }
    return {
      archetypeTitle: "Long-Term Steady",
      badge: "STEADY COMPOUNDER",
      psychologicalProfile: "You value emotional peace of mind and milestone certainty. The LIT Buddy automatically protects your compounding habit by offering gentle step-down contributions during rough markets.",
      behavioralStrength: "High commitment to milestone preservation",
      riskMitigationRule: "Use automated 50% Step-Down options to avoid disruptive cashflow shocks.",
      riskBarrierScore: baseBarrier,
    };
  }
}

