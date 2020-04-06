import { PayloadAction } from "@reduxjs/toolkit";
import {
    ErrorResponse,
    Game,
    GameActionResult,
    GameChatMessage,
    GameSummary,
    HistoryTurn,
    PlayState,
} from "../../../../external/imperaClients";
import { UserPayloadAction } from "../../../../types";
import {
    countriesToMap,
    getPlayer,
    getPlayerFromTeams,
    getTeam,
} from "../../../utils/game/utils";
import { isEmptyGuid } from "../../../utils/guid";
import {
    areConnected,
    connections,
    MapTemplateCacheEntry,
} from "./mapTemplateCache";
import { inputActive } from "./play.selectors";
import {
    IGameUIOptions,
    initialState,
    PlaySliceState,
} from "./play.slice.state";

export const switchGame = (
    state: PlaySliceState,
    action: UserPayloadAction<{
        game: Game;
        mapTemplate: MapTemplateCacheEntry;
    }>
) => {
    const { game, userId, mapTemplate } = action.payload;
    const player = getPlayer(game, userId);

    state.gameId = game.id;
    state.game = game;
    state.player = player;
    state.historyTurn = null;
    state.historyActive = false;
    state.sidebarOpen = localStorage.getItem("impera-sidebar") === "true";
    state.operationInProgress = false;
    state.error = null;
    state.mapTemplate = mapTemplate;
};

export const refreshOtherGames = (
    state: PlaySliceState,
    action: PayloadAction<GameSummary[]>
) => {
    state.otherGames = action.payload;
};

export const refreshGame = (
    state: PlaySliceState,
    action: UserPayloadAction<{ game: Game }>
) => {
    const { game, userId } = action.payload;
    const player = getPlayer(game, userId);

    state.gameId = game.id;
    state.game = game;
    state.player = player;
    state.operationInProgress = false;
    state.error = null;
};

export const toggleSidebar = (
    state: PlaySliceState,
    _: PayloadAction<void>
) => {
    state.sidebarOpen = !state.sidebarOpen;
};

export interface ISetGameOptionPayload {
    name: keyof IGameUIOptions;
    value: boolean;
    temporary?: boolean;
}
export const setUIOption = (
    state: PlaySliceState,
    action: PayloadAction<ISetGameOptionPayload>
) => {
    const { name, temporary, value } = action.payload;

    if (temporary && !value) {
        delete state.overrideGameUiOptions[name];
    } else {
        if (action.payload.temporary) {
            state.overrideGameUiOptions[name] = value;
        } else {
            state.gameUiOptions[name] = value;
        }
    }
};

export const pendingOperation = (state: PlaySliceState) => {
    state.operationInProgress = true;
};

export const error = (
    state: PlaySliceState,
    action: PayloadAction<ErrorResponse>
) => {
    state.error = action.payload;
};

export const leave = (state: PlaySliceState) => {
    return initialState;
};

//
// Game chat
//
export const gameChatMessage = (
    state: PlaySliceState,
    action: PayloadAction<GameChatMessage>
) => {
    const message = action.payload;

    if (isEmptyGuid(message.teamId)) {
        state.gameChat.all.push(message);
    } else {
        state.gameChat.team.push(message);
    }
};

export const gameChatSendMessagePending = (
    state: PlaySliceState,
    action: PayloadAction<void>
) => {
    state.gameChat.isPending = true;
};

export const gameChatSendMessageSuccess = (
    state: PlaySliceState,
    _: PayloadAction<void>
) => {
    state.gameChat.isPending = false;
};

export interface IGameChatMessagesPayload {
    gameId: number;
    all: GameChatMessage[];
    team: GameChatMessage[];
}
export const gameChatMessages = (
    state: PlaySliceState,
    action: PayloadAction<IGameChatMessagesPayload>
) => {
    const { gameId, all, team } = action.payload;

    if (state.gameId !== gameId) {
        // Game might have changed, ignore result
        return state;
    }

    state.gameChat = {
        isPending: false,
        all,
        team,
    };
};

//
// Game history
//
export const historyTurn = (
    state: PlaySliceState,
    action: PayloadAction<HistoryTurn>
) => {
    const turn = action.payload;

    state.operationInProgress = false;
    state.historyTurn = turn;
    state.historyActive = true;
};

export const historyExit = (
    state: PlaySliceState,
    action: PayloadAction<void>
) => {
    state.historyActive = false;
    state.historyTurn = null;
};

