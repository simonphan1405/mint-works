"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { FaUser, FaUsers, FaUserFriends } from "react-icons/fa";

interface GameStarterProps {
}

const PLAYER_OPTIONS = [
  { count: 1, label: "Solo", icon: FaUser, description: "Challenge the AI" },
  { count: 2, label: "2 Players", icon: FaUserFriends, description: "Classic Duel" },
  { count: 3, label: "3 Players", icon: FaUsers, description: "Triple Threat" },
  { count: 4, label: "4 Players", icon: FaUsers, description: "Full Table" },
];

export function GameStarter() {
  const router = useRouter();
  const [selected, setSelected] = useState<number | null>(null);

  return (
    <div className="min-h-screen bg-[#1C1A17] flex flex-col items-center justify-center p-6 relative overflow-hidden font-sans">
      {/* Background Glows */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-[#89AFA7]/10 rounded-full blur-[120px]" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-[#E9B04D]/10 rounded-full blur-[120px]" />

      {/* Content Container */}
      <div className="relative z-10 w-full max-w-4xl text-center space-y-12">
        {/* Title */}
        <div className="space-y-4 animate-fadeIn">
          <h1 className="font-oswald text-7xl md:text-8xl font-bold tracking-tighter text-[#EAE3CE] uppercase">
            Mint <span className="text-[#89AFA7]">Works</span>
          </h1>
          <p className="text-[#EAE3CE]/40 font-oswald text-lg tracking-widest uppercase">
            The Pocket-Sized Worker Placement Game
          </p>
        </div>

        {/* Player Selection Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 animate-fadeInStagger">
          {PLAYER_OPTIONS.map((opt) => (
            <button
              key={opt.count}
              onClick={() => setSelected(opt.count)}
              className={`group flex flex-col items-center p-8 rounded-2xl transition-all duration-500 border-2 ${
                selected === opt.count
                  ? "bg-[#89AFA7]/20 border-[#89AFA7] shadow-[0_0_30px_rgba(137,175,167,0.3)] scale-105"
                  : "bg-white/5 border-white/10 hover:bg-white/10 hover:border-white/20 hover:scale-105"
              }`}
            >
              <div
                className={`w-16 h-16 rounded-full flex items-center justify-center mb-4 transition-colors duration-500 ${
                  selected === opt.count
                    ? "bg-[#89AFA7] text-[#1C1A17]"
                    : "bg-[#2B2B2B] text-[#EAE3CE] group-hover:bg-[#89AFA7] group-hover:text-[#1C1A17]"
                }`}
              >
                <opt.icon className="w-8 h-8" />
              </div>
              <h3
                className={`font-oswald text-2xl font-bold mb-1 tracking-wide ${
                  selected === opt.count ? "text-[#89AFA7]" : "text-[#EAE3CE]"
                }`}
              >
                {opt.label}
              </h3>
              <p className="text-[#EAE3CE]/40 text-sm font-medium tracking-tight uppercase">
                {opt.description}
              </p>
            </button>
          ))}
        </div>

        {/* Start Action */}
        <div className="pt-8 h-24 flex items-center justify-center">
          {selected !== null && (
            <button
              onClick={() => router.push(`/game/${selected}`)}
              className="px-12 py-5 rounded-xl bg-[#89AFA7] text-[#1C1A17] font-oswald text-2xl font-bold tracking-widest uppercase shadow-[0_0_40px_rgba(137,175,167,0.4)] hover:shadow-[0_0_60px_rgba(137,175,167,0.6)] hover:scale-110 active:scale-95 transition-all duration-300 animate-slideUpFade"
            >
              Start Game
            </button>
          )}
        </div>
      </div>

      {/* Decorative Icons in background */}
      <div className="absolute top-1/4 right-[5%] opacity-[0.03] rotate-12 scale-[3.0] pointer-events-none">
        <FaUser className="text-white" />
      </div>
      <div className="absolute bottom-1/4 left-[5%] opacity-[0.03] -rotate-12 scale-[3.0] pointer-events-none">
        <FaUsers className="text-white" />
      </div>

      <style jsx global>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(-20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes slideUpFade {
          from { opacity: 0; transform: translateY(30px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fadeIn {
          animation: fadeIn 0.8s ease-out forwards;
        }
        .animate-slideUpFade {
          animation: slideUpFade 0.5s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }
      `}</style>
    </div>
  );
}
