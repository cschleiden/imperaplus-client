import { PayloadAction, ActionCreatorWithPayload } from "@reduxjs/toolkit";
import { IState } from "./reducers";
import { getUserId } from "./lib/domain/shared/session/session.selectors";
import { AppThunk } from "./store";

export type UserPayloadAction<P, M = {}> = PayloadAction<
    P & UserIdPayload,
    string
>;

export type UserIdPayload = { userId: string };

export function withUserId<P>(state: IState, payload: P): P & UserIdPayload {
    return {
        ...payload,
        userId: getUserId(state),
    };
}

/**
 * Gets the user id from the state, combines it with the user id and dispatches the passed in action
 *
 * @param action Action to dispatch
 * @param payload Payload for action without user id
 */
export const withUser =
    <P>(
        action: ActionCreatorWithPayload<P & UserIdPayload, string>,
        payload: P
    ): AppThunk =>
    async (dispatch, getState) => {
        const userId = getUserId(getState());

        dispatch(action({ ...payload, userId }));
    };
