import { VICTORY_STAR_VALUE } from "@/constants/game";
import type { PlanData } from "@/data/cards/plans";
import type { GameAction } from "@/features/game/model/actions";
import type {
  BoardLocationState,
  GameState,
  LocationSpaceState,
  PendingPlacement,
  PendingTurnState,
  PlayerBuildingState,
  PlayerState,
} from "@/features/game/model/types";
import { createPlayers, setupGame } from "@/features/game/engine/setupGame";

function createEmptyPendingTurn(playerId: string): PendingTurnState {
  return {
    playerId,
    placements: [],
    passRequested: false,
  };
}

function parseStars(player: PlayerState): number {
  const leafBuildings = player.buildings.reduce((count, building) => {
    if (building.type === "Culture") {
      return count + (building.id === "bridge" ? 2 : 1);
    }

    return count;
  }, 0);

  const planCount = player.claimedPlans.length;

  return player.buildings.reduce((total, building) => {
    switch (building.id) {
      case "windmill":
      case "co-op":
      case "mine":
      case "truck":
      case "crane":
      case "wholesaler":
        return total + 1;
      case "statue":
      case "plant":
      case "workshop":
      case "lotto":
        return total + 2;
      case "gardens":
      case "factory":
      case "landfill":
        return total + 3;
      case "museum":
        return total + Math.max(0, leafBuildings - (player.buildings.some((b) => b.id === "landfill") ? 1 : 0));
      case "gallery":
        return total + building.storedMint;
      case "obelisk":
        return total + player.buildings.length;
      case "vault":
        return total + planCount * 2;
      default:
        return total;
    }
  }, 0);
}

function syncPlayerScores(players: PlayerState[]): PlayerState[] {
  return players.map((player) => ({
    ...player,
    score: parseStars(player),
  }));
}

function getNextPlayerId(players: PlayerState[], currentPlayerId: string) {
  const currentIndex = players.findIndex((player) => player.id === currentPlayerId);
  const nextIndex = currentIndex === -1 ? 0 : (currentIndex + 1) % players.length;
  return players[nextIndex]?.id ?? currentPlayerId;
}

function getStartingPlayerId(players: PlayerState[]) {
  return players.find((player) => player.isStartingPlayer)?.id ?? players[0]?.id ?? "p1";
}

function findLocation(state: GameState, locationId: string) {
  return state.board.locations.find((location) => location.id === locationId);
}

function findSpace(location: BoardLocationState | undefined, spaceIndex: number) {
  return location?.spaces.find((space) => space.index === spaceIndex);
}

function getSpaceCost(space: LocationSpaceState, actionMintCount?: number) {
  if (space.printedCost === "*") {
    return actionMintCount ?? 0;
  }

  if (space.printedCost === "1+") {
    return 1;
  }

  return Number(space.printedCost) || 0;
}

function clearAllLocationSpaces(state: GameState) {
  return state.board.locations.map((location) => ({
    ...location,
    spaces: location.spaces.map((space) => ({
      ...space,
      occupiedByPlayerId: undefined,
      occupiedMintCount: undefined,
    })),
  }));
}

function buildClaimedPlanForPlayer(player: PlayerState): {
  player: PlayerState;
  builtPlan?: PlanData;
} {
  const planToBuild = player.claimedPlans[0];

  if (!planToBuild || player.mint < planToBuild.cost) {
    return { player };
  }

  const building: PlayerBuildingState = {
    id: planToBuild.id,
    name: planToBuild.name,
    type: planToBuild.type,
    cost: planToBuild.cost,
    effect: planToBuild.effect,
    starValue: planToBuild.starValue,
    storedMint: 0,
  };

  return {
    builtPlan: planToBuild,
    player: {
      ...player,
      mint: player.mint - planToBuild.cost,
      claimedPlans: player.claimedPlans.slice(1),
      planIds: player.claimedPlans.slice(1).map((plan) => plan.id),
      buildings: [...player.buildings, building],
      buildingIds: [...player.buildingIds, building.id],
    },
  };
}

function applyLocationEffect(
  state: GameState,
  locationId: string,
  playerId: string,
): { players: PlayerState[]; boardLocations: BoardLocationState[]; message: string } {
  let players = state.players.map((player) => ({ ...player }));
  let boardLocations = state.board.locations.map((location) => ({
    ...location,
    spaces: location.spaces.map((space) => ({ ...space })),
  }));

  const playerIndex = players.findIndex((player) => player.id === playerId);
  if (playerIndex === -1) {
    return { players: state.players, boardLocations: state.board.locations, message: "" };
  }

  const player = players[playerIndex];
  let message = `${player.name} used ${locationId}.`;

  switch (locationId) {
    case "producer-0":
    case "producer-1":
    case "wholesaler":
      players[playerIndex] = { ...player, mint: player.mint + 2 };
      message = `${player.name} gains 2 mint.`;
      break;
    case "leadership":
      players = players.map((candidate) => ({
        ...candidate,
        isStartingPlayer: candidate.id === playerId,
      }));
      players[playerIndex] = {
        ...players[playerIndex],
        mint: players[playerIndex].mint + 1,
      };
      message = `${player.name} takes First Player and gains 1 mint.`;
      break;
    case "crowdfunder":
      players = players.map((candidate) => ({
        ...candidate,
        mint: candidate.mint + (candidate.id === playerId ? 3 : 1),
      }));
      message = `${player.name} gains 3 mint; everyone else gains 1.`;
      break;
    case "lotto": {
      const claimedPlan = player.claimedPlans[0];
      if (claimedPlan) {
        players[playerIndex] = {
          ...player,
          claimedPlans: player.claimedPlans.slice(1),
          planIds: player.claimedPlans.slice(1).map((plan) => plan.id),
          mint: player.mint + claimedPlan.cost,
        };
        message = `${player.name} scraps ${claimedPlan.name} for ${claimedPlan.cost} mint.`;
      } else {
        players[playerIndex] = { ...player, mint: player.mint + 2 };
        message = `${player.name} has no plan to scrap, gains 2 mint instead.`;
      }
      break;
    }
    case "builder-0":
    case "builder-1":
    case "swap_meet": {
      const result = buildClaimedPlanForPlayer(player);
      players[playerIndex] = result.player;
      message = result.builtPlan
        ? `${player.name} builds ${result.builtPlan.name}.`
        : `${player.name} cannot build a claimed plan right now.`;
      break;
    }
    case "supplier-0":
    case "supplier-1":
    case "temp_agency":
    case "recycler":
      message = `${player.name} activates ${findLocation(state, locationId)?.definition.name ?? locationId}.`;
      break;
    default:
      break;
  }

  if (locationId === "wholesaler" || locationId === "lotto") {
    boardLocations = boardLocations.map((location) =>
      location.id === locationId ? { ...location, ownerPlayerId: playerId } : location,
    );
  }

  return {
    players: syncPlayerScores(players),
    boardLocations,
    message,
  };
}

