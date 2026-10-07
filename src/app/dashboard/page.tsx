"use client";

import React, { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useApp } from "@/context/AppContext";
import Home from "@/app/page";

export default function DashboardPage() {
  const router = useRouter();
  const { isAuthenticated, loginAsDemo } = useApp();

  useEffect(() => {
    if (!isAuthenticated) {
      // Auto-authenticate with demo if visiting /dashboard directly
      loginAsDemo();
    }
  }, [isAuthenticated, loginAsDemo]);

  return <Home />;
}
