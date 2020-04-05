import { produce } from "immer";
import { Ladder, LadderSummary } from "../../external/imperaClients";
import { IAction, pending, success } from "../../lib/utils/action";
import reducerMap from "../../lib/utils/reducerMap";
import * as Actions from "./ladders.actions";

const initialState = makeImmutable({
    isLoading: false,
    ladders: {} as { [ladderId: number]: LadderSummary },
    /** Current ladder */
    ladder: null as Ladder,
});

export type ILaddersState = typeof initialState;

const refresh = (
    state: ILaddersState,
    action: ActionPayload<LadderSummary[]>
) => {
    // Convert to map
    let ladderMap = {};

    if (action.payload) {
        for (let ladder of action.payload) {
            ladderMap[ladder.id] = ladder;
        }
    }

    return state.__set(x => x, {
        isLoading: false,
        ladders: ladderMap,
    });
};

const pendingOpen = (state: ILaddersState, action: ActionPayload<void>) => {
    return state.__set(x => x, {
        isLoading: true,
        ladder: null,
    });
};

const open = (state: ILaddersState, action: ActionPayload<Ladder>) => {
    return state.__set(x => x, {
        isLoading: false,
        ladder: action.payload,
    });
};

const loading = (state: ILaddersState, action: ActionPayload<void>) => {
    return state.__set(x => x.isLoading, true);
};

export const ladders = <TPayload>(
    state = initialState,
    action?: ActionPayload<TPayload>
) => {
    return reducerMap(action, state, {
        [pending(Actions.refresh.TYPE)]: loading,
        [success(Actions.refresh.TYPE)]: refresh,

        [pending(Actions.open.TYPE)]: pendingOpen,
        [success(Actions.open.TYPE)]: open,
    });
};
