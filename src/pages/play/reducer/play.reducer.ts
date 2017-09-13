import {
    ActionResult, ErrorResponse, Game, GameActionResult, GameChatMessage, HistoryTurn, PlayState, GameSummary
} from "../../../external/imperaClients";
import { IAction } from "../../../lib/action";
import { countriesToMap, getPlayer, getPlayerFromTeams, getTeam } from "../../../lib/game/utils";
import { isEmptyGuid } from "../../../lib/guid";
import { UserProvider } from "../../../services/userProvider";
import {
    IGameChatMessagesPayload, ISetPlaceUnitsPayload, ISwitchGamePayload
} from "../play.actions";
import { initialState, IPlayState, ITwoCountry } from "./play.reducer.state";
import { inputActive } from "./play.selectors";

//
// Ui actions
//
export const switchGame = (state: IPlayState, action: IAction<ISwitchGamePayload>) => {
    const { game, mapTemplate } = action.payload;
    const player = getPlayer(game, UserProvider.getUserId());

    return state
        .merge(x => x, {
            gameId: game.id,
            game,
            mapTemplate,
            player,
            sidebarOpen: localStorage.getItem("impera-sidebar") === "true"
        })
        .set(x => x.operationInProgress, false)
        .set(x => x.error, null);
};

export const refreshOtherGames = (state: IPlayState, action: IAction<GameSummary[]>) => {
    return state.set(x => x.otherGames, action.payload);
};

export const refreshGame = (state: IPlayState, action: IAction<Game>) => {
    const currentState = state.data;

    const game = action.payload;
    const player = getPlayer(game, UserProvider.getUserId());

    return state
        .merge(x => x, {
            gameId: game.id,
            game,
            mapTemplate: currentState.mapTemplate,
            player
        })
        .set(x => x.operationInProgress, false)
        .set(x => x.error, null);
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

export const leave = (state: IPlayState) => {
    return initialState;
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
                    const { [countryIdentifier]: _, ...newPlaceCountries } = placeCountries;
                    return state.set(x => x.placeCountries, newPlaceCountries);
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
                
                const player = getPlayer(game, UserProvider.getUserId());
                const playerId = player.id;

                if (game.playState === PlayState.Attack) {
                    if (originSet && !destinationSet) {
                        const originCountry = countriesByIdentifier[twoCountry.originCountryIdentifier];

                        // Try to set destination country, has to belong to other player
                        if (country.playerId !== playerId
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
                            // Destinations have to belong to other player
                            const allowedDestinations = mapTemplate
                                .connections(countryIdentifier)
                                .filter(c => countriesByIdentifier[c].playerId !== playerId);

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
        .merge(x => x.game, {
            state: result.state,
            playState: result.playState,
            currentPlayer: result.currentPlayer,
            attacksInCurrentTurn: result.attacksInCurrentTurn,
            movesInCurrentTurn: result.movesInCurrentTurn,
            unitsToPlace: result.unitsToPlace
        })
        .update(x => x.game.map, map => {
            let newMap = {
                countries: map.countries.slice(0)
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

            return newMap;
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
