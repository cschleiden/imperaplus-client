import { IImmutable, makeImmutable } from "immuts";
import { Ladder, LadderStanding, LadderSummary } from "../../external/imperaClients";
import { failed, IAction, pending, success } from "../../lib/action";
import reducerMap from "../../lib/reducerMap";
import * as Actions from "./ladders.actions";

const initialState = makeImmutable({
    isLoading: false,
    ladders: {} as { [ladderId: number]: LadderSummary },
    /** Current ladder */
    ladder: null as Ladder
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

const pendingOpen = (state: ILaddersState, action: IAction<void>) => {
    return state.merge(x => x, {
        isLoading: true,
        ladder: null
    });
};

const open = (state: ILaddersState, action: IAction<Ladder>) => {
    return state.merge(x => x, {
        isLoading: false,
        ladder: action.payload
    });
};

const loading = (state: ILaddersState, action: IAction<void>) => {
    return state.set(x => x.isLoading, true);
};

export const ladders = <TPayload>(
    state = initialState,
    action?: IAction<TPayload>) => {

    return reducerMap(action, state, {
        [pending(Actions.refresh.TYPE)]: loading,
        [success(Actions.refresh.TYPE)]: refresh,

        [pending(Actions.open.TYPE)]: pendingOpen,
        [success(Actions.open.TYPE)]: open
    });
};