"use client";

import React, { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useApp } from "@/context/AppContext";
import { OnboardingModal } from "@/components/OnboardingModal";

export default function OnboardingPage() {
  const router = useRouter();
  const { profile, setProfile, goals, setGoals, selectedGoal, setSelectedGoal } = useApp();

  return (
    <div className="min-h-screen bg-[#0c0e12] flex items-center justify-center p-4">
      <OnboardingModal
        isOpen={true}
        onClose={() => router.push("/")}
        profile={profile}
        goals={goals}
        onSaveProfile={(newProfile, newGoals) => {
          setProfile(newProfile);
          setGoals(newGoals);
          if (!newGoals.some((g) => g.id === selectedGoal.id)) {
            setSelectedGoal(newGoals[0]);
          }
          router.push("/");
        }}
      />
    </div>
  );
}
