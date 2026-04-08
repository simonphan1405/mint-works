import { useGameContext } from "@/features/game/state/GameProvider";

export function useGame() {
  return useGameContext();
}
