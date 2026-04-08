import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import { plans, type PlanData } from "@/data/cards/plans";

export interface ClaimedPlanRecord {
  playerId: string;
  plan: PlanData;
}

export interface PlansState {
  supplyPlans: PlanData[];
  claimedPlans: ClaimedPlanRecord[];
  remainingPlans: PlanData[];
}

function shuffle<T>(arr: T[]): T[] {
  const copy = [...arr];
  for (let i = copy.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

export function createInitialPlansState(playerCount: number): PlansState {
  const deck = shuffle(plans);
  const supplyCount = playerCount === 1 ? 2 : 3;

  return {
    supplyPlans: deck.slice(0, supplyCount),
    claimedPlans: [],
    remainingPlans: deck.slice(supplyCount),
  };
}

const plansSlice = createSlice({
  name: "plans",
  initialState: createInitialPlansState(2),
  reducers: {
    initializePlansState: (_state, action: PayloadAction<{ playerCount: number }>) =>
      createInitialPlansState(action.payload.playerCount),

    resetPlansState: (_state, action: PayloadAction<{ playerCount: number }>) =>
      createInitialPlansState(action.payload.playerCount),

    claimPlan: (
      state,
      action: PayloadAction<{ planId: string; playerId: string }>,
    ) => {
      const planIndex = state.supplyPlans.findIndex(
        (plan) => plan.id === action.payload.planId,
      );

      if (planIndex === -1) {
        return;
      }

      const [claimedPlan] = state.supplyPlans.splice(planIndex, 1);
      state.claimedPlans.push({
        playerId: action.payload.playerId,
        plan: claimedPlan,
      });

      const replacement = state.remainingPlans.shift();
      if (replacement) {
        state.supplyPlans.push(replacement);
      }
    },
  },
});

export const {
  initializePlansState,
  resetPlansState,
  claimPlan,
} = plansSlice.actions;

export const plansReducer = plansSlice.reducer;
