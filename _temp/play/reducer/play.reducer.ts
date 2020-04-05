import {
    ErrorResponse,
    Game,
    GameActionResult,
    GameChatMessage,
    GameSummary,
    HistoryTurn,
    PlayState,
    Result,
} from "../../../external/imperaClients";
import { IAction } from "../../../lib/utils/action";
import {
    countriesToMap,
    getPlayer,
    getPlayerFromTeams,
    getTeam,
} from "../../../lib/utils/game/utils";
import { isEmptyGuid } from "../../../lib/utils/guid";
import { UserProvider } from "../../../services/userProvider";
import {
    IGameChatMessagesPayload,
    ISetGameOptionPayload,
    ISetPlaceUnitsPayload,
    ISwitchGamePayload,
} from "../play.actions";
import { IPlayState, initialState } from "./play.reducer.state";
import { inputActive } from "./play.selectors";

//
// Ui actions
//
export const switchGame = (
    state: IPlayState,
    action: ActionPayload<ISwitchGamePayload>
) => {
    const { game, mapTemplate } = action.payload;
    const player = getPlayer(game, UserProvider.getUserId());

    return state
        .__set(x => x, {
            gameId: game.id,
            game,
            mapTemplate,
            player,
            historyTurn: null,
            historyActive: false,
            sidebarOpen: localStorage.getItem("impera-sidebar") === "true",
        })
        .__set(x => x.operationInProgress, false)
        .__set(x => x.error, null);
};

export const refreshOtherGames = (
    state: IPlayState,
    action: ActionPayload<GameSummary[]>
) => {
    return state.__set(x => x.otherGames, action.payload);
};

export const refreshGame = (state: IPlayState, action: ActionPayload<Game>) => {
    const currentState = state;

    const game = action.payload;
    const player = getPlayer(game, UserProvider.getUserId());

    return state
        .__set(x => x, {
            gameId: game.id,
            game,
            mapTemplate: currentState.mapTemplate,
            player,
        })
        .__set(x => x.operationInProgress, false)
        .__set(x => x.error, null);
};

export const toggleSidebar = (
    state: IPlayState,
    action: ActionPayload<void>
) => {
    return state.__set(x => x.sidebarOpen, !state.sidebarOpen);
};

export const setUIOption = (
    state: IPlayState,
    action: ActionPayload<ISetGameOptionPayload>
) => {
    const { name, temporary, value } = action.payload;

    if (temporary && !value) {
        return state.__set(
            x => x.overrideGameUiOptions,
            oldValue => {
                // Remove from overrides
                const clone = {
                    ...oldValue,
                };

                delete clone[name];

                return clone;
            }
        );
    } else {
        return state.__set(
            action.payload.temporary
                ? x => x.overrideGameUiOptions
                : x => x.gameUiOptions,
            {
                [name]: value,
            }
        );
    }
};

export const pendingOperation = (state: IPlayState) => {
    return state.__set(x => x.operationInProgress, true);
};

export const error = (
    state: IPlayState,
    action: ActionPayload<ErrorResponse>
) => {
    return state.__set(x => x.error, action.payload);
};

export const leave = (state: IPlayState) => {
    return initialState;
};

//
// Game chat
//
export const gameChatMessage = (
    state: IPlayState,
    action: ActionPayload<GameChatMessage>
) => {
    const message = action.payload;

    if (isEmptyGuid(message.teamId)) {
        return state.__set(
            x => x.gameChat.all,
            messages => messages.concat([message])
        );
    } else {
        return state.__set(
            x => x.gameChat.team,
            messages => messages.concat([message])
        );
    }
};

export const gameChatSendMessagePending = (
    state: IPlayState,
    action: ActionPayload<void>
) => {
    return state.__set(x => x.gameChat.isPending, true);
};

export const gameChatSendMessageSuccess = (
    state: IPlayState,
    action: ActionPayload<void>
) => {
    return state.__set(x => x.gameChat.isPending, false);
};

export const gameChatMessages = (
    state: IPlayState,
    action: ActionPayload<IGameChatMessagesPayload>
) => {
    const { gameId, all, team } = action.payload;

    if (state.gameId !== gameId) {
        // Game might have changed, ignore result
        return state;
    }

    return state.__set(x => x.gameChat, {
        isPending: false,
        all,
        team,
    });
};

//
// Game history
//
export const historyTurn = (
    state: IPlayState,
    action: ActionPayload<HistoryTurn>
) => {
    const turn = action.payload;

    return state
        .__set(x => x.operationInProgress, false)
        .__set(x => x.historyTurn, turn)
        .__set(x => x.historyActive, true);
};

export const historyExit = (state: IPlayState, action: ActionPayload<void>) => {
    return state
        .__set(x => x.historyActive, false)
        .__set(x => x.historyTurn, null);
};

