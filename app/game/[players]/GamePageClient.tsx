"use client";

import { useMemo } from "react";
import { GameBoardContainer } from "@/components/board/GameBoardContainer";
import { createInitialPlansState } from "@/features/plans/plansSlice";
import { GameProvider } from "@/features/game/state/GameProvider";
import { createGameState } from "@/features/game/state/gameReducer";
import { ReduxProvider } from "@/store/ReduxProvider";

export default function GamePageClient({ playerCount }: { playerCount: number }) {
  const initialState = useMemo(() => createGameState(playerCount), [playerCount]);
  const preloadedReduxState = useMemo(
    () => ({ plans: createInitialPlansState(playerCount) }),
    [playerCount],
  );

  return (
    <ReduxProvider preloadedState={preloadedReduxState}>
      <GameProvider initialState={initialState}>
        <GameBoardContainer />
      </GameProvider>
    </ReduxProvider>
  );
}
