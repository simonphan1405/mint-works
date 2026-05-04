"use client";

import { useEffect } from "react";
import { GameBoard } from "@/components/board/GameBoard";
import { useGame } from "@/features/game/hooks/useGame";
import { usePlansState } from "@/features/plans/hooks";
import {
  selectBoardSeed,
  selectCurrentPlayerId,
  selectLastAction,
  selectLocations,
  selectPendingTurn,
  selectPhase,
  selectPlayerCount,
  selectPlayers,
  selectRound,
  selectWinnerPlayerId,
} from "@/features/game/state/selectors";

export function GameBoardContainer() {
  const { state, dispatch } = useGame();
  const {
    supplyPlans,
    claimedPlans,
    remainingPlans,
    claimPlanForPlayer,
  } = usePlansState();

  useEffect(() => {
    const statePlanIds = new Set(
      state.players.flatMap((player) => player.claimedPlans.map((plan) => plan.id)),
    );

    claimedPlans.forEach((record) => {
      if (!statePlanIds.has(record.plan.id)) {
        claimPlanForPlayer(record.plan.id, record.playerId);
      }
    });
  }, [claimPlanForPlayer, claimedPlans, state.players]);

  return (
    <GameBoard
      players={selectPlayerCount(state)}
      activeLocations={selectLocations(state)}
      activePlans={supplyPlans}
      claimedPlans={claimedPlans}
      remainingPlanCount={remainingPlans.length}
      playerStates={selectPlayers(state)}
      currentPlayerId={selectCurrentPlayerId(state)}
      pendingTurn={selectPendingTurn(state)}
      phase={selectPhase(state)}
      round={selectRound(state)}
      winnerPlayerId={selectWinnerPlayerId(state)}
      lastAction={selectLastAction(state)}
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
      onRequestPassTurn={() => dispatch({ type: "REQUEST_PASS_TURN" })}
      onConfirmTurn={() => dispatch({ type: "CONFIRM_TURN" })}
      onClearPendingTurn={() => dispatch({ type: "CLEAR_PENDING_TURN" })}
    />
  );
}
