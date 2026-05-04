import { claimPlan, removeClaimedPlanForPlayer } from "@/features/plans/plansSlice";
import {
  selectClaimedPlans,
  selectRemainingPlans,
  selectSupplyPlans,
} from "@/features/plans/selectors";
import { useAppDispatch, useAppSelector } from "@/store/hooks";

export function usePlansState() {
  const dispatch = useAppDispatch();

  return {
    supplyPlans: useAppSelector(selectSupplyPlans),
    claimedPlans: useAppSelector(selectClaimedPlans),
    remainingPlans: useAppSelector(selectRemainingPlans),
    claimPlanForPlayer: (planId: string, playerId: string) =>
      dispatch(claimPlan({ planId, playerId })),
    removeClaimedPlanForPlayer: (planId: string, playerId: string) =>
      dispatch(removeClaimedPlanForPlayer({ planId, playerId })),
  };
}
