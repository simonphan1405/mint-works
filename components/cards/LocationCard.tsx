"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
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
  allowsOccupiedPlacement?: boolean;
  requiresSelfPlacementFirst?: boolean;
  canAfford?: boolean;
  isClickable?: boolean;
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
  onSpaceClick?: (spaceIndex: number, mintCount?: number, planId?: string) => void;
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
      <div
        className="absolute inset-0 opacity-[0.35] mix-blend-multiply pointer-events-none rounded-[12px]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
        }}
      />

      <div className="flex gap-[8px] w-full h-full relative z-10">
        <div className="w-[68px] bg-[#89AFA7] rounded-[6px] border border-[#7C9E96]/30 shadow-[inset_1px_1px_5px_rgba(0,0,0,0.1)] flex flex-col items-center justify-center py-2 relative overflow-visible">
          <div className="flex flex-col gap-[16px] items-center z-10">
            {mintPlacementSpace.map((space, i) => (
              <DottedCircle
                key={i}
                number={space.displayValue}
                occupied={space.occupied}
                occupiedMintCount={space.occupiedMintCount}
                planOptions={planOptions}
                allowsOccupiedPlacement={space.allowsOccupiedPlacement}
                requiresSelfPlacementFirst={space.requiresSelfPlacementFirst}
                isClickable={space.isClickable}
                onChange={(mintCount, planId) => onSpaceClick?.(i, mintCount, planId)}
              />
            ))}
          </div>

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

        <div className="flex-1 flex flex-col gap-[8px]">
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

          <div className="flex-1 bg-[#89AFA7] rounded-[6px] border border-[#7C9E96]/30 shadow-[inset_1px_1px_5px_rgba(0,0,0,0.1)] flex flex-col relative items-center justify-center">
            {effect && (
              <div className="mt-[-10px] flex flex-col items-center justify-center gap-0.5 w-full relative z-10 px-1">
                {renderEffectRow(effect)}
              </div>
            )}

            {flavorText && !ownerEffect && (
              <div className="absolute bottom-[10px] w-full text-center px-2">
                <span className="text-[#F1EAD7] opacity-90 font-dancing text-[10px] tracking-wide inline-block leading-none">
                  {flavorText}
                </span>
              </div>
            )}

            {ownerEffect && (
              <div className="absolute bottom-[2px] right-[2px] left-[2px] h-[28px]">
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

function PlanSelectModal({
  plans,
  onSelect,
  onClose,
}: {
  plans: PlanOption[];
  onSelect: (cost: number, planId: string) => void;
  onClose: () => void;
}) {
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, [onClose]);

  return createPortal(
    <div
      className="fixed inset-0 z-[9999] flex items-center justify-center"
      aria-modal="true"
      role="dialog"
      aria-label="Select a plan"
    >
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      />

      <div
        className="relative z-10 w-[340px] bg-[#1C1A17] border border-[#E9B04D]/30 rounded-[12px] shadow-[0_20px_60px_rgba(0,0,0,0.8)] overflow-hidden"
        style={{ animation: "fadeInScale 0.18s ease-out" }}
      >
        <div className="flex items-center justify-between px-5 py-3.5 border-b border-white/10 bg-[#E9B04D]/5">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-[#E9B04D] shadow-[0_0_6px_#E9B04D]" />
            <span className="text-[#E9B04D] font-oswald text-sm tracking-widest uppercase">
              Select Plan
            </span>
          </div>
          <button
            onClick={onClose}
            className="w-6 h-6 flex items-center justify-center rounded-full text-white/30 hover:text-white/70 hover:bg-white/10 transition-all duration-150"
            aria-label="Close"
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5} className="w-3.5 h-3.5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <p className="px-5 pt-3 pb-1 text-white/40 text-xs font-sans tracking-wide">
          Place mints equal to the selected plan&apos;s cost.
        </p>

        <div className="px-3 pb-3 pt-1 flex flex-col gap-1 max-h-[320px] overflow-y-auto">
          {plans.length === 0 ? (
            <div className="px-3 py-4 text-center text-white/30 font-oswald text-sm tracking-wide">
              No plans in the supply
            </div>
          ) : (
            plans.map((plan) => (
              <button
                key={plan.id}
                onClick={() => onSelect(plan.cost, plan.id)}
                className="group w-full flex items-center justify-between px-4 py-3 rounded-[8px] bg-white/5 hover:bg-[#E9B04D]/10 border border-transparent hover:border-[#E9B04D]/30 transition-all duration-200 text-left"
              >
                <span className="text-[#EAE3CE] font-oswald text-base tracking-wide group-hover:text-[#E9B04D] transition-colors">
                  {plan.name}
                </span>
                <div className="flex items-center gap-2 shrink-0">
                  <span className="text-white/40 font-oswald text-xs tracking-widest uppercase">
                    Cost
                  </span>
                  <MintTokenGroup count={plan.cost} size="sm" />
                </div>
              </button>
            ))
          )}
        </div>
      </div>

      <style>{`
        @keyframes fadeInScale {
          from { opacity: 0; transform: scale(0.94); }
          to   { opacity: 1; transform: scale(1); }
        }
      `}</style>
    </div>,
    document.body,
  );
}

export const DottedCircle = ({
  number,
  occupied = false,
  occupiedMintCount,
  planOptions = [],
  onChange,
  requiresSelfPlacementFirst = false,
  isClickable = true,
}: {
  number: string | number;
  occupied?: boolean;
  occupiedMintCount?: number;
  planOptions?: PlanOption[];
  onChange?: (mintCount?: number, planId?: string) => void;
  allowsOccupiedPlacement?: boolean;
  requiresSelfPlacementFirst?: boolean;
  isClickable?: boolean;
}) => {
  const isWildcard = number === "*" || number === "1+";
  const usesPlanSelection = number === "*";
  const fixedCount = isWildcard ? 0 : (parseInt(String(number), 10) || 1);

  const [state, setState] = useState<DottedCircleState>("empty");
  const [occupiedCount, setOccupiedCount] = useState(occupiedMintCount ?? 0);
  const currentState: DottedCircleState = occupied ? "occupied" : state;

  const handleClick = () => {
    if (!isClickable && !occupied) {
      return;
    }

    if (!isWildcard) {
      if (!occupied) {
        onChange?.();
      }
      return;
    }

    if (requiresSelfPlacementFirst) {
      if (!occupied) {
        setState("occupied");
        setOccupiedCount(1);
        onChange?.(1);
      }
      return;
    }

    if (currentState === "empty") {
      setState("selecting");
    }
  };

  const handleSelectPlan = (cost: number, planId: string) => {
    setOccupiedCount(cost);
    setState("occupied");
    onChange?.(cost, planId);
  };

  const handleCloseModal = () => {
    setState("empty");
  };

  const count = isWildcard ? (occupied ? (occupiedMintCount ?? occupiedCount) : occupiedCount) : fixedCount;
  const isOccupied = currentState === "occupied";
  const isSelecting = currentState === "selecting";

  return (
    <div className="relative flex items-center justify-center mx-auto">
      <div
        className={`w-[32px] h-[32px] rounded-full border-2 border-dotted flex items-center justify-center relative transition-all duration-200 ${
          isClickable && !isOccupied ? "cursor-pointer hover:scale-110" : "cursor-default"
        } ${
          isSelecting
            ? "border-[#E9B04D] scale-110"
            : isOccupied
            ? "border-[#EAE3CE]"
            : isClickable
            ? "border-[#EAE3CE]/80 hover:border-[#EAE3CE]"
            : "border-[#EAE3CE]/40 opacity-60"
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
              isSelecting ? "text-[#E9B04D]" : isClickable ? "text-[#EAE3CE]/90" : "text-[#EAE3CE]/45"
            } ${usesPlanSelection ? "mt-2" : "mb-0.5"}`}
          >
            {number}
          </span>
        )}
      </div>

      {usesPlanSelection && isSelecting && (
        <PlanSelectModal
          plans={planOptions}
          onSelect={handleSelectPlan}
          onClose={handleCloseModal}
        />
      )}
    </div>
  );
};
