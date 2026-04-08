import { locations, type LocationData } from "@/data/cards/locations";
import { plans, type PlanData } from "@/data/cards/plans";
import type { GameBoardState } from "@/features/game/model/types";

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function pickLocations(playerCount: number): LocationData[] {
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

  const coreOrdered: LocationData[] = [
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

function pickPlans(playerCount: number): PlanData[] {
  const count = playerCount === 1 ? 2 : 3;
  return shuffle(plans).slice(0, count);
}

export function setupGame(playerCount: number, seed = Date.now()): GameBoardState {
  return {
    playerCount,
    seed,
    locations: pickLocations(playerCount),
    planSupply: pickPlans(playerCount),
  };
}
