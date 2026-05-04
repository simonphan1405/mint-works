import type { GameState, LocationCardViewModel } from "@/features/game/model/types";

export const selectPlayerCount = (state: GameState) => state.board.playerCount;
export const selectPlayers = (state: GameState) => state.players;
export const selectCurrentPlayerId = (state: GameState) => state.currentPlayerId;
export const selectBoardSeed = (state: GameState) => state.board.seed;
export const selectPhase = (state: GameState) => state.phase;
export const selectRound = (state: GameState) => state.round;
export const selectWinnerPlayerId = (state: GameState) => state.winnerPlayerId;
export const selectLastAction = (state: GameState) => state.lastAction;
export const selectPendingTurn = (state: GameState) => state.pendingTurn;
export const selectSupplyPlans = (state: GameState) => state.supplyPlans;
export const selectRemainingPlanCount = (state: GameState) => state.remainingPlans.length;

export const selectLocations = (state: GameState): LocationCardViewModel[] => {
  const currentPlayer = state.players.find((player) => player.id === state.currentPlayerId);
  const availableMint = currentPlayer?.mint ?? 0;
  const hasPendingPlacement = state.pendingTurn.placements.length > 0;

  const tempAgencyPending = state.pendingTurn.placements.find(
    (placement) => placement.locationId === "temp_agency",
  );

  return state.board.locations.map((location) => ({
    ...location.definition,
    runtimeId: location.id,
    ownerPlayerId: location.ownerPlayerId,
    occupiedByPlayerId: location.spaces.find((space) => space.occupiedByPlayerId)
      ?.occupiedByPlayerId,
    isOpen: location.isOpen,
    mintPlacementSpace: location.spaces.map((space) => {
      const pendingPlacement = state.pendingTurn.placements.find(
        (placement) =>
          placement.locationId === location.id && placement.spaceIndex === space.index,
      );
      const cost =
        space.printedCost === "*"
          ? pendingPlacement?.mintCount ?? space.occupiedMintCount ?? 0
          : space.printedCost === "1+"
          ? 1
          : Number(space.printedCost) || 0;

      const canAfford = availableMint >= cost;
      const occupied = Boolean(space.occupiedByPlayerId || pendingPlacement);
      const canUseWithTempAgency =
        Boolean(tempAgencyPending) &&
        location.id !== "temp_agency" &&
        Boolean(space.occupiedByPlayerId);
      const isClickable =
        state.phase === "action" &&
        location.isOpen &&
        ((canUseWithTempAgency || !space.occupiedByPlayerId || Boolean(pendingPlacement))) &&
        (pendingPlacement || !hasPendingPlacement || canUseWithTempAgency) &&
        (pendingPlacement ? true : canUseWithTempAgency || canAfford);

      return {
        displayValue: occupied
          ? (pendingPlacement?.mintCount ?? space.occupiedMintCount ?? space.printedCost)
          : space.printedCost,
        occupied,
        occupiedMintCount: pendingPlacement?.mintCount ?? space.occupiedMintCount,
        allowsOccupiedPlacement: space.printedCost === "*" || space.printedCost === "1+",
        requiresSelfPlacementFirst: space.printedCost === "1+",
        canAfford,
        isClickable,
        isPending: Boolean(pendingPlacement),
      };
    }),
  }));
};
