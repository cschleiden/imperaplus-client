import { makeImmutable, IImmutable } from "immuts";
import reducerMap from "../../lib/reducerMap";
import { GameSummary, GameType, GameState } from "../../external/imperaClients";
import { IAction, success, pending, failed } from "../../lib/action";
import { REFRESH, SURRENDER, REMOVE, LEAVE } from "./games.actions";

const initialState = makeImmutable({
    isLoading: false,
    games: {} as { [gameId: number]: GameSummary }
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

    return state.merge(x => x, {
        isLoading: false,
        games: gameMap
    });
};

const loading = (state: IMyGamesState, action: IAction<void>) => {
    return state.set(x => x.isLoading, true);
};

const surrender = (state: IMyGamesState, action: IAction<GameSummary>) => {
    const game = action.payload;

    return state.merge(x => x.games[game.id], game);
};

const remove = (state: IMyGamesState, action: IAction<GameSummary>) => {
    const game = action.payload;

    return state.remove(x => x.games[game.id]);
};

export const games = <TPayload>(
    state = initialState,
    action?: IAction<TPayload>) => {

    return reducerMap(action, state, {
        [pending(REFRESH)]: loading,
        [success(REFRESH)]: refresh,
        [success(SURRENDER)]: surrender,
        [success(REMOVE)]: remove
    });
};