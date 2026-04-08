export type GameAction =
  | { type: "SETUP_GAME"; playerCount: number; seed?: number }
  | { type: "RESET_BOARD" };