function applyUpkeep(state: GameState): GameState {
  let players = state.players.map((player) => ({
    ...player,
    mint: player.mint + 1,
    buildings: player.buildings.map((building) => ({ ...building })),
  }));

  players = players.map((player) => {
    let bonusMint = 0;
    const nextBuildings = player.buildings.map((building) => {
      let storedMint = building.storedMint;

      switch (building.id) {
        case "mine":
        case "workshop":
        case "factory":
          bonusMint += 1;
          break;
        case "plant":
          bonusMint += 2;
          break;
        case "stripmine":
          bonusMint += 3;
          break;
        case "co-op":
          bonusMint += 1;
          break;
        case "corporate-hq":
          bonusMint += player.buildings.length;
          break;
        case "gallery":
          storedMint += 1;
          break;
        default:
          break;
      }

      return {
        ...building,
        storedMint,
      };
    });

    return {
      ...player,
      mint: player.mint + bonusMint,
      buildings: nextBuildings,
    };
  });

  const coopOwners = players.filter((player) => player.buildings.some((building) => building.id === "co-op"));
  if (players.length > 1) {
    players = players.map((player, index) => {
      const coopBonus = coopOwners.reduce((bonus, owner) => {
        if (owner.id === player.id) return bonus;
        const ownerIndex = players.findIndex((candidate) => candidate.id === owner.id);
        return ownerIndex !== -1 && index === (ownerIndex + 1) % players.length ? bonus + 1 : bonus;
      }, 0);

      return coopBonus > 0 ? { ...player, mint: player.mint + coopBonus } : player;
    });
  }

  players = syncPlayerScores(players);

  const eligibleWinners = players.filter((player) => player.score >= VICTORY_STAR_VALUE);
  const winningScore = eligibleWinners.reduce((highest, player) => Math.max(highest, player.score), 0);
  const winner = eligibleWinners.find((player) => player.score === winningScore);

  if (winner) {
    return {
      ...state,
      phase: "gameEnd",
      winnerPlayerId: winner.id,
      players,
      pendingTurn: createEmptyPendingTurn(winner.id),
      lastAction: `${winner.name} wins with ${winner.score} stars.`,
    };
  }

  const startingPlayerId = getStartingPlayerId(players);

  return {
    ...state,
    phase: "action",
    round: state.round + 1,
    currentPlayerId: startingPlayerId,
    actionStartPlayerId: startingPlayerId,
    consecutivePasses: 0,
    pendingTurn: createEmptyPendingTurn(startingPlayerId),
    players,
    board: {
      ...state.board,
      locations: clearAllLocationSpaces(state),
    },
    lastAction: `Upkeep complete. Round ${state.round + 1} begins with ${players.find((p) => p.id === startingPlayerId)?.name ?? startingPlayerId}.`,
  };
}

function applyPendingPlacementsToBoard(state: GameState, placements: PendingPlacement[]) {
  return state.board.locations.map((boardLocation) => ({
    ...boardLocation,
    spaces: boardLocation.spaces.map((space) => {
      const pendingPlacement = placements.find(
        (placement) =>
          placement.locationId === boardLocation.id && placement.spaceIndex === space.index,
      );

      if (!pendingPlacement) {
        return { ...space };
      }

      return {
        ...space,
        occupiedByPlayerId: state.pendingTurn.playerId,
        occupiedMintCount: pendingPlacement.mintCount,
      };
    }),
  }));
}

function getPendingSpentMint(placements: PendingPlacement[]) {
  return placements.reduce((total, placement) => total + placement.mintCount, 0);
}

export function createGameState(playerCount: number, seed?: number): GameState {
  const players = syncPlayerScores(createPlayers(playerCount));
  const startingPlayerId = players[0]?.id ?? "p1";

  return {
    phase: "action",
    round: 1,
    currentPlayerId: startingPlayerId,
    actionStartPlayerId: startingPlayerId,
    consecutivePasses: 0,
    pendingTurn: createEmptyPendingTurn(startingPlayerId),
    players,
    board: setupGame(playerCount, seed),
    winnerPlayerId: undefined,
    lastAction: "Game started.",
  };
}

