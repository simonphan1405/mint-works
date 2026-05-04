import type { GameAction } from "@/features/game/model/actions";
import type { GameState } from "@/features/game/model/types";
import { createPlayers, setupGame } from "@/features/game/engine/setupGame";

export function createGameState(playerCount: number, seed?: number): GameState {
  const players = createPlayers(playerCount);

  return {
    phase: "ready",
    round: 1,
    currentPlayerId: players[0]?.id ?? "p1",
    players,
    board: setupGame(playerCount, seed),
  };
}

export function gameReducer(state: GameState, action: GameAction): GameState {
  switch (action.type) {
    case "SETUP_GAME":
      return createGameState(action.playerCount, action.seed);

    case "RESET_BOARD":
      return createGameState(state.board.playerCount);

    case "TOGGLE_LOCATION_SPACE": {
      const currentPlayer = state.players.find(
        (player) => player.id === state.currentPlayerId,
      );

      if (!currentPlayer) {
        return state;
      }

      const nextLocations = state.board.locations.map((location) => {
        if (location.id !== action.locationId) {
          return location;
        }

        return {
          ...location,
          spaces: location.spaces.map((space) => {
            if (space.index !== action.spaceIndex) {
              return space;
            }

            if (space.occupiedByPlayerId) {
              return {
                ...space,
                occupiedByPlayerId: undefined,
                occupiedMintCount: undefined,
              };
            }

            if (space.printedCost === "1+") {
              return {
                ...space,
                occupiedByPlayerId: currentPlayer.id,
                occupiedMintCount: 1,
              };
            }

            return {
              ...space,
              occupiedByPlayerId: currentPlayer.id,
              occupiedMintCount: action.mintCount,
            };
          }),
        };
      });

      return {
        ...state,
        board: {
          ...state.board,
          locations: nextLocations,
        },
      };
    }

    default:
      return state;
  }
}
