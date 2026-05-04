import { VICTORY_STAR_VALUE } from "@/constants/game";
import { plans, type PlanData } from "@/data/cards/plans";
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

function shuffle<T>(arr: T[]): T[] {
  const copy = [...arr];
  for (let index = copy.length - 1; index > 0; index -= 1) {
    const swapIndex = Math.floor(Math.random() * (index + 1));
    [copy[index], copy[swapIndex]] = [copy[swapIndex], copy[index]];
  }
  return copy;
}

function createPlanRows(playerCount: number) {
  const deck = shuffle(plans);
  const supplyCount = playerCount === 1 ? 2 : 3;

  return {
    supplyPlans: deck.slice(0, supplyCount),
    remainingPlans: deck.slice(supplyCount),
  };
}

function parsePrintedStarValue(starValue: string): number {
  if (!starValue) return 0;
  const matches = starValue.match(/\[STAR(?:_(\d+))?\]/g) ?? [];
  return matches.reduce((total, token) => {
    const value = token.match(/\[STAR_(\d+)\]/)?.[1];
    return total + (value ? Number(value) : 1);
  }, 0);
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

function drawReplacementPlan(state: GameState) {
  const [replacement, ...remainingPlans] = state.remainingPlans;
  return { replacement, remainingPlans };
}

function claimPlanFromSupply(
  state: GameState,
  player: PlayerState,
  selectedPlanId?: string,
): { player: PlayerState; supplyPlans: PlanData[]; remainingPlans: PlanData[]; claimedPlan?: PlanData } {
  const planIndex = state.supplyPlans.findIndex((plan) => plan.id === selectedPlanId);
  const actualIndex = planIndex >= 0 ? planIndex : 0;
  const claimedPlan = state.supplyPlans[actualIndex];

  if (!claimedPlan) {
    return { player, supplyPlans: state.supplyPlans, remainingPlans: state.remainingPlans };
  }

  const nextSupplyPlans = state.supplyPlans.filter((_, index) => index !== actualIndex);
  const { replacement, remainingPlans } = drawReplacementPlan(state);

  return {
    claimedPlan,
    supplyPlans: replacement ? [...nextSupplyPlans, replacement] : nextSupplyPlans,
    remainingPlans,
    player: {
      ...player,
      claimedPlans: [...player.claimedPlans, claimedPlan],
      planIds: [...player.planIds, claimedPlan.id],
    },
  };
}

function buildSpecificPlanForPlayer(player: PlayerState, planId?: string): { player: PlayerState; builtPlan?: PlanData } {
  const candidatePlans = player.claimedPlans
    .filter((plan) => player.mint >= Math.max(0, plan.cost - (player.buildings.some((b) => b.id === "crane") ? 1 : 0)))
    .sort((left, right) => left.cost - right.cost);

  const planToBuild =
    player.claimedPlans.find((plan) => plan.id === planId && player.mint >= Math.max(0, plan.cost - (player.buildings.some((b) => b.id === "crane") ? 1 : 0))) ??
    candidatePlans[0];

  if (!planToBuild) {
    return { player };
  }

  const buildCost = Math.max(0, planToBuild.cost - (player.buildings.some((b) => b.id === "crane") ? 1 : 0));
  const building: PlayerBuildingState = {
    id: planToBuild.id,
    name: planToBuild.name,
    type: planToBuild.type,
    cost: planToBuild.cost,
    effect: planToBuild.effect,
    starValue: planToBuild.starValue,
    storedMint: 0,
  };

  const remainingPlans = player.claimedPlans.filter((plan) => plan !== planToBuild);
  const nextPlayer: PlayerState = {
    ...player,
    mint: player.mint - buildCost,
    claimedPlans: remainingPlans,
    planIds: remainingPlans.map((plan) => plan.id),
    buildings: [...player.buildings, building],
    buildingIds: [...player.buildingIds, building.id],
  };

  return {
    builtPlan: planToBuild,
    player: nextPlayer,
  };
}

function maybeOpenOwnedDeed(locations: BoardLocationState[], builtPlan?: PlanData, playerId?: string) {
  if (!builtPlan || !playerId || (builtPlan.id !== "wholesaler" && builtPlan.id !== "lotto")) {
    return locations;
  }

  return locations.map((location) =>
    location.id === builtPlan.id
      ? { ...location, isOpen: true, ownerPlayerId: playerId }
      : location,
  );
}

function applyLocationEffect(
  state: GameState,
  placement: PendingPlacement,
  playerId: string,
): Pick<GameState, "players" | "board" | "supplyPlans" | "remainingPlans"> & { message: string } {
  let players = state.players.map((player) => ({ ...player, buildings: player.buildings.map((building) => ({ ...building })) }));
  let boardLocations = state.board.locations.map((location) => ({
    ...location,
    spaces: location.spaces.map((space) => ({ ...space })),
  }));
  let supplyPlans = [...state.supplyPlans];
  let remainingPlans = [...state.remainingPlans];

  const playerIndex = players.findIndex((player) => player.id === playerId);
  if (playerIndex === -1) {
    return { players: state.players, board: state.board, supplyPlans: state.supplyPlans, remainingPlans: state.remainingPlans, message: "" };
  }

  const player = players[playerIndex];
  const locationId = placement.locationId;
  let message = `${player.name} used ${locationId}.`;

  switch (locationId) {
    case "producer-0":
    case "producer-1":
    case "wholesaler":
      players[playerIndex] = { ...player, mint: player.mint + 2 };
      message = `${player.name} gains 2 mint.`;
      break;
    case "supplier-0":
    case "supplier-1": {
      const result = claimPlanFromSupply({ ...state, supplyPlans, remainingPlans }, player, placement.selectedPlanId);
      players[playerIndex] = result.player;
      supplyPlans = result.supplyPlans;
      remainingPlans = result.remainingPlans;

      if (result.claimedPlan) {
        if (result.player.buildings.some((building) => building.id === "assembler")) {
          const autoBuilt = buildSpecificPlanForPlayer(result.player, result.claimedPlan.id);
          players[playerIndex] = autoBuilt.player;
          boardLocations = maybeOpenOwnedDeed(boardLocations, autoBuilt.builtPlan, playerId);
          message = autoBuilt.builtPlan
            ? `${player.name} gains ${result.claimedPlan.name} from the supply and immediately builds it with Assembler.`
            : `${player.name} gains ${result.claimedPlan.name} from the supply.`;
        } else {
          message = `${player.name} gains ${result.claimedPlan.name} from the supply.`;
        }
      } else {
        message = `${player.name} cannot gain a plan because the supply is empty.`;
      }
      break;
    }
    case "builder-0":
    case "builder-1": {
      const result = buildSpecificPlanForPlayer(player);
      players[playerIndex] = result.player;
      boardLocations = maybeOpenOwnedDeed(boardLocations, result.builtPlan, playerId);
      message = result.builtPlan
        ? `${player.name} builds ${result.builtPlan.name}.`
        : `${player.name} cannot build one of their plans right now.`;
      break;
    }
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
      const [topPlan, ...deck] = remainingPlans;
      remainingPlans = deck;
      if (topPlan) {
        players[playerIndex] = {
          ...player,
          claimedPlans: [...player.claimedPlans, topPlan],
          planIds: [...player.planIds, topPlan.id],
        };
        message = `${player.name} gains ${topPlan.name} from the top of the plan deck.`;
      } else {
        message = `${player.name} cannot gain a plan because the deck is empty.`;
      }
      break;
    }
    case "recycler": {
      const claimedPlan = player.claimedPlans[0];
      const builtPlan = !claimedPlan ? player.buildings[0] : undefined;
      const recyclable = claimedPlan ?? builtPlan;
      if (!recyclable) {
        message = `${player.name} has nothing to recycle.`;
        break;
      }

      const mintGain = recyclable.cost + parsePrintedStarValue(recyclable.starValue);
      players[playerIndex] = claimedPlan
        ? {
            ...player,
            mint: player.mint + mintGain,
            claimedPlans: player.claimedPlans.slice(1),
            planIds: player.claimedPlans.slice(1).map((plan) => plan.id),
          }
        : {
            ...player,
            mint: player.mint + mintGain,
            buildings: player.buildings.slice(1),
            buildingIds: player.buildings.slice(1).map((building) => building.id),
          };
      message = `${player.name} recycles ${recyclable.name} for ${mintGain} mint.`;
      break;
    }
    case "swap_meet": {
      const incomingPlan = supplyPlans[0];
      const outgoingPlan = player.claimedPlans[0] ?? player.buildings[0];
      if (!incomingPlan || !outgoingPlan) {
        message = `${player.name} cannot use Swap Meet right now.`;
        break;
      }

      const outgoingAsPlan = plans.find((plan) => plan.id === outgoingPlan.id);
      players[playerIndex] = player.claimedPlans.length > 0
        ? {
            ...player,
            claimedPlans: [...player.claimedPlans.slice(1), incomingPlan],
            planIds: [...player.claimedPlans.slice(1), incomingPlan].map((plan) => plan.id),
          }
        : {
            ...player,
            claimedPlans: [...player.claimedPlans, incomingPlan],
            planIds: [...player.planIds, incomingPlan.id],
            buildings: player.buildings.slice(1),
            buildingIds: player.buildings.slice(1).map((building) => building.id),
          };

      supplyPlans = outgoingAsPlan
        ? [outgoingAsPlan, ...supplyPlans.slice(1)]
        : [...supplyPlans];
      message = `${player.name} swaps ${outgoingPlan.name} for ${incomingPlan.name}.`;
      break;
    }
    default:
      message = `${player.name} activates ${findLocation(state, locationId)?.definition.name ?? locationId}.`;
      break;
  }

  return {
    players: syncPlayerScores(players),
    board: {
      ...state.board,
      locations: boardLocations,
    },
    supplyPlans,
    remainingPlans,
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

  const wholesaler = state.board.locations.find((location) => location.id === "wholesaler");
  const lotto = state.board.locations.find((location) => location.id === "lotto");

  players = players.map((player) => {
    let deedBonus = 0;
    if (wholesaler?.ownerPlayerId === player.id && wholesaler.spaces.some((space) => space.occupiedByPlayerId)) {
      deedBonus += 1;
    }
    if (lotto?.ownerPlayerId === player.id && lotto.spaces.some((space) => space.occupiedByPlayerId)) {
      deedBonus += 2;
    }
    return deedBonus > 0 ? { ...player, mint: player.mint + deedBonus } : player;
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
  const planRows = createPlanRows(playerCount);

  return {
    phase: "action",
    round: 1,
    currentPlayerId: startingPlayerId,
    actionStartPlayerId: startingPlayerId,
    consecutivePasses: 0,
    pendingTurn: createEmptyPendingTurn(startingPlayerId),
    players,
    board: setupGame(playerCount, seed),
    supplyPlans: planRows.supplyPlans,
    remainingPlans: planRows.remainingPlans,
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
      if (!location || !targetSpace || !location.isOpen) {
        return state;
      }

      const pendingTurn =
        state.pendingTurn.playerId === currentPlayer.id
          ? state.pendingTurn
          : createEmptyPendingTurn(currentPlayer.id);

      const tempAgencyPlacement = pendingTurn.placements.find((placement) => placement.locationId === "temp_agency");
      if (tempAgencyPlacement && action.locationId !== "temp_agency" && targetSpace.occupiedByPlayerId) {
        return {
          ...state,
          pendingTurn: {
            playerId: currentPlayer.id,
            passRequested: false,
            placements: [{
              ...tempAgencyPlacement,
              mintCount: targetSpace.occupiedMintCount ?? getSpaceCost(targetSpace),
              targetLocationId: action.locationId,
              targetSpaceIndex: action.spaceIndex,
            }],
          },
        };
      }

      if (targetSpace.occupiedByPlayerId) {
        return state;
      }

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
      if (cost <= 0 || currentPlayer.mint < cost) {
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
              selectedPlanId: action.selectedPlanId,
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

      let workingState: GameState = {
        ...state,
        players: state.players.map((player) =>
          player.id === currentPlayer.id
            ? {
                ...player,
                mint: player.mint - spentMint,
              }
            : player,
        ),
        board: {
          ...state.board,
          locations: applyPendingPlacementsToBoard(state, pendingTurn.placements),
        },
      };

      let latestMessage = `${currentPlayer.name} ends their turn.`;

      pendingTurn.placements.forEach((placement) => {
        const effectPlacement = placement.locationId === "temp_agency" && placement.targetLocationId
          ? {
              ...placement,
              locationId: placement.targetLocationId,
              spaceIndex: placement.targetSpaceIndex ?? 0,
            }
          : placement;

        const result = applyLocationEffect(workingState, effectPlacement, currentPlayer.id);

        workingState = {
          ...workingState,
          players: result.players,
          board: result.board,
          supplyPlans: result.supplyPlans,
          remainingPlans: result.remainingPlans,
        };
        latestMessage = placement.locationId === "temp_agency" && placement.targetLocationId
          ? `${result.message} (via Temp Agency).`
          : result.message;
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
