export interface PlanData {
  id: string;
  title: string;
  cost: number;
  flavorText?: string;
  actionText?: string; // Text above flavor like "Counts as two [LEAF] Buildings" or "Upkeep: Add [MINT]..."
  pointsText: string; // e.g. "[STAR]" or "[STAR][STAR]" or "[STAR] per [LEAF] Building"
}

export const plans: PlanData[] = [
  {
    id: "windmill",
    title: "Windmill",
    cost: 1,
    flavorText: "Hey, it even works.",
    pointsText: "[STAR]",
  },
  {
    id: "statue",
    title: "Statue",
    cost: 2,
    flavorText: "Wow, that is nice!",
    pointsText: "[STAR_2]",
  },
  {
    id: "gallery",
    title: "Gallery",
    cost: 4,
    actionText: "Upkeep: Add [MINT] from\nthe Mint Supply to Gallery",
    flavorText: "Mints! Mints Galore!",
    pointsText: "[STAR] per [MINT] On Gallery",
  },
  {
    id: "bridge",
    title: "Bridge",
    cost: 1,
    actionText: "Counts as two [LEAF] Buildings",
    flavorText: "Woah, déjà vu...",
    pointsText: "",
  },
  {
    id: "museum",
    title: "Museum",
    cost: 2,
    flavorText: "Look at this wonderful piece.",
    pointsText: "[STAR] per [LEAF] Building",
  },
  {
    id: "gardens",
    title: "Gardens",
    cost: 3,
    flavorText: "Aren't they beautiful?",
    pointsText: "[STAR_3]",
  },
];
