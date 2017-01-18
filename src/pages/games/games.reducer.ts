import { makeImmutable, IImmutable } from "immuts";
import reducerMap from "../../lib/reducerMap";
import { GameSummary, GameType, GameState } from "../../external/imperaClients";
import { IAction, success, pending, failed } from "../../lib/action";
import { REFRESH } from "./games.actions";

const initialState = makeImmutable({
    isLoading: false,
    games: [] as GameSummary[]
});

export type IMyGamesState = typeof initialState;

const refresh = (state: IMyGamesState, action: IAction<GameSummary[]>) => {
    return state
        .set(x => x.games, action.payload)
        .set(x => x.isLoading, false);
};

const loading = (state: IMyGamesState, action: IAction<void>) => {
    return state.set(x => x.isLoading, true);
};

export const games = <TPayload>(
    state = initialState,
    action?: IAction<TPayload>) => {

    return reducerMap(action, state, {
        [pending(REFRESH)]: loading,
        [success(REFRESH)]: refresh
    });
};