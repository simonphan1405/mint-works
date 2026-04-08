"use client";

import { GameBoard } from "@/components/board/GameBoard";
import { useGame } from "@/features/game/hooks/useGame";
import {
  selectBoardSeed,
  selectCurrentPlayerId,
  selectLocations,
  selectPlanSupply,
  selectPlayerCount,
  selectPlayers,
} from "@/features/game/state/selectors";

export function GameBoardContainer() {
  const { state, dispatch } = useGame();

  return (
    <GameBoard
      players={selectPlayerCount(state)}
      activeLocations={selectLocations(state)}
      activePlans={selectPlanSupply(state)}
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
    />
  );
}
