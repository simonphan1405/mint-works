export interface LocationData {
  id: string;
  title: string;
  points: (string | number)[];
  playersText?: string;
  actionText: string;
  tokensCount: number;
  flavorText?: string;
  iconUrl?: string; // Supports external image paths
  ownerLabel?: string;
  ownerText?: string;
  ownerTokensCount?: number;
}

export const locations: LocationData[] = [
  {
    id: "producer-0",
    title: "PRODUCER",
    points: [1, 1, 1],
    playersText: "Players 1 or 4",
    actionText: "Gain",
    tokensCount: 2,
    flavorText: "There's never enough to go around.",
    iconUrl: "https://static.thenounproject.com/png/4221-200.png",
  },
  {
    id: "producer-1",
    title: "PRODUCER",
    points: [1, 1],
    playersText: "Players 2-3",
    actionText: "Gain",
    tokensCount: 2,
    flavorText: "There's never enough to go around.",
    iconUrl: "https://static.thenounproject.com/png/4221-200.png",
  },
  {
    id: "supplier-0",
    title: "SUPPLIER",
    points: ["*", "*"],
    playersText: "Players 1-3",
    actionText: "Gain a Plan from the Plan Supply",
    tokensCount: 0,
    flavorText: "Come, get your buildings here!",
    iconUrl: "https://static.thenounproject.com/png/4221-200.png",
  },
  {
    id: "supplier-1",
    title: "SUPPLIER",
    points: ["*", "*", "*"],
    playersText: "Players 4",
    actionText: "Gain a Plan from the Plan Supply",
    tokensCount: 0,
    flavorText: "Come, get your buildings here!",
    iconUrl: "https://static.thenounproject.com/png/4221-200.png",
  },
  {
    id: "builder-0",
    title: "BUILDER",
    points: [2, 2],
    playersText: "Players 1-3",
    actionText: "Build one of your Plans",
    tokensCount: 0,
    flavorText: "Your building 'em in, we put 'em up.",
    iconUrl: "https://static.thenounproject.com/png/4221-200.png",
  },
  {
    id: "builder-1",
    title: "BUILDER",
    points: [2, 2, 2],
    playersText: "Players 4",
    actionText: "Build one of your Plans",
    tokensCount: 0,
    flavorText: "Your building 'em in, we put 'em up.",
    iconUrl: "https://static.thenounproject.com/png/4221-200.png",
  },
  {
    id: "wholesaler",
    title: "WHOLESALER",
    points: [1],
    playersText: "BUILD DEED TO OPEN",
    actionText: "Gain",
    tokensCount: 2,
    iconUrl: "https://static.thenounproject.com/png/1783892-200.png",
    ownerLabel: "Upkeep:",
    ownerText: "If occupied, Gain",
    ownerTokensCount: 1,
  },
  {
    id: "lotto",
    title: "LOTTO",
    points: [3],
    playersText: "BUILD DEED TO OPEN",
    actionText: "Gain the top Plan from the Plan Deck",
    tokensCount: 0,
    iconUrl: "https://static.thenounproject.com/png/1783892-200.png",
    ownerLabel: "Upkeep:",
    ownerText: "If occupied, Gain",
    ownerTokensCount: 2,
  },
  {
    id: "leadership",
    title: "LEADERSHIP COUNCIL",
    points: [1],
    playersText: "",
    actionText: "Take the Starting Player Token and gain",
    tokensCount: 1,
    flavorText: "Hey! Listen!",
    iconUrl: "https://static.thenounproject.com/png/4221-200.png",
  },
];
