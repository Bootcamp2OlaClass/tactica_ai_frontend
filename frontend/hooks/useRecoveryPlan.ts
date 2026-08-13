"use client";

import { getRecoveryPlan } from "@/services/recoveryPlan.service";

import { useAsyncData } from "./useAsyncData";

export function useRecoveryPlan() {
  return useAsyncData(() => getRecoveryPlan(), []);
}
