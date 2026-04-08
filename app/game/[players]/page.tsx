import { GameBoard } from "../../../components/board/GameBoard";

export default async function Page({
  params,
}: {
  params: Promise<{ players: string }>;
}) {
  const { players } = await params;
  const playerCount = parseInt(players, 10) || 2;

  return <GameBoard initialPlayers={playerCount} />;
}
