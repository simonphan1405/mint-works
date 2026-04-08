export interface LocationData {
  id: string;
  name: string;
  type: "Core" | "Deed" | "Advanced";
  mintPlacementSpace: (string | number)[];
  playersText?: string;
  effect: string;
  flavorText?: string;
  ownerLabel?: string;
  ownerEffect?: string;
}

export const locations: LocationData[] = [
  {
    id: "producer-0",
    name: "PRODUCER",
    type: "Core",
    mintPlacementSpace: [1, 1, 1],
    playersText: "Players 1 or 4",
    effect: "Gain [MINT_2]",
    flavorText: "There's never enough to go around.",
  },
  {
    id: "producer-1",
    name: "PRODUCER",
    type: "Core",
    mintPlacementSpace: [1, 1],
    playersText: "Players 2-3",
    effect: "Gain [MINT_2]",
    flavorText: "There's never enough to go around.",
  },
  {
    id: "supplier-0",
    name: "SUPPLIER",
    type: "Core",
    mintPlacementSpace: ["*", "*"],
    playersText: "Players 1-3",
    effect: "Gain a Plan from the Plan Supply",
    flavorText: "Come, get your buildings here!",
  },
  {
    id: "supplier-1",
    name: "SUPPLIER",
    type: "Core",
    mintPlacementSpace: ["*", "*", "*"],
    playersText: "Players 4",
    effect: "Gain a Plan from the Plan Supply",
    flavorText: "Come, get your buildings here!",
  },
  {
    id: "builder-0",
    name: "BUILDER",
    type: "Core",
    mintPlacementSpace: [2, 2],
    playersText: "Players 1-3",
    effect: "Build one of your Plans",
    flavorText: "Your building 'em in, we put 'em up.",
  },
  {
    id: "builder-1",
    name: "BUILDER",
    type: "Core",
    mintPlacementSpace: [2, 2, 2],
    playersText: "Players 4",
    effect: "Build one of your Plans",
    flavorText: "Your building 'em in, we put 'em up.",
  },
  {
    id: "wholesaler",
    name: "WHOLESALER",
    type: "Deed",
    mintPlacementSpace: [1],
    playersText: "BUILD DEED TO OPEN",
    effect: "Gain [MINT_2]",
    ownerLabel: "Upkeep:",
    ownerEffect: "If occupied, Gain [MINT]",
  },
  {
    id: "lotto",
    name: "LOTTO",
    type: "Deed",
    mintPlacementSpace: [3],
    playersText: "BUILD DEED TO OPEN",
    effect: "Gain the top Plan from the Plan Deck",
    ownerLabel: "Upkeep:",
    ownerEffect: "If occupied, Gain [MINT_2]",
  },
  {
    id: "leadership",
    name: "LEADERSHIP COUNCIL",
    type: "Core",
    mintPlacementSpace: [1],
    playersText: "",
    effect: "Take the Starting Player Token and gain [MINT]",
    flavorText: "Hey! Listen!",
  },
  {
    id: "crowdfunder",
    name: "CROWDFUNDER",
    type: "Advanced",
    mintPlacementSpace: [1],
    playersText: "",
    effect: "Gain [MINT_3]\nEach other player gains [MINT]",
    flavorText: "We can all gain from this!",
  },
  {
    id: "recycler",
    name: "RECYCLER",
    type: "Advanced",
    mintPlacementSpace: [1],
    playersText: "",
    effect:
      "Lose a plan you own, then\ngain [MINT] equal to the sum of its\ncost and printed [STAR] value.",
    flavorText: "Nobody wanted that anyway...",
  },
  {
    id: "swap_meet",
    name: "SWAP MEET",
    type: "Advanced",
    mintPlacementSpace: [2],
    playersText: "",
    effect:
      "Exchange a Building or Plan\nin your Neighborhood with one\nfrom the Plan Supply.",
    flavorText: "I think I want that instead...",
  },
  {
    id: "temp_agency",
    name: "TEMP AGENCY",
    type: "Advanced",
    mintPlacementSpace: ["1+"],
    playersText: "",
    effect: "Use an occupied Location space",
    flavorText: "A little help here?",
  },
];
