import { MintTokenGroup } from "./MintTokenGroup";
import { parseTextWithIcons } from "../../lib/textParser";
import { PlanData } from "../../data/cards/plans";
import { FaLeaf, FaHammer, FaScroll, FaScrewdriver } from "react-icons/fa";
import { getPlanIcon } from "../../lib/planIconMapper";

const typeConfig = {
  Culture: { bg: "bg-[#B2C65A]", border: "border-[#A1B846]/40" },
  Production: { bg: "bg-[#D17D73]", border: "border-[#BC6B61]/40" },
  Utility: { bg: "bg-[#E9B04D]", border: "border-[#D39B3C]/40" },
  Deed: { bg: "bg-[#A9BDB9]", border: "border-[#92A7A3]/40" },
};

export function PlanCard({
  id,
  name,
  type,
  cost,
  effect,
  starValue,
}: PlanData) {
  const config = typeConfig[type] || typeConfig.Culture;

  return (
    <div
      className="w-[189px] h-[321px] bg-[#EAE3CE] rounded-[10px] p-2.5 flex flex-col border-[1.5px] border-[#2B2B2B] relative overflow-hidden shadow-xl"
      style={{ boxShadow: "2px 2px 8px rgba(0,0,0,0.3)" }}
    >
      {/* Background texture overlay */}
      <div
        className="absolute inset-0 opacity-[0.03] pointer-events-none mix-blend-multiply"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
        }}
      />

      {/* Top Header Block */}
      <div
        className={`relative h-[48px] flex items-center justify-center ${config.bg} rounded-[8px] border ${config.border} shadow-[inset_1px_1px_5px_rgba(0,0,0,0.1)] z-10 w-full mb-1`}
      >
        {/* Type Badge overlapping top left */}
        <div className="absolute left-0 top-1/2 -translate-y-1/2 z-20">
          {type === "Culture" && (
            <FaLeaf className="w-7 h-7 drop-shadow-[2px_2px_3px_rgba(0,0,0,0.25)] text-white -rotate-30" />
          )}
          {type === "Production" && (
            <FaHammer className="w-7 h-7 drop-shadow-[2px_2px_3px_rgba(0,0,0,0.25)] text-white -rotate-30" />
          )}
          {type === "Utility" && (
            <FaScrewdriver className="w-7 h-7 drop-shadow-[2px_2px_3px_rgba(0,0,0,0.25)] text-white -rotate-30" />
          )}
          {type === "Deed" && (
            <FaScroll className="w-7 h-7 drop-shadow-[2px_2px_3px_rgba(0,0,0,0.25)] text-white" />
          )}
        </div>

        <h1 className="text-center text-[#233532] text-xl font-medium tracking-[0.03em] font-oswald mt-[-4px] ml-3">
          {name}
        </h1>
      </div>

      {/* Cost Token Block */}
      <div className="h-[44px] w-full flex items-center justify-center z-10 shrink-0">
        <MintTokenGroup count={cost} size="sm" />
      </div>

      {/* Main Body Block */}
      <div
        className={`flex-1 ${config.bg} rounded-[8px] border ${config.border} shadow-[inset_1px_1px_5px_rgba(0,0,0,0.1)] flex flex-col items-center pb-1.5 pt-2.5 px-2 relative z-10 w-full overflow-hidden`}
      >
        {/* Shared Workspace for Icon and Action Text */}
        <div className="flex-1 flex flex-col items-center justify-center w-full min-h-0 mb-2 gap-1">
          {/* Large Vector Icon (Center) */}
          <div className="flex-1 min-h-0 flex items-center justify-center w-full">
            {getPlanIcon(
              id,
              `w-full h-full ${effect ? "max-w-[55px] max-h-[55px]" : "max-w-[85px] max-h-[85px]"} drop-shadow-[2px_2px_2px_rgba(0,0,0,0.15)] text-[#fdfdfd] opacity-90 mix-blend-plus-lighter`,
            )}
          </div>

          {/* Action Text */}
          {effect && (
            <div className="flex-1 min-h-0 flex items-center justify-center w-full text-center text-[#233532] leading-[1.1] px-1 mt-1">
              <span className="text-[11px] font-oswald tracking-[0.01em] align-middle">
                {parseTextWithIcons(
                  effect,
                  "scale-[0.5] origin-center -my-[6px] mx-[-10px]",
                  "md",
                )}
              </span>
            </div>
          )}
        </div>

        {/* Points Overlay / Footer */}
        {starValue && (
          <div className="text-center text-[#233532] mt-auto">
            <span className="text-sm font-oswald font-normal tracking-[0.02em] align-middle">
              {parseTextWithIcons(starValue, "", "sm")}
            </span>
          </div>
        )}
      </div>
    </div>
  );
}
