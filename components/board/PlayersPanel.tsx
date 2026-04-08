import type { PlayerState } from "@/features/game/model/types";

export function PlayersPanel({
  players,
  currentPlayerId,
}: {
  players: PlayerState[];
  currentPlayerId: string;
}) {
  return (
    <section className="w-full border-t border-white/10 bg-[#15130F] px-6 py-4">
      <div className="flex items-center gap-3 mb-3">
        <span className="w-1.5 h-5 rounded-full bg-[#B2C65A]" />
        <h2 className="font-oswald text-lg tracking-widest uppercase text-[#B2C65A]">
          Players
        </h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-3">
        {players.map((player) => {
          const isCurrent = player.id === currentPlayerId;

          return (
            <div
              key={player.id}
              className={`rounded-xl border px-4 py-3 transition-all ${
                isCurrent
                  ? "border-[#89AFA7] bg-[#89AFA7]/10 shadow-[0_0_20px_rgba(137,175,167,0.15)]"
                  : "border-white/10 bg-white/5"
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <span className="font-oswald text-lg tracking-wide text-[#EAE3CE]">
                  {player.name}
                </span>
                {isCurrent && (
                  <span className="text-[10px] font-oswald tracking-[0.25em] uppercase text-[#89AFA7]">
                    Current
                  </span>
                )}
              </div>

              <div className="grid grid-cols-2 gap-y-2 text-sm">
                <span className="text-white/45 uppercase tracking-wide">Mint</span>
                <span className="text-[#EAE3CE] text-right">{player.mint}</span>

                <span className="text-white/45 uppercase tracking-wide">Workers</span>
                <span className="text-[#EAE3CE] text-right">
                  {player.workersAvailable}/{player.workersTotal}
                </span>

                <span className="text-white/45 uppercase tracking-wide">Placed</span>
                <span className="text-[#EAE3CE] text-right">{player.workersPlaced}</span>

                <span className="text-white/45 uppercase tracking-wide">Plans</span>
                <span className="text-[#EAE3CE] text-right">{player.planIds.length}</span>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
