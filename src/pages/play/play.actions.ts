import { IAction, makePromiseAction } from "../../lib/action";
import { PlayClient, GameActionResult, MoveOptions, AttackOptions, Game, GameClient } from "../../external/imperaClients";

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

export const PLACE = "play-place";
export const place = makePromiseAction<void, GameActionResult>((gameId, dispatch, getState, deps) => {
    const playState = getState().play.data;

    return {
        type: PLACE,
        payload: {
            promise: deps.getCachedClient(PlayClient).postPlace(playState.gameId, []) // TODO
        },
        options: {
            useMessage: true
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
        type: END_ATTACK,
        payload: {
            promise: deps.getCachedClient(PlayClient).postEndTurn(playState.gameId)
        },
        options: {
            useMessage: true
        }
    };
});