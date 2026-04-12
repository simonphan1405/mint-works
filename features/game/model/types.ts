import type { LocationData } from "@/data/cards/locations";

export type GamePhase = "setup" | "ready" | "gameEnd";

export interface PlayerState {
  id: string;
  name: string;
  mint: number;
  workersTotal: number;
  workersAvailable: number;
  workersPlaced: number;
  score: number;
  isStartingPlayer: boolean;
  planIds: string[];
  buildingIds: string[];
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

export interface GameBoardState {
  playerCount: number;
  seed: number;
  locations: BoardLocationState[];
}

export interface GameState {
  phase: GamePhase;
  round: number;
  currentPlayerId: string;
  players: PlayerState[];
  board: GameBoardState;
}

export interface LocationCardSpaceViewModel {
  displayValue: string | number;
  occupied: boolean;
  occupiedMintCount?: number;
}

export interface LocationCardViewModel
  extends Omit<LocationData, "mintPlacementSpace"> {
  runtimeId: string;
  occupiedByPlayerId?: string;
  ownerPlayerId?: string;
  isOpen: boolean;
  mintPlacementSpace: LocationCardSpaceViewModel[];
}
