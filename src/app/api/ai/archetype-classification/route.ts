import { NextRequest, NextResponse } from "next/server";
import { GeminiFinancialAIService, ArchetypeClassificationParams } from "@/lib/gemini";

export const runtime = "nodejs";

export async function POST(req: NextRequest) {
  try {
    const body = (await req.json()) as ArchetypeClassificationParams;
    const result = await GeminiFinancialAIService.classifyInvestorArchetype(body);
    return NextResponse.json(result);
  } catch (error: any) {
    console.error("Error in /api/ai/archetype-classification:", error);
    return NextResponse.json(
      {
        archetypeTitle: "Disciplined Wealth Builder",
        badge: "BALANCED DISCIPLINE",
        psychologicalProfile: "You have a solid long-term mindset. You recognize that short-term volatility is normal and stay focused on your target milestone dates.",
        behavioralStrength: "Consistency across market cycles",
        riskMitigationRule: "Use Step-Down safety valves rather than stopping SIPs.",
        riskBarrierScore: 0.6,
      },
      { status: 200 }
    );
  }
}
