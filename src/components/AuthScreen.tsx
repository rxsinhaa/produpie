"use client";

import React, { useState } from "react";
import { useApp } from "@/context/AppContext";
import {
  ShieldAlert,
  ShieldCheck,
  Sparkles,
  Lock,
  ArrowRight,
  TrendingUp,
  Eye,
  EyeOff,
  CheckCircle2,
  Zap,
  Activity,
  ChevronRight,
} from "lucide-react";

interface AuthScreenProps {
  onSuccess?: () => void;
}

export const AuthScreen: React.FC<AuthScreenProps> = ({ onSuccess }) => {
  const { login, signup, loginAsDemo } = useApp();
  const [mode, setMode] = useState<"SIGNIN" | "SIGNUP">("SIGNIN");
  const [email, setEmail] = useState("aarav.sharma@example.com");
  const [password, setPassword] = useState("••••••••••••");
  const [name, setName] = useState("Aarav Sharma");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setTimeout(() => {
      if (mode === "SIGNIN") {
        login(email, name || "Aarav Sharma");
      } else {
        signup(email, name || "Investor");
      }
      setIsLoading(false);
      if (onSuccess) onSuccess();
    }, 400);
  };

  const handleOAuth = (provider: string) => {
    setIsLoading(true);
    setTimeout(() => {
      login(`${provider.toLowerCase()}_user@finlit.ai`, `${provider} User`);
      setIsLoading(false);
      if (onSuccess) onSuccess();
    }, 400);
  };

  const handleDemoClick = () => {
    setIsLoading(true);
    setTimeout(() => {
      loginAsDemo();
      setIsLoading(false);
      if (onSuccess) onSuccess();
    }, 300);
  };

  return (
    <div className="relative min-h-screen w-full bg-[#0c0e12] text-slate-100 flex items-center justify-center p-4 sm:p-6 lg:p-8 overflow-hidden selection:bg-calm-amber-500/30 selection:text-calm-amber-200">
      {/* Ambient background glow & grid */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_left,rgba(113,100,156,0.18)_0%,rgba(12,14,18,0)_65%)] pointer-events-none" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_right,rgba(51,78,104,0.15)_0%,rgba(12,14,18,0)_60%)] pointer-events-none" />
      <div className="absolute inset-0 bg-[radial-gradient(#282e3e_1px,transparent_1px)] [background-size:24px_24px] opacity-25 pointer-events-none" />

      {/* Main Container */}
      <div className="relative z-10 w-full max-w-5xl grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
        {/* Left Col: Calming Value Proposition Hero (5 cols) */}
        <div className="lg:col-span-6 space-y-6 lg:pr-4 text-left">
          {/* Brand pill */}
          <div className="inline-flex items-center space-x-2 rounded-full border border-[#71649C]/40 bg-[#71649C]/10 px-3 py-1.5 backdrop-blur-md">
            <ShieldCheck className="h-4 w-4 text-calm-amber-400" />
            <span className="text-xs font-semibold tracking-wide text-slate-200">
              FinLit Behavioral Wealth Co-Pilot
            </span>
          </div>

          <div className="space-y-3">
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-slate-50 leading-[1.15]">
              Stay invested when markets panic.{" "}
              <span className="bg-gradient-to-r from-calm-amber-300 via-amber-100 to-[#71649C] bg-clip-text text-transparent">
                Compounding guarded.
              </span>
            </h1>
            <p className="text-sm sm:text-base text-slate-400 leading-relaxed max-w-lg">
              Your AI co-pilot designed to neutralize retail anxiety, prevent costly SIP leaks, and turn market corrections into powerful wealth-compounding opportunities.
            </p>
          </div>

          {/* Calming Behavioral Principles Checklist */}
          <div className="space-y-3 pt-2">
            <div className="flex items-start space-x-3 text-xs sm:text-sm text-slate-300">
              <div className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-calm-green-950/70 border border-calm-green-600/60 text-calm-green-400 mt-0.5">
                <CheckCircle2 className="h-3.5 w-3.5" />
              </div>
              <div>
                <strong className="text-slate-100">Cognitive Circuit Breaker:</strong> Prevents panic selling with deterministic, explainable milestone math.
              </div>
            </div>

            <div className="flex items-start space-x-3 text-xs sm:text-sm text-slate-300">
              <div className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[#71649C]/20 border border-[#71649C]/50 text-purple-300 mt-0.5">
                <Sparkles className="h-3.5 w-3.5" />
              </div>
              <div>
                <strong className="text-slate-100">Contrarian Unit Accumulation:</strong> Shows you exactly how much cheaper fund units are during dips.
              </div>
            </div>

            <div className="flex items-start space-x-3 text-xs sm:text-sm text-slate-300">
              <div className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-calm-navy-900 border border-calm-navy-600 text-blue-300 mt-0.5">
                <Lock className="h-3.5 w-3.5" />
              </div>
              <div>
                <strong className="text-slate-100">Zero-PII Architecture:</strong> No PAN or bank account logins stored; 100% privacy-first analytics.
              </div>
            </div>
          </div>

          {/* Quick Demo Launch Shortcut */}
          <div className="pt-2">
            <div className="rounded-2xl border border-calm-amber-500/40 bg-gradient-to-r from-calm-amber-950/30 via-[#161a24] to-[#12151d] p-4 text-xs text-slate-300 flex items-center justify-between gap-3 shadow-lg">
              <div className="space-y-0.5">
                <div className="flex items-center space-x-2">
                  <span className="font-bold text-slate-100 text-xs sm:text-sm">
                    Interactive Reviewer Demo
                  </span>
                  <span className="rounded bg-calm-amber-500/20 border border-calm-amber-500/40 px-1.5 py-0.2 text-[9px] font-bold text-calm-amber-300 uppercase">
                    Instant Access
                  </span>
                </div>
                <p className="text-[11px] text-slate-400">
                  Pre-loaded with Aarav's ₹22.1L portfolio and simulated -7.5% market dip.
                </p>
              </div>

              <button
                type="button"
                onClick={handleDemoClick}
                disabled={isLoading}
                className="shrink-0 flex items-center space-x-1.5 rounded-xl bg-gradient-to-r from-calm-amber-500 to-amber-600 px-3.5 py-2 text-xs font-bold text-slate-950 hover:brightness-110 active:scale-95 transition shadow-md"
              >
                <span>Enter Demo</span>
                <ArrowRight className="h-3.5 w-3.5" />
              </button>
            </div>
          </div>
        </div>

        {/* Right Col: Sleek Minimalist Auth Form Card (6 cols) */}
        <div className="lg:col-span-6 w-full max-w-md mx-auto">
          <div className="relative rounded-3xl border border-[#282e3e] bg-[#14171f]/90 p-6 sm:p-8 backdrop-blur-xl shadow-2xl shadow-black/80">
            {/* Form Header */}
            <div className="flex items-center justify-between border-b border-[#242938] pb-4 mb-6">
              <div className="flex items-center space-x-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-[#71649C] to-calm-navy-700 border border-[#71649C]/50 shadow-md">
                  <ShieldAlert className="h-5 w-5 text-calm-amber-300" />
                </div>
                <div>
                  <h2 className="text-lg font-bold tracking-tight text-slate-100">
                    {mode === "SIGNIN" ? "Welcome to FinLit" : "Start Compounding"}
                  </h2>
                  <p className="text-xs text-slate-400">
                    {mode === "SIGNIN"
                      ? "Sign in to access your wealth guardrails"
                      : "Create your zero-PII investor profile"}
                  </p>
                </div>
              </div>

              {/* Mode Toggle Switch */}
              <div className="flex rounded-lg border border-[#282e3e] bg-[#0c0e12] p-0.5 text-xs">
                <button
                  type="button"
                  onClick={() => setMode("SIGNIN")}
                  className={`rounded-md px-2.5 py-1 font-medium transition ${
                    mode === "SIGNIN"
                      ? "bg-[#71649C] text-white shadow-sm"
                      : "text-slate-400 hover:text-slate-200"
                  }`}
                >
                  Log In
                </button>
                <button
                  type="button"
                  onClick={() => setMode("SIGNUP")}
                  className={`rounded-md px-2.5 py-1 font-medium transition ${
                    mode === "SIGNUP"
                      ? "bg-[#71649C] text-white shadow-sm"
                      : "text-slate-400 hover:text-slate-200"
                  }`}
                >
                  Sign Up
                </button>
              </div>
            </div>

            {/* OAuth Social Buttons */}
            <div className="grid grid-cols-2 gap-3 mb-5">
              {/* Google Button */}
              <button
                type="button"
                onClick={() => handleOAuth("Google")}
                disabled={isLoading}
                className="flex items-center justify-center space-x-2 rounded-xl border border-[#282e3e] bg-[#1a1e29] px-3.5 py-2.5 text-xs font-semibold text-slate-200 hover:bg-[#202534] hover:border-slate-600 transition active:scale-98"
              >
                <svg className="h-4 w-4" viewBox="0 0 24 24">
                  <path
                    fill="#EA4335"
                    d="M12 5c1.6 0 3 .6 4.1 1.7l3.1-3.1C17.3 1.8 14.8 1 12 1 7.5 1 3.7 3.6 1.9 7.3l3.7 2.9C6.5 7.4 9 5 12 5z"
                  />
                  <path
                    fill="#4285F4"
                    d="M23.5 12.3c0-.8-.1-1.7-.2-2.3H12v4.6h6.5c-.3 1.5-1.1 2.8-2.4 3.7l3.7 2.9c2.2-2 3.7-5 3.7-8.9z"
                  />
                  <path
                    fill="#FBBC05"
                    d="M5.6 14.8c-.2-.7-.4-1.5-.4-2.3s.2-1.6.4-2.3L1.9 7.3C.7 9.7 0 12.3 0 15.1s.7 5.4 1.9 7.8l3.7-2.9z"
                  />
                  <path
                    fill="#34A853"
                    d="M12 23.5c3.2 0 6-1.1 8-3l-3.7-2.9c-1.1.7-2.5 1.2-4.3 1.2-3 0-5.5-2.4-6.4-5.2L1.9 16.5C3.7 20.2 7.5 23.5 12 23.5z"
                  />
                </svg>
                <span>Google</span>
              </button>

              {/* Apple Button */}
              <button
                type="button"
                onClick={() => handleOAuth("Apple")}
                disabled={isLoading}
                className="flex items-center justify-center space-x-2 rounded-xl border border-[#282e3e] bg-[#1a1e29] px-3.5 py-2.5 text-xs font-semibold text-slate-200 hover:bg-[#202534] hover:border-slate-600 transition active:scale-98"
              >
                <svg className="h-4 w-4 fill-current text-slate-100" viewBox="0 0 24 24">
                  <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M15.97 6.84c.66-.82 1.11-1.96.99-3.1-.96.04-2.12.64-2.8 1.44-.6.69-1.12 1.83-.98 2.94 1.07.08 2.14-.49 2.79-1.28z" />
                </svg>
                <span>Apple</span>
              </button>
            </div>

            {/* Divider */}
            <div className="relative mb-5 text-center">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-[#242938]" />
              </div>
              <span className="relative bg-[#14171f] px-3 text-[11px] uppercase tracking-wider text-slate-500 font-medium">
                Or continue with email
              </span>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-4 text-xs">
              {mode === "SIGNUP" && (
                <div>
                  <label className="block text-slate-300 font-medium mb-1.5">
                    Your Name / Alias
                  </label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. Aarav Sharma"
                    className="w-full rounded-xl border border-[#282e3e] bg-[#0c0e12] px-3.5 py-2.5 text-slate-100 placeholder-slate-600 focus:outline-none focus:border-[#71649C] focus:ring-1 focus:ring-[#71649C] transition font-medium"
                  />
                </div>
              )}

              <div>
                <label className="block text-slate-300 font-medium mb-1.5">
                  Email Address
                </label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@example.com"
                  className="w-full rounded-xl border border-[#282e3e] bg-[#0c0e12] px-3.5 py-2.5 text-slate-100 placeholder-slate-600 focus:outline-none focus:border-[#71649C] focus:ring-1 focus:ring-[#71649C] transition font-medium"
                />
              </div>

              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="text-slate-300 font-medium">Password</label>
                  {mode === "SIGNIN" && (
                    <button
                      type="button"
                      onClick={() => alert("Password reset link sent to registered email.")}
                      className="text-[11px] text-[#71649C] hover:text-purple-300 transition"
                    >
                      Forgot?
                    </button>
                  )}
                </div>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full rounded-xl border border-[#282e3e] bg-[#0c0e12] px-3.5 py-2.5 pr-10 text-slate-100 placeholder-slate-600 focus:outline-none focus:border-[#71649C] focus:ring-1 focus:ring-[#71649C] transition font-medium"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300"
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>

              {/* Primary Submit Button with #71649C Accent */}
              <button
                type="submit"
                disabled={isLoading}
                className="w-full mt-2 flex items-center justify-center space-x-2 rounded-xl bg-gradient-to-r from-[#71649C] to-[#594d80] px-4 py-3 text-sm font-bold text-white shadow-lg shadow-[#71649C]/25 hover:brightness-110 active:scale-98 transition"
              >
                <span>
                  {isLoading
                    ? "Securing Session..."
                    : mode === "SIGNIN"
                    ? "Enter Portfolio Dashboard"
                    : "Create Investor Account"}
                </span>
                <ArrowRight className="h-4 w-4" />
              </button>
            </form>

            {/* Privacy & Compliance Footnote */}
            <div className="mt-6 border-t border-[#242938] pt-4 text-center">
              <p className="text-[11px] text-slate-500 flex items-center justify-center gap-1.5">
                <Lock className="h-3 w-3 text-calm-green-400" />
                Zero-PII Tokenized Session • SEBI Technology Guardrails
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthScreen;
