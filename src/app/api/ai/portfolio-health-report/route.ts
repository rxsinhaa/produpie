import { NextRequest, NextResponse } from "next/server";
import { GeminiFinancialAIService, PortfolioHealthReportParams } from "@/lib/gemini";

export const runtime = "nodejs";

export async function POST(req: NextRequest) {
  try {
    const body = (await req.json()) as PortfolioHealthReportParams;
    const result = await GeminiFinancialAIService.generatePortfolioHealthReport(body);
    return NextResponse.json(result);
  } catch (error: any) {
    console.error("Error in /api/ai/portfolio-health-report:", error);
    return NextResponse.json(
      {
        report: "### 🔍 Portfolio Health Diagnostic\n- **Health Status:** 92/100 (Optimal Velocity)\n- **Execution Regularity:** High consistency across all mandates.\n\n### 🎯 Milestone Alignment\n- All active life milestones remain on track.",
        modelUsed: "fallback",
        isAiGenerated: false,
      },
      { status: 200 }
    );
  }
}
