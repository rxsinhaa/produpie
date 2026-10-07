"use client";

import React, { useEffect, useRef, useState } from "react";
import {
  createChart,
  IChartApi,
  ISeriesApi,
  ColorType,
  LineStyle,
} from "lightweight-charts";
import { GENERATE_TIME_SERIES } from "@/lib/constants";
import { TrendingDown, TrendingUp, Sparkles, Activity, Layers, BarChart2, ChevronDown, ChevronUp } from "lucide-react";

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

  const [showAdvancedMetrics, setShowAdvancedMetrics] = useState<boolean>(false);
  const [activeView, setActiveView] = useState<"NAV" | "BENCHMARK" | "VIX">("NAV");
  const [hoverData, setHoverData] = useState<{
    date: string;
    nav: number;
    change: number;
  } | null>(null);

  useEffect(() => {
    if (!chartContainerRef.current) return;

    // Institutional dark mode chart configuration per PRD specification:
    // Background: #222222 solid, Text: #DDDDDD, Grid: #444444 (subtle), Border: #71649C
    const chart = createChart(chartContainerRef.current, {
      width: chartContainerRef.current.clientWidth,
      height: 360,
      layout: {
        background: { type: ColorType.Solid, color: "#222222" },
        textColor: "#DDDDDD",
        fontSize: 12,
        fontFamily: "var(--font-inter), system-ui, -apple-system, sans-serif",
      },
      grid: {
        vertLines: {
          color: showAdvancedMetrics ? "#444444" : "rgba(68, 68, 68, 0.4)",
          style: LineStyle.Dotted,
        },
        horzLines: {
          color: showAdvancedMetrics ? "#444444" : "rgba(68, 68, 68, 0.4)",
          style: LineStyle.Dotted,
        },
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

    // Area series with calm Navy/Lavender tones
    const areaSeries = chart.addAreaSeries({
      topColor: "rgba(113, 100, 156, 0.55)", // #71649C gradient top
      bottomColor: "rgba(18, 21, 29, 0.05)",
      lineColor: "#71649C",
      lineWidth: 2,
    });

    seriesRef.current = areaSeries;

    // Generate time series data
    const rawData = GENERATE_TIME_SERIES();
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

    // Contrarian Accumulation Milestone Markers
    if (isMarketCrashActive) {
      const lastIndex = formattedData.length - 1;
      const markerData = [
        {
          time: formattedData[165].time,
          position: "aboveBar" as const,
          color: "#71649C",
          shape: "circle" as const,
          text: "Pre-Dip NAV (₹101.2)",
        },
        {
          time: formattedData[lastIndex].time,
          position: "belowBar" as const,
          color: "#fbbf24",
          shape: "arrowUp" as const,
          text: "Sale Window (+12.6% units/₹)",
        },
      ];
      const sortedMarkers = [...markerData].sort((a, b) =>
        String(a.time).localeCompare(String(b.time))
      );
      areaSeries.setMarkers(sortedMarkers);
    }

    // Subscribe to crosshair
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

    // Set initial hover data
    const last = formattedData[formattedData.length - 1];
    const first = formattedData[0];
    setHoverData({
      date: String(last.time),
      nav: last.value,
      change: parseFloat((((last.value - first.value) / first.value) * 100).toFixed(2)),
    });

    chart.timeScale().fitContent();

    const handleResize = () => {
      if (chartContainerRef.current && chartInstanceRef.current) {
        chartInstanceRef.current.applyOptions({
          width: chartContainerRef.current.clientWidth,
        });
      }
    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
      if (chartInstanceRef.current) {
        chartInstanceRef.current.remove();
        chartInstanceRef.current = null;
      }
    };
  }, [isMarketCrashActive, activeView, showAdvancedMetrics]);

  return (
    <div className="relative rounded-3xl border border-[#71649C]/40 bg-[#222222] p-5 shadow-2xl shadow-black/60">
      {/* Chart Header Bar */}
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3 border-b border-[#444444] pb-3.5">
        <div>
          <div className="flex items-center space-x-2">
            <span className="inline-block h-2.5 w-2.5 rounded-full bg-calm-amber-400"></span>
            <h3 className="font-bold text-base text-slate-100">{selectedFundName}</h3>
            <span className="rounded-md bg-[#161a24] border border-[#71649C]/60 px-2 py-0.5 text-[10px] font-mono text-[#DDDDDD]">
              INF204K01129
            </span>
          </div>
          <p className="mt-0.5 text-xs text-slate-400">
            Net Asset Value (NAV) Trajectory & Systematic Compounding Timeline
          </p>
        </div>

        {/* Show Advanced Metrics Toggle */}
        <div className="flex items-center space-x-2">
          <button
            onClick={() => setShowAdvancedMetrics(!showAdvancedMetrics)}
            className="flex items-center space-x-1.5 rounded-xl border border-[#444444] bg-[#1a1e29] px-3 py-1.5 text-xs font-medium text-slate-300 hover:text-white hover:border-slate-500 transition"
          >
            <Activity className="h-3.5 w-3.5 text-[#71649C]" />
            <span>{showAdvancedMetrics ? "Hide Advanced Metrics" : "Show Advanced Metrics"}</span>
            {showAdvancedMetrics ? <ChevronUp className="h-3.5 w-3.5" /> : <ChevronDown className="h-3.5 w-3.5" />}
          </button>
        </div>
      </div>

      {/* Advanced Metrics Sub-bar (Unfolds when toggled) */}
      {showAdvancedMetrics && (
        <div className="mb-3.5 flex flex-wrap items-center justify-between gap-2 rounded-2xl border border-[#444444] bg-[#1a1e29] p-2 text-xs animate-in fade-in">
          <span className="text-[11px] text-slate-400 font-mono px-2">
            Institutional Overlays:
          </span>
          <div className="flex items-center space-x-1.5">
            <button
              onClick={() => setActiveView("NAV")}
              className={`flex items-center space-x-1 rounded-lg px-2.5 py-1 text-xs font-medium transition ${
                activeView === "NAV"
                  ? "bg-[#71649C] text-white shadow"
                  : "text-slate-400 hover:text-white"
              }`}
            >
              <BarChart2 className="h-3 w-3" />
              <span>Historical NAV</span>
            </button>
            <button
              onClick={() => setActiveView("BENCHMARK")}
              className={`flex items-center space-x-1 rounded-lg px-2.5 py-1 text-xs font-medium transition ${
                activeView === "BENCHMARK"
                  ? "bg-[#71649C] text-white shadow"
                  : "text-slate-400 hover:text-white"
              }`}
            >
              <Layers className="h-3 w-3" />
              <span>Nifty Midcap 150</span>
            </button>
            <button
              onClick={() => setActiveView("VIX")}
              className={`flex items-center space-x-1 rounded-lg px-2.5 py-1 text-xs font-medium transition ${
                activeView === "VIX"
                  ? "bg-[#71649C] text-white shadow"
                  : "text-slate-400 hover:text-white"
              }`}
            >
              <Activity className="h-3 w-3 text-calm-amber-400" />
              <span>India VIX ({isMarketCrashActive ? "14.8" : "11.2"})</span>
            </button>
          </div>
        </div>
      )}

      {/* Floating Hover & Performance Metric Cards */}
      {hoverData && (
        <div className="mb-3 flex flex-wrap items-center gap-3 text-xs font-mono">
          <div className="rounded-xl bg-[#14171f] border border-[#38425d] px-3 py-1.5 flex items-center space-x-1.5">
            <span className="text-slate-400">Date:</span>
            <span className="text-slate-100 font-semibold">{hoverData.date}</span>
          </div>
          <div className="rounded-xl bg-[#14171f] border border-[#38425d] px-3 py-1.5 flex items-center space-x-1.5">
            <span className="text-slate-400">NAV:</span>
            <span className="text-calm-amber-400 font-bold text-sm">₹{hoverData.nav.toFixed(2)}</span>
          </div>
          <div className="rounded-xl bg-[#14171f] border border-[#38425d] px-3 py-1.5 flex items-center space-x-1.5">
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
            <div className="flex-1 rounded-xl bg-calm-amber-950/40 border border-calm-amber-600/50 px-3 py-1.5 text-xs text-calm-amber-200 flex items-center gap-1.5">
              <Sparkles className="h-3.5 w-3.5 text-calm-amber-400 shrink-0" />
              <span>
                <strong>Discount Active:</strong> Units are 12.6% cheaper than average. Your ₹15k SIP acquires +14.5% more units today!
              </span>
            </div>
          )}
        </div>
      )}

      {/* TradingView Canvas Container with mandated #222 background */}
      <div
        ref={chartContainerRef}
        className="w-full rounded-2xl overflow-hidden"
        style={{ minHeight: "360px" }}
      />

      {/* Friendly Footer Note */}
      <div className="mt-3.5 flex items-center justify-between border-t border-[#444444] pt-2.5 text-[11px] text-slate-400">
        <div className="flex items-center space-x-2">
          <span>Lightweight Charts™ Engine</span>
          <span>•</span>
          <span className="text-slate-300">#222 Theme</span>
        </div>
        <div className="text-calm-green-400 font-medium flex items-center gap-1">
          <Sparkles className="h-3 w-3" />
          <span>Rupee Cost Averaging Safeguard Active</span>
        </div>
      </div>
    </div>
  );
};

export default TradingViewChart;
