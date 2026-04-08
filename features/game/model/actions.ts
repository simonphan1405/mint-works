export type GameAction =
  | { type: "SETUP_GAME"; playerCount: number; seed?: number }
  | { type: "RESET_BOARD" }
  | {
      type: "TOGGLE_LOCATION_SPACE";
      locationId: string;
      spaceIndex: number;
      mintCount?: number;
    };
