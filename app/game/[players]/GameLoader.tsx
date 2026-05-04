"use client";

import dynamic from "next/dynamic";

// `ssr: false` must live inside a Client Component — this wrapper satisfies that constraint
// while keeping page.tsx as a Server Component.
const GamePageClient = dynamic(() => import("./GamePageClient"), { ssr: false });

export default function GameLoader({ playerCount }: { playerCount: number }) {
  return <GamePageClient playerCount={playerCount} />;
}
