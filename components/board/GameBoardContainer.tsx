"use client";

import { GameBoard } from "@/components/board/GameBoard";
import { useGame } from "@/features/game/hooks/useGame";
import {
  selectBoardSeed,
  selectCurrentPlayerId,
  selectLastAction,
  selectLocations,
  selectPendingTurn,
  selectPhase,
  selectPlayerCount,
  selectPlayers,
  selectRemainingPlanCount,
  selectRound,
  selectSupplyPlans,
  selectWinnerPlayerId,
} from "@/features/game/state/selectors";

export function GameBoardContainer() {
  const { state, dispatch } = useGame();

  return (
    <GameBoard
      players={selectPlayerCount(state)}
      activeLocations={selectLocations(state)}
      activePlans={selectSupplyPlans(state)}
      claimedPlans={state.players.flatMap((player) =>
        player.claimedPlans.map((plan) => ({ playerId: player.id, plan })),
      )}
      remainingPlanCount={selectRemainingPlanCount(state)}
      playerStates={selectPlayers(state)}
      currentPlayerId={selectCurrentPlayerId(state)}
      pendingTurn={selectPendingTurn(state)}
      phase={selectPhase(state)}
      round={selectRound(state)}
      winnerPlayerId={selectWinnerPlayerId(state)}
      lastAction={selectLastAction(state)}
      seed={selectBoardSeed(state)}
      onResetBoard={() => dispatch({ type: "RESET_BOARD" })}
      onToggleLocationSpace={(locationId, spaceIndex, mintCount, selectedPlanId) =>
        dispatch({
          type: "TOGGLE_LOCATION_SPACE",
          locationId,
          spaceIndex,
          mintCount,
          selectedPlanId,
        })
      }
      onRequestPassTurn={() => dispatch({ type: "REQUEST_PASS_TURN" })}
      onConfirmTurn={() => dispatch({ type: "CONFIRM_TURN" })}
      onClearPendingTurn={() => dispatch({ type: "CLEAR_PENDING_TURN" })}
    />
  );
}
