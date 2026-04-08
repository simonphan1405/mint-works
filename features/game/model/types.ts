import type { LocationData } from "@/data/cards/locations";
import type { PlanData } from "@/data/cards/plans";

export type GamePhase = "setup" | "ready" | "gameEnd";

export interface GameBoardState {
  playerCount: number;
  seed: number;
  locations: LocationData[];
  planSupply: PlanData[];
}

export interface GameState {
  phase: GamePhase;
  board: GameBoardState;
}
