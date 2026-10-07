"use client";

import React, { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useApp } from "@/context/AppContext";
import { AuthScreen } from "@/components/AuthScreen";

export default function LoginPage() {
  const router = useRouter();
  const { isAuthenticated } = useApp();

  useEffect(() => {
    if (isAuthenticated) {
      router.push("/");
    }
  }, [isAuthenticated, router]);

  return <AuthScreen onSuccess={() => router.push("/")} />;
}
