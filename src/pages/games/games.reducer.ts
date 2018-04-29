import { makeImmutable } from "immuts";
import { GameSummary } from "../../external/imperaClients";
import { IAction, pending, success } from "../../lib/action";
import reducerMap from "../../lib/reducerMap";
import * as Actions from "./games.actions";

const initialState = makeImmutable({
    isLoading: false,
    games: {} as { [gameId: number]: GameSummary },
    openGames: [] as GameSummary[]
});

export type IMyGamesState = typeof initialState;

const refresh = (state: IMyGamesState, action: IAction<GameSummary[]>) => {
    // Convert to map
    let gameMap = {};

    if (action.payload) {
        for (let game of action.payload) {
            gameMap[game.id] = game;
        }
    }

    return state.__set(x => x, {
        isLoading: false,
        games: gameMap
    });
};

const refreshOpen = (state: IMyGamesState, action: IAction<GameSummary[]>) => {
    return state.__set(x => x, {
        isLoading: false,
        openGames: action.payload
    });
};

const loading = (state: IMyGamesState, action: IAction<void>) => {
    return state.__set(x => x.isLoading, true);
};

const surrender = (state: IMyGamesState, action: IAction<GameSummary>) => {
    const game = action.payload;

    return state.__set(x => x.games[game.id], game);
};

const remove = (state: IMyGamesState, action: IAction<GameSummary>) => {
    const game = action.payload;
    const { [game.id]: _, ...newGames } = state.games;
    return state.__set(x => x.games, newGames);
};

export const games = <TPayload>(
    state = initialState,
    action?: IAction<TPayload>) => {

    return reducerMap(action, state, {
        [pending(Actions.refresh.TYPE)]: loading,
        [success(Actions.refresh.TYPE)]: refresh,
        [success(Actions.surrender.TYPE)]: surrender,
        [success(Actions.remove.TYPE)]: remove,
        [success(Actions.leave.TYPE)]: remove,

        [pending(Actions.refreshOpen.TYPE)]: loading,
        [success(Actions.refreshOpen.TYPE)]: refreshOpen,
    });
};