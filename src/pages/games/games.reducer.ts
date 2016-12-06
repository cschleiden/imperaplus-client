import { makeImmutable, IImmutable } from "immuts";
import reducerMap from "../../lib/reducerMap";
import { GameSummary, GameType, GameSummaryType, GameSummaryState } from "../../external/imperaClients";
import { IAction, success, pending, failed } from "../../lib/action";
import { REFRESH } from "./games.actions";

const initialState = makeImmutable({
    isLoading: false,
    games: [] as GameSummary[]
});

export type INewsState = typeof initialState;

const refresh = (state: INewsState, action: IAction<GameSummary[]>) => {
    return state
        .set(x => x.games, action.payload)
        .set(x => x.isLoading, false);
};

const loading = (state: INewsState, action: IAction<void>) => {
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