import {
    GameActionResult, ActionResult, PlayState, GameChatMessage, HistoryTurn, Game, ErrorResponse
} from "../../../external/imperaClients";
import { IAction } from "../../../lib/action";
import {
    ISetPlaceUnitsPayload, ISwitchGamePayload, IGameChatMessagesPayload
} from "../play.actions";
import { UserProvider } from "../../../services/userProvider";
import { isEmptyGuid } from "../../../lib/guid";
import { getPlayer, countriesToMap, getTeam, getPlayerFromTeams } from "../../../lib/game/utils";

import { IPlayState, ITwoCountry, initialState } from "./play.reducer.state";
import { inputActive } from "./play.selectors";

//
// Ui actions
//
export const switchGame = (state: IPlayState, action: IAction<ISwitchGamePayload>) => {
    const { game, mapTemplate } = action.payload;
    const player = getPlayer(game, UserProvider.getUserId());

    return initialState
        .merge(x => x, {
            gameId: game.id,
            game,
            mapTemplate,
            player
        })
        .set(x => x.operationInProgress, false);
};

export const refreshGame = (state: IPlayState, action: IAction<Game>) => {
    const game = action.payload;
    const player = getPlayer(game, UserProvider.getUserId());

    return initialState
        .merge(x => x, {
            gameId: game.id,
            game,
            mapTemplate: state.data.mapTemplate,
            player
        })
        .set(x => x.operationInProgress, false);
};

export const toggleSidebar = (state: IPlayState, action: IAction<void>) => {
    return state.set(x => x.sidebarOpen, !state.data.sidebarOpen);
};

export const pendingOperation = (state: IPlayState) => {
    return state.set(x => x.operationInProgress, true);
};

export const error = (state: IPlayState, action: IAction<ErrorResponse>) => {
    return state.set(x => x.error, action.payload);
};

// 
// Game chat
//
export const gameChatMessage = (state: IPlayState, action: IAction<GameChatMessage>) => {
    const message = action.payload;

    if (isEmptyGuid(message.teamId)) {
        return state.update(x => x.gameChat.all, messages => messages.concat([message]));
    } else {
        return state.update(x => x.gameChat.team, messages => messages.concat([message]));
    }
};

export const gameChatSendMessagePending = (state: IPlayState, action: IAction<void>) => {
    return state.set(x => x.gameChat.isPending, true);
};

export const gameChatSendMessageSuccess = (state: IPlayState, action: IAction<void>) => {
    return state.set(x => x.gameChat.isPending, false);
};

export const gameChatMessages = (state: IPlayState, action: IAction<IGameChatMessagesPayload>) => {
    const { gameId, all, team, } = action.payload;

    if (state.data.gameId !== gameId) {
        // Game might have changed, ignore result
        return state;
    }

    return state.merge(x => x.gameChat, {
        isPending: false,
        all,
        team
    });
};

//
//
//
export const historyTurn = (state: IPlayState, action: IAction<HistoryTurn>) => {
    const turn = action.payload;

    return state
        .set(x => x.historyTurn, turn)
        .set(x => x.historyActive, true);
};

export const historyExit = (state: IPlayState, action: IAction<void>) => {
    return state
        .set(x => x.historyActive, false)
        .set(x => x.historyTurn, null);
};

//
// Play actions
//
export const selectCountry = (state: IPlayState, action: IAction<string>) => {
    const { game, placeCountries, twoCountry, mapTemplate } = state.data;
    const currentUserId = UserProvider.getUserId();
    const teamId = getTeam(game, currentUserId).id;

    const countryIdentifier = action.payload;
    const countriesByIdentifier = countriesToMap(game.map.countries);
    const country = countriesByIdentifier[countryIdentifier];

    const inputAllowed = inputActive(state);

    if (game && game.currentPlayer.userId === currentUserId && inputAllowed) {
        switch (game.playState) {
            case PlayState.PlaceUnits: {
                if (placeCountries[countryIdentifier]) {
                    // Country was selected, de-select
                    return state.remove(x => x.placeCountries[countryIdentifier]);
                }

                // Select country
                if (country && country.teamId === teamId) {
                    const remainingUnits = game.unitsToPlace - Object.keys(placeCountries).reduce((sum, id) => sum + placeCountries[id], 0);

                    return state.merge(x => x.placeCountries, {
                        [countryIdentifier]: remainingUnits
                    });
                }

                break;
            }

            case PlayState.Attack:
            case PlayState.Move: {

                if (countryIdentifier === null) {
                    return state.set(x => x.twoCountry, initialState.data.twoCountry);
                }

                const originSet = !!twoCountry.originCountryIdentifier;
                const destinationSet = !!twoCountry.destinationCountryIdentifier;

                if (game.playState === PlayState.Attack) {
                    if (originSet && !destinationSet) {
                        const originCountry = countriesByIdentifier[twoCountry.originCountryIdentifier];

                        // Try to set destination country, has to belong to other team
                        if (country.teamId !== teamId
                            && mapTemplate.areConnected(originCountry.identifier, countryIdentifier)) {
                            const maxUnits = originCountry.units - game.options.minUnitsPerCountry;

                            return state
                                .set(x => x.twoCountry.destinationCountryIdentifier, countryIdentifier)
                                .merge(x => x.twoCountry, {
                                    minUnits: 1,
                                    maxUnits,
                                    numberOfUnits: Math.max(0, maxUnits)
                                });
                        } else {
                            // Reset
                            state.set(x => x.twoCountry, initialState.data.twoCountry);
                        }
                    } else {
                        // Origin country has to belong to current player's team
                        if (country.teamId === teamId) {
                            const allowedDestinations = mapTemplate
                                .connections(countryIdentifier)
                                .filter(c => countriesByIdentifier[c].teamId !== teamId);

                            return state
                                .merge(x => x.twoCountry, {
                                    originCountryIdentifier: countryIdentifier,
                                    destinationCountryIdentifier: null,
                                    allowedDestinations
                                } as ITwoCountry);
                        }
                    }
                } else if (game.playState === PlayState.Move) {
                    // Can only select own team's countries
                    if (country.teamId === teamId) {
                        if (originSet && mapTemplate.areConnected(twoCountry.originCountryIdentifier, countryIdentifier)) {
                            const originCountry = countriesByIdentifier[twoCountry.originCountryIdentifier];
                            const maxUnits = originCountry.units - game.options.minUnitsPerCountry;

                            return state
                                .merge(x => x.twoCountry, {
                                    destinationCountryIdentifier: countryIdentifier,
                                    minUnits: 1,
                                    maxUnits,
                                    numberOfUnits: Math.max(0, maxUnits)
                                } as ITwoCountry);
                        } else if (!twoCountry.originCountryIdentifier || !!twoCountry.destinationCountryIdentifier) {
                            // Set destination
                            const allowedDestinations = mapTemplate
                                .connections(countryIdentifier)
                                .filter(c => countriesByIdentifier[c].teamId === teamId);

                            return state
                                .merge(x => x.twoCountry, {
                                    originCountryIdentifier: countryIdentifier,
                                    allowedDestinations
                                } as ITwoCountry);
                        }
                    } else {
                        // Reset
                        state.set(x => x.twoCountry, initialState.data.twoCountry);
                    }
                }

                break;
            }
        }
    }

    // Ignore action
    return state;
};

export const setPlaceUnits = (state: IPlayState, action: IAction<ISetPlaceUnitsPayload>) => {
    const data = state.data;

    let { countryIdentifier, units = 0 } = action.payload;

    if (data.placeCountries[countryIdentifier]) {
        const unitsToPlace = Object.keys(data.placeCountries).filter(x => x !== countryIdentifier).reduce((sum, id) => sum + data.placeCountries[id], 0);
        const remainingUnitsWithoutCurrentCountry = data.game.unitsToPlace - unitsToPlace;

        if (units > remainingUnitsWithoutCurrentCountry) {
            units = remainingUnitsWithoutCurrentCountry;
        }

        return state.merge(x => x.placeCountries, {
            [countryIdentifier]: units
        });
    }

    return state;
};

export const setActionUnits = (state: IPlayState, action: IAction<number>) => {
    const data = state.data;
    const { minUnits, maxUnits } = data.twoCountry;
    const inputUnits = action.payload;

    const units = Math.min(Math.max(minUnits, inputUnits), maxUnits);

    return state.set(x => x.twoCountry.numberOfUnits, units);
};

export const updateFromResult = (state: IPlayState, action: IAction<GameActionResult>) => {
    const result = action.payload;
    const currentUserId = UserProvider.getUserId();

    return state
        .set(x => x.operationInProgress, false)
        .set(x => x.placeCountries, {})
        .set(x => x.twoCountry, initialState.data.twoCountry)
        .update(x => x.game, game => {
            game.state = result.state;
            game.playState = result.playState;
            game.currentPlayer = result.currentPlayer;
            game.attacksInCurrentTurn = result.attacksInCurrentTurn;
            game.movesInCurrentTurn = result.movesInCurrentTurn;
            game.currentPlayer = result.currentPlayer;
            game.unitsToPlace = result.unitsToPlace;

            // Apply map updates
            const countryUpdates = countriesToMap(result.countryUpdates);
            for (let i = 0; i < game.map.countries.length; ++i) {
                const country = game.map.countries[i];

                const countryUpdate = countryUpdates[country.identifier];
                if (countryUpdate) {
                    game.map.countries.splice(i, 1, countryUpdate);
                }
            }

            return game;
        })
        .set(x => x.game.teams, result.teams)
        .merge(x => x.player, getPlayerFromTeams(result.teams, currentUserId));
};

export const attack = (state: IPlayState, action: IAction<GameActionResult>) => {
    const result = action.payload;

    if (result.actionResult === ActionResult.Successful) {
        // Attack was successful
    } else {
        // Attack failed
    }

    return state;
};