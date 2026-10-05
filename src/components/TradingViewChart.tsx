"use client";

import React, { useEffect, useRef, useState } from "react";
import {
  createChart,
  IChartApi,
  ISeriesApi,
  ColorType,
  UTCTimestamp,
  LineStyle,
} from "lightweight-charts";
import { GENERATE_TIME_SERIES } from "@/lib/constants";
import { TrendingDown, Eye, Activity, BarChart2, Layers } from "lucide-react";

interface TradingViewChartProps {
  isMarketCrashActive: boolean;
  selectedFundName: string;
}

export const TradingViewChart: React.FC<TradingViewChartProps> = ({
  isMarketCrashActive,
  selectedFundName,
}) => {
  const chartContainerRef = useRef<HTMLDivElement>(null);
  const chartInstanceRef = useRef<IChartApi | null>(null);
  const seriesRef = useRef<ISeriesApi<"Area"> | null>(null);
  const [activeView, setActiveView] = useState<"NAV" | "BENCHMARK" | "VIX">("NAV");
  const [hoverData, setHoverData] = useState<{
    date: string;
    nav: number;
    change: number;
  } | null>(null);

  useEffect(() => {
    if (!chartContainerRef.current) return;

    // Strict institutional dark mode chart configuration per PRD specification:
    // - Background: #222222 solid
    // - Axis text: #DDDDDD
    // - Grid lines: #444444
    // - Scale borders: #71649C
    const chart = createChart(chartContainerRef.current, {
      width: chartContainerRef.current.clientWidth,
      height: 380,
      layout: {
        background: { type: ColorType.Solid, color: "#222222" },
        textColor: "#DDDDDD",
        fontSize: 12,
        fontFamily: "var(--font-inter), -apple-system, sans-serif",
      },
      grid: {
        vertLines: { color: "#444444", style: LineStyle.Dotted },
        horzLines: { color: "#444444", style: LineStyle.Dotted },
      },
      crosshair: {
        mode: 1,
        vertLine: {
          color: "#71649C",
          width: 1,
          style: LineStyle.Dashed,
          labelBackgroundColor: "#1e2433",
        },
        horzLine: {
          color: "#71649C",
          width: 1,
          style: LineStyle.Dashed,
          labelBackgroundColor: "#1e2433",
        },
      },
      rightPriceScale: {
        borderColor: "#71649C",
        textColor: "#DDDDDD",
        scaleMargins: {
          top: 0.15,
          bottom: 0.15,
        },
      },
      timeScale: {
        borderColor: "#71649C",
        timeVisible: true,
        secondsVisible: false,
      },
    });

    chartInstanceRef.current = chart;

    // Create Area series with calm Navy/Amber hues
    const areaSeries = chart.addAreaSeries({
      topColor: "rgba(51, 78, 104, 0.65)", // Calm Navy top
      bottomColor: "rgba(16, 42, 67, 0.05)",
      lineColor: "#486581", // Calm Navy Accent line
      lineWidth: 2,
    });

    seriesRef.current = areaSeries;

    // Generate and set data
    const rawData = GENERATE_TIME_SERIES();
    // If crash is toggled off, replace the final 15 crash days with continued gentle upward drift
    const formattedData = rawData.map((item, idx) => {
      let val = item.value;
      if (!isMarketCrashActive && idx >= 165) {
        val = 112.5 * (1 + 0.001 * (idx - 165));
      }
      return {
        time: item.time as any,
        value: parseFloat(val.toFixed(2)),
      };
    });

    areaSeries.setData(formattedData);

    // Contrarian Accumulation markers (demonstrating Rupee Cost Averaging)
    if (isMarketCrashActive) {
      const lastIndex = formattedData.length - 1;
      const markerData = [
        {
          time: formattedData[165].time,
          position: "aboveBar" as const,
          color: "#71649C",
          shape: "circle" as const,
          text: "Pre-Correction NAV (₹101.2)",
        },
        {
          time: formattedData[lastIndex].time,
          position: "belowBar" as const,
          color: "#fbbf24", // Calm Amber
          shape: "arrowUp" as const,
          text: "RCA Buy Opportunity (+12.4% units)",
        },
      ];
      // Sort in ascending order by time
      const sortedMarkers = [...markerData].sort((a, b) =>
        String(a.time).localeCompare(String(b.time))
      );
      areaSeries.setMarkers(sortedMarkers);
    }

    // Subscribe to crosshair move
    chart.subscribeCrosshairMove((param) => {
      if (
        param.point === undefined ||
        !param.time ||
        param.point.x < 0 ||
        param.point.x > chartContainerRef.current!.clientWidth ||
        param.point.y < 0 ||
        param.point.y > chartContainerRef.current!.clientHeight
      ) {
        const last = formattedData[formattedData.length - 1];
        const first = formattedData[0];
        setHoverData({
          date: String(last.time),
          nav: last.value,
          change: parseFloat((((last.value - first.value) / first.value) * 100).toFixed(2)),
        });
      } else {
        const price = param.seriesData.get(areaSeries) as { value?: number } | undefined;
        if (price && price.value !== undefined) {
          const first = formattedData[0];
          setHoverData({
            date: String(param.time),
            nav: price.value,
            change: parseFloat((((price.value - first.value) / first.value) * 100).toFixed(2)),
          });
        }
      }
    });

    // Set initial hover data to latest point
    const last = formattedData[formattedData.length - 1];
    const first = formattedData[0];
    setHoverData({
      date: String(last.time),
      nav: last.value,
      change: parseFloat((((last.value - first.value) / first.value) * 100).toFixed(2)),
    });

    // Fit content
    chart.timeScale().fitContent();

    // Responsive resize handler
    const handleResize = () => {
      if (chartContainerRef.current && chartInstanceRef.current) {
        chartInstanceRef.current.applyOptions({
          width: chartContainerRef.current.clientWidth,
        });
      }
    };

    window.addEventListener("resize", handleResize);

    // CRITICAL: Strict React cleanup to remove canvas & prevent memory leaks
    return () => {
      window.removeEventListener("resize", handleResize);
      if (chartInstanceRef.current) {
        chartInstanceRef.current.remove();
        chartInstanceRef.current = null;
      }
    };
  }, [isMarketCrashActive, activeView]);

  return (
    <div className="relative rounded-xl border border-[#71649C]/40 bg-[#222222] p-4 shadow-2xl">
      {/* Chart Header Bar */}
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3 border-b border-[#444444] pb-3">
        <div>
          <div className="flex items-center space-x-2">
            <span className="inline-block h-2 w-2 rounded-full bg-calm-amber-400"></span>
            <h3 className="font-semibold text-slate-100">{selectedFundName}</h3>
            <span className="rounded bg-calm-navy-900 border border-[#71649C] px-2 py-0.5 text-[11px] font-mono text-[#DDDDDD]">
              INF204K01129
            </span>
          </div>
          <p className="mt-0.5 text-xs text-slate-400">
            Institutional Net Asset Value (NAV) & Time-Series Compounding Pane
          </p>
        </div>

        {/* Series Switchers */}
        <div className="flex items-center space-x-1.5 rounded-lg border border-[#444444] bg-[#1a1e29] p-1">
          <button
            onClick={() => setActiveView("NAV")}
            className={`flex items-center space-x-1 rounded px-2.5 py-1 text-xs font-medium transition ${
              activeView === "NAV"
                ? "bg-calm-navy-700 text-slate-100 shadow"
                : "text-slate-400 hover:text-slate-200"
            }`}
          >
            <BarChart2 className="h-3 w-3" />
            <span>Historical NAV</span>
          </button>
          <button
            onClick={() => setActiveView("BENCHMARK")}
            className={`flex items-center space-x-1 rounded px-2.5 py-1 text-xs font-medium transition ${
              activeView === "BENCHMARK"
                ? "bg-calm-navy-700 text-slate-100 shadow"
                : "text-slate-400 hover:text-slate-200"
            }`}
          >
            <Layers className="h-3 w-3" />
            <span>Nifty Midcap 150</span>
          </button>
          <button
            onClick={() => setActiveView("VIX")}
            className={`flex items-center space-x-1 rounded px-2.5 py-1 text-xs font-medium transition ${
              activeView === "VIX"
                ? "bg-calm-navy-700 text-slate-100 shadow"
                : "text-slate-400 hover:text-slate-200"
            }`}
          >
            <Activity className="h-3 w-3 text-calm-amber-400" />
            <span>India VIX (14.8)</span>
          </button>
        </div>
      </div>

      {/* Floating Institutional Metrics Bar */}
      {hoverData && (
        <div className="mb-2 flex flex-wrap items-center gap-4 text-xs font-mono">
          <div className="flex items-center space-x-1.5">
            <span className="text-slate-400">Date:</span>
            <span className="text-slate-200 font-semibold">{hoverData.date}</span>
          </div>
          <div className="flex items-center space-x-1.5">
            <span className="text-slate-400">NAV:</span>
            <span className="text-slate-100 font-bold text-sm">₹{hoverData.nav.toFixed(2)}</span>
          </div>
          <div className="flex items-center space-x-1.5">
            <span className="text-slate-400">6-Mo Return:</span>
            <span
              className={`font-semibold ${
                hoverData.change >= 0 ? "text-calm-green-400" : "text-calm-amber-400"
              }`}
            >
              {hoverData.change >= 0 ? "+" : ""}
              {hoverData.change}%
            </span>
          </div>
          {isMarketCrashActive && (
            <div className="rounded bg-calm-amber-900/30 border border-calm-amber-700/50 px-2 py-0.5 text-[11px] text-calm-amber-300">
              ⚡ Localized Drawdown Active: -7.5% (Units on 12.6% discount)
            </div>
          )}
        </div>
      )}

      {/* TradingView Chart Container with mandated #222 background & #71649C border */}
      <div
        ref={chartContainerRef}
        className="w-full rounded-lg overflow-hidden"
        style={{ minHeight: "380px" }}
      />

      {/* Institutional Footer Stamp */}
      <div className="mt-3 flex items-center justify-between border-t border-[#444444] pt-2 text-[11px] text-slate-400">
        <div className="flex items-center space-x-2">
          <span>Powered by TradingView Lightweight Charts™</span>
          <span>•</span>
          <span className="text-[#DDDDDD]">Grid: #444444</span>
          <span>•</span>
          <span className="text-[#71649C]">Scale: #71649C</span>
        </div>
        <div className="text-slate-400">
          Actuarial Unit Compounding Stream Active
        </div>
      </div>
    </div>
  );
};

export default TradingViewChart;
