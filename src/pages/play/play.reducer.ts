import { makeImmutable, IImmutable } from "immuts";
import reducerMap from "../../lib/reducerMap";
import { GameSummary, GameType, GameState, AttackOptions, MoveOptions, GameActionResult, ActionResult, Game } from "../../external/imperaClients";
import { IAction, success, pending, failed } from "../../lib/action";
import { EXCHANGE, ATTACK, SWITCH_GAME, TOGGLE_SIDEBAR } from "./play.actions";

const initialState = makeImmutable({
    gameId: 0,
    game: null as Game,

    games: [] as GameSummary[],

    twoCountry: {
        originCountryIdentifier: null as string,
        destinationCountryIdentifier: null as string,
        numberOfUnits: 0
    },

    attacksLeftPerTurn: 0,
    movesLeftPerTurn: 0,

    sidebarOpen: false,
    operationInProgress: false,

    historyActive: false
});

export type IPlayState = typeof initialState;

//
// Ui actions
//
export const switchGame = (state: IPlayState, action: IAction<Game>) => {
    const game = action.payload;

    return initialState.merge(x => x, {
        gameId: game.id,
        game: game
    });
};

export const toggleSidebar = (state: IPlayState, action: IAction<void>) => {
    return state.set(x => x.sidebarOpen, !state.data.sidebarOpen);
};

//
// Play actions
//
export const attack = (state: IPlayState, action: IAction<GameActionResult>) => {
    const result = action.payload;

    if (result.actionResult === ActionResult.Successful) {
        // Attack was successful
    } else {
        // Attack failed
    }

    return state;
};

/** Reducer */
export const play = <TPayload>(
    state = initialState,
    action?: IAction<TPayload>) => {

    return reducerMap(action, state, {
        [TOGGLE_SIDEBAR]: toggleSidebar,
        [success(SWITCH_GAME)]: switchGame,

        [success(ATTACK)]: attack
    });
};