import type { GameState, LocationCardViewModel } from "@/features/game/model/types";

export const selectPlayerCount = (state: GameState) => state.board.playerCount;
export const selectPlayers = (state: GameState) => state.players;
export const selectCurrentPlayerId = (state: GameState) => state.currentPlayerId;
export const selectBoardSeed = (state: GameState) => state.board.seed;

export const selectLocations = (state: GameState): LocationCardViewModel[] =>
  state.board.locations.map((location) => ({
    ...location.definition,
    runtimeId: location.id,
    ownerPlayerId: location.ownerPlayerId,
    occupiedByPlayerId: location.spaces.find((space) => space.occupiedByPlayerId)
      ?.occupiedByPlayerId,
    isOpen: location.isOpen,
    mintPlacementSpace: location.spaces.map((space) => ({
      displayValue: space.occupiedByPlayerId
        ? (space.occupiedMintCount ?? space.printedCost)
        : space.printedCost,
      occupied: Boolean(space.occupiedByPlayerId),
      occupiedMintCount: space.occupiedMintCount,
    })),
  }));
