import { LocationCard } from "../components/LocationCard";
import { locations } from "../data/locations";

export default function Home() {
  return (
    <div className="flex flex-wrap items-center justify-center bg-[#2B2B2B] min-h-screen font-sans gap-8 py-12">
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
  );
}
