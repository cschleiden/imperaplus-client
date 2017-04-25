import { makeImmutable, IImmutable } from "immuts";
import reducerMap from "../../lib/reducerMap";
import { LadderSummary, LadderStanding } from "../../external/imperaClients";
import { IAction, success, pending, failed } from "../../lib/action";
import { REFRESH, JOIN } from "./ladders.actions";

const initialState = makeImmutable({
    isLoading: false,
    ladders: {} as { [ladderId: number]: LadderSummary }
});

export type ILaddersState = typeof initialState;

const refresh = (state: ILaddersState, action: IAction<LadderSummary[]>) => {
    // Convert to map
    let ladderMap = {};

    if (action.payload) {
        for (let ladder of action.payload) {
            ladderMap[ladder.id] = ladder;
        }
    }

    return state.merge(x => x, {
        isLoading: false,
        ladders: ladderMap
    });
};

const loading = (state: ILaddersState, action: IAction<void>) => {
    return state.set(x => x.isLoading, true);
};

export const ladders = <TPayload>(
    state = initialState,
    action?: IAction<TPayload>) => {

    return reducerMap(action, state, {
        [pending(REFRESH)]: loading,
        [success(REFRESH)]: refresh
    });
};