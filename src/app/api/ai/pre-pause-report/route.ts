import { NextRequest, NextResponse } from "next/server";
import { GeminiFinancialAIService, PrePauseReportParams } from "@/lib/gemini";

export const runtime = "nodejs";

export async function POST(req: NextRequest) {
  try {
    const body = (await req.json()) as PrePauseReportParams;
    const result = await GeminiFinancialAIService.generatePrePauseReport(body);
    return NextResponse.json(result);
  } catch (error: any) {
    console.error("Error in /api/ai/pre-pause-report:", error);
    return NextResponse.json(
      {
        report: "• **Rupee Cost Averaging Alert:** Stopping your contribution forfeits acquiring units at discounted prices.\n• **Milestone Delay:** Pausing directly delays your anchored life milestone target.\n• **Step-Down Recommended:** Use the 50% Step-Down option to preserve compounding.",
        modelUsed: "fallback",
        isAiGenerated: false,
      },
      { status: 200 }
    );
  }
}
