import { produce } from "immer";
import {
    Alliance,
    AllianceJoinRequest,
    AllianceSummary,
} from "../../external/imperaClients";
import { IAction, pending, success } from "../../lib/utils/action";
import reducerMap from "../../lib/utils/reducerMap";
import * as Actions from "./alliances.actions";

const initialState = makeImmutable({
    isLoading: false,
    alliances: [] as AllianceSummary[],
    /** Current alliance */
    alliance: null as Alliance,
    /** Requests for currenct alliance */
    requests: null as AllianceJoinRequest[],
    /** Requests for user */
    pendingRequests: null as AllianceJoinRequest[],
});

export type IAlliancesState = typeof initialState;

const refresh = (
    state: IAlliancesState,
    action: ActionPayload<AllianceSummary[]>
) => {
    return state.__set(x => x, {
        isLoading: false,
        alliances: action.payload,
    });
};

const loading = (state: IAlliancesState, action: ActionPayload<void>) => {
    return state.__set(x => x.isLoading, true);
};

const get = (
    state: IAlliancesState,
    action: ActionPayload<typeof Actions.get.PAYLOAD>
) => {
    return state.__set(x => x.alliance, action.payload);
};

const getRequests = (
    state: IAlliancesState,
    action: ActionPayload<typeof Actions.getRequests.PAYLOAD>
) => {
    return state.__set(x => x.requests, action.payload);
};

const getAllRequests = (
    state: IAlliancesState,
    action: ActionPayload<typeof Actions.getAllRequests.PAYLOAD>
) => {
    return state.__set(x => x.pendingRequests, action.payload);
};

export const alliances = <TPayload>(
    state = initialState,
    action?: ActionPayload<TPayload>
) => {
    return reducerMap(action, state, {
        [pending(Actions.refresh.TYPE)]: loading,
        [success(Actions.refresh.TYPE)]: refresh,

        [pending(Actions.get.TYPE)]: loading,
        [success(Actions.get.TYPE)]: get,

        [success(Actions.getRequests.TYPE)]: getRequests,
        [success(Actions.getAllRequests.TYPE)]: getAllRequests,
    });
};
