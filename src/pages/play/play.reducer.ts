import { makeImmutable, IImmutable } from "immuts";
import reducerMap from "../../lib/reducerMap";
import { GameSummary, GameType, GameState, AttackOptions, MoveOptions, GameActionResult, ActionResult, Game, Country, PlayState, Player, Team } from "../../external/imperaClients";
import { IAction, success, pending, failed } from "../../lib/action";
import { EXCHANGE, ATTACK, SWITCH_GAME, TOGGLE_SIDEBAR, SELECT_COUNTRY, ISetPlaceUnitsPayload, SET_PLACE_UNITS, INPROGRESS, PLACE, END_TURN, SET_ACTION_UNITS } from "./play.actions";
import { UserProvider } from "../../services/userProvider";

export interface ITwoCountry {
    originCountryIdentifier: string;
    destinationCountryIdentifier: string;
    numberOfUnits: number;
    minUnits: number;
    maxUnits: number;
}

const initialState = makeImmutable({
    gameId: 0,
    game: null as Game,
    player: null as Player,

    countriesByIdentifier: null as { [id: string]: Country },

    /** Other games where it's the player's turn */
    otherGames: [] as GameSummary[],

    placeCountries: {} as { [id: string]: number },

    twoCountry: {
        originCountryIdentifier: null as string,
        destinationCountryIdentifier: null as string,
        numberOfUnits: 0,
        minUnits: 0,
        maxUnits: 0
    } as ITwoCountry,

    attacksLeftPerTurn: 0,
    movesLeftPerTurn: 0,

    sidebarOpen: false,
    operationInProgress: false,

    historyActive: false
});

export type IPlayState = typeof initialState;

function countriesToMap(countries: Country[]): { [id: string]: Country } {
    let idToCountry = {};

    if (countries && countries.length) {
        for (let country of countries) {
            idToCountry[country.identifier] = country;
        }
    }

    return idToCountry;
}

function getPlayer(game: Game, userId: string): Player {
    for (let team of game.teams) {
        for (let player of team.players) {
            if (player.userId === userId) {
                return player;
            }
        }
    }

    return null;
}

function getTeam(game: Game, userId: string): Team {
    for (let team of game.teams) {
        for (let player of team.players) {
            if (player.userId === userId) {
                return team;
            }
        }
    }

    return null;
}

//
// Ui actions
//
export const switchGame = (state: IPlayState, action: IAction<Game>) => {
    const game = action.payload;
    const player = getPlayer(game, UserProvider.getUserId());

    return initialState.merge(x => x, {
        gameId: game.id,
        game,
        player,
        countriesByIdentifier: countriesToMap(game.map.countries)
    });
};

export const toggleSidebar = (state: IPlayState, action: IAction<void>) => {
    return state.set(x => x.sidebarOpen, !state.data.sidebarOpen);
};

export const inProgress = (state: IPlayState, action: IAction<boolean>) => {
    return state.set(x => x.operationInProgress, action.payload);
};

//
// Play actions
//
export const selectCountry = (state: IPlayState, action: IAction<string>) => {
    const { game, placeCountries, twoCountry, countriesByIdentifier } = state.data;

    const currentUserId = UserProvider.getUserId();
    if (game && game.currentPlayer.userId === currentUserId) {
        const countryIdentifier = action.payload;

        if (game.playState === PlayState.PlaceUnits) {
            if (placeCountries[countryIdentifier]) {
                // Country was selected, de-select
                return state.remove(x => x.placeCountries[countryIdentifier]);
            }

            // Select country
            const remainingUnits = game.unitsToPlace - Object.keys(placeCountries).reduce((sum, id) => sum + placeCountries[id], 0);

            return state.merge(x => x.placeCountries, {
                [countryIdentifier]: remainingUnits
            });
        } else if (game.playState === PlayState.Attack
            || game.playState === PlayState.Move) {

            if (countryIdentifier === null) {
                return state.set(x => x.twoCountry, {
                    originCountryIdentifier: null,
                    destinationCountryIdentifier: null,
                    numberOfUnits: 0
                } as ITwoCountry);
            }

            const originSet = !!twoCountry.originCountryIdentifier;
            const country = countriesByIdentifier[countryIdentifier];
            const teamId = getTeam(game, currentUserId).id;

            if (game.playState === PlayState.Attack) {
                if (originSet) {
                    const originCountry = countriesByIdentifier[twoCountry.originCountryIdentifier];

                    // Try to set destination country, has to belong to other team
                    if (country.teamId !== teamId) {
                        const maxUnits = originCountry.units - game.options.minUnitsPerCountry;

                        return state
                            .set(x => x.twoCountry.destinationCountryIdentifier, countryIdentifier)
                            .merge(x => x.twoCountry, {
                                minUnits: 1,
                                maxUnits,
                                numberOfUnits: Math.min(1, maxUnits)
                            });
                    }
                } else if (!twoCountry.originCountryIdentifier || !!twoCountry.destinationCountryIdentifier) {
                    // Origin country has to belong to current player's team
                    if (country.teamId === teamId) {
                        return state
                            .set(x => x.twoCountry.originCountryIdentifier, countryIdentifier);
                    }
                }
            } else if (game.playState === PlayState.Move) {
                // Can only select own team's countries
                if (country.teamId === teamId) {
                    if (originSet) {
                        const originCountry = countriesByIdentifier[twoCountry.originCountryIdentifier];
                        const maxUnits = originCountry.units - game.options.minUnitsPerCountry;
                        return state
                            .set(x => x.twoCountry.destinationCountryIdentifier, countryIdentifier)
                            .merge(x => x.twoCountry, {
                                minUnits: 1,
                                maxUnits,
                                numberOfUnits: Math.min(1, maxUnits)
                            });
                    } else if (!twoCountry.originCountryIdentifier || !!twoCountry.destinationCountryIdentifier) {
                        return state.set(x => x.twoCountry.originCountryIdentifier, countryIdentifier);
                    }
                }
            }
        }
    }

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

    return state
        .set(x => x.placeCountries, {})
        .set(x => x.twoCountry, initialState.data.twoCountry)
        .update(x => x.game, game => {
            game.state = result.state;
            game.playState = result.playState;
            game.currentPlayer = result.currentPlayer;
            game.attacksInCurrentTurn = result.attacksInCurrentTurn;
            game.movesInCurrentTurn = result.movesInCurrentTurn;
            game.currentPlayer = result.currentPlayer;

            return game;
        })
        .set(x => x.game.teams, result.teams)
        .update(x => x.player, player => {
            player.cards = result.cards;

            return player;
        })
        .merge(x => x.countriesByIdentifier, countriesToMap(result.countryUpdates));
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

// export const placed = (state: IPlayState, action: IAction<GameActionResult>) => {

// };

/** Reducer */
export const play = <TPayload>(
    state = initialState,
    action?: IAction<TPayload>) => {

    return reducerMap(action, state, {
        [TOGGLE_SIDEBAR]: toggleSidebar,
        [success(SWITCH_GAME)]: switchGame,
        [INPROGRESS]: inProgress,

        [SELECT_COUNTRY]: selectCountry,
        [SET_PLACE_UNITS]: setPlaceUnits,
        [SET_ACTION_UNITS]: setActionUnits,

        [success(PLACE)]: updateFromResult,
        [success(ATTACK)]: updateFromResult,
        [success(END_TURN)]: updateFromResult
    });
};