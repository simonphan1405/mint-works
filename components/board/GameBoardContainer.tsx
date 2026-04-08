"use client";

import { GameBoard } from "@/components/board/GameBoard";
import { useGame } from "@/features/game/hooks/useGame";
import { usePlansState } from "@/features/plans/hooks";
import {
  selectBoardSeed,
  selectCurrentPlayerId,
  selectLocations,
  selectPlayerCount,
  selectPlayers,
} from "@/features/game/state/selectors";

export function GameBoardContainer() {
  const { state, dispatch } = useGame();
  const { supplyPlans, claimedPlans, remainingPlans, claimPlanForPlayer } = usePlansState();

  return (
    <GameBoard
      players={selectPlayerCount(state)}
      activeLocations={selectLocations(state)}
      activePlans={supplyPlans}
      claimedPlans={claimedPlans}
      remainingPlanCount={remainingPlans.length}
      playerStates={selectPlayers(state)}
      currentPlayerId={selectCurrentPlayerId(state)}
      seed={selectBoardSeed(state)}
      onResetBoard={() => dispatch({ type: "RESET_BOARD" })}
      onToggleLocationSpace={(locationId, spaceIndex, mintCount) =>
        dispatch({
          type: "TOGGLE_LOCATION_SPACE",
          locationId,
          spaceIndex,
          mintCount,
        })
      }
      onClaimPlan={(planId, playerId) => claimPlanForPlayer(planId, playerId)}
    />
  );
}
