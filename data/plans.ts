export interface PlanData {
  id: string;
  title: string;
  cost: number;
  iconUrl: string; // The primary white-filled vector icon link
  flavorText?: string;
  actionText?: string; // Text above flavor like "Counts as two [LEAF] Buildings" or "Upkeep: Add [MINT]..."
  pointsText: string; // e.g. "[STAR]" or "[STAR][STAR]" or "[STAR] per [LEAF] Building"
}

export const plans: PlanData[] = [
  {
    id: "windmill",
    title: "Windmill",
    cost: 1,
    iconUrl:
      "https://user-images.githubusercontent.com/16616543/38887237-43bfbd5e-4246-11e8-9aa7-696acaddbf4a.png", // Placeholder
    flavorText: "Hey, it even works.",
    pointsText: "[STAR]",
  },
  {
    id: "statue",
    title: "Statue",
    cost: 2,
    iconUrl: "https://cdn-icons-png.freepik.com/512/1517/1517534.png", // Placeholder
    flavorText: "Wow, that is nice!",
    pointsText: "[STAR_2]",
  },
  {
    id: "gallery",
    title: "Gallery",
    cost: 4,
    iconUrl:
      "https://png.pngtree.com/png-vector/20230407/ourmid/pngtree-stage-line-icon-vector-png-image_6694138.png", // Placeholder
    actionText: "Upkeep: Add [MINT] from\nthe Mint Supply to Gallery",
    flavorText: "Mints! Mints Galore!",
    pointsText: "[STAR] per [MINT] On Gallery",
  },
  {
    id: "bridge",
    title: "Bridge",
    cost: 1,
    iconUrl:
      "https://cdn.creazilla.com/silhouettes/7967867/tower-bridge-silhouette-000000-lg.png", // Placeholder
    actionText: "Counts as two [LEAF] Buildings",
    flavorText: "Woah, déjà vu...",
    pointsText: "",
  },
  {
    id: "museum",
    title: "Museum",
    cost: 2,
    iconUrl: "https://static.thenounproject.com/png/3129-200.png", // Placeholder
    flavorText: "Look at this wonderful piece.",
    pointsText: "[STAR] per [LEAF] Building",
  },
  {
    id: "gardens",
    title: "Gardens",
    cost: 3,
    iconUrl:
      "https://png.pngtree.com/png-vector/20230407/ourmid/pngtree-garden-line-icon-vector-png-image_6680031.png", // Placeholder
    flavorText: "Aren't they beautiful?",
    pointsText: "[STAR_3]",
  },
];
