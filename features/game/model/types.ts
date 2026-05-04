import type { LocationData } from "@/data/cards/locations";
import type { PlanData } from "@/data/cards/plans";

export type GamePhase = "setup" | "action" | "upkeep" | "gameEnd";

export interface PlayerBuildingState {
  id: string;
  name: string;
  type: PlanData["type"];
  cost: number;
  effect?: string;
  starValue: string;
  storedMint: number;
}

export interface PlayerState {
  id: string;
  name: string;
  mint: number;
  score: number;
  isStartingPlayer: boolean;
  planIds: string[];
  claimedPlans: PlanData[];
  buildingIds: string[];
  buildings: PlayerBuildingState[];
}

export interface LocationSpaceState {
  index: number;
  printedCost: string | number;
  occupiedByPlayerId?: string;
  occupiedMintCount?: number;
}

export interface BoardLocationState {
  id: string;
  definition: LocationData;
  spaces: LocationSpaceState[];
  ownerPlayerId?: string;
  isOpen: boolean;
}

export interface PendingPlacement {
  locationId: string;
  spaceIndex: number;
  mintCount: number;
}

export interface PendingTurnState {
  playerId: string;
  placements: PendingPlacement[];
  passRequested: boolean;
}

export interface GameBoardState {
  playerCount: number;
  seed: number;
  locations: BoardLocationState[];
}

export interface GameState {
  phase: GamePhase;
  round: number;
  currentPlayerId: string;
  actionStartPlayerId: string;
  consecutivePasses: number;
  pendingTurn: PendingTurnState;
  players: PlayerState[];
  board: GameBoardState;
  winnerPlayerId?: string;
  lastAction?: string;
}

export interface LocationCardSpaceViewModel {
  displayValue: string | number;
  occupied: boolean;
  occupiedMintCount?: number;
  allowsOccupiedPlacement?: boolean;
  requiresSelfPlacementFirst?: boolean;
  canAfford?: boolean;
  isClickable?: boolean;
  isPending?: boolean;
}

export interface LocationCardViewModel
  extends Omit<LocationData, "mintPlacementSpace"> {
  runtimeId: string;
  occupiedByPlayerId?: string;
  ownerPlayerId?: string;
  isOpen: boolean;
  mintPlacementSpace: LocationCardSpaceViewModel[];
}
