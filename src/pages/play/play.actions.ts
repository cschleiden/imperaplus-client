import { IAction, makePromiseAction } from "../../lib/action";
import { PlayClient, GameActionResult, MoveOptions, AttackOptions, Game, GameClient, PlaceUnitsOptions } from "../../external/imperaClients";

export const SWITCH_GAME = "play-switch-game";
export const switchGame = makePromiseAction<number, Game>((gameId, dispatch, getState, deps) =>
    ({
        type: SWITCH_GAME,
        payload: {
            promise: deps.getCachedClient(GameClient).get(gameId)
        }
    }));

export const TOGGLE_SIDEBAR = "play-toggle-sidebar";
export const toggleSidebar = (): IAction<void> => ({
    type: TOGGLE_SIDEBAR
});

export const INPROGRESS = "play-in-progress";
export const inProgress = (isActive: boolean): IAction<boolean> => ({
    type: INPROGRESS,
    payload: isActive
});

export const PLACE = "play-place";
export const place = makePromiseAction<void, GameActionResult>((gameId, dispatch, getState, deps) => {
    const playState = getState().play.data;

    const options = Object.keys(playState.placeCountries).map(ci => ({
        countryIdentifier: ci,
        numberOfUnits: playState.placeCountries[ci]
    } as PlaceUnitsOptions));

    dispatch(inProgress(true));

    return {
        type: PLACE,
        payload: {
            promise: deps.getCachedClient(PlayClient).postPlace(playState.gameId, options)
        },
        options: {
            useMessage: true,
            afterSuccess: () => dispatch(inProgress(true))
        }
    };
});

export const EXCHANGE = "play-exchange";
export const exchange = makePromiseAction<void, GameActionResult>((gameId, dispatch, getState, deps) =>
    ({
        type: EXCHANGE,
        payload: {
            promise: deps.getCachedClient(PlayClient).postExchange(getState().play.data.gameId)
        },
        options: {
            useMessage: true
        }
    }));

export const SELECT_COUNTRY = "play-country-select";
export const selectCountry = (countryIdentifier: string): IAction<string> => ({
    type: SELECT_COUNTRY,
    payload: countryIdentifier
});

export const SET_PLACE_UNITS = "play-place-set-units";
export interface ISetPlaceUnitsPayload {
    countryIdentifier: string;
    units: number;
};
export const setPlaceUnits = (countryIdentifier: string, units: number): IAction<ISetPlaceUnitsPayload> => ({
    type: SET_PLACE_UNITS,
    payload: {
        countryIdentifier,
        units
    }
});

export const ATTACK = "play-attack";
export const attack = makePromiseAction<void, GameActionResult>((input, dispatch, getState, deps) => {
    const playState = getState().play.data;

    return {
        type: ATTACK,
        payload: {
            promise: deps.getCachedClient(PlayClient).postAttack(playState.gameId, {
                originCountryIdentifier: playState.twoCountry.originCountryIdentifier,
                destinationCountryIdentifier: playState.twoCountry.destinationCountryIdentifier,
                numberOfUnits: playState.twoCountry.numberOfUnits
            })
        },
        options: {
            useMessage: true
        }
    };
});

export const END_ATTACK = "play-end-attack";
export const endAttack = makePromiseAction<void, GameActionResult>((_, dispatch, getState, deps) => {
    const playState = getState().play.data;

    return {
        type: END_ATTACK,
        payload: {
            promise: deps.getCachedClient(PlayClient).postEndAttack(playState.gameId)
        },
        options: {
            useMessage: true
        }
    };
});

export const MOVE = "play-move";
export const move = makePromiseAction<void, GameActionResult>((_, dispatch, getState, deps) => {
    const playState = getState().play.data;

    return {
        type: MOVE,
        payload: {
            promise: deps.getCachedClient(PlayClient).postMove(playState.gameId, {
                originCountryIdentifier: playState.twoCountry.originCountryIdentifier,
                destinationCountryIdentifier: playState.twoCountry.destinationCountryIdentifier,
                numberOfUnits: playState.twoCountry.numberOfUnits
            })
        },
        options: {
            useMessage: true
        }
    };
});

export const END_TURN = "play-end-turn";
export const endTurn = makePromiseAction<void, Game>((_, dispatch, getState, deps) => {
    const playState = getState().play.data;

    return {
        type: END_TURN,
        payload: {
            promise: deps.getCachedClient(PlayClient).postEndTurn(playState.gameId)
        },
        options: {
            useMessage: true
        }
    };
});