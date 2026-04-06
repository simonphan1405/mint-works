import React, { ReactNode } from "react";
import { TokenGroup } from "./TokenGroup";

export interface LocationCardProps {
  title: string;
  points: (string | number)[];
  playersText?: string;
  actionText?: string;
  tokensCount?: number;
  flavorText?: string;
  iconUrl?: string;
  ownerLabel?: string;
  ownerText?: string;
  ownerTokensCount?: number;
}

export function LocationCard({
  title,
  points,
  playersText = "Players 1 or 4",
  actionText,
  tokensCount = 0,
  flavorText,
  iconUrl,
  ownerLabel = "Upkeep:",
  ownerText,
  ownerTokensCount,
}: LocationCardProps) {
  return (
    <div
      className="w-[660px] h-[420px] bg-[#EAE3CE] rounded-[24px] shadow-2xl p-[18px] relative flex flex-col justify-center items-center shrink-0"
      style={{
        boxShadow:
          "0 20px 40px rgba(0,0,0,0.4), inset 0 0 60px rgba(180,165,135,0.4)",
      }}
    >
      {/* Subtle noise texture */}
      <div
        className="absolute inset-0 opacity-[0.35] mix-blend-multiply pointer-events-none rounded-[24px]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
        }}
      />

      {/* Card Content Grid */}
      <div className="flex gap-[16px] w-full h-full relative z-10">
        {/* Left Column - Players */}
        <div className="w-[145px] bg-[#89AFA7] rounded-[10px] border border-[#7C9E96]/30 shadow-[inset_1px_1px_5px_rgba(0,0,0,0.1)] flex flex-col items-center justify-center py-6 relative overflow-hidden">
          <div className="flex flex-col gap-[34px] items-center z-10">
            {points.map((pt, i) => (
              <DottedCircle key={i} number={pt} />
            ))}
          </div>

          {/* PLAYERS text */}
          {playersText && (
            <div
              className="absolute right-0.5 top-1/2 -translate-y-1/2 rotate-180 flex items-center justify-center opacity-60"
              style={{ writingMode: "vertical-rl" }}
            >
              <span className="text-[#EAE3CE] text-xs font-bold tracking-[0.25em] uppercase font-sans">
                {playersText}
              </span>
            </div>
          )}
        </div>

        {/* Right Column */}
        <div className="flex-1 flex flex-col gap-[16px]">
          {/* Header Row */}
          <div className="h-[82px] bg-[#89AFA7] rounded-[10px] border border-[#7C9E96]/30 shadow-[inset_1px_1px_5px_rgba(0,0,0,0.1)] flex items-center px-5 relative overflow-hidden">
            <div className="relative z-10 flex items-center w-full">
              {iconUrl ? (
                <img
                  src={iconUrl}
                  alt={title}
                  className="w-[46px] h-[46px] object-contain drop-shadow-md ml-1"
                />
              ) : (
                <WreathIcon className="w-[46px] h-[46px] drop-shadow-md ml-1" />
              )}
              <h1 className="flex-1 text-center text-[#233532] text-4xl font-medium tracking-[0.03em] uppercase font-[family-name:var(--font-oswald)] mt-[-4px]">
                {title}
              </h1>
            </div>
          </div>

          {/* Main Content Area */}
          <div className="flex-1 bg-[#89AFA7] rounded-[10px] border border-[#7C9E96]/30 shadow-[inset_1px_1px_5px_rgba(0,0,0,0.1)] flex flex-col relative items-center justify-center">
            {/* Action */}
            {actionText && (
              <div className="mt-[-20px] text-center text-[#233532] px-[36px] leading-[1.2]">
                <span className="text-[36px] font-[family-name:var(--font-oswald)] font-light tracking-[0.02em] align-middle">
                  {actionText}
                </span>
                {tokensCount ? (
                  <span className="inline-block align-middle ml-2">
                    <TokenGroup count={tokensCount} />
                  </span>
                ) : null}
              </div>
            )}

            {/* Flavor text - Hidden if owner section exists to prevent collision */}
            {flavorText && !ownerText && (
              <div className="absolute bottom-[22px] w-full text-center px-4">
                <span className="text-[#F1EAD7] opacity-90 font-[family-name:var(--font-dancing)] text-base tracking-wide inline-block leading-none">
                  {flavorText}
                </span>
              </div>
            )}

            {/* Owner Section */}
            {ownerText && (
              <div className="absolute bottom-[4px] right-[4px] left-[4px] h-[58px]">
                {/* The OWNER tab */}
                <div
                  className="absolute right-[0px] top-[-28px] bg-[#E1EDEB] rounded-t-[8px] px-3 py-1 flex items-center justify-center z-10"
                  style={{
                    boxShadow: "inset 0 2px 4px rgba(255,255,255,0.8)",
                  }}
                >
                  <span className="font-[family-name:var(--font-oswald)] font-medium text-[#233532] text-[20px] leading-none uppercase tracking-[0.05em]">
                    Owner
                  </span>
                </div>
                {/* Main Upkeep box */}
                <div
                  className="absolute bottom-0 w-full h-full bg-[#E1EDEB] rounded-[6px] rounded-tr-none z-20 flex items-center justify-center gap-2"
                  style={{
                    boxShadow: "inset 0 2px 4px rgba(255,255,255,0.6)",
                  }}
                >
                  <div className="flex items-center gap-2">
                    <span className="text-[#233532] font-[family-name:var(--font-oswald)] text-[26px] tracking-wide inline-flex items-center">
                      <span className="font-semibold mr-1.5">{ownerLabel}</span>{" "}
                      {ownerText}
                    </span>
                    {ownerTokensCount ? (
                      <span className="inline-block align-middle ml-1">
                        <TokenGroup count={ownerTokensCount} />
                      </span>
                    ) : null}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export const WreathIcon = ({ className }: { className?: string }) => (
  <svg
    viewBox="0 0 100 100"
    className={className}
    fill="#fff"
    stroke="#222"
    strokeWidth="2.5"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M48 95 C 20 80, 5 45, 20 15" fill="none" />
    <path d="M52 95 C 80 80, 95 45, 80 15" fill="none" />
    <path d="M46 80 C 25 80, 15 65, 30 65 C 40 65, 45 75, 46 80 Z" />
    <path d="M38 65 C 15 55, 10 40, 25 40 C 35 40, 42 55, 38 65 Z" />
    <path d="M28 45 C 5 35, 5 15, 20 20 C 30 25, 32 40, 28 45 Z" />
    <path d="M20 25 C -5 10, 5 -5, 15 5 C 25 15, 22 25, 20 25 Z" />
    <path d="M54 80 C 75 80, 85 65, 70 65 C 60 65, 55 75, 54 80 Z" />
    <path d="M62 65 C 85 55, 90 40, 75 40 C 65 40, 58 55, 62 65 Z" />
    <path d="M72 45 C 95 35, 95 15, 80 20 C 70 25, 68 40, 72 45 Z" />
    <path d="M80 25 C 105 10, 95 -5, 85 5 C 75 15, 78 25, 80 25 Z" />
    <path d="M40 92 C 50 98, 50 98, 60 92" fill="none" strokeWidth="4" />
  </svg>
);

export const DottedCircle = ({ number }: { number: string | number }) => (
  <div className="w-[66px] h-[66px] rounded-full border-[3px] border-dotted border-[#EAE3CE] flex items-center justify-center opacity-90 mx-auto">
    <span
      className={`text-[#EAE3CE] text-[48px] font-[family-name:var(--font-oswald)] font-medium drop-shadow-sm leading-none ${number === "*" ? "mt-4" : "mb-1"}`}
    >
      {number}
    </span>
  </div>
);
