import { makeImmutable, IImmutable } from "immuts";
import reducerMap from "../../lib/reducerMap";
import { GameSummary, GameType, GameState, AttackOptions, MoveOptions, GameActionResult, ActionResult, Game, Country, PlayState, Player } from "../../external/imperaClients";
import { IAction, success, pending, failed } from "../../lib/action";
import { EXCHANGE, ATTACK, SWITCH_GAME, TOGGLE_SIDEBAR, SELECT_COUNTRY, ISetPlaceUnitsPayload, SET_PLACE_UNITS, INPROGRESS, PLACE, END_TURN } from "./play.actions";
import { UserProvider } from "../../services/userProvider";

export interface ITwoCountry {
    originCountryIdentifier: string;
    destinationCountryIdentifier: string;
    numberOfUnits: number;
}

const initialState = makeImmutable({
    gameId: 0,
    game: null as Game,
    player: null as Player,

    countriesByIdentifier: null as { [id: string]: Country },

    /** Other games where it's the player's turn */
    otherGames: [] as GameSummary[],

    placeCountries: {} as { [id: string]: number },

    canMove: false,
    canAttack: false,
    twoCountry: {
        originCountryIdentifier: null as string,
        destinationCountryIdentifier: null as string,
        numberOfUnits: 0
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
    const { game, placeCountries, twoCountry } = state.data;

    const currentUserId = UserProvider.getUserId();
    if (game && game.currentPlayer.userId === currentUserId) {
        const countryIdentifier = action.payload;

        switch (game.playState) {
            case PlayState.PlaceUnits: {
                if (placeCountries[countryIdentifier]) {
                    // Country was selected, de-select
                    return state.remove(x => x.placeCountries[countryIdentifier]);
                }

                // Select country
                const remainingUnits = game.unitsToPlace - Object.keys(placeCountries).reduce((sum, id) => sum + placeCountries[id], 0);

                return state.merge(x => x.placeCountries, {
                    [countryIdentifier]: remainingUnits
                });
            }

            case PlayState.Attack: {
                if (countryIdentifier === null) {
                    return state.set(x => x.twoCountry, {
                        originCountryIdentifier: null,
                        destinationCountryIdentifier: null,
                        numberOfUnits: 0
                    } as ITwoCountry);
                }

                const originSet = !!twoCountry.originCountryIdentifier;

                if (originSet) {
                    // Try to set destination country, has to belong to other player

                }

                if (!twoCountry.originCountryIdentifier || !!twoCountry.destinationCountryIdentifier) {
                    return state.set(x => x.twoCountry.originCountryIdentifier, countryIdentifier);
                }

                return state.set(x => x.twoCountry.destinationCountryIdentifier, countryIdentifier);
            }

            case PlayState.Move: {
                if (action.payload === null) {
                    return state.set(x => x.twoCountry, {
                        originCountryIdentifier: null,
                        destinationCountryIdentifier: null,
                        numberOfUnits: 0
                    } as ITwoCountry);
                }

                if (!twoCountry.originCountryIdentifier || !!twoCountry.destinationCountryIdentifier) {
                    return state.set(x => x.twoCountry.originCountryIdentifier, countryIdentifier);
                }

                return state.set(x => x.twoCountry.destinationCountryIdentifier, countryIdentifier);
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

export const updateFromResult = (state: IPlayState, action: IAction<GameActionResult>) => {
    const result = action.payload;

    return state
        .set(x => x.placeCountries, {})
        .set(x => x.twoCountry, {
            originCountryIdentifier: null,
            destinationCountryIdentifier: null,
            numberOfUnits: 0
        })
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

        [success(PLACE)]: updateFromResult,
        [success(ATTACK)]: updateFromResult,
        [success(END_TURN)]: updateFromResult
    });
};