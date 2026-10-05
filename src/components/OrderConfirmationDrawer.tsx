"use client";

import React from "react";
import {
  CheckCircle2,
  AlertTriangle,
  Clock,
  Sparkles,
  Lock,
  ArrowRight,
  TrendingUp,
  Scissors,
  Calendar,
  X,
} from "lucide-react";

interface OrderConfirmationDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  actionType: "STEP_DOWN" | "SKIP_SINGLE" | "CONTINUE_SIP" | "PAUSE_ANYWAY" | "HARVEST_TLH" | null;
  fundName: string;
  algoId: string;
  details?: {
    stepDownAmount?: number;
    months?: number;
  };
}

export const OrderConfirmationDrawer: React.FC<OrderConfirmationDrawerProps> = ({
  isOpen,
  onClose,
  actionType,
  fundName,
  algoId,
  details,
}) => {
  if (!isOpen || !actionType) return null;

  const isSuccessResolution = actionType !== "PAUSE_ANYWAY";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-in fade-in">
      <div className="relative w-full max-w-lg rounded-2xl border border-[#282e3e] bg-[#12151d] p-6 shadow-2xl text-slate-100">
        {/* Header */}
        <div className="flex items-start justify-between border-b border-[#242938] pb-4">
          <div className="flex items-center space-x-3">
            <div
              className={`flex h-10 w-10 items-center justify-center rounded-xl border ${
                isSuccessResolution
                  ? "bg-calm-green-950/60 border-calm-green-600 text-calm-green-400"
                  : "bg-slate-800 border-slate-600 text-slate-300"
              }`}
            >
              {actionType === "STEP_DOWN" && <Scissors className="h-5 w-5" />}
              {actionType === "SKIP_SINGLE" && <Calendar className="h-5 w-5" />}
              {actionType === "CONTINUE_SIP" && <TrendingUp className="h-5 w-5" />}
              {actionType === "PAUSE_ANYWAY" && <Clock className="h-5 w-5" />}
            </div>

            <div>
              <span className="rounded bg-calm-navy-900 border border-calm-navy-600 px-2 py-0.5 text-[10px] font-mono text-slate-300">
                Resolution Processed
              </span>
              <h3 className="mt-0.5 text-base font-bold text-slate-100">
                {actionType === "STEP_DOWN" && "Step-Down Protocol Activated"}
                {actionType === "SKIP_SINGLE" && "Single-Month Skip Scheduled"}
                {actionType === "CONTINUE_SIP" && "Full SIP Re-affirmed (Contrarian)"}
                {actionType === "PAUSE_ANYWAY" && "SIP Paused (Autonomy Preserved)"}
              </h3>
            </div>
          </div>

          <button
            onClick={onClose}
            className="rounded-lg p-1.5 text-slate-400 hover:text-slate-200"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Resolution Details */}
        <div className="mt-4 space-y-3 text-xs">
          <div className="rounded-xl border border-[#242938] bg-[#161a24] p-3.5 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-slate-400">Target Fund:</span>
              <span className="font-semibold text-slate-200">{fundName}</span>
            </div>

            {actionType === "STEP_DOWN" && (
              <div className="flex items-center justify-between border-t border-[#242938] pt-2">
                <span className="text-slate-400">Modified Contribution:</span>
                <span className="font-mono font-bold text-calm-green-400">
                  ₹{details?.stepDownAmount?.toLocaleString("en-IN")}/mo (for 3 months)
                </span>
              </div>
            )}

            {actionType === "SKIP_SINGLE" && (
              <div className="flex items-center justify-between border-t border-[#242938] pt-2">
                <span className="text-slate-400">Next Scheduled Debit:</span>
                <span className="font-mono font-bold text-blue-400">
                  10th of Next Month (Unbroken NACH)
                </span>
              </div>
            )}

            {actionType === "CONTINUE_SIP" && (
              <div className="flex items-center justify-between border-t border-[#242938] pt-2">
                <span className="text-slate-400">Compounding Velocity:</span>
                <span className="font-mono font-bold text-calm-amber-400">
                  100% Uninterrupted
                </span>
              </div>
            )}

            {actionType === "PAUSE_ANYWAY" && (
              <div className="flex items-center justify-between border-t border-[#242938] pt-2">
                <span className="text-slate-400">Pause Duration:</span>
                <span className="font-mono font-bold text-slate-300">
                  {details?.months || 3} Months
                </span>
              </div>
            )}
          </div>

          {/* Audit & Compliance Footnote */}
          <div className="rounded-xl border border-[#282e3e] bg-[#0c0e12] p-3 text-[11px] text-slate-400 space-y-1">
            <div className="flex items-center justify-between">
              <span className="flex items-center gap-1 text-slate-300">
                <Lock className="h-3 w-3 text-calm-green-400" /> SEBI Algo ID:
              </span>
              <span className="font-mono font-bold text-slate-200">{algoId}</span>
            </div>
            <p className="text-[10px] text-slate-500 pt-1">
              Zero-PII compliant payload dispatched through broker-approved static gateway.
            </p>
          </div>
        </div>

        {/* Close Button */}
        <div className="mt-5 pt-3 border-t border-[#242938]">
          <button
            onClick={onClose}
            className="w-full rounded-xl bg-calm-navy-600 py-2.5 text-xs font-semibold text-white hover:bg-calm-navy-500 transition shadow"
          >
            Return to Ambient Dashboard
          </button>
        </div>
      </div>
    </div>
  );
};
