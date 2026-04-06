import { LocationCard } from "../components/LocationCard";
import { locations } from "../data/locations";
import { PlanCard } from "../components/PlanCard";
import { plans } from "../data/plans";

export default function Home() {
  return (
    <div className="flex flex-col items-center bg-[#2B2B2B] min-h-screen font-sans gap-12 py-12 px-8">
      {/* Location Cards */}
      <div className="w-full max-w-6xl">
        <h2 className="text-white text-3xl font-oswald mb-6 border-b border-white/20 pb-2">Location Cards</h2>
        <div className="flex flex-wrap items-center justify-center gap-8">
          {locations.map((loc) => (
            <LocationCard
              key={loc.id}
              title={loc.title}
              points={loc.points}
              playersText={loc.playersText}
              flavorText={loc.flavorText}
              actionText={loc.actionText}
              tokensCount={loc.tokensCount}
              iconUrl={loc.iconUrl}
              ownerLabel={loc.ownerLabel}
              ownerText={loc.ownerText}
              ownerTokensCount={loc.ownerTokensCount}
            />
          ))}
        </div>
      </div>

      {/* Plan Cards */}
      <div className="w-full max-w-6xl">
        <h2 className="text-white text-3xl font-oswald mb-6 border-b border-white/20 pb-2">Plan Cards</h2>
        <div className="flex flex-wrap items-center justify-center gap-8">
          {plans.map((plan) => (
            <PlanCard
              key={plan.id}
              id={plan.id}
              title={plan.title}
              cost={plan.cost}
              iconUrl={plan.iconUrl}
              actionText={plan.actionText}
              flavorText={plan.flavorText}
              pointsText={plan.pointsText}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
