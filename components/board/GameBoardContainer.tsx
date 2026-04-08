"use client";

import { GameBoard } from "@/components/board/GameBoard";
import { useGame } from "@/features/game/hooks/useGame";
import {
  selectBoardSeed,
  selectLocations,
  selectPlanSupply,
  selectPlayerCount,
} from "@/features/game/state/selectors";

export function GameBoardContainer() {
  const { state, dispatch } = useGame();

  return (
    <GameBoard
      players={selectPlayerCount(state)}
      activeLocations={selectLocations(state)}
      activePlans={selectPlanSupply(state)}
      seed={selectBoardSeed(state)}
      onResetBoard={() => dispatch({ type: "RESET_BOARD" })}
    />
  );
}
