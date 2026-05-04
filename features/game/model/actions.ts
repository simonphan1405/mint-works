export type GameAction =
  | { type: "SETUP_GAME"; playerCount: number; seed?: number }
  | { type: "RESET_BOARD" }
  | {
      type: "TOGGLE_LOCATION_SPACE";
      locationId: string;
      spaceIndex: number;
      mintCount?: number;
    }
  | { type: "REQUEST_PASS_TURN" }
  | { type: "CONFIRM_TURN" }
  | { type: "CLEAR_PENDING_TURN" }
  | { type: "CLEAR_LOG" };
