"use client";

import { useState } from "react";
import Link from "next/link";
import { FaChevronLeft } from "react-icons/fa";
import { LocationCard, PlanOption, SpaceOption } from "../cards/LocationCard";
import { PlanCard } from "../cards/PlanCard";
import { PlayersPanel } from "./PlayersPanel";
import type { PlanData } from "@/data/cards/plans";
import type { ClaimedPlanRecord } from "@/features/plans/plansSlice";
import type {
  LocationCardViewModel,
  PlayerState,
} from "@/features/game/model/types";

export interface GameBoardProps {
  players: number;
  seed: number;
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
  onClaimPlan: (planId: string, playerId: string) => void;
}

export function GameBoard({
  players,
  seed,
  activeLocations,
  activePlans,
  claimedPlans,
  remainingPlanCount,
  playerStates,
  currentPlayerId,
  onResetBoard,
  onToggleLocationSpace,
  onClaimPlan,
}: GameBoardProps) {
  const [confirmReset, setConfirmReset] = useState(false);

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

        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-[6px] bg-[#89AFA7]/10 border border-[#89AFA7]/20">
            <span className="text-[#89AFA7] text-xs font-oswald tracking-widest uppercase">
              Players
            </span>
            <span className="text-[#EAE3CE] font-oswald text-lg font-bold">
              {players}
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
                <svg
                  className="w-3 h-3"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2.5}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M5 13l4 4L19 7"
                  />
                </svg>
                Yes
              </button>
              <button
                id="reset-cancel-btn"
                onClick={() => setConfirmReset(false)}
                className="flex items-center gap-1.5 px-3 py-2 rounded-[6px] bg-[#2B2B2B] border border-white/10 text-[#EAE3CE]/60 hover:text-[#EAE3CE] hover:border-white/30 transition-all duration-200 font-oswald text-sm tracking-wider uppercase"
              >
                <svg
                  className="w-3 h-3"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2.5}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
                No
              </button>
            </div>
          ) : (
            <button
              id="reset-btn"
              onClick={() => setConfirmReset(true)}
              className="flex items-center gap-2 px-4 py-2 rounded-[6px] bg-[#2B2B2B] border border-white/10 text-[#EAE3CE]/70 hover:text-[#EAE3CE] hover:border-white/30 transition-all duration-200 font-oswald text-sm tracking-wider uppercase"
            >
              <svg
                className="w-3.5 h-3.5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2.5}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0 3.181 3.183a8.25 8.25 0 0 0 13.803-3.7M4.031 9.865a8.25 8.25 0 0 1 13.803-3.7l3.181 3.182m0-4.991v4.99"
                />
              </svg>
              Reset
            </button>
          )}
        </div>
      </header>

      <main className="h-[calc(100vh-130px)] min-h-0 flex gap-0 overflow-hidden items-stretch">
        <section className="w-[55%] h-full self-stretch min-w-0 p-6 overflow-hidden border-r border-white/10 flex flex-col">
          <div className="flex items-center gap-2 mb-5 w-full shrink-0">
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
          <div className="grid h-full min-h-0 grid-rows-[minmax(0,1.2fr)_minmax(0,1fr)] gap-6">
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
                  {activePlans.map((plan) => (
                    <button
                      key={`${plan.id}-${seed}`}
                      type="button"
                      className="animate-fadeIn text-left transition-transform hover:scale-[1.02] shrink-0"
                      onClick={() => onClaimPlan(plan.id, currentPlayerId)}
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
                  ))}
                </div>
              </div>
            </div>

            <div className="min-h-0 flex flex-col overflow-hidden">
              <div className="flex items-center gap-2 mb-3 shrink-0">
                <span className="w-1.5 h-5 rounded-full bg-[#B2C65A]" />
                <h3 className="font-oswald text-base tracking-widest uppercase text-[#B2C65A]">
                  Claimed Plans
                </h3>
                <span className="ml-auto text-white/30 font-oswald text-sm">
                  {claimedPlans.length}
                </span>
              </div>

              <div className="flex-1 min-h-0 overflow-y-auto overflow-x-hidden rounded-xl border border-white/10 bg-black/10 px-3 py-3">
                {claimedPlans.length === 0 ? (
                  <div className="rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-white/40 text-sm">
                    Chưa có plan nào được lấy.
                  </div>
                ) : (
                  <div className="space-y-2 pr-1">
                    {claimedPlans.map((record, index) => (
                      <div
                        key={`${record.playerId}-${record.plan.id}-${index}`}
                        className="rounded-xl border border-white/10 bg-white/5 px-4 py-3 flex items-center justify-between gap-3"
                      >
                        <div>
                          <div className="text-[#EAE3CE] font-oswald text-base tracking-wide">
                            {record.plan.name}
                          </div>
                          <div className="text-white/40 text-xs uppercase tracking-[0.2em] mt-1">
                            {record.plan.type}
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-[#89AFA7] text-sm font-oswald uppercase tracking-[0.2em]">
                            {record.playerId}
                          </div>
                          <div className="text-white/40 text-xs mt-1">
                            Cost {record.plan.cost}
                          </div>
                        </div>
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
