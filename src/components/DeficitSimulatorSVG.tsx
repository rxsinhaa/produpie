"use client";

import React, { useMemo } from "react";
import { LifeGoal } from "@/types";
import { FinLitMathEngine } from "@/lib/math-engine";
import { TrendingDown, ArrowDownRight, Sparkles, CheckCircle, AlertCircle, Sliders } from "lucide-react";

interface DeficitSimulatorSVGProps {
  goal: LifeGoal;
  monthlySip: number;
  pauseMonths: number;
  onPauseMonthsChange: (months: number) => void;
}

export const DeficitSimulatorSVG: React.FC<DeficitSimulatorSVGProps> = ({
  goal,
  monthlySip,
  pauseMonths,
  onPauseMonthsChange,
}) => {
  // Generate real-time mathematical trajectory coordinates
  const trajectory = useMemo(() => {
    return FinLitMathEngine.generateTrajectoryData(goal, monthlySip, pauseMonths);
  }, [goal, monthlySip, pauseMonths]);

  // SVG dimensions
  const svgWidth = 620;
  const svgHeight = 220;
  const padding = { top: 25, right: 35, bottom: 35, left: 60 };

  const plotWidth = svgWidth - padding.left - padding.right;
  const plotHeight = svgHeight - padding.top - padding.bottom;

  // Scales
  const maxCorpus = Math.max(
    goal.targetAmount,
    trajectory.finalBaseline * 1.08
  );
  const minCorpus = goal.currentAccumulated * 0.9;

  const totalPoints = trajectory.baselinePoints.length;

  const getX = (index: number) => {
    return padding.left + (index / (totalPoints - 1)) * plotWidth;
  };

  const getY = (val: number) => {
    const ratio = (val - minCorpus) / (maxCorpus - minCorpus);
    return padding.top + plotHeight - ratio * plotHeight;
  };

  // Generate SVG Path d strings
  const baselinePath = useMemo(() => {
    return trajectory.baselinePoints.reduce((acc, pt, idx) => {
      const x = getX(idx);
      const y = getY(pt.corpus);
      return idx === 0 ? `M ${x} ${y}` : `${acc} L ${x} ${y}`;
    }, "");
  }, [trajectory.baselinePoints, maxCorpus, minCorpus]);

  const pausedPath = useMemo(() => {
    return trajectory.pausedPoints.reduce((acc, pt, idx) => {
      const x = getX(idx);
      const y = getY(pt.corpus);
      return idx === 0 ? `M ${x} ${y}` : `${acc} L ${x} ${y}`;
    }, "");
  }, [trajectory.pausedPoints, maxCorpus, minCorpus]);

  const stepDownPath = useMemo(() => {
    return trajectory.stepDownPoints.reduce((acc, pt, idx) => {
      const x = getX(idx);
      const y = getY(pt.corpus);
      return idx === 0 ? `M ${x} ${y}` : `${acc} L ${x} ${y}`;
    }, "");
  }, [trajectory.stepDownPoints, maxCorpus, minCorpus]);

  // Format currency in Lakhs/Crores
  const formatInr = (num: number) => {
    if (num >= 10000000) {
      return `₹${(num / 10000000).toFixed(2)} Cr`;
    }
    if (num >= 100000) {
      return `₹${(num / 100000).toFixed(2)} L`;
    }
    return `₹${num.toLocaleString("en-IN")}`;
  };

  return (
    <div className="rounded-2xl border border-calm-amber-600/30 bg-[#14171f] p-4 sm:p-5 shadow-lg">
      {/* Simulator Header with Live Micro-slider */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[#242938] pb-3.5">
        <div>
          <div className="flex items-center space-x-2">
            <span className="inline-block h-2.5 w-2.5 rounded-full bg-calm-amber-400 animate-pulse"></span>
            <h4 className="text-sm font-bold text-slate-100">
              Interactive Compounding Deficit Simulator
            </h4>
          </div>
          <p className="text-xs text-slate-400 mt-0.5">
            Real-time projection for{" "}
            <span className="text-slate-200 font-medium">{goal.title}</span> ({goal.targetYear})
          </p>
        </div>

        {/* Micro-Slider Control */}
        <div className="flex items-center space-x-3 bg-[#1a1e29] border border-[#282e3e] rounded-xl px-3.5 py-2">
          <span className="text-xs text-slate-400 font-medium">Pause Duration:</span>
          <input
            type="range"
            min="1"
            max="6"
            step="1"
            value={pauseMonths}
            onChange={(e) => onPauseMonthsChange(parseInt(e.target.value))}
            className="micro-slider w-28 sm:w-32 accent-amber-400 cursor-pointer"
            id="pause-months-slider"
          />
          <span className="min-w-[4.5rem] rounded-lg bg-calm-amber-900/60 border border-calm-amber-600/50 px-2.5 py-1 text-center text-xs font-bold text-calm-amber-300">
            {pauseMonths} {pauseMonths === 1 ? "Month" : "Months"}
          </span>
        </div>
      </div>

      {/* SVG Canvas Area */}
      <div className="relative mt-3.5 w-full overflow-hidden rounded-xl bg-[#0c0e12] p-2.5 border border-[#1e2433]">
        <svg
          viewBox={`0 0 ${svgWidth} ${svgHeight}`}
          className="w-full h-auto"
          preserveAspectRatio="xMidYMid meet"
        >
          {/* Grid lines */}
          <line
            x1={padding.left}
            y1={padding.top}
            x2={svgWidth - padding.right}
            y2={padding.top}
            stroke="#282e3e"
            strokeDasharray="3 3"
          />
          <line
            x1={padding.left}
            y1={padding.top + plotHeight / 2}
            x2={svgWidth - padding.right}
            y2={padding.top + plotHeight / 2}
            stroke="#282e3e"
            strokeDasharray="3 3"
          />
          <line
            x1={padding.left}
            y1={padding.top + plotHeight}
            x2={svgWidth - padding.right}
            y2={padding.top + plotHeight}
            stroke="#38425d"
          />

          {/* Target Milestone Reference Line */}
          <line
            x1={padding.left}
            y1={getY(goal.targetAmount)}
            x2={svgWidth - padding.right}
            y2={getY(goal.targetAmount)}
            stroke="#22c55e"
            strokeWidth="1.2"
            strokeDasharray="4 4"
            opacity="0.6"
          />
          <text
            x={svgWidth - padding.right - 4}
            y={getY(goal.targetAmount) - 5}
            textAnchor="end"
            fill="#4ade80"
            fontSize="9"
            fontFamily="monospace"
          >
            Target Milestone: {formatInr(goal.targetAmount)}
          </text>

          {/* 1. Baseline Compounding Curve (Unbroken) */}
          <path
            d={baselinePath}
            fill="none"
            stroke="#486581"
            strokeWidth="2.2"
            strokeDasharray="none"
          />

          {/* 2. Step-Down Alternative Curve (Preserves habit) */}
          <path
            d={stepDownPath}
            fill="none"
            stroke="#22c55e"
            strokeWidth="2"
            strokeDasharray="3 2"
            opacity="0.85"
          />

          {/* 3. Paused Curve (Dynamic real-time shift downward) */}
          <path
            d={pausedPath}
            fill="none"
            stroke="#f59e0b"
            strokeWidth="2.5"
            className="transition-all duration-300"
          />

          {/* Fill Deficit Area between Baseline and Paused */}
          {trajectory.baselinePoints.length > 0 && (
            <path
              d={`${baselinePath} L ${getX(totalPoints - 1)} ${getY(
                trajectory.finalPaused
              )} L ${pausedPath.replace(/^M [0-9.]+ [0-9.]+ L/, "L")} Z`}
              fill="rgba(245, 158, 11, 0.08)"
            />
          )}

          {/* End Point Markers */}
          {/* Baseline Endpoint */}
          <circle
            cx={getX(totalPoints - 1)}
            cy={getY(trajectory.finalBaseline)}
            r="4.5"
            fill="#486581"
            stroke="#ffffff"
            strokeWidth="1"
          />
          <text
            x={getX(totalPoints - 1) + 8}
            y={getY(trajectory.finalBaseline) + 3}
            fill="#94a3b8"
            fontSize="10"
            fontFamily="monospace"
          >
            {formatInr(trajectory.finalBaseline)}
          </text>

          {/* Paused Endpoint */}
          <circle
            cx={getX(totalPoints - 1)}
            cy={getY(trajectory.finalPaused)}
            r="5"
            fill="#f59e0b"
            stroke="#78350f"
            strokeWidth="1.5"
          />
          <text
            x={getX(totalPoints - 1) + 8}
            y={getY(trajectory.finalPaused) + 4}
            fill="#fbbf24"
            fontSize="10"
            fontWeight="bold"
            fontFamily="monospace"
          >
            {formatInr(trajectory.finalPaused)}
          </text>

          {/* Axis Labels */}
          <text x={padding.left} y={svgHeight - 12} fill="#64748b" fontSize="10">
            2026 (Now)
          </text>
          <text
            x={padding.left + plotWidth / 2}
            y={svgHeight - 12}
            fill="#64748b"
            fontSize="10"
            textAnchor="middle"
          >
            {Math.round(2026 + (goal.targetYear - 2026) / 2)}
          </text>
          <text
            x={svgWidth - padding.right}
            y={svgHeight - 12}
            fill="#64748b"
            fontSize="10"
            textAnchor="end"
          >
            {goal.targetYear} (Goal Target)
          </text>

          {/* Y Axis Labels */}
          <text x={padding.left - 8} y={getY(minCorpus)} fill="#64748b" fontSize="9" textAnchor="end">
            {formatInr(minCorpus)}
          </text>
          <text x={padding.left - 8} y={getY(maxCorpus)} fill="#64748b" fontSize="9" textAnchor="end">
            {formatInr(maxCorpus)}
          </text>
        </svg>

        {/* Legend */}
        <div className="mt-2.5 flex flex-wrap items-center justify-between gap-2 border-t border-[#1e2433] pt-2.5 text-xs">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-1.5">
              <span className="inline-block h-1.5 w-4 bg-[#486581] rounded"></span>
              <span className="text-slate-300">Baseline (No Pause)</span>
            </div>
            <div className="flex items-center space-x-1.5">
              <span className="inline-block h-1.5 w-4 bg-calm-amber-500 rounded"></span>
              <span className="text-calm-amber-300 font-semibold">
                With {pauseMonths}M Pause
              </span>
            </div>
            <div className="flex items-center space-x-1.5">
              <span className="inline-block h-1.5 w-4 bg-calm-green-500 rounded border border-dashed"></span>
              <span className="text-calm-green-400">Step-Down (Smart Alternative)</span>
            </div>
          </div>
          <span className="text-[11px] text-slate-400 font-mono">
            Projected CAGR: {(goal.projectedReturnRate * 100).toFixed(1)}%
          </span>
        </div>
      </div>

      {/* Real-Time Impact Metric Cards */}
      <div className="mt-3.5 grid grid-cols-1 sm:grid-cols-3 gap-3">
        {/* Metric 1: Total Corpus Shortfall */}
        <div className="rounded-xl border border-calm-amber-700/50 bg-calm-amber-950/20 p-3 text-left">
          <span className="block text-[11px] text-calm-amber-300 font-medium">
            Calculated Corpus Shortfall
          </span>
          <div className="mt-1 flex items-baseline space-x-1">
            <span className="text-lg font-bold text-calm-amber-300 font-mono">
              -{formatInr(trajectory.totalDeficit)}
            </span>
          </div>
          <p className="text-[10px] text-slate-400 mt-0.5">
            Lost terminal value at {goal.targetYear}
          </p>
        </div>

        {/* Metric 2: Milestone Delay */}
        <div className="rounded-xl border border-[#282e3e] bg-[#1a1e29] p-3 text-left">
          <span className="block text-[11px] text-slate-300 font-medium">
            Milestone Target Delay
          </span>
          <div className="mt-1 flex items-baseline space-x-1">
            <span className="text-lg font-bold text-slate-100 font-mono">
              +{pauseMonths * 2} to {pauseMonths * 2 + 2} Months
            </span>
          </div>
          <p className="text-[10px] text-slate-400 mt-0.5">
            Runway extension needed to hit {formatInr(goal.targetAmount)}
          </p>
        </div>

        {/* Metric 3: Step-Down Corpus Protection */}
        <div className="rounded-xl border border-calm-green-800/60 bg-calm-green-950/30 p-3 text-left">
          <span className="block text-[11px] text-calm-green-300 font-medium flex items-center gap-1">
            <Sparkles className="h-3 w-3" /> Step-Down Shield
          </span>
          <div className="mt-1 flex items-baseline space-x-1">
            <span className="text-lg font-bold text-calm-green-400 font-mono">
              +{formatInr(trajectory.protectedCorpus)}
            </span>
          </div>
          <p className="text-[10px] text-slate-400 mt-0.5">
            Corpus saved vs pausing completely
          </p>
        </div>
      </div>
    </div>
  );
};

export default DeficitSimulatorSVG;
