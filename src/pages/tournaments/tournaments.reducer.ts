import { makeImmutable, IImmutable } from "immuts";
import reducerMap from "../../lib/reducerMap";
import { TournamentClient, TournamentSummary } from "../../external/imperaClients";
import { IAction, success, pending, failed } from "../../lib/action";
import { REFRESH, JOIN } from "./tournaments.actions";

const initialState = makeImmutable({
    isLoading: false,
    tournaments: {} as { [tournamentId: number]: TournamentSummary }
});

export type ITournamentsState = typeof initialState;

const refresh = (state: ITournamentsState, action: IAction<TournamentSummary[]>) => {
    // Convert to map
    let tournamentMap = {};

    if (action.payload) {
        for (let tournament of action.payload) {
            tournamentMap[tournament.id] = tournament;
        }
    }

    return state.merge(x => x, {
        isLoading: false,
        tournaments: tournamentMap
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
        [success(REFRESH)]: refresh
    });
};