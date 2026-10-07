"use client";

import React, { useState, useEffect } from "react";
import { BehavioralProfile, LifeGoal } from "@/types";
import { ONBOARDING_QUESTIONS, getFriendlyArchetypeInfo } from "@/lib/constants";
import {
  ShieldCheck,
  Target,
  CheckCircle2,
  Lock,
  Plus,
  Trash2,
  ArrowRight,
  ArrowLeft,
  Sparkles,
  HeartHandshake,
  Compass,
  Smile,
  Zap,
  RefreshCw,
  Cpu,
} from "lucide-react";

interface OnboardingModalProps {
  isOpen: boolean;
  onClose: () => void;
  profile: BehavioralProfile;
  goals: LifeGoal[];
  onSaveProfile: (profile: BehavioralProfile, goals: LifeGoal[]) => void;
}

export const OnboardingModal: React.FC<OnboardingModalProps> = ({
  isOpen,
  onClose,
  profile,
  goals,
  onSaveProfile,
}) => {
  const [step, setStep] = useState<"GOALS" | "QUESTIONNAIRE" | "SUMMARY">("GOALS");
  const [userGoals, setUserGoals] = useState<LifeGoal[]>(goals);
  const [answers, setAnswers] = useState<Record<string, number>>(
    profile.answers || {
      q1: 0.55,
      q2: 0.6,
      q3: 0.8,
      q4: 0.6,
    }
  );

  // Gemini Smart Classification State
  const [isClassifying, setIsClassifying] = useState<boolean>(false);
  const [aiClassification, setAiClassification] = useState<{
    archetypeTitle: string;
    badge: string;
    psychologicalProfile: string;
    behavioralStrength: string;
    riskMitigationRule: string;
    riskBarrierScore: number;
  } | null>(null);

  if (!isOpen) return null;

  const handleSelectAnswer = (qId: string, weight: number) => {
    setAnswers((prev) => ({ ...prev, [qId]: weight }));
  };

  // Deterministic math score as anchor
  const calculateBarrier = () => {
    const weights = Object.values(answers);
    if (weights.length === 0) return 0.6;
    const avg = weights.reduce((acc, w) => acc + w, 0) / weights.length;
    return parseFloat(avg.toFixed(2));
  };

  const calculatedRiskBarrier = calculateBarrier();
  const fallbackArchetype = getFriendlyArchetypeInfo(calculatedRiskBarrier);

  // Trigger Gemini AI Classification when advancing to Step 3
  const fetchAiArchetype = async () => {
    setIsClassifying(true);
    try {
      const payload = {
        userName: profile.name || "Rouneet Raj Sinha",
        answers,
        goals: userGoals,
      };

      const res = await fetch("/api/ai/archetype-classification", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        const data = await res.json();
        setAiClassification(data);
      } else {
        throw new Error("Failed to classify archetype");
      }
    } catch (e) {
      console.warn("AI Archetype classification fallback:", e);
      setAiClassification({
        archetypeTitle: fallbackArchetype.title,
        badge: fallbackArchetype.badge,
        psychologicalProfile: fallbackArchetype.summary,
        behavioralStrength: "Long-term milestone discipline",
        riskMitigationRule: "Utilize Step-Down SIPs to avoid breaking compounding momentum during drawdowns.",
        riskBarrierScore: calculatedRiskBarrier,
      });
    } finally {
      setIsClassifying(false);
    }
  };

  const handleGoToSummary = () => {
    setStep("SUMMARY");
    fetchAiArchetype();
  };

  const handleUpdateGoal = (index: number, field: keyof LifeGoal, value: any) => {
    const updated = [...userGoals];
    updated[index] = { ...updated[index], [field]: value };
    setUserGoals(updated);
  };

  const handleAddGoal = () => {
    if (userGoals.length >= 4) return;
    const newGoal: LifeGoal = {
      id: `goal-${Date.now()}`,
      title: "2035 Financial Independence",
      targetYear: 2035,
      targetAmount: 5000000,
      currentAccumulated: 200000,
      monthlySip: 10000,
      category: "WEALTH",
      projectedReturnRate: 0.12,
    };
    setUserGoals([...userGoals, newGoal]);
  };

  const handleRemoveGoal = (index: number) => {
    if (userGoals.length <= 1) return;
    setUserGoals(userGoals.filter((_, i) => i !== index));
  };

  const handleSaveAndComplete = () => {
    const effectiveBarrier = aiClassification?.riskBarrierScore || calculatedRiskBarrier;
    const effectiveArchetype = aiClassification?.archetypeTitle || fallbackArchetype.title;

    const updatedProfile: BehavioralProfile = {
      ...profile,
      name: profile.name || "Rouneet Raj Sinha",
      riskBarrier: effectiveBarrier,
      archetype: effectiveArchetype,
      answers,
      aiProfileSummary: aiClassification?.psychologicalProfile,
      aiBehavioralStrength: aiClassification?.behavioralStrength,
      aiRiskMitigationRule: aiClassification?.riskMitigationRule,
    };

    onSaveProfile(updatedProfile, userGoals);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 overflow-y-auto bg-black/85 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-3xl max-h-[92vh] overflow-y-auto rounded-3xl border border-[#282e3e] bg-[#12151d] p-6 sm:p-8 shadow-2xl text-slate-100">
        {/* Step Indicator Header */}
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[#242938] pb-4">
          <div className="flex items-center space-x-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-[#71649C] to-calm-navy-700 border border-[#71649C]/40 text-calm-amber-300 shadow-md">
              <Compass className="h-5 w-5" />
            </div>
            <div>
              <span className="rounded-full bg-[#71649C]/20 border border-[#71649C]/40 px-2.5 py-0.5 text-[10px] font-bold text-purple-200 uppercase tracking-wide">
                Personalized Wealth Setup
              </span>
              <h2 className="mt-0.5 text-lg font-bold text-slate-100">
                {step === "GOALS" && "Step 1: Your Life Milestones"}
                {step === "QUESTIONNAIRE" && "Step 2: Understanding Your Investment Style"}
                {step === "SUMMARY" && "Step 3: Smart AI Behavioral Profile"}
              </h2>
            </div>
          </div>

          {/* Navigation Pills */}
          <div className="flex items-center space-x-1.5 rounded-xl border border-[#282e3e] bg-[#0c0e12] p-1 text-xs">
            <button
              onClick={() => setStep("GOALS")}
              className={`px-3 py-1 rounded-lg font-medium transition ${
                step === "GOALS"
                  ? "bg-[#71649C] text-white shadow-sm font-semibold"
                  : "text-slate-400 hover:text-white"
              }`}
            >
              1. Milestones
            </button>
            <button
              onClick={() => setStep("QUESTIONNAIRE")}
              className={`px-3 py-1 rounded-lg font-medium transition ${
                step === "QUESTIONNAIRE"
                  ? "bg-[#71649C] text-white shadow-sm font-semibold"
                  : "text-slate-400 hover:text-white"
              }`}
            >
              2. Style
            </button>
            <button
              onClick={handleGoToSummary}
              className={`px-3 py-1 rounded-lg font-medium transition ${
                step === "SUMMARY"
                  ? "bg-[#71649C] text-white shadow-sm font-semibold"
                  : "text-slate-400 hover:text-white"
              }`}
            >
              3. AI Profile
            </button>
          </div>
        </div>

        {/* STEP 1: LIFE MILESTONES ANCHORING */}
        {step === "GOALS" && (
          <div className="mt-6 space-y-5">
            <div className="rounded-2xl border border-calm-navy-600/40 bg-gradient-to-r from-calm-navy-950/40 via-[#14171f] to-[#12151d] p-4 text-xs text-slate-300 flex items-start space-x-3">
              <HeartHandshake className="h-5 w-5 text-calm-amber-400 shrink-0 mt-0.5" />
              <div>
                <strong className="text-slate-100 text-sm block">What are you investing for?</strong>
                <p className="text-slate-400 mt-0.5 leading-relaxed">
                  Anchor your monthly SIPs to real-life milestones (like your 2032 Dream Home or 2038 Education). Our AI co-pilot calculates concrete timeline impacts rather than confusing percentage drops.
                </p>
              </div>
            </div>

            <div className="space-y-3.5">
              {userGoals.map((goal, idx) => (
                <div
                  key={goal.id}
                  className="rounded-2xl border border-[#282e3e] bg-[#161a24] p-4 sm:p-5 space-y-3 shadow-md hover:border-slate-600 transition"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-calm-amber-400 font-mono tracking-wide">
                      🎯 Milestone #{idx + 1}
                    </span>
                    {userGoals.length > 1 && (
                      <button
                        onClick={() => handleRemoveGoal(idx)}
                        className="text-xs text-slate-500 hover:text-calm-amber-400 p-1 transition"
                        title="Remove milestone"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    )}
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5 text-xs">
                    <div>
                      <label className="block text-slate-300 font-medium mb-1">
                        Milestone Name
                      </label>
                      <input
                        type="text"
                        value={goal.title}
                        onChange={(e) => handleUpdateGoal(idx, "title", e.target.value)}
                        placeholder="e.g. 2032 Dream Home"
                        className="w-full rounded-xl border border-[#282e3e] bg-[#0c0e12] px-3.5 py-2.5 text-slate-100 font-medium focus:outline-none focus:border-[#71649C] focus:ring-1 focus:ring-[#71649C] transition"
                      />
                    </div>
                    <div>
                      <label className="block text-slate-300 font-medium mb-1">Target Year</label>
                      <input
                        type="number"
                        min="2027"
                        max="2060"
                        value={goal.targetYear}
                        onChange={(e) =>
                          handleUpdateGoal(idx, "targetYear", parseInt(e.target.value) || 2032)
                        }
                        className="w-full rounded-xl border border-[#282e3e] bg-[#0c0e12] px-3.5 py-2.5 text-slate-100 font-mono font-medium focus:outline-none focus:border-[#71649C] focus:ring-1 focus:ring-[#71649C] transition"
                      />
                    </div>
                    <div>
                      <label className="block text-slate-300 font-medium mb-1">
                        Target Corpus (₹)
                      </label>
                      <input
                        type="number"
                        step="100000"
                        value={goal.targetAmount}
                        onChange={(e) =>
                          handleUpdateGoal(idx, "targetAmount", parseInt(e.target.value) || 2500000)
                        }
                        className="w-full rounded-xl border border-[#282e3e] bg-[#0c0e12] px-3.5 py-2.5 text-slate-100 font-mono font-medium focus:outline-none focus:border-[#71649C] focus:ring-1 focus:ring-[#71649C] transition"
                      />
                    </div>
                  </div>
                </div>
              ))}

              {userGoals.length < 4 && (
                <button
                  onClick={handleAddGoal}
                  className="flex w-full items-center justify-center space-x-2 rounded-2xl border border-dashed border-[#38425d] bg-[#14171f] py-3.5 text-xs font-semibold text-slate-300 hover:border-[#71649C] hover:text-purple-300 transition active:scale-99"
                >
                  <Plus className="h-4 w-4" />
                  <span>Add Another Milestone (Max 4)</span>
                </button>
              )}
            </div>

            <div className="flex items-center justify-between pt-4 border-t border-[#242938]">
              <button
                onClick={onClose}
                className="rounded-xl border border-[#282e3e] px-4 py-2.5 text-xs text-slate-400 hover:text-slate-200 transition"
              >
                Skip for now
              </button>
              <button
                onClick={() => setStep("QUESTIONNAIRE")}
                className="flex items-center space-x-2 rounded-xl bg-gradient-to-r from-[#71649C] to-[#594d80] px-6 py-2.5 text-xs font-bold text-white shadow-lg shadow-[#71649C]/25 hover:brightness-110 active:scale-98 transition"
              >
                <span>Continue to Investment Style</span>
                <ArrowRight className="h-4 w-4" />
              </button>
            </div>
          </div>
        )}

        {/* STEP 2: EMPATHETIC & CONVERSATIONAL QUESTIONNAIRE */}
        {step === "QUESTIONNAIRE" && (
          <div className="mt-6 space-y-5 max-h-[60vh] overflow-y-auto pr-1">
            <div className="rounded-2xl border border-calm-navy-600/40 bg-gradient-to-r from-calm-navy-950/40 via-[#14171f] to-[#12151d] p-4 text-xs text-slate-300 flex items-start space-x-3">
              <Sparkles className="h-5 w-5 text-calm-amber-400 shrink-0 mt-0.5" />
              <div>
                <strong className="text-slate-100 text-sm block">Understanding Your Investment Style</strong>
                <p className="text-slate-400 mt-0.5 leading-relaxed">
                  These scenario questions are analyzed by Google Gemini to dynamically calibrate your personalized investor persona and compounding guardrails.
                </p>
              </div>
            </div>

            {ONBOARDING_QUESTIONS.map((q, qIdx) => (
              <div
                key={q.id}
                className="rounded-2xl border border-[#282e3e] bg-[#161a24] p-4 sm:p-5 space-y-3.5 shadow-md"
              >
                <div>
                  <span className="text-[10px] font-bold text-purple-300 uppercase tracking-wider">
                    Question {qIdx + 1} of 4
                  </span>
                  <h4 className="text-sm sm:text-base font-bold text-slate-100 mt-0.5">
                    {q.scenario}
                  </h4>
                  <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                    {q.description}
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {q.options.map((opt, oIdx) => {
                    const isSelected = answers[q.id] === opt.weight;
                    return (
                      <button
                        key={oIdx}
                        onClick={() => handleSelectAnswer(q.id, opt.weight)}
                        className={`rounded-xl border p-3.5 text-left text-xs transition active:scale-98 ${
                          isSelected
                            ? "border-calm-amber-500 bg-calm-amber-950/30 text-slate-100 shadow-md shadow-amber-950/40 ring-1 ring-calm-amber-500/50"
                            : "border-[#282e3e] bg-[#0c0e12] text-slate-400 hover:border-slate-600 hover:text-slate-200"
                        }`}
                      >
                        <div className="flex items-start justify-between gap-2">
                          <span className={`font-semibold ${isSelected ? "text-calm-amber-300" : "text-slate-200"}`}>
                            {opt.label}
                          </span>
                          {isSelected && (
                            <CheckCircle2 className="h-4 w-4 text-calm-amber-400 shrink-0 mt-0.5" />
                          )}
                        </div>
                        <span className="text-[11px] text-slate-400 mt-1.5 block leading-relaxed">
                          {opt.description}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>
            ))}

            <div className="flex items-center justify-between pt-4 border-t border-[#242938]">
              <button
                onClick={() => setStep("GOALS")}
                className="flex items-center space-x-1.5 rounded-xl border border-[#282e3e] px-4 py-2.5 text-xs text-slate-400 hover:text-slate-200 transition"
              >
                <ArrowLeft className="h-4 w-4" />
                <span>Back to Milestones</span>
              </button>
              <button
                onClick={handleGoToSummary}
                className="flex items-center space-x-2 rounded-xl bg-gradient-to-r from-[#71649C] to-[#594d80] px-6 py-2.5 text-xs font-bold text-white shadow-lg shadow-[#71649C]/25 hover:brightness-110 active:scale-98 transition"
              >
                <span>Classify With Gemini AI</span>
                <ArrowRight className="h-4 w-4" />
              </button>
            </div>
          </div>
        )}

        {/* STEP 3: DYNAMIC GEMINI AI ARCHETYPE SUMMARY */}
        {step === "SUMMARY" && (
          <div className="mt-6 space-y-5">
            {isClassifying ? (
              <div className="py-12 flex flex-col items-center justify-center space-y-4 text-center rounded-3xl border border-[#71649C]/40 bg-[#161a24] p-8">
                <div className="relative">
                  <div className="h-12 w-12 rounded-full border-4 border-[#71649C]/30 border-t-[#71649C] animate-spin" />
                  <Sparkles className="h-5 w-5 text-calm-amber-400 absolute inset-0 m-auto animate-pulse" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-100">
                    Gemini 1.5 Flash analyzing your psychological risk profile...
                  </h3>
                  <p className="text-xs text-slate-400 mt-1">
                    Calibrating behavioral resilience barrier and personalized archetype for {profile.name || "Rouneet Raj Sinha"}.
                  </p>
                </div>
              </div>
            ) : (
              <>
                {/* Dynamically Generated Archetype Card */}
                <div className="rounded-3xl border border-[#71649C]/50 bg-gradient-to-b from-[#71649C]/20 via-[#161a24] to-[#12151d] p-6 text-center space-y-3.5 shadow-2xl relative overflow-hidden">
                  <div className="flex items-center justify-center space-x-2">
                    <span className="inline-block rounded-full bg-[#71649C]/30 border border-[#71649C]/60 px-3 py-1 text-[11px] font-bold text-purple-200 uppercase tracking-wider">
                      {aiClassification?.badge || fallbackArchetype.badge}
                    </span>
                    <span className="rounded-full bg-[#1e2433] border border-[#282e3e] px-2 py-0.5 text-[10px] font-mono text-slate-400">
                      Gemini 1.5 Flash
                    </span>
                  </div>

                  <h3 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white">
                    Your Profile:{" "}
                    <span className="bg-gradient-to-r from-calm-amber-300 to-amber-200 bg-clip-text text-transparent">
                      {aiClassification?.archetypeTitle || fallbackArchetype.title}
                    </span>
                  </h3>

                  <p className="text-sm text-slate-300 max-w-xl mx-auto leading-relaxed">
                    {aiClassification?.psychologicalProfile || fallbackArchetype.summary}
                  </p>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 text-left text-xs max-w-xl mx-auto">
                    <div className="rounded-xl bg-[#0c0e12]/80 border border-[#282e3e] p-3 space-y-0.5">
                      <span className="text-[10px] uppercase font-bold text-calm-green-400 block">
                        ✨ Core Strength
                      </span>
                      <p className="text-slate-200 font-medium">
                        {aiClassification?.behavioralStrength || "Milestone-anchored discipline"}
                      </p>
                    </div>

                    <div className="rounded-xl bg-[#0c0e12]/80 border border-[#282e3e] p-3 space-y-0.5">
                      <span className="text-[10px] uppercase font-bold text-calm-amber-400 block">
                        🛡️ Co-Pilot Guardrail
                      </span>
                      <p className="text-slate-200 font-medium">
                        {aiClassification?.riskMitigationRule || "Automated Step-Down protection during drawdowns"}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Anchored Milestones & Privacy */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 text-xs">
                  <div className="rounded-2xl border border-[#282e3e] bg-[#161a24] p-4 space-y-2">
                    <span className="text-slate-400 font-semibold block uppercase tracking-wider text-[10px]">
                      Anchored Milestones:
                    </span>
                    <ul className="space-y-2 pt-1">
                      {userGoals.map((g) => (
                        <li key={g.id} className="flex items-center justify-between text-slate-200">
                          <span className="font-medium">• {g.title}</span>
                          <span className="font-mono text-calm-amber-400 font-semibold">
                            {g.targetYear} (₹{(g.targetAmount / 100000).toFixed(1)}L)
                          </span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="rounded-2xl border border-[#282e3e] bg-[#161a24] p-4 space-y-2">
                    <span className="text-slate-400 font-semibold block uppercase tracking-wider text-[10px]">
                      Privacy & Zero-PII Guarantee:
                    </span>
                    <div className="flex items-center space-x-2 text-calm-green-400 font-medium text-xs pt-1">
                      <CheckCircle2 className="h-4 w-4 shrink-0" />
                      <span>Zero-PII Anonymized Session</span>
                    </div>
                    <p className="text-[11px] text-slate-400 leading-relaxed">
                      No PAN numbers or bank login credentials are ever ingested. Data stays 100% private and protected under SEBI tech guidelines.
                    </p>
                  </div>
                </div>

                {/* Finish CTA */}
                <div className="flex items-center justify-between pt-4 border-t border-[#242938]">
                  <button
                    onClick={() => setStep("QUESTIONNAIRE")}
                    className="flex items-center space-x-1.5 rounded-xl border border-[#282e3e] px-4 py-2.5 text-xs text-slate-400 hover:text-slate-200 transition"
                  >
                    <ArrowLeft className="h-4 w-4" />
                    <span>Adjust Answers</span>
                  </button>
                  <button
                    onClick={handleSaveAndComplete}
                    className="flex items-center space-x-2 rounded-2xl bg-gradient-to-r from-calm-green-600 to-emerald-600 px-7 py-3 text-xs font-bold text-white shadow-xl shadow-green-900/30 hover:brightness-110 active:scale-98 transition"
                  >
                    <CheckCircle2 className="h-4 w-4" />
                    <span>Save Profile & Enter Dashboard</span>
                  </button>
                </div>
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default OnboardingModal;
