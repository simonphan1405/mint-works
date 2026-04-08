import type { RootState } from "@/store/store";

export const selectSupplyPlans = (state: RootState) => state.plans.supplyPlans;
export const selectClaimedPlans = (state: RootState) => state.plans.claimedPlans;
export const selectRemainingPlans = (state: RootState) => state.plans.remainingPlans;
