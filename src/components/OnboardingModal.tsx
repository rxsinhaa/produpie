"use client";

import React, { useState } from "react";
import { BehavioralProfile, LifeGoal, QuestionItem } from "@/types";
import { ONBOARDING_QUESTIONS } from "@/lib/constants";
import {
  ShieldCheck,
  Target,
  Sliders,
  HelpCircle,
  CheckCircle2,
  Lock,
  Plus,
  Trash2,
  ArrowRight,
  Sparkles,
  Key,
  Globe,
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
  const [step, setStep] = useState<"AUTH" | "GOALS" | "QUESTIONNAIRE" | "SUMMARY">("GOALS");
  const [authMethod, setAuthMethod] = useState<string>("OAuth-Passkey");
  const [userGoals, setUserGoals] = useState<LifeGoal[]>(goals);
  const [answers, setAnswers] = useState<Record<string, number>>(profile.answers || {
    q1: 0.55,
    q2: 0.6,
    q3: 0.8,
    q4: 0.6,
  });

  if (!isOpen) return null;

  // Handle Answer Selection
  const handleSelectAnswer = (qId: string, weight: number) => {
    setAnswers((prev) => ({ ...prev, [qId]: weight }));
  };

  // Calculate Continuous Risk Barrier from Answers
  const calculateBarrier = () => {
    const weights = Object.values(answers);
    if (weights.length === 0) return 0.6;
    const avg = weights.reduce((acc, w) => acc + w, 0) / weights.length;
    return parseFloat(avg.toFixed(2));
  };

  const calculatedRiskBarrier = calculateBarrier();

  // Goal modifications
  const handleUpdateGoal = (index: number, field: keyof LifeGoal, value: any) => {
    const updated = [...userGoals];
    updated[index] = { ...updated[index], [field]: value };
    setUserGoals(updated);
  };

  const handleAddGoal = () => {
    if (userGoals.length >= 3) return;
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
    let archetype: BehavioralProfile["archetype"] = "Anxious Aarav";
    if (calculatedRiskBarrier >= 0.8) {
      archetype = "Contrarian Accumulator";
    } else if (calculatedRiskBarrier >= 0.65) {
      archetype = "Disciplined Compounder";
    }

    const updatedProfile: BehavioralProfile = {
      ...profile,
      riskBarrier: calculatedRiskBarrier,
      archetype,
      answers,
    };

    onSaveProfile(updatedProfile, userGoals);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 overflow-y-auto bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-3xl rounded-2xl border border-[#282e3e] bg-[#12151d] p-6 sm:p-8 shadow-2xl text-slate-100">
        {/* Step Indicator */}
        <div className="flex items-center justify-between border-b border-[#242938] pb-4">
          <div>
            <span className="rounded bg-calm-navy-900 border border-calm-navy-600 px-2 py-0.5 text-[10px] font-bold text-calm-navy-100 uppercase">
              Phase 1: Foundation Calibration
            </span>
            <h2 className="mt-1 text-lg font-bold text-slate-100">
              {step === "AUTH" && "Secure Zero-PII Authentication"}
              {step === "GOALS" && "Goal Anchoring & Milestone Mapping"}
              {step === "QUESTIONNAIRE" && "Behavioral Resilience & Risk Barrier Calibration"}
              {step === "SUMMARY" && "Calibrated Compounding Profile"}
            </h2>
          </div>

          <div className="flex items-center space-x-2 text-xs font-mono">
            <button
              onClick={() => setStep("GOALS")}
              className={`px-2.5 py-1 rounded ${
                step === "GOALS" ? "bg-calm-navy-700 text-white font-bold" : "text-slate-400 hover:text-white"
              }`}
            >
              1. Goals
            </button>
            <button
              onClick={() => setStep("QUESTIONNAIRE")}
              className={`px-2.5 py-1 rounded ${
                step === "QUESTIONNAIRE"
                  ? "bg-calm-navy-700 text-white font-bold"
                  : "text-slate-400 hover:text-white"
              }`}
            >
              2. Resilience
            </button>
            <button
              onClick={() => setStep("SUMMARY")}
              className={`px-2.5 py-1 rounded ${
                step === "SUMMARY" ? "bg-calm-navy-700 text-white font-bold" : "text-slate-400 hover:text-white"
              }`}
            >
              3. Summary
            </button>
          </div>
        </div>

        {/* STEP 1: GOALS ANCHORING */}
        {step === "GOALS" && (
          <div className="mt-5 space-y-4">
            <div className="rounded-xl border border-calm-navy-600/40 bg-calm-navy-900/30 p-3.5 text-xs text-slate-300">
              <span className="font-semibold text-calm-amber-400">Anchoring Principle:</span> Define up to 3 life milestones with timeline and capital targets. The math engine uses these anchors to compute concrete milestone delay impacts rather than abstract percentage drops.
            </div>

            <div className="space-y-3">
              {userGoals.map((goal, idx) => (
                <div
                  key={goal.id}
                  className="rounded-xl border border-[#282e3e] bg-[#161a24] p-4 space-y-3"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-calm-amber-400 font-mono">
                      Milestone #{idx + 1}
                    </span>
                    {userGoals.length > 1 && (
                      <button
                        onClick={() => handleRemoveGoal(idx)}
                        className="text-xs text-slate-500 hover:text-calm-amber-400 p-1"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    )}
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                    <div>
                      <label className="block text-slate-400 mb-1">Milestone Name</label>
                      <input
                        type="text"
                        value={goal.title}
                        onChange={(e) => handleUpdateGoal(idx, "title", e.target.value)}
                        className="w-full rounded-lg border border-[#282e3e] bg-[#0c0e12] px-3 py-2 text-slate-100 font-medium focus:outline-none focus:border-calm-amber-500"
                      />
                    </div>
                    <div>
                      <label className="block text-slate-400 mb-1">Target Year</label>
                      <input
                        type="number"
                        min="2027"
                        max="2060"
                        value={goal.targetYear}
                        onChange={(e) =>
                          handleUpdateGoal(idx, "targetYear", parseInt(e.target.value) || 2032)
                        }
                        className="w-full rounded-lg border border-[#282e3e] bg-[#0c0e12] px-3 py-2 text-slate-100 font-mono font-medium focus:outline-none focus:border-calm-amber-500"
                      />
                    </div>
                    <div>
                      <label className="block text-slate-400 mb-1">Target Corpus (₹)</label>
                      <input
                        type="number"
                        step="100000"
                        value={goal.targetAmount}
                        onChange={(e) =>
                          handleUpdateGoal(idx, "targetAmount", parseInt(e.target.value) || 2500000)
                        }
                        className="w-full rounded-lg border border-[#282e3e] bg-[#0c0e12] px-3 py-2 text-slate-100 font-mono font-medium focus:outline-none focus:border-calm-amber-500"
                      />
                    </div>
                  </div>
                </div>
              ))}

              {userGoals.length < 3 && (
                <button
                  onClick={handleAddGoal}
                  className="flex w-full items-center justify-center space-x-2 rounded-xl border border-dashed border-[#38425d] bg-[#14171f] py-3 text-xs font-semibold text-slate-300 hover:border-calm-amber-500 hover:text-calm-amber-300 transition"
                >
                  <Plus className="h-4 w-4" />
                  <span>Add Life Milestone (Max 3)</span>
                </button>
              )}
            </div>

            <div className="flex justify-end pt-3">
              <button
                onClick={() => setStep("QUESTIONNAIRE")}
                className="flex items-center space-x-2 rounded-xl bg-calm-navy-600 px-5 py-2.5 text-xs font-semibold text-white hover:bg-calm-navy-500 transition shadow"
              >
                <span>Continue to Resilience Calibration</span>
                <ArrowRight className="h-4 w-4" />
              </button>
            </div>
          </div>
        )}

        {/* STEP 2: BEHAVIORAL QUESTIONNAIRE */}
        {step === "QUESTIONNAIRE" && (
          <div className="mt-5 space-y-4 max-h-[60vh] overflow-y-auto pr-1">
            <div className="rounded-xl border border-calm-navy-600/40 bg-calm-navy-900/30 p-3 text-xs text-slate-300">
              <span className="font-semibold text-calm-amber-400">Prospect Theory Calibration:</span> Answer these 4 behavioral scenarios. The RAG/Math engine scales your personalized baseline <strong>Risk Barrier</strong> from <code className="font-mono text-calm-amber-300">0.0 → 1.0</code>.
            </div>

            {ONBOARDING_QUESTIONS.map((q, qIdx) => (
              <div
                key={q.id}
                className="rounded-xl border border-[#282e3e] bg-[#161a24] p-4 space-y-3"
              >
                <div>
                  <span className="text-[10px] font-bold text-calm-navy-100 uppercase tracking-wide">
                    Scenario #{qIdx + 1}
                  </span>
                  <h4 className="text-sm font-semibold text-slate-100">{q.scenario}</h4>
                  <p className="text-xs text-slate-400 mt-0.5">{q.description}</p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {q.options.map((opt, oIdx) => {
                    const isSelected = answers[q.id] === opt.weight;
                    return (
                      <button
                        key={oIdx}
                        onClick={() => handleSelectAnswer(q.id, opt.weight)}
                        className={`rounded-lg border p-2.5 text-left text-xs transition ${
                          isSelected
                            ? "border-calm-amber-500 bg-calm-amber-950/40 text-calm-amber-200 shadow"
                            : "border-[#282e3e] bg-[#0c0e12] text-slate-400 hover:border-slate-600"
                        }`}
                      >
                        <div className="flex items-start justify-between">
                          <span className="font-medium text-slate-200">{opt.label}</span>
                          {isSelected && <CheckCircle2 className="h-4 w-4 text-calm-amber-400 shrink-0 ml-1" />}
                        </div>
                        <span className="text-[10px] text-slate-500 mt-1 block">
                          {opt.description}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>
            ))}

            <div className="flex justify-between pt-3 border-t border-[#242938]">
              <button
                onClick={() => setStep("GOALS")}
                className="rounded-xl border border-[#282e3e] px-4 py-2 text-xs text-slate-400 hover:text-slate-200"
              >
                Back to Goals
              </button>
              <button
                onClick={() => setStep("SUMMARY")}
                className="flex items-center space-x-2 rounded-xl bg-calm-navy-600 px-5 py-2.5 text-xs font-semibold text-white hover:bg-calm-navy-500 transition shadow"
              >
                <span>View Calibrated Risk Barrier</span>
                <ArrowRight className="h-4 w-4" />
              </button>
            </div>
          </div>
        )}

        {/* STEP 3: SUMMARY & CONFIRMATION */}
        {step === "SUMMARY" && (
          <div className="mt-5 space-y-4">
            <div className="rounded-xl border border-calm-green-600/50 bg-calm-green-950/30 p-4 text-center">
              <span className="inline-block rounded bg-calm-green-500/20 border border-calm-green-500/40 px-2 py-0.5 text-[10px] font-bold text-calm-green-300 uppercase">
                Calibration Ready
              </span>
              <h3 className="mt-2 text-2xl font-black font-mono text-calm-amber-400">
                Risk Barrier: {calculatedRiskBarrier.toFixed(2)}
              </h3>
              <p className="mt-1 text-xs text-slate-300">
                Archetype:{" "}
                <strong className="text-white">
                  {calculatedRiskBarrier < 0.65 ? "Anxious Aarav (Loss-Sensitive)" : "Disciplined Compounder"}
                </strong>
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div className="rounded-xl border border-[#282e3e] bg-[#161a24] p-3.5 space-y-1">
                <span className="text-slate-400">Anchored Milestones:</span>
                <ul className="space-y-1 pt-1">
                  {userGoals.map((g) => (
                    <li key={g.id} className="text-slate-200 font-medium">
                      • {g.title} ({g.targetYear}) — ₹{(g.targetAmount / 100000).toFixed(1)} Lakhs
                    </li>
                  ))}
                </ul>
              </div>

              <div className="rounded-xl border border-[#282e3e] bg-[#161a24] p-3.5 space-y-1">
                <span className="text-slate-400">Zero-PII Token Status:</span>
                <div className="flex items-center space-x-1.5 text-calm-green-400 font-mono text-[11px] pt-1">
                  <Lock className="h-3.5 w-3.5" />
                  <span>{profile.sessionToken}</span>
                </div>
                <p className="text-[10px] text-slate-500">
                  No PAN, bank accounts, or personal identities ingested or stored.
                </p>
              </div>
            </div>

            <div className="flex justify-between pt-3 border-t border-[#242938]">
              <button
                onClick={() => setStep("QUESTIONNAIRE")}
                className="rounded-xl border border-[#282e3e] px-4 py-2 text-xs text-slate-400 hover:text-slate-200"
              >
                Back to Questionnaire
              </button>
              <button
                onClick={handleSaveAndComplete}
                className="flex items-center space-x-2 rounded-xl bg-calm-green-600 px-6 py-2.5 text-xs font-bold text-white hover:bg-calm-green-500 transition shadow"
              >
                <CheckCircle2 className="h-4 w-4" />
                <span>Save Anchors & Enter Dashboard</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
