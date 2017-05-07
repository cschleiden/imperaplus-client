import { IImmutable, makeImmutable } from "immuts";
import { LadderStanding, LadderSummary } from "../../external/imperaClients";
import { failed, IAction, pending, success } from "../../lib/action";
import reducerMap from "../../lib/reducerMap";
import { JOIN, REFRESH } from "./ladders.actions";

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