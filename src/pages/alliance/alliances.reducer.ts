import { IImmutable, makeImmutable } from "immuts";
import { failed, IAction, pending, success } from "../../lib/action";
import reducerMap from "../../lib/reducerMap";
import * as Actions from "./alliances.actions";
import { AllianceSummary, Alliance } from "../../external/imperaClients";

const initialState = makeImmutable({
    isLoading: false,
    alliances: [] as AllianceSummary[],
    /** Current alliance */
    alliance: null as Alliance
});

export type IAlliancesState = typeof initialState;

const refresh = (state: IAlliancesState, action: IAction<AllianceSummary[]>) => {
    return state.__set(x => x, {
        isLoading: false,
        alliances: action.payload
    });
};

const loading = (state: IAlliancesState, action: IAction<void>) => {
    return state.__set(x => x.isLoading, true);
};

export const alliances = <TPayload>(
    state = initialState,
    action?: IAction<TPayload>) => {

    return reducerMap(action, state, {
        [pending(Actions.refresh.TYPE)]: loading,
        [success(Actions.refresh.TYPE)]: refresh,

        // [pending(Actions.open.TYPE)]: pendingOpen,
        // [success(Actions.open.TYPE)]: open
    });
};