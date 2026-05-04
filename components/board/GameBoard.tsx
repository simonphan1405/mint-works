"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { FaChevronLeft } from "react-icons/fa";
import { LocationCard, PlanOption, SpaceOption } from "../cards/LocationCard";
import { PlanCard } from "../cards/PlanCard";
import { PlayersPanel } from "./PlayersPanel";
import type { PlanData } from "@/data/cards/plans";
import type { ClaimedPlanRecord } from "@/features/plans/plansSlice";
import type {
  GamePhase,
  LocationCardViewModel,
  PendingTurnState,
  PlayerState,
  TurnLogEntry,
} from "@/features/game/model/types";

export interface GameBoardProps {
  players: number;
  seed: number;
  phase: GamePhase;
  round: number;
  winnerPlayerId?: string;
  lastAction?: string;
  log: TurnLogEntry[];
  pendingTurn: PendingTurnState;
  activeLocations: LocationCardViewModel[];
  activePlans: PlanData[];
  claimedPlans: ClaimedPlanRecord[];
  remainingPlanCount: number;
  playerStates: PlayerState[];
  currentPlayerId: string;
  onResetBoard: () => void;
  onToggleLocationSpace: (
    locationId: string,
    spaceIndex: number,
    mintCount?: number,
  ) => void;
  onRequestPassTurn: () => void;
  onConfirmTurn: () => void;
  onClearPendingTurn: () => void;
  onClaimPlan: (planId: string, playerId: string) => void;
}

export function GameBoard({
  players,
  seed,
  phase,
  round,
  winnerPlayerId,
  lastAction,
  log,
  pendingTurn,
  activeLocations,
  activePlans,
  claimedPlans,
  remainingPlanCount,
  playerStates,
  currentPlayerId,
  onResetBoard,
  onToggleLocationSpace,
  onRequestPassTurn,
  onConfirmTurn,
  onClearPendingTurn,
  onClaimPlan,
}: GameBoardProps) {
  const [confirmReset, setConfirmReset] = useState(false);

  const currentPlayer = playerStates.find((player) => player.id === currentPlayerId);
  const winner = playerStates.find((player) => player.id === winnerPlayerId);
  const currentPlayerClaimedPlans = useMemo(
    () => claimedPlans.filter((record) => record.playerId === currentPlayerId),
    [claimedPlans, currentPlayerId],
  );
  const hasPendingChanges = pendingTurn.passRequested || pendingTurn.placements.length > 0;
  const pendingMint = pendingTurn.placements.reduce((total, placement) => total + placement.mintCount, 0);

  return (
    <div className="min-h-screen bg-[#1C1A17] flex flex-col font-sans">
      <header className="flex items-center justify-between px-8 py-4 border-b border-white/10 bg-[#16140F]/80 backdrop-blur shrink-0">
        <div className="flex items-center gap-6">
          <Link
            href="/"
            className="group flex items-center justify-center w-10 h-10 rounded-full bg-white/5 border border-white/10 text-[#EAE3CE]/60 hover:text-[#EAE3CE] hover:border-white/30 hover:bg-white/10 transition-all duration-200"
            title="Back to Selection"
          >
            <FaChevronLeft className="w-4 h-4 transition-transform group-hover:-translate-x-0.5" />
          </Link>

          <div className="flex items-center gap-3">
            <span className="w-2.5 h-2.5 rounded-full bg-[#B2C65A] shadow-[0_0_8px_#B2C65A]" />
            <h1 className="font-oswald text-2xl font-semibold tracking-wide text-[#EAE3CE] uppercase">
              Mint Works
            </h1>
            <span className="text-white/30 text-sm font-oswald tracking-widest uppercase italic">
              — Game Board —
            </span>
          </div>
        </div>

        <div className="flex items-center gap-4 flex-wrap justify-end">
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-[6px] bg-[#89AFA7]/10 border border-[#89AFA7]/20">
            <span className="text-[#89AFA7] text-xs font-oswald tracking-widest uppercase">
              Players
            </span>
            <span className="text-[#EAE3CE] font-oswald text-lg font-bold">
              {players}
            </span>
          </div>

          <div className="flex items-center gap-2 px-3 py-1.5 rounded-[6px] bg-[#89AFA7]/10 border border-[#89AFA7]/20">
            <span className="text-[#89AFA7] text-xs font-oswald tracking-widest uppercase">
              Round
            </span>
            <span className="text-[#EAE3CE] font-oswald text-lg font-bold">
              {round}
            </span>
          </div>

          <div className="flex items-center gap-2 px-3 py-1.5 rounded-[6px] bg-[#B2C65A]/10 border border-[#B2C65A]/20">
            <span className="text-[#B2C65A] text-xs font-oswald tracking-widest uppercase">
              Phase
            </span>
            <span className="text-[#EAE3CE] font-oswald text-lg font-bold uppercase">
              {phase}
            </span>
          </div>

          <div className="flex items-center gap-2 px-3 py-1.5 rounded-[6px] bg-[#E9B04D]/10 border border-[#E9B04D]/20">
            <span className="text-[#E9B04D] text-xs font-oswald tracking-widest uppercase">
              Remaining
            </span>
            <span className="text-[#EAE3CE] font-oswald text-lg font-bold">
              {remainingPlanCount}
            </span>
          </div>

          {confirmReset ? (
            <div className="flex items-center gap-2">
              <span className="text-[#EAE3CE]/50 font-oswald text-sm tracking-wider uppercase">
                Reset board?
              </span>
              <button
                id="reset-confirm-btn"
                onClick={() => {
                  onResetBoard();
                  setConfirmReset(false);
                }}
                className="flex items-center gap-1.5 px-3 py-2 rounded-[6px] bg-red-500/20 border border-red-400/50 text-red-300 hover:bg-red-500/30 hover:border-red-400 transition-all duration-200 font-oswald text-sm tracking-wider uppercase"
              >
                Yes
              </button>
              <button
                id="reset-cancel-btn"
                onClick={() => setConfirmReset(false)}
                className="flex items-center gap-1.5 px-3 py-2 rounded-[6px] bg-[#2B2B2B] border border-white/10 text-[#EAE3CE]/60 hover:text-[#EAE3CE] hover:border-white/30 transition-all duration-200 font-oswald text-sm tracking-wider uppercase"
              >
                No
              </button>
            </div>
          ) : (
            <button
              id="reset-btn"
              onClick={() => setConfirmReset(true)}
              className="flex items-center gap-2 px-4 py-2 rounded-[6px] bg-[#2B2B2B] border border-white/10 text-[#EAE3CE]/70 hover:text-[#EAE3CE] hover:border-white/30 transition-all duration-200 font-oswald text-sm tracking-wider uppercase"
            >
              Reset
            </button>
          )}
        </div>
      </header>

      <main className="h-[calc(100vh-130px)] min-h-0 flex gap-0 overflow-hidden items-stretch">
        <section className="w-[55%] h-full self-stretch min-w-0 p-6 overflow-hidden border-r border-white/10 flex flex-col gap-4">
          <div className="rounded-xl border border-white/10 bg-black/15 p-4 shrink-0">
            <div className="flex items-center justify-between gap-4 flex-wrap">
              <div>
                <div className="text-[#89AFA7] font-oswald text-xs tracking-[0.3em] uppercase mb-1">
                  Turn status
                </div>
                <div className="text-[#EAE3CE] font-oswald text-xl">
                  {winner
                    ? `${winner.name} wins!`
                    : currentPlayer
                    ? `${currentPlayer.name} drafting turn`
                    : "Waiting..."}
                </div>
                {lastAction && (
                  <div className="text-white/55 text-sm mt-1 max-w-[520px]">{lastAction}</div>
                )}
              </div>
              {currentPlayer && !winner && (
                <div className="text-right">
                  <div className="text-white/35 uppercase tracking-[0.2em] text-xs">Current mint</div>
                  <div className="text-[#E9B04D] font-oswald text-2xl">{currentPlayer.mint}</div>
                  <div className="text-white/35 uppercase tracking-[0.2em] text-xs mt-1">Pending spend</div>
                  <div className="text-[#EAE3CE] font-oswald text-lg">{pendingMint}</div>
                </div>
              )}
            </div>

            {phase === "action" && !winner && (
              <div className="flex items-center gap-3 mt-4 flex-wrap">
                <button
                  onClick={onRequestPassTurn}
                  className="flex items-center gap-2 px-4 py-2 rounded-[6px] bg-[#89AFA7]/15 border border-[#89AFA7]/35 text-[#EAE3CE] hover:bg-[#89AFA7]/25 transition-all duration-200 font-oswald text-sm tracking-wider uppercase"
                >
                  {pendingTurn.passRequested ? "Pass requested" : "Pass turn"}
                </button>
                <button
                  onClick={onConfirmTurn}
                  disabled={!hasPendingChanges}
                  className={`flex items-center gap-2 px-4 py-2 rounded-[6px] font-oswald text-sm tracking-wider uppercase transition-all duration-200 ${
                    hasPendingChanges
                      ? "bg-[#E9B04D]/20 border border-[#E9B04D]/50 text-[#EAE3CE] hover:bg-[#E9B04D]/30"
                      : "bg-white/5 border border-white/10 text-white/30 cursor-not-allowed"
                  }`}
                >
                  Confirm end turn
                </button>
                <button
                  onClick={onClearPendingTurn}
                  disabled={!hasPendingChanges}
                  className={`flex items-center gap-2 px-4 py-2 rounded-[6px] font-oswald text-sm tracking-wider uppercase transition-all duration-200 ${
                    hasPendingChanges
                      ? "bg-white/5 border border-white/20 text-[#EAE3CE] hover:bg-white/10"
                      : "bg-white/5 border border-white/10 text-white/30 cursor-not-allowed"
                  }`}
                >
                  Undo all
                </button>
              </div>
            )}
          </div>

          <div className="flex items-center gap-2 mb-1 w-full shrink-0">
            <span className="w-1.5 h-5 rounded-full bg-[#89AFA7]" />
            <h2 className="font-oswald text-lg tracking-widest uppercase text-[#89AFA7]">
              Locations
            </h2>
            <span className="ml-auto text-white/30 font-oswald text-sm">
              {activeLocations.length} cards
            </span>
          </div>

          <div className="flex-1 min-h-0 overflow-y-auto overflow-x-hidden rounded-xl border border-white/10 bg-black/10 px-2 py-4">
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-4 xl:gap-6 justify-items-center content-start">
              {activeLocations.map((loc) => (
                <div key={`${loc.id}-${seed}`} className="animate-fadeIn">
                  <LocationCard
                    name={loc.name}
                    type={loc.type}
                    mintPlacementSpace={loc.mintPlacementSpace as SpaceOption[]}
                    playersText={loc.playersText}
                    flavorText={loc.flavorText}
                    effect={loc.effect}
                    ownerLabel={loc.ownerLabel}
                    ownerEffect={loc.ownerEffect}
                    planOptions={activePlans.map(
                      (p): PlanOption => ({
                        id: p.id,
                        name: p.name,
                        cost: p.cost,
                      }),
                    )}
                    onSpaceClick={(spaceIndex, mintCount) =>
                      onToggleLocationSpace(
                        loc.runtimeId,
                        spaceIndex,
                        mintCount,
                      )
                    }
                  />
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="w-[45%] h-full self-stretch min-w-0 p-6 bg-[#18160E] overflow-hidden">
          <div className="grid h-full min-h-0 grid-rows-[minmax(0,1.05fr)_minmax(0,0.95fr)_minmax(0,0.9fr)] gap-6">
            <div className="min-h-0 flex flex-col overflow-hidden">
              <div className="flex items-center gap-2 mb-5 w-full shrink-0">
                <span className="w-1.5 h-5 rounded-full bg-[#E9B04D]" />
                <h2 className="font-oswald text-lg tracking-widest uppercase text-[#E9B04D]">
                  Plan Supply
                </h2>
                <span className="ml-auto text-white/30 font-oswald text-sm">
                  {activePlans.length} open / {remainingPlanCount} remaining
                </span>
              </div>

              <div className="flex-1 min-h-0 overflow-y-auto overflow-x-hidden rounded-xl border border-white/10 bg-black/10 px-2 py-4">
                <div className="flex flex-row flex-wrap gap-4 items-start justify-center">
                  {activePlans.map((plan) => {
                    const disabled = phase !== "action" || !currentPlayer || hasPendingChanges;
                    return (
                      <button
                        key={`${plan.id}-${seed}`}
                        type="button"
                        disabled={disabled}
                        className={`animate-fadeIn text-left shrink-0 ${
                          disabled ? "opacity-50 cursor-not-allowed" : "transition-transform hover:scale-[1.02]"
                        }`}
                        onClick={() => currentPlayer && onClaimPlan(plan.id, currentPlayer.id)}
                        title="Claim this plan for the current player"
                      >
                        <PlanCard
                          id={plan.id}
                          name={plan.name}
                          type={plan.type}
                          cost={plan.cost}
                          effect={plan.effect}
                          starValue={plan.starValue}
                        />
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>

            <div className="min-h-0 flex flex-col overflow-hidden">
              <div className="flex items-center gap-2 mb-3 shrink-0">
                <span className="w-1.5 h-5 rounded-full bg-[#B2C65A]" />
                <h3 className="font-oswald text-base tracking-widest uppercase text-[#B2C65A]">
                  Current Player Plans
                </h3>
                <span className="ml-auto text-white/30 font-oswald text-sm">
                  {currentPlayerClaimedPlans.length}
                </span>
              </div>

              <div className="flex-1 min-h-0 overflow-y-auto overflow-x-hidden rounded-xl border border-white/10 bg-black/10 px-3 py-3">
                {currentPlayerClaimedPlans.length === 0 ? (
                  <div className="rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-white/40 text-sm">
                    Người chơi hiện tại chưa có claimed plan nào.
                  </div>
                ) : (
                  <div className="space-y-2 pr-1">
                    {currentPlayerClaimedPlans.map((record, index) => (
                      <div
                        key={`${record.playerId}-${record.plan.id}-${index}`}
                        className="rounded-xl border border-white/10 bg-white/5 px-4 py-3 flex items-center justify-between gap-3"
                      >
                        <div>
                          <div className="text-[#EAE3CE] font-oswald text-base tracking-wide">
                            {record.plan.name}
                          </div>
                          <div className="text-white/40 text-xs uppercase tracking-[0.2em] mt-1">
                            Cost {record.plan.cost}
                          </div>
                        </div>
                        <div className="text-right text-white/50 text-xs uppercase tracking-[0.2em]">
                          {record.plan.type}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            <div className="min-h-0 flex flex-col overflow-hidden">
              <div className="flex items-center gap-2 mb-3 shrink-0">
                <span className="w-1.5 h-5 rounded-full bg-[#89AFA7]" />
                <h3 className="font-oswald text-base tracking-widest uppercase text-[#89AFA7]">
                  Action Log
                </h3>
                <span className="ml-auto text-white/30 font-oswald text-sm">
                  {log.length}
                </span>
              </div>

              <div className="flex-1 min-h-0 overflow-y-auto overflow-x-hidden rounded-xl border border-white/10 bg-black/10 px-3 py-3">
                {log.length === 0 ? (
                  <div className="rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-white/40 text-sm">
                    Chưa có hành động nào.
                  </div>
                ) : (
                  <div className="space-y-2 pr-1">
                    {log.map((entry) => (
                      <div
                        key={entry.id}
                        className="rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-[#EAE3CE] text-sm"
                      >
                        {entry.text}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </section>
      </main>

      <PlayersPanel players={playerStates} currentPlayerId={currentPlayerId} />
    </div>
  );
}
