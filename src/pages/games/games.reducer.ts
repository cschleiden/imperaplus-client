import { IImmutable, makeImmutable } from "immuts";
import { GameState, GameSummary, GameType } from "../../external/imperaClients";
import { failed, IAction, pending, success } from "../../lib/action";
import reducerMap from "../../lib/reducerMap";
import { LEAVE, REFRESH, REMOVE, SURRENDER } from "./games.actions";

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
    const { [game.id]: _, ...newGames } = state.data.games;
    return state.set(x => x.games, newGames);
};

export const games = <TPayload>(
    state = initialState,
    action?: IAction<TPayload>) => {

    return reducerMap(action, state, {
        [pending(REFRESH)]: loading,
        [success(REFRESH)]: refresh,
        [success(SURRENDER)]: surrender,
        [success(REMOVE)]: remove,
        [success(LEAVE)]: remove
    });
};