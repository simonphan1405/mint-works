export interface PlanData {
  id: string;
  name: string;
  type: "Culture" | "Production" | "Utility" | "Deed";
  cost: number;
  effect?: string; // Text above flavor like "Counts as two [LEAF] Buildings" or "Upkeep: Add [MINT]..."
  starValue: string; // e.g. "[STAR]" or "[STAR][STAR]" or "[STAR] per [LEAF] Building"
}

export const plans: PlanData[] = [
  {
    id: "windmill",
    name: "Windmill",
    type: "Culture",
    cost: 1,
    starValue: "[STAR]",
  },
  {
    id: "museum",
    name: "Museum",
    type: "Culture",
    cost: 2,
    starValue: "[STAR] per [LEAF] Building",
  },

  {
    id: "gallery",
    name: "Gallery",
    type: "Culture",
    cost: 4,
    effect: "Upkeep: Add [MINT] from\nthe Mint Supply to Gallery",
    starValue: "[STAR] per [MINT] On Gallery",
  },
  {
    id: "bridge",
    name: "Bridge",
    type: "Culture",
    cost: 1,
    effect: "Counts as two [LEAF] Buildings",
    starValue: "",
  },
  {
    id: "statue",
    name: "Statue",
    type: "Culture",
    cost: 2,
    starValue: "[STAR_2]",
  },
  {
    id: "gardens",
    name: "Gardens",
    type: "Culture",
    cost: 3,
    starValue: "[STAR_3]",
  },
];