export function gameReducer(state: GameState, action: GameAction): GameState {
  switch (action.type) {
    case "SETUP_GAME":
      return createGameState(action.playerCount, action.seed);

    case "RESET_BOARD":
      return createGameState(state.board.playerCount);

    case "CLEAR_PENDING_TURN":
      return {
        ...state,
        pendingTurn: createEmptyPendingTurn(state.currentPlayerId),
      };

    case "REQUEST_PASS_TURN":
      if (state.phase !== "action") {
        return state;
      }

      return {
        ...state,
        pendingTurn: {
          playerId: state.currentPlayerId,
          placements: [],
          passRequested: true,
        },
      };

    case "TOGGLE_LOCATION_SPACE": {
      if (state.phase !== "action") {
        return state;
      }

      const currentPlayer = state.players.find((player) => player.id === state.currentPlayerId);
      if (!currentPlayer) {
        return state;
      }

      const location = findLocation(state, action.locationId);
      const targetSpace = findSpace(location, action.spaceIndex);
      if (!location || !targetSpace || !location.isOpen || targetSpace.occupiedByPlayerId) {
        return state;
      }

      const pendingTurn =
        state.pendingTurn.playerId === currentPlayer.id
          ? state.pendingTurn
          : createEmptyPendingTurn(currentPlayer.id);

      const existingPlacement = pendingTurn.placements.find(
        (placement) =>
          placement.locationId === action.locationId && placement.spaceIndex === action.spaceIndex,
      );

      if (existingPlacement) {
        return {
          ...state,
          pendingTurn: {
            playerId: currentPlayer.id,
            passRequested: false,
            placements: pendingTurn.placements.filter(
              (placement) =>
                !(placement.locationId === action.locationId && placement.spaceIndex === action.spaceIndex),
            ),
          },
        };
      }

      const cost = getSpaceCost(targetSpace, action.mintCount);
      const availableMint = currentPlayer.mint;

      if (cost <= 0 || availableMint < cost) {
        return state;
      }

      return {
        ...state,
        pendingTurn: {
          playerId: currentPlayer.id,
          passRequested: false,
          placements: [
            {
              locationId: action.locationId,
              spaceIndex: action.spaceIndex,
              mintCount: cost,
            },
          ],
        },
      };
    }

    case "CONFIRM_TURN": {
      if (state.phase !== "action") {
        return state;
      }

      const currentPlayer = state.players.find((player) => player.id === state.currentPlayerId);
      if (!currentPlayer) {
        return state;
      }

      const pendingTurn =
        state.pendingTurn.playerId === currentPlayer.id
          ? state.pendingTurn
          : createEmptyPendingTurn(currentPlayer.id);

      if (pendingTurn.passRequested) {
        const nextConsecutivePasses = state.consecutivePasses + 1;
        if (nextConsecutivePasses >= state.players.length) {
          return applyUpkeep({
            ...state,
            phase: "upkeep",
            consecutivePasses: nextConsecutivePasses,
            pendingTurn: createEmptyPendingTurn(currentPlayer.id),
            lastAction: `${currentPlayer.name} passes. Everyone passes in sequence, entering upkeep.`,
          });
        }

        const nextPlayerId = getNextPlayerId(state.players, currentPlayer.id);
        return {
          ...state,
          consecutivePasses: nextConsecutivePasses,
          currentPlayerId: nextPlayerId,
          pendingTurn: createEmptyPendingTurn(nextPlayerId),
          lastAction: `${currentPlayer.name} passes.`,
        };
      }

      if (pendingTurn.placements.length === 0) {
        return state;
      }

      const spentMint = getPendingSpentMint(pendingTurn.placements);
      if (currentPlayer.mint < spentMint) {
        return state;
      }

      const nextPlayersBase = state.players.map((player) =>
        player.id === currentPlayer.id
          ? {
              ...player,
              mint: player.mint - spentMint,
            }
          : player,
      );

      let workingState: GameState = {
        ...state,
        players: nextPlayersBase,
        board: {
          ...state.board,
          locations: applyPendingPlacementsToBoard(state, pendingTurn.placements),
        },
      };

      let latestMessage = `${currentPlayer.name} ends their turn.`;

      pendingTurn.placements.forEach((placement) => {
        const result = applyLocationEffect(
          workingState,
          placement.locationId,
          currentPlayer.id,
        );

        workingState = {
          ...workingState,
          players: result.players,
          board: {
            ...workingState.board,
            locations: result.boardLocations,
          },
        };
        latestMessage = result.message;
      });

      const nextPlayerId = getNextPlayerId(workingState.players, currentPlayer.id);
      return {
        ...workingState,
        currentPlayerId: nextPlayerId,
        consecutivePasses: 0,
        pendingTurn: createEmptyPendingTurn(nextPlayerId),
        lastAction: latestMessage,
      };
    }

    default:
      return state;
  }
}
