export interface LocationData {
  id: string;
  title: string;
  points: (string | number)[];
  playersText?: string;
  actionText: string;
  tokensCount: number;
  flavorText?: string;
  iconUrl?: string; // Supports external image paths
}

export const locations: LocationData[] = [
  {
    id: "producer",
    title: "PRODUCER",
    points: [1, 1, 1],
    playersText: "Players 1 or 4",
    actionText: "Gain",
    tokensCount: 2,
    flavorText: "There's never enough to go around.",
    iconUrl: "https://static.thenounproject.com/png/4221-200.png",
  },
  {
    id: "supplier",
    title: "SUPPLIER",
    points: ["*", "*"],
    playersText: "Players 1-3",
    actionText: "Gain a Plan from the Plan Supply",
    tokensCount: 0,
    flavorText: "Come, get your buildings here!",
    iconUrl: "https://static.thenounproject.com/png/4221-200.png",
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
  {
    id: "builder",
    title: "BUILDER",
    points: [2, 2],
    playersText: "Players 1-3",
    actionText: "Build one of your Plans",
    tokensCount: 0,
    flavorText: "Your building 'em in, we put 'em up.",
    iconUrl: "https://static.thenounproject.com/png/4221-200.png",
  },
];
