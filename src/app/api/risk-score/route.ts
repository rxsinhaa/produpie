import { NextRequest, NextResponse } from "next/server";
import { FinLitMathEngine } from "@/lib/math-engine";
import { DEFAULT_GOALS, DEFAULT_SIP_HOLDINGS } from "@/lib/constants";
import { RiskScorePayload } from "@/types";

// Vercel Serverless Edge Function Runtime for sub-200ms latency SLA
export const runtime = "edge";

export async function POST(req: NextRequest) {
  const startTime = performance.now();

  try {
    const body = (await req.json()) as RiskScorePayload & {
      simulatedISTHourMinute?: { hour: number; minute: number };
    };

    // Fail-Open Simulation / Timeout Trigger
    if (body.forceTimeout) {
      // Simulate timeout exceeding 200ms SLA
      await new Promise((resolve) => setTimeout(resolve, 250));
      return NextResponse.json(
        {
          error: "Inference SLA exceeded 200ms. Fail-Open routing initiated.",
          failOpen: true,
          latencyMs: 250,
          algoAuditId: "SEBI-FAILOPEN-FALLBACK",
        },
        { status: 504 }
      );
    }

    // Zero-PII Compliance Check
    // Ensure request contains anonymized session token, not PII
    if (!body.sessionToken || body.sessionToken.includes("@")) {
      return NextResponse.json(
        { error: "Zero-PII violation: Sensitive identifiers rejected." },
        { status: 400 }
      );
    }

    // Find target goal and holding
    const goal =
      DEFAULT_GOALS.find((g) => g.id === body.targetGoalId) || DEFAULT_GOALS[0];
    const holding =
      DEFAULT_SIP_HOLDINGS.find((h) => h.isin === body.fundIsin) ||
      DEFAULT_SIP_HOLDINGS[0];

    // Compute deterministic risk score
    const result = FinLitMathEngine.calculateRiskScore(
      body,
      goal,
      holding,
      body.simulatedISTHourMinute
    );

    const totalLatency = parseFloat((performance.now() - startTime).toFixed(2));
    result.latencyMs = totalLatency;

    return NextResponse.json(result, {
      headers: {
        "x-finlit-latency-ms": totalLatency.toString(),
        "x-finlit-zero-pii": "compliant",
        "x-sebi-algo-id": result.algoAuditId,
        "Cache-Control": "no-store, max-age=0",
      },
    });
  } catch (error: any) {
    // Fail-Open Protocol on error
    return NextResponse.json(
      {
        error: error?.message || "Internal inference error",
        failOpen: true,
        latencyMs: parseFloat((performance.now() - startTime).toFixed(2)),
      },
      { status: 500 }
    );
  }
}