//
// Play actions
//
export const selectCountry = (
    state: PlaySliceState,
    action: UserPayloadAction<{ countryIdentifier: string }>
) => {
    const { userId, countryIdentifier } = action.payload;
    const { game, placeCountries, twoCountry, mapTemplate } = state;
    const teamId = getTeam(game, userId).id;
    const countriesByIdentifier = countriesToMap(game.map.countries);
    const country = countriesByIdentifier[countryIdentifier];

    const inputAllowed = inputActive(state, userId);

    if (game && game.currentPlayer.userId === userId && inputAllowed) {
        switch (game.playState) {
            case PlayState.PlaceUnits: {
                if (placeCountries[countryIdentifier]) {
                    // Country was selected, de-select
                    delete state.placeCountries[countryIdentifier];
                }

                // Select country
                if (country && country.teamId === teamId) {
                    const remainingUnits =
                        game.unitsToPlace -
                        Object.keys(placeCountries).reduce(
                            (sum, id) => sum + placeCountries[id],
                            0
                        );

                    state.placeCountries[countryIdentifier] = remainingUnits;
                }

                break;
            }

            case PlayState.Attack:
            case PlayState.Move: {
                if (countryIdentifier === null) {
                    state.twoCountry = initialState.twoCountry;
                    return;
                }

                const originSet = !!twoCountry.originCountryIdentifier;
                const destinationSet = !!twoCountry.destinationCountryIdentifier;

                const player = getPlayer(game, userId);
                const playerId = player.id;

                if (game.playState === PlayState.Attack) {
                    if (originSet && !destinationSet) {
                        const originCountry =
                            countriesByIdentifier[
                                twoCountry.originCountryIdentifier
                            ];

                        // Try to set destination country, has to belong to other player
                        if (
                            country.playerId !== playerId &&
                            areConnected(
                                mapTemplate,
                                originCountry.identifier,
                                countryIdentifier
                            )
                        ) {
                            const maxUnits =
                                originCountry.units -
                                game.options.minUnitsPerCountry;

                            state.twoCountry.destinationCountryIdentifier = countryIdentifier;
                            state.twoCountry.minUnits = 1;
                            state.twoCountry.maxUnits = maxUnits;
                            state.twoCountry.numberOfUnits = Math.max(
                                0,
                                maxUnits
                            );
                            return;
                        } else {
                            // Reset
                            state.twoCountry = initialState.twoCountry;
                        }
                    } else {
                        // Origin country has to belong to current player's team
                        if (country.teamId === teamId) {
                            // Destinations have to belong to other player
                            const allowedDestinations = connections(
                                mapTemplate,
                                countryIdentifier
                            ).filter(
                                (c) =>
                                    countriesByIdentifier[c].playerId !==
                                    playerId
                            );

                            state.twoCountry.originCountryIdentifier = countryIdentifier;
                            state.twoCountry.destinationCountryIdentifier = null;
                            state.twoCountry.allowedDestinations = allowedDestinations;
                            return;
                        }
                    }
                } else if (game.playState === PlayState.Move) {
                    // Can only select own team's countries
                    if (country.teamId === teamId) {
                        if (
                            originSet &&
                            areConnected(
                                mapTemplate,
                                twoCountry.originCountryIdentifier,
                                countryIdentifier
                            )
                        ) {
                            const originCountry =
                                countriesByIdentifier[
                                    twoCountry.originCountryIdentifier
                                ];
                            const maxUnits =
                                originCountry.units -
                                game.options.minUnitsPerCountry;

                            state.twoCountry.destinationCountryIdentifier = countryIdentifier;
                            state.twoCountry.minUnits = 1;
                            state.twoCountry.maxUnits = maxUnits;
                            state.twoCountry.numberOfUnits = Math.max(
                                0,
                                maxUnits
                            );
                            return;
                        } else if (
                            !twoCountry.originCountryIdentifier ||
                            !!twoCountry.destinationCountryIdentifier
                        ) {
                            // Set destination
                            const allowedDestinations = connections(
                                mapTemplate,
                                countryIdentifier
                            ).filter(
                                (c) =>
                                    countriesByIdentifier[c].teamId === teamId
                            );

                            state.twoCountry.originCountryIdentifier = countryIdentifier;
                            state.twoCountry.allowedDestinations = allowedDestinations;
                            return;
                        }
                    } else {
                        // Reset
                        state.twoCountry = initialState.twoCountry;
                    }
                }

                break;
            }
        }
    }

    // Ignore action
    return state;
};

export interface ISetPlaceUnitsPayload {
    countryIdentifier: string;
    units: number;
}
export const setPlaceUnits = (
    state: PlaySliceState,
    action: PayloadAction<ISetPlaceUnitsPayload>
) => {
    const data = state;

    let { countryIdentifier, units = 0 } = action.payload;

    if (data.placeCountries[countryIdentifier]) {
        const unitsToPlace = Object.keys(data.placeCountries)
            .filter((x) => x !== countryIdentifier)
            .reduce((sum, id) => sum + data.placeCountries[id], 0);
        const remainingUnits = data.game.unitsToPlace - unitsToPlace;

        if (units > remainingUnits) {
            units = remainingUnits;
        }

        state.placeCountries[countryIdentifier] = units;
    }
};

export const setActionUnits = (
    state: PlaySliceState,
    action: PayloadAction<number>
) => {
    const data = state;
    const { minUnits, maxUnits } = data.twoCountry;
    const inputUnits = action.payload;

    const units = Math.min(Math.max(minUnits, inputUnits), maxUnits);

    state.twoCountry.numberOfUnits = units;
};

export const updateFromResult = (
    state: PlaySliceState,
    action: UserPayloadAction<{ result: GameActionResult }>
) => {
    const { result, userId } = action.payload;

    state.operationInProgress = false;
    state.placeCountries = {};

    state.twoCountry = initialState.twoCountry;
    state.game.state = result.state;
    (state.game.playState = result.playState),
        (state.game.currentPlayer = result.currentPlayer);
    state.game.attacksInCurrentTurn = result.attacksInCurrentTurn;
    state.game.movesInCurrentTurn = result.movesInCurrentTurn;
    state.game.unitsToPlace = result.unitsToPlace;
    state.game.turnCounter = result.turnCounter;

    // Update map
    let newMap = {
        countries: state.game.map.countries.slice(0),
    };

    // Apply map updates
    const countryUpdates = countriesToMap(result.countryUpdates);

    for (let i = 0; i < newMap.countries.length; ++i) {
        const country = newMap.countries[i];
        const countryUpdate = countryUpdates[country.identifier];
        if (countryUpdate) {
            newMap.countries.splice(i, 1, countryUpdate);
            delete countryUpdates[country.identifier];
        }
    }

    // Add remaining countries
    for (const identifier of Object.keys(countryUpdates)) {
        newMap.countries.push(countryUpdates[identifier]);
    }

    state.game.map = newMap;

    // Update teams
    state.game.teams = result.teams;
    state.player = getPlayerFromTeams(result.teams, userId);
};
