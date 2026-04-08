"use client";

import { useState, useRef, useEffect } from "react";
import { parseTextWithIcons } from "../../lib/textParser";
import { FaCrown, FaScroll, FaLightbulb } from "react-icons/fa";
import { MintTokenGroup } from "./MintTokenGroup";

export interface PlanOption {
  id: string;
  name: string;
  cost: number;
}

export interface SpaceOption {
  displayValue: string | number;
  occupied?: boolean;
  occupiedMintCount?: number;
}

export interface LocationCardProps {
  name: string;
  type: "Core" | "Deed" | "Advanced";
  mintPlacementSpace: SpaceOption[];
  playersText?: string;
  effect?: string;
  flavorText?: string;
  ownerLabel?: string;
  ownerEffect?: string;
  planOptions?: PlanOption[];
  onSpaceClick?: (spaceIndex: number, mintCount?: number) => void;
}

const renderEffectRow = (text: string) => (
  <div className="text-center text-[#233532] leading-[1.2]">
    <span className="text-[16px] font-oswald font-light tracking-[0.02em] align-middle">
      {parseTextWithIcons(text, "", "sm")}
    </span>
  </div>
);

export function LocationCard({
  name,
  type,
  mintPlacementSpace,
  playersText = "Players 1 or 4",
  effect,
  flavorText,
  ownerLabel = "Upkeep:",
  ownerEffect,
  planOptions = [],
  onSpaceClick,
}: LocationCardProps) {
  return (
    <div
      className="w-[321px] h-[189px] bg-[#EAE3CE] rounded-[12px] shadow-xl p-2.5 relative flex flex-col justify-center items-center shrink-0 overflow-visible"
      style={{
        boxShadow:
          "0 10px 20px rgba(0,0,0,0.3), inset 0 0 30px rgba(180,165,135,0.3)",
      }}
    >
      {/* Subtle noise texture */}
      <div
        className="absolute inset-0 opacity-[0.35] mix-blend-multiply pointer-events-none rounded-[12px]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
        }}
      />

      {/* Card Content Grid */}
      <div className="flex gap-[8px] w-full h-full relative z-10">
        {/* Left Column - Players */}
        <div className="w-[68px] bg-[#89AFA7] rounded-[6px] border border-[#7C9E96]/30 shadow-[inset_1px_1px_5px_rgba(0,0,0,0.1)] flex flex-col items-center justify-center py-2 relative overflow-visible">
          <div className="flex flex-col gap-[16px] items-center z-10">
            {mintPlacementSpace.map((space, i) => (
              <DottedCircle
                key={i}
                number={space.displayValue}
                occupied={space.occupied}
                occupiedMintCount={space.occupiedMintCount}
                planOptions={planOptions}
                onChange={(mintCount) => onSpaceClick?.(i, mintCount)}
              />
            ))}
          </div>

          {/* PLAYERS text */}
          {playersText && (
            <div
              className="absolute right-0 top-1/2 -translate-y-1/2 rotate-180 flex items-center justify-center opacity-60"
              style={{ writingMode: "vertical-rl" }}
            >
              <span className="text-[#EAE3CE] text-[6px] font-bold tracking-widest uppercase font-sans">
                {playersText}
              </span>
            </div>
          )}
        </div>

        {/* Right Column */}
        <div className="flex-1 flex flex-col gap-[8px]">
          {/* Header Row */}
          <div className="h-[40px] bg-[#89AFA7] rounded-[6px] border border-[#7C9E96]/30 shadow-[inset_1px_1px_5px_rgba(0,0,0,0.1)] flex items-center px-2.5 relative overflow-hidden">
            <div className="relative z-10 flex items-center w-full">
              {type === "Core" && (
                <FaCrown className="w-[22px] h-[22px] text-white drop-shadow-md ml-0.5" />
              )}
              {type === "Deed" && (
                <FaScroll className="w-[22px] h-[22px] text-white drop-shadow-md ml-0.5" />
              )}
              {type === "Advanced" && (
                <FaLightbulb className="w-[22px] h-[22px] text-white drop-shadow-md ml-0.5" />
              )}
              <h1 className="flex-1 text-center text-[#233532] text-md font-medium tracking-[0.02em] uppercase font-oswald mt-[-2px]">
                {name}
              </h1>
            </div>
          </div>

          {/* Main Content Area */}
          <div className="flex-1 bg-[#89AFA7] rounded-[6px] border border-[#7C9E96]/30 shadow-[inset_1px_1px_5px_rgba(0,0,0,0.1)] flex flex-col relative items-center justify-center">
            {/* Action */}
            {effect && (
              <div className="mt-[-10px] flex flex-col items-center justify-center gap-0.5 w-full relative z-10 px-1">
                {renderEffectRow(effect)}
              </div>
            )}

            {/* Flavor text - Hidden if owner section exists to prevent collision */}
            {flavorText && !ownerEffect && (
              <div className="absolute bottom-[10px] w-full text-center px-2">
                <span className="text-[#F1EAD7] opacity-90 font-dancing text-[10px] tracking-wide inline-block leading-none">
                  {flavorText}
                </span>
              </div>
            )}

            {/* Owner Section */}
            {ownerEffect && (
              <div className="absolute bottom-[2px] right-[2px] left-[2px] h-[28px]">
                {/* The OWNER tab */}
                <div
                  className="absolute right-0 top-[-18px] bg-[#E1EDEB] rounded-t-[4px] px-1.5 py-0.5 flex items-center justify-center z-10"
                  style={{
                    boxShadow: "inset 0 1px 2px rgba(255,255,255,0.8)",
                  }}
                >
                  <span className="font-oswald font-medium text-[#233532] text-[10px] leading-none uppercase tracking-[0.04em]">
                    Owner
                  </span>
                </div>
                {/* Main Upkeep box */}
                <div
                  className="absolute bottom-0 w-full h-full bg-[#E1EDEB] rounded-[4px] rounded-tr-none z-20 flex items-center justify-center px-1 py-4"
                  style={{
                    boxShadow: "inset 0 1px 2px rgba(255,255,255,0.6)",
                  }}
                >
                  <span className="text-[#233532] font-oswald text-[12px] tracking-wide inline-flex items-center whitespace-nowrap">
                    <span className="font-semibold mr-1">{ownerLabel}</span>{" "}
                    {parseTextWithIcons(ownerEffect, "", "sm")}
                  </span>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

type DottedCircleState = "empty" | "selecting" | "occupied";

export const DottedCircle = ({
  number,
  occupied = false,
  occupiedMintCount,
  planOptions = [],
  onChange,
}: {
  number: string | number;
  occupied?: boolean;
  occupiedMintCount?: number;
  planOptions?: PlanOption[];
  onChange?: (mintCount?: number) => void;
}) => {
  const isWildcard = number === "*" || number === "1+";
  const fixedCount = isWildcard ? 0 : (parseInt(String(number), 10) || 1);

  const [state, setState] = useState<DottedCircleState>(occupied ? "occupied" : "empty");
  const [occupiedCount, setOccupiedCount] = useState(occupiedMintCount ?? 0);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setState(occupied ? "occupied" : "empty");
    setOccupiedCount(occupiedMintCount ?? 0);
  }, [occupied, occupiedMintCount]);

  // Close dropdown when clicking outside
  useEffect(() => {
    if (state !== "selecting") return;
    const handler = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setState(occupied ? "occupied" : "empty");
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [occupied, state]);

  const handleClick = () => {
    if (!isWildcard) {
      const nextOccupied = state === "empty";
      setState(nextOccupied ? "occupied" : "empty");
      onChange?.();
      return;
    }
    // Wildcard: empty → selecting, occupied → empty
    if (state === "empty") setState("selecting");
    else if (state === "occupied") {
      setState("empty");
      setOccupiedCount(0);
      onChange?.();
    }
  };

  const handleSelectPlan = (cost: number) => {
    setOccupiedCount(cost);
    setState("occupied");
    onChange?.(cost);
  };

  const count = isWildcard ? occupiedCount : fixedCount;
  const isOccupied = state === "occupied";
  const isSelecting = state === "selecting";

  return (
    <div className="relative flex items-center justify-center mx-auto" ref={dropdownRef}>
      <div
        className={`w-[32px] h-[32px] rounded-full border-2 border-dotted flex items-center justify-center cursor-pointer relative transition-all duration-200 hover:scale-110 ${
          isSelecting
            ? "border-[#E9B04D] scale-110"
            : isOccupied
            ? "border-[#EAE3CE]"
            : "border-[#EAE3CE]/80 hover:border-[#EAE3CE]"
        }`}
        onClick={handleClick}
      >
        {isOccupied ? (
          <div className="absolute z-20 drop-shadow-lg pointer-events-none flex items-center justify-center scale-[0.8]">
            <MintTokenGroup count={count} size="sm" />
          </div>
        ) : (
          <span
            className={`text-[22px] font-oswald font-medium drop-shadow-sm leading-none ${
              isSelecting ? "text-[#E9B04D]" : "text-[#EAE3CE]/90"
            } ${number === "*" ? "mt-2" : "mb-0.5"}`}
          >
            {number}
          </span>
        )}
      </div>

      {/* Plan picker dropdown — only for wildcard spaces */}
      {isSelecting && (
        <div className="fixed z-9999 bg-[#1C1A17] border border-[#E9B04D]/40 rounded-[8px] shadow-[0_8px_24px_rgba(0,0,0,0.6)] overflow-hidden min-w-[160px]" style={{ top: dropdownRef.current ? dropdownRef.current.getBoundingClientRect().top + dropdownRef.current.getBoundingClientRect().height / 2 + 'px' : 0, left: dropdownRef.current ? dropdownRef.current.getBoundingClientRect().right + 8 + 'px' : 0, transform: 'translateY(-50%)' }}>
          <div className="px-3 py-1.5 border-b border-white/10">
            <span className="text-[#E9B04D] font-oswald text-[10px] tracking-widest uppercase">
              Select Plan
            </span>
          </div>
          {planOptions.length === 0 ? (
            <div className="px-3 py-2 text-white/40 font-oswald text-xs">
              No plans available
            </div>
          ) : (
            planOptions.map((plan) => (
              <button
                key={plan.id}
                onClick={(e) => { e.stopPropagation(); handleSelectPlan(plan.cost); }}
                className="w-full flex items-center justify-between px-3 py-2 hover:bg-[#E9B04D]/10 transition-colors duration-150 group gap-3"
              >
                <span className="text-[#EAE3CE] font-oswald text-sm group-hover:text-[#E9B04D] transition-colors whitespace-nowrap">
                  {plan.name}
                </span>
                <div className="flex items-center gap-1 shrink-0">
                  <MintTokenGroup count={plan.cost} size="xs" />
                </div>
              </button>
            ))
          )}
        </div>
      )}
    </div>
  );
};
