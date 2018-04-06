import { push } from "react-router-redux";
import { makePromiseAction } from "../../lib/action";
import { AllianceCreationOptions, AllianceClient, AllianceSummary, AccountClient } from "../../external/imperaClients";
import { updateUserInfo } from "../../common/session/session.actions";

export const refresh = makePromiseAction<void, AllianceSummary[]>(
    "alliances-refresh", (input, dispatch, getState, deps) =>
        ({
            payload: {
                promise: deps.getCachedClient(AllianceClient).getAll()
            },
            options: {
                useMessage: true
            }
        }));

export const create = makePromiseAction(
    "alliance-create", (input: AllianceCreationOptions, dispatch, getState, deps) =>
        ({
            payload: {
                promise: deps.getCachedClient(AllianceClient).post(input).then(alliance => {
                    // Refresh profile, the user is now a member of an alliance
                    deps.getCachedClient(AccountClient).getUserInfo().then(userInfo => {
                        dispatch(updateUserInfo(userInfo));
                    });

                    dispatch(push(`/game/alliances/${alliance.id}`));
                })
            }
        })
);