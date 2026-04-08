import { GameBoardContainer } from "@/components/board/GameBoardContainer";
import { createInitialPlansState } from "@/features/plans/plansSlice";
import { GameProvider } from "@/features/game/state/GameProvider";
import { createGameState } from "@/features/game/state/gameReducer";
import { ReduxProvider } from "@/store/ReduxProvider";

export default async function Page({
  params,
}: {
  params: Promise<{ players: string }>;
}) {
  const { players } = await params;
  const playerCount = parseInt(players, 10) || 2;
  const initialState = createGameState(playerCount);
  const preloadedReduxState = {
    plans: createInitialPlansState(playerCount),
  };

  return (
    <ReduxProvider preloadedState={preloadedReduxState}>
      <GameProvider initialState={initialState}>
        <GameBoardContainer />
      </GameProvider>
    </ReduxProvider>
  );
}
