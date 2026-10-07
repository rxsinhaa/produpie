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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in">
      <div className="relative w-full max-w-lg rounded-3xl border border-[#282e3e] bg-[#12151d] p-6 sm:p-7 shadow-2xl text-slate-100">
        {/* Header */}
        <div className="flex items-start justify-between border-b border-[#242938] pb-4">
          <div className="flex items-center space-x-3.5">
            <div
              className={`flex h-12 w-12 items-center justify-center rounded-2xl border ${
                isSuccessResolution
                  ? "bg-calm-green-950/60 border-calm-green-600 text-calm-green-400 shadow-md shadow-green-950/50"
                  : "bg-slate-800 border-slate-600 text-slate-300"
              }`}
            >
              {actionType === "STEP_DOWN" && <Scissors className="h-6 w-6" />}
              {actionType === "SKIP_SINGLE" && <Calendar className="h-6 w-6" />}
              {actionType === "CONTINUE_SIP" && <TrendingUp className="h-6 w-6" />}
              {actionType === "PAUSE_ANYWAY" && <Clock className="h-6 w-6" />}
            </div>

            <div>
              <span className="rounded-full bg-calm-navy-900 border border-calm-navy-600 px-2.5 py-0.5 text-[10px] font-bold text-slate-300 uppercase">
                Resolution Confirmed
              </span>
              <h3 className="mt-1 text-lg font-bold text-slate-100">
                {actionType === "STEP_DOWN" && "Step-Down Protocol Activated"}
                {actionType === "SKIP_SINGLE" && "Single-Month Skip Scheduled"}
                {actionType === "CONTINUE_SIP" && "Full SIP Re-affirmed (Contrarian)"}
                {actionType === "PAUSE_ANYWAY" && "SIP Paused (Autonomy Preserved)"}
              </h3>
            </div>
          </div>

          <button
            onClick={onClose}
            className="rounded-xl p-2 text-slate-400 hover:text-slate-200 transition"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Resolution Details */}
        <div className="mt-4 space-y-3.5 text-xs">
          <div className="rounded-2xl border border-[#282e3e] bg-[#161a24] p-4 space-y-2.5">
            <div className="flex items-center justify-between">
              <span className="text-slate-400">Target Fund:</span>
              <span className="font-semibold text-slate-200">{fundName}</span>
            </div>

            {actionType === "STEP_DOWN" && (
              <div className="flex items-center justify-between border-t border-[#242938] pt-2.5">
                <span className="text-slate-400">Modified Monthly SIP:</span>
                <span className="font-mono font-bold text-calm-green-400 text-sm">
                  ₹{details?.stepDownAmount?.toLocaleString("en-IN")}/mo (for 3 months)
                </span>
              </div>
            )}

            {actionType === "SKIP_SINGLE" && (
              <div className="flex items-center justify-between border-t border-[#242938] pt-2.5">
                <span className="text-slate-400">Next Scheduled Debit:</span>
                <span className="font-mono font-bold text-blue-400 text-sm">
                  10th of Next Month (Unbroken NACH)
                </span>
              </div>
            )}

            {actionType === "CONTINUE_SIP" && (
              <div className="flex items-center justify-between border-t border-[#242938] pt-2.5">
                <span className="text-slate-400">Compounding Velocity:</span>
                <span className="font-mono font-bold text-calm-amber-400 text-sm">
                  100% Uninterrupted
                </span>
              </div>
            )}

            {actionType === "PAUSE_ANYWAY" && (
              <div className="flex items-center justify-between border-t border-[#242938] pt-2.5">
                <span className="text-slate-400">Pause Duration:</span>
                <span className="font-mono font-bold text-slate-300 text-sm">
                  {details?.months || 3} Months
                </span>
              </div>
            )}
          </div>

          {/* Audit Footnote */}
          <div className="rounded-2xl border border-[#282e3e] bg-[#0c0e12] p-3.5 text-[11px] text-slate-400 space-y-1">
            <div className="flex items-center justify-between">
              <span className="flex items-center gap-1.5 text-slate-300">
                <Lock className="h-3.5 w-3.5 text-calm-green-400" /> SEBI Algo Identifier:
              </span>
              <span className="font-mono font-bold text-slate-200">{algoId}</span>
            </div>
            <p className="text-[10px] text-slate-500 pt-1">
              Zero-PII compliant payload dispatched via broker-approved static gateway.
            </p>
          </div>
        </div>

        {/* Action Button */}
        <div className="mt-5 pt-3.5 border-t border-[#242938]">
          <button
            onClick={onClose}
            className="w-full rounded-2xl bg-gradient-to-r from-calm-navy-600 to-calm-navy-700 py-3 text-xs font-bold text-white hover:brightness-110 active:scale-98 transition shadow-lg"
          >
            Return to Portfolio Dashboard
          </button>
        </div>
      </div>
    </div>
  );
};

export default OrderConfirmationDrawer;
