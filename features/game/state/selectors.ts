import type { GameState } from "@/features/game/model/types";

export const selectPlayerCount = (state: GameState) => state.board.playerCount;
export const selectLocations = (state: GameState) => state.board.locations;
export const selectPlanSupply = (state: GameState) => state.board.planSupply;
export const selectBoardSeed = (state: GameState) => state.board.seed;
