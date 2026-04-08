import type { GameAction } from "@/features/game/model/actions";
import type { GameState } from "@/features/game/model/types";
import { setupGame } from "@/features/game/engine/setupGame";

export function createGameState(playerCount: number, seed?: number): GameState {
  return {
    phase: "ready",
    board: setupGame(playerCount, seed),
  };
}

export function gameReducer(state: GameState, action: GameAction): GameState {
  switch (action.type) {
    case "SETUP_GAME":
      return {
        phase: "ready",
        board: setupGame(action.playerCount, action.seed),
      };

    case "RESET_BOARD":
      return {
        ...state,
        board: setupGame(state.board.playerCount),
      };

    default:
      return state;
  }
}
