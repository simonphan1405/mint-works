import { MintTokenGroup } from "./MintTokenGroup";
import { parseTextWithIcons } from "../utils/textParser";
import { LeafIcon } from "./LeafIcon";
import { PlanData } from "../data/plans";
import {
  GiWindmill,
  GiStoneBridge,
  GiStoneBust,
  GiBank,
  GiGreekTemple,
  GiFlowers,
} from "react-icons/gi";

const getPlanIcon = (id: string, className: string) => {
  switch (id) {
    case "windmill":
      return <GiWindmill className={className} />;
    case "statue":
      return <GiStoneBust className={className} />;
    case "gallery":
      return <GiBank className={className} />;
    case "bridge":
      return <GiStoneBridge className={className} />;
    case "museum":
      return <GiGreekTemple className={className} />;
    case "gardens":
      return <GiFlowers className={className} />;
    default:
      return null;
  }
};

export function PlanCard({
  id,
  title,
  cost,
  flavorText,
  actionText,
  pointsText,
}: PlanData) {
  return (
    <div
      className="w-[300px] h-[420px] bg-[#EAE3CE] rounded-[15px] p-4 flex flex-col border-[1.5px] border-[#2B2B2B] relative overflow-hidden shadow-xl"
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
      <div className="relative h-[65px] flex items-center justify-center bg-[#B2C65A] rounded-[10px] border border-[#A1B846]/40 shadow-[inset_1px_1px_5px_rgba(0,0,0,0.1)] z-10 w-full mb-1">
        {/* Leaf Badge overlapping top left */}
        <div className="absolute -left-3 top-1/2 -translate-y-1/2 z-20">
          <LeafIcon className="w-[48px] h-[48px] drop-shadow-[2px_2px_3px_rgba(0,0,0,0.25)] origin-center -rotate-12" />
        </div>

        <h1 className="text-center text-[#233532] text-3xl font-medium tracking-[0.03em] font-oswald mt-[-6px] ml-4">
          {title}
        </h1>
      </div>

      {/* Cost Token Block */}
      <div className="h-[60px] w-full flex items-center justify-center z-10 shrink-0">
        <MintTokenGroup count={cost} />
      </div>

      {/* Main Body Block */}
      <div className="flex-1 bg-[#B2C65A] rounded-[10px] border border-[#A1B846]/40 shadow-[inset_1px_1px_5px_rgba(0,0,0,0.1)] flex flex-col items-center pb-2 pt-4 px-3 relative z-10 w-full overflow-hidden">
        {/* Shared Workspace for Icon and Action Text */}
        <div className="flex-1 flex flex-col items-center justify-center w-full min-h-0 mb-2 gap-1">
          {/* Large Vector Icon (Center) */}
          <div className="flex-1 min-h-0 flex items-center justify-center w-full">
            {getPlanIcon(
              id,
              `w-full h-full ${actionText ? "max-w-[85px] max-h-[85px]" : "max-w-[130px] max-h-[130px]"} drop-shadow-[2px_2px_2px_rgba(0,0,0,0.15)] text-[#fdfdfd] opacity-90 mix-blend-plus-lighter`,
            )}
          </div>

          {/* Action Text */}
          {actionText && (
            <div className="flex-1 min-h-0 flex items-center justify-center w-full text-center text-[#233532] leading-[1.1] px-1 mt-1">
              <span className="text-base font-oswald tracking-[0.01em] align-middle">
                {parseTextWithIcons(
                  actionText,
                  "scale-[0.75] origin-center -my-[8px] mx-[2px]",
                )}
              </span>
            </div>
          )}
        </div>

        {/* Flavor Text */}
        {flavorText && (
          <div className="text-center text-[#fdfdfd] text-base font-dancing leading-[1.1] mb-3 drop-shadow-[0px_1px_1px_rgba(0,0,0,0.15)] opacity-90">
            {flavorText}
          </div>
        )}

        {/* Points Overlay / Footer */}
        {pointsText && (
          <div className="text-center text-[#233532] mt-auto">
            <span className="text-lg font-oswald font-normal tracking-[0.02em] align-middle">
              {parseTextWithIcons(pointsText)}
            </span>
          </div>
        )}
      </div>
    </div>
  );
}
