"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { FaChevronLeft } from "react-icons/fa";
import { LocationCard, PlanOption } from "../cards/LocationCard";
import { PlanCard } from "../cards/PlanCard";
import { locations, LocationData } from "../../data/cards/locations";
import { plans, PlanData } from "../../data/cards/plans";

// ─── helpers ──────────────────────────────────────────────────────────────────

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function pickLocations(playerCount: number): LocationData[] {
  // Core + Deed ordered slots, pick correct variant per player count
  const pick = (base: string) => {
    // Try to find a variant whose playersText matches, fallback to the first
    const variants = locations.filter((l) => l.id.startsWith(base));
    const match =
      variants.find((v) => {
        if (!v.playersText) return false;
        if (v.playersText.includes("1 or 4"))
          return playerCount === 1 || playerCount === 4;
        if (v.playersText.includes("2-3"))
          return playerCount === 2 || playerCount === 3;
        if (v.playersText.includes("Players 4")) return playerCount === 4;
        if (v.playersText.includes("Players 1-3")) return playerCount <= 3;
        return false;
      }) ?? variants[0];
    return match;
  };

  const coreOrdered: LocationData[] = [
    pick("producer"),
    pick("wholesaler"),
    pick("builder"),
    pick("supplier"),
    locations.find((l) => l.id === "leadership")!,
    locations.find((l) => l.id === "lotto")!,
  ].filter(Boolean);

  const advancedCount = playerCount === 1 ? 1 : 2;
  const advancedPool = locations.filter((l) => l.type === "Advanced");
  const randomAdvanced = shuffle(advancedPool).slice(0, advancedCount);

  return [...coreOrdered, ...randomAdvanced];
}

function pickPlans(playerCount: number): PlanData[] {
  const count = playerCount === 1 ? 2 : 3;
  // Use seed to re-shuffle when user clicks regenerate
  const shuffled = shuffle([...plans]);
  return shuffled.slice(0, count);
}

// ─── Component ────────────────────────────────────────────────────────────────

export interface GameBoardProps {
  initialPlayers: number;
}

export function GameBoard({ initialPlayers }: GameBoardProps) {
  const [players, setPlayers] = useState<number>(initialPlayers);
  const [seed, setSeed] = useState(0);
  const [confirmReset, setConfirmReset] = useState(false);

  const [activeLocations, setActiveLocations] = useState<LocationData[]>([]);
  const [activePlans, setActivePlans] = useState<PlanData[]>([]);

  useEffect(() => {
    setActiveLocations(pickLocations(players));
    setActivePlans(pickPlans(players));
  }, [players, seed]);

  return (
    <div className="min-h-screen bg-[#1C1A17] flex flex-col font-sans">
      {/* ── Top Bar ── */}
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
          {/* Player Display (Static) */}
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-[6px] bg-[#89AFA7]/10 border border-[#89AFA7]/20">
            <span className="text-[#89AFA7] text-xs font-oswald tracking-widest uppercase">
              Players
            </span>
            <span className="text-[#EAE3CE] font-oswald text-lg font-bold">
              {players}
            </span>
          </div>

          {/* Reset */}
          {confirmReset ? (
            <div className="flex items-center gap-2">
              <span className="text-[#EAE3CE]/50 font-oswald text-sm tracking-wider uppercase">
                Reset board?
              </span>
              <button
                id="reset-confirm-btn"
                onClick={() => { setSeed((s) => s + 1); setConfirmReset(false); }}
                className="flex items-center gap-1.5 px-3 py-2 rounded-[6px] bg-red-500/20 border border-red-400/50 text-red-300 hover:bg-red-500/30 hover:border-red-400 transition-all duration-200 font-oswald text-sm tracking-wider uppercase"
              >
                <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                </svg>
                Yes
              </button>
              <button
                id="reset-cancel-btn"
                onClick={() => setConfirmReset(false)}
                className="flex items-center gap-1.5 px-3 py-2 rounded-[6px] bg-[#2B2B2B] border border-white/10 text-[#EAE3CE]/60 hover:text-[#EAE3CE] hover:border-white/30 transition-all duration-200 font-oswald text-sm tracking-wider uppercase"
              >
                <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
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

      {/* ── Board ── */}
      <main className="flex-1 flex gap-0 overflow-hidden">
        {/* Left Part — Location Cards */}
        <section className="w-[55%] min-w-0 p-6 overflow-y-auto border-r border-white/10 flex flex-col items-center">
          <div className="flex items-center gap-2 mb-5">
            <span className="w-1.5 h-5 rounded-full bg-[#89AFA7]" />
            <h2 className="font-oswald text-lg tracking-widest uppercase text-[#89AFA7]">
              Locations
            </h2>
            <span className="ml-auto text-white/30 font-oswald text-sm">
              {activeLocations.length} cards
            </span>
          </div>

          <div className="grid grid-cols-2 gap-4 xl:gap-6 justify-items-center mt-4">
            {activeLocations.map((loc) => (
              <div
                key={`${loc.id}-${seed}`}
                className="animate-fadeIn"
              >
                <LocationCard
                  name={loc.name}
                  type={loc.type}
                  mintPlacementSpace={loc.mintPlacementSpace}
                  playersText={loc.playersText}
                  flavorText={loc.flavorText}
                  effect={loc.effect}
                  ownerLabel={loc.ownerLabel}
                  ownerEffect={loc.ownerEffect}
                  planOptions={activePlans.map((p): PlanOption => ({ id: p.id, name: p.name, cost: p.cost }))}
                />
              </div>
            ))}
          </div>
        </section>

        {/* Right Part — Plan Supply */}
        <section className="w-[45%] min-w-0 p-6 overflow-y-auto bg-[#18160E] flex flex-col items-center">
          <div className="flex items-center gap-2 mb-5">
            <span className="w-1.5 h-5 rounded-full bg-[#E9B04D]" />
            <h2 className="font-oswald text-lg tracking-widest uppercase text-[#E9B04D]">
              Plan Supply
            </h2>
            <span className="ml-auto text-white/30 font-oswald text-sm">
              {activePlans.length} cards
            </span>
          </div>

          <div className="flex flex-row flex-wrap gap-4 items-center justify-center mt-4">
            {activePlans.map((plan) => (
              <div
                key={`${plan.id}-${seed}`}
                className="animate-fadeIn"
              >
                <PlanCard
                  id={plan.id}
                  name={plan.name}
                  type={plan.type}
                  cost={plan.cost}
                  effect={plan.effect}
                  starValue={plan.starValue}
                />
              </div>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
}
