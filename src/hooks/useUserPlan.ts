import { useState } from "react";

// Simulated user context for the frontend demo
export interface UserPlan {
  planName: string;
  pageBalance: number;
  pageLimit: number;
  extraPages: number;
  email: string;
  role: "user" | "admin";
}

const DEFAULT_PLAN: UserPlan = {
  planName: "Free Trial",
  pageBalance: 50,
  pageLimit: 50,
  extraPages: 0,
  email: "",
  role: "user",
};

export function useUserPlan() {
  const [plan, setPlan] = useState<UserPlan>(DEFAULT_PLAN);
  const [isLoading, setIsLoading] = useState(false);

  const consumePages = (count: number) => {
    setPlan((prev) => ({
      ...prev,
      pageBalance: Math.max(0, prev.pageBalance - count),
    }));
  };

  const canConsume = (count: number) => plan.pageBalance >= count;

  const fetchPlan = async (_email: string) => {
    setIsLoading(true);
    // Simulating API call — replace with real endpoint
    await new Promise((r) => setTimeout(r, 800));
    setPlan({
      planName: "Free Trial",
      pageBalance: 35,
      pageLimit: 50,
      extraPages: 0,
      email: _email,
      role: "user",
    });
    setIsLoading(false);
  };

  return { plan, isLoading, consumePages, canConsume, fetchPlan };
}
