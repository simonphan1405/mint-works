import { locations } from "@/data/cards/locations";
import type {
  BoardLocationState,
  GameBoardState,
  PlayerState,
} from "@/features/game/model/types";

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function pickLocations(playerCount: number) {
  const pick = (base: string) => {
    const variants = locations.filter((location) => location.id.startsWith(base));
    const match =
      variants.find((variant) => {
        if (!variant.playersText) return false;
        if (variant.playersText.includes("1 or 4")) {
          return playerCount === 1 || playerCount === 4;
        }
        if (variant.playersText.includes("2-3")) {
          return playerCount === 2 || playerCount === 3;
        }
        if (variant.playersText.includes("Players 4")) {
          return playerCount === 4;
        }
        if (variant.playersText.includes("Players 1-3")) {
          return playerCount <= 3;
        }
        return false;
      }) ?? variants[0];

    return match;
  };

  const coreOrdered = [
    pick("producer"),
    pick("wholesaler"),
    pick("builder"),
    pick("supplier"),
    locations.find((location) => location.id === "leadership")!,
    locations.find((location) => location.id === "lotto")!,
  ].filter(Boolean);

  const advancedCount = playerCount === 1 ? 1 : 2;
  const advancedPool = locations.filter((location) => location.type === "Advanced");
  const randomAdvanced = shuffle(advancedPool).slice(0, advancedCount);

  return [...coreOrdered, ...randomAdvanced];
}

function createBoardLocations(playerCount: number): BoardLocationState[] {
  return pickLocations(playerCount).map((definition) => ({
    id: definition.id,
    definition,
    ownerPlayerId: undefined,
    isOpen: definition.type !== "Deed",
    spaces: definition.mintPlacementSpace.map((printedCost, index) => ({
      index,
      printedCost,
      occupiedByPlayerId: undefined,
      occupiedMintCount: undefined,
    })),
  }));
}

export function createPlayers(playerCount: number): PlayerState[] {
  return Array.from({ length: playerCount }).map((_, index) => ({
    id: `p${index + 1}`,
    name: `Player ${index + 1}`,
    mint: 3,
    score: 0,
    isStartingPlayer: index === 0,
    planIds: [],
    claimedPlans: [],
    buildingIds: [],
    buildings: [],
  }));
}

export function setupGame(playerCount: number, seed = Date.now()): GameBoardState {
  return {
    playerCount,
    seed,
    locations: createBoardLocations(playerCount),
  };
}
