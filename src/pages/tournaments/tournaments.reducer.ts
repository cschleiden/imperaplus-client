import { makeImmutable, IImmutable } from "immuts";
import reducerMap from "../../lib/reducerMap";
import { TournamentClient, TournamentSummary, Tournament } from "../../external/imperaClients";
import { IAction, success, pending, failed } from "../../lib/action";
import { REFRESH, JOIN, LOAD } from "./tournaments.actions";

const initialState = makeImmutable({
    isLoading: false,
    tournaments: [] as TournamentSummary[],
    tournament: null as Tournament
});

export type ITournamentsState = typeof initialState;

const refresh = (state: ITournamentsState, action: IAction<TournamentSummary[]>) => {
    return state.merge(x => x, {
        isLoading: false,
        tournaments: action.payload
    });
};

const load = (state: ITournamentsState, action: IAction<Tournament>) => {
    return state.merge(x => x, {
        isLoading: false,
        tournament: action.payload
    });
};

const loading = (state: ITournamentsState, action: IAction<void>) => {
    return state.set(x => x.isLoading, true);
};

export const tournaments = <TPayload>(
    state = initialState,
    action?: IAction<TPayload>) => {

    return reducerMap(action, state, {
        [pending(REFRESH)]: loading,
        [success(REFRESH)]: refresh,

        [pending(LOAD)]: loading,
        [success(LOAD)]: load
    });
};