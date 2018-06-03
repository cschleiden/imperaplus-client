import { push } from "react-router-redux";
import { updateUserInfo } from "../../common/session/session.actions";
import { FixedAccountClient } from "../../external/accountClient";
import { AllianceClient, AllianceCreationOptions, AllianceSummary, AllianceJoinRequestState } from "../../external/imperaClients";
import { makePromiseAction } from "../../lib/action";

export const refresh = makePromiseAction<void, AllianceSummary[]>(
    "alliances-refresh", (input, dispatch, getState, deps) =>
        ({
            payload: {
                promise: deps.getCachedClient(AllianceClient).getAll()
            }
        }));

export const create = makePromiseAction(
    "alliance-create", (input: AllianceCreationOptions, dispatch, getState, deps) =>
        ({
            payload: {
                promise: deps.getCachedClient(AllianceClient).create(input).then(alliance => {
                    // Refresh profile, the user is now a member of an alliance
                    deps.getCachedClient(FixedAccountClient).getUserInfo().then(userInfo => {
                        dispatch(updateUserInfo(userInfo));
                        dispatch(push(`/game/alliances/${alliance.id}`));
                    });
                })
            }
        })
);

export const deleteAlliance = makePromiseAction(
    "alliance-delete", (allianceId: string, dispatch, getState, deps) =>
        ({
            payload: {
                promise: deps.getCachedClient(AllianceClient).delete(allianceId).then(() => {
                    // Refresh profile, the user is not in an alliance anymore
                    deps.getCachedClient(FixedAccountClient).getUserInfo().then(userInfo => {
                        dispatch(updateUserInfo(userInfo));
                    });

                    dispatch(push(`/game/alliances`));
                })
            }
        })
);

export const getRequests = makePromiseAction(
    "alliance-get-requests", (allianceId: string, dispatch, getState, deps) => {
        const client = deps.getCachedClient(AllianceClient);

        return {
            payload: {
                promise: client.getRequests(allianceId)
            }
        };
    });


export const get = makePromiseAction(
    "alliance-get", (id: string, dispatch, getState, deps) => {
        const client = deps.getCachedClient(AllianceClient);

        return {
            payload: {
                promise: client.get(id).then(alliance => {
                    const userInfo = getState().session.userInfo;
                    if (userInfo.allianceAdmin && userInfo.allianceId === id) {
                        // If the user is an admin of the current alliance, also retrieve requests for the alliance
                        dispatch(getRequests(id));
                    }

                    if (!userInfo.allianceId) {
                        // User is not member of any alliance, get pending requests
                        dispatch(getAllRequests(null));
                    }

                    return alliance;
                })
            }
        };
    });

export interface IAllianceRequestOptions {
    allianceId: string;
    reason: string;
}
export const requestJoin = makePromiseAction(
    "alliance-join", (input: IAllianceRequestOptions, dispatch, getState, deps) =>
        ({
            payload: {
                promise: deps.getCachedClient(AllianceClient).requestJoin(input.allianceId, input.reason)
            },
            options: {
                afterSuccess: () => {
                    // Update the requests
                    dispatch(getAllRequests(null));
                }
            }
        })
);

export const leave = makePromiseAction(
    "alliance-leave", (allianceId: string, dispatch, getState, deps) =>
        ({
            payload: {
                promise: deps.getCachedClient(AllianceClient).removeMember(allianceId, getState().session.userInfo.userId!).then(() => {
                    // Refresh profile, the user is now a member of an alliance
                    deps.getCachedClient(FixedAccountClient).getUserInfo().then(userInfo => {
                        dispatch(updateUserInfo(userInfo));
                        dispatch(push(`/game/alliances`));
                    });
                })
            }
        })
);

export const getAllRequests = makePromiseAction(
    "alliance-get-all-requests", (_, dispatch, getState, deps) =>
        ({
            payload: {
                promise: deps.getCachedClient(AllianceClient).getAllRequests()
            }
        })
);

export interface IUpdateRequestOptions {
    allianceId: string;
    requestId: string;
    state: AllianceJoinRequestState;
}
export const updateRequest = makePromiseAction(
    "alliance-update-request", (input: IUpdateRequestOptions, dispatch, getState, deps) =>
        ({
            payload: {
                promise: deps.getCachedClient(AllianceClient).updateRequest(input.allianceId, input.requestId, input.state)
            },
            options: {
                afterSuccess: () => {
                    if (input.state === AllianceJoinRequestState.Approved) {
                        // Update alliance if request was granted
                        dispatch(get(input.allianceId));
                    }
                    dispatch(getRequests(input.allianceId));
                }
            }
        })
);