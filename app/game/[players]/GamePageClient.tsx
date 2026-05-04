"use client";

import { useMemo } from "react";
import { GameBoardContainer } from "@/components/board/GameBoardContainer";
import { GameProvider } from "@/features/game/state/GameProvider";
import { createGameState } from "@/features/game/state/gameReducer";

export default function GamePageClient({ playerCount }: { playerCount: number }) {
  const initialState = useMemo(() => createGameState(playerCount), [playerCount]);

  return (
    <GameProvider initialState={initialState}>
      <GameBoardContainer />
    </GameProvider>
  );
}