//
// Play actions
//
export const selectCountry = (
    state: IPlayState,
    action: ActionPayload<string>
) => {
    const { game, placeCountries, twoCountry, mapTemplate } = state;
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
                    const {
                        [countryIdentifier]: _,
                        ...newPlaceCountries
                    } = placeCountries;
                    return state.__set(
                        x => x.placeCountries,
                        newPlaceCountries
                    );
                }

                // Select country
                if (country && country.teamId === teamId) {
                    const remainingUnits =
                        game.unitsToPlace -
                        Object.keys(placeCountries).reduce(
                            (sum, id) => sum + placeCountries[id],
                            0
                        );

                    return state.__set(
                        x => x.placeCountries[countryIdentifier],
                        remainingUnits
                    );
                }

                break;
            }

            case PlayState.Attack:
            case PlayState.Move: {
                if (countryIdentifier === null) {
                    return state.__set(
                        x => x.twoCountry,
                        initialState.twoCountry
                    );
                }

                const originSet = !!twoCountry.originCountryIdentifier;
                const destinationSet = !!twoCountry.destinationCountryIdentifier;

                const player = getPlayer(game, UserProvider.getUserId());
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
                            mapTemplate.areConnected(
                                originCountry.identifier,
                                countryIdentifier
                            )
                        ) {
                            const maxUnits =
                                originCountry.units -
                                game.options.minUnitsPerCountry;

                            return state.__set(
                                x => x.twoCountry,
                                x => ({
                                    ...x,
                                    destinationCountryIdentifier: countryIdentifier,
                                    minUnits: 1,
                                    maxUnits,
                                    numberOfUnits: Math.max(0, maxUnits),
                                })
                            );
                        } else {
                            // Reset
                            state.__set(
                                x => x.twoCountry,
                                initialState.twoCountry
                            );
                        }
                    } else {
                        // Origin country has to belong to current player's team
                        if (country.teamId === teamId) {
                            // Destinations have to belong to other player
                            const allowedDestinations = mapTemplate
                                .connections(countryIdentifier)
                                .filter(
                                    c =>
                                        countriesByIdentifier[c].playerId !==
                                        playerId
                                );

                            return state.__set(
                                x => x.twoCountry,
                                x => ({
                                    ...x,
                                    originCountryIdentifier: countryIdentifier,
                                    destinationCountryIdentifier: null,
                                    allowedDestinations,
                                })
                            );
                        }
                    }
                } else if (game.playState === PlayState.Move) {
                    // Can only select own team's countries
                    if (country.teamId === teamId) {
                        if (
                            originSet &&
                            mapTemplate.areConnected(
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

                            return state.__set(
                                x => x.twoCountry,
                                x => ({
                                    ...x,
                                    destinationCountryIdentifier: countryIdentifier,
                                    minUnits: 1,
                                    maxUnits,
                                    numberOfUnits: Math.max(0, maxUnits),
                                })
                            );
                        } else if (
                            !twoCountry.originCountryIdentifier ||
                            !!twoCountry.destinationCountryIdentifier
                        ) {
                            // Set destination
                            const allowedDestinations = mapTemplate
                                .connections(countryIdentifier)
                                .filter(
                                    c =>
                                        countriesByIdentifier[c].teamId ===
                                        teamId
                                );

                            return state.__set(
                                x => x.twoCountry,
                                x => ({
                                    ...x,
                                    originCountryIdentifier: countryIdentifier,
                                    allowedDestinations,
                                })
                            );
                        }
                    } else {
                        // Reset
                        state.__set(x => x.twoCountry, initialState.twoCountry);
                    }
                }

                break;
            }
        }
    }

    // Ignore action
    return state;
};

export const setPlaceUnits = (
    state: IPlayState,
    action: ActionPayload<ISetPlaceUnitsPayload>
) => {
    const data = state;

    let { countryIdentifier, units = 0 } = action.payload;

    if (data.placeCountries[countryIdentifier]) {
        const unitsToPlace = Object.keys(data.placeCountries)
            .filter(x => x !== countryIdentifier)
            .reduce((sum, id) => sum + data.placeCountries[id], 0);
        const remainingUnits = data.game.unitsToPlace - unitsToPlace;

        if (units > remainingUnits) {
            units = remainingUnits;
        }

        return state.__set(x => x.placeCountries[countryIdentifier], units);
    }

    return state;
};

export const setActionUnits = (
    state: IPlayState,
    action: ActionPayload<number>
) => {
    const data = state;
    const { minUnits, maxUnits } = data.twoCountry;
    const inputUnits = action.payload;

    const units = Math.min(Math.max(minUnits, inputUnits), maxUnits);

    return state.__set(x => x.twoCountry.numberOfUnits, units);
};

export const updateFromResult = (
    state: IPlayState,
    action: ActionPayload<GameActionResult>
) => {
    const result = action.payload;
    const currentUserId = UserProvider.getUserId();

    return state
        .__set(x => x.operationInProgress, false)
        .__set(x => x.placeCountries, {})
        .__set(x => x.twoCountry, initialState.twoCountry)
        .__set(
            x => x.game,
            x => ({
                ...x,
                state: result.state,
                playState: result.playState,
                currentPlayer: result.currentPlayer,
                attacksInCurrentTurn: result.attacksInCurrentTurn,
                movesInCurrentTurn: result.movesInCurrentTurn,
                unitsToPlace: result.unitsToPlace,
                turnCounter: result.turnCounter,
            })
        )
        .__set(
            x => x.game.map,
            map => {
                let newMap = {
                    countries: map.countries.slice(0),
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
            }
        )
        .__set(x => x.game.teams, result.teams)
        .__set(x => x.player, getPlayerFromTeams(result.teams, currentUserId));
};

export const attack = (
    state: IPlayState,
    action: ActionPayload<GameActionResult>
) => {
    const result = action.payload;

    if (result.actionResult === Result.Successful) {
        // Attack was successful
    } else {
        // Attack failed
    }

    return state;
};
