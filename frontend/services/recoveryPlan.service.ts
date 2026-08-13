import { authenticatedApiRequest } from "@/lib/api/client";
import { mapRecoveryPlan, type RawRecoveryPlan } from "@/lib/mappers/recoveryPlan";
import type { RecoveryPlan } from "@/types/recoveryPlan";

export async function getRecoveryPlan(): Promise<RecoveryPlan> {
  const raw = await authenticatedApiRequest<RawRecoveryPlan>("/api/v1/recovery-plan");
  return mapRecoveryPlan(raw);
}
