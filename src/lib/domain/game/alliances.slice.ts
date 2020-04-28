import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import Router from "next/router";
import { FixedAccountClient } from "../../../external/accountClient";
import { AllianceClient } from "../../../external/AllianceClient";
import {
    Alliance,
    AllianceCreationOptions,
    AllianceJoinRequest,
    AllianceJoinRequestState,
    AllianceSummary,
} from "../../../external/imperaClients";
import { AppThunkArg } from "../../../store";
import { getToken } from "../shared/session/session.selectors";
import { updateUserInfo } from "../shared/session/session.slice";

const initialState = {
    isLoading: false,
    alliances: [] as AllianceSummary[],
    /** Current alliance */
    alliance: null as Alliance,
    /** Requests for currenct alliance */
    requests: null as AllianceJoinRequest[],
    /** Requests for user */
    pendingRequests: null as AllianceJoinRequest[],
};

export const create = createAsyncThunk<
    AllianceSummary,
    AllianceCreationOptions,
    AppThunkArg
>("alliances/create", async (input, thunkAPI) => {
    const alliance = await thunkAPI.extra
        .createClient(getToken(thunkAPI.getState()), AllianceClient)
        .create(input);

    const userInfo = await thunkAPI.extra
        .createClient(getToken(thunkAPI.getState()), FixedAccountClient)
        .getUserInfo();

    thunkAPI.dispatch(updateUserInfo(userInfo));
    Router.push(
        "/game/alliances/[allianceId]",
        `/game/alliances/${alliance.id}`
    );

    return alliance;
});

export const deleteAlliance = createAsyncThunk<void, string, AppThunkArg>(
    "alliances/create",
    async (allianceId, thunkAPI) => {
        await thunkAPI.extra
            .createClient(getToken(thunkAPI.getState()), AllianceClient)
            .delete(allianceId);

        // Refresh profile, the user is not in an alliance anymore
        const userInfo = await thunkAPI.extra
            .createClient(getToken(thunkAPI.getState()), FixedAccountClient)
            .getUserInfo();

        thunkAPI.dispatch(updateUserInfo(userInfo));
        Router.push(`/game/alliances`);
    }
);

export const getRequests = createAsyncThunk<
    AllianceJoinRequest[],
    string,
    AppThunkArg
>("alliances/get-requests", (allianceId, thunkAPI) => {
    return thunkAPI.extra
        .createClient(getToken(thunkAPI.getState()), AllianceClient)
        .getRequests(allianceId);
});

export const getAllRequests = createAsyncThunk<
    AllianceJoinRequest[],
    void,
    AppThunkArg
>("alliances/get-all-requests", (_, thunkAPI) => {
    return thunkAPI.extra
        .createClient(getToken(thunkAPI.getState()), AllianceClient)
        .getAllRequests();
});

export interface IAllianceRequestOptions {
    allianceId: string;
    reason: string;
}
export const requestJoin = createAsyncThunk<
    void,
    IAllianceRequestOptions,
    AppThunkArg
>("alliances/get-all-requests", async (input, thunkAPI) => {
    await thunkAPI.extra
        .createClient(getToken(thunkAPI.getState()), AllianceClient)
        .requestJoin(input.allianceId, input.reason);

    await thunkAPI.dispatch(getAllRequests());
});

export const leave = createAsyncThunk<void, string, AppThunkArg>(
    "alliances/leave",
    async (input, thunkAPI) => {
        const userId = thunkAPI.getState().session.userInfo.userId;

        await thunkAPI.extra
            .createClient(getToken(thunkAPI.getState()), AllianceClient)
            .removeMember(input, userId);

        await thunkAPI.dispatch(getAllRequests());

        const userInfo = await thunkAPI.extra
            .createClient(getToken(thunkAPI.getState()), FixedAccountClient)
            .getUserInfo();

        thunkAPI.dispatch(updateUserInfo(userInfo));
        Router.push(`/game/alliances`);
    }
);

export interface IUpdateRequestOptions {
    allianceId: string;
    requestId: string;
    state: AllianceJoinRequestState;
}
export const updateRequest = createAsyncThunk<
    void,
    IUpdateRequestOptions,
    AppThunkArg
>("alliances/update-request", async (input, thunkAPI) => {
    await thunkAPI.extra
        .createClient(getToken(thunkAPI.getState()), AllianceClient)
        .updateRequest(input.allianceId, input.requestId, input.state);

    if (input.state === AllianceJoinRequestState.Approved) {
        // Update alliance if request was granted
        await thunkAPI.dispatch(fetch(input.allianceId));
    }

    const userInfo = await thunkAPI.extra
        .createClient(getToken(thunkAPI.getState()), FixedAccountClient)
        .getUserInfo();

    thunkAPI.dispatch(updateUserInfo(userInfo));
    Router.push(`/game/alliances`);
});

export interface IRemoveMemberOptions {
    allianceId: string;
    userId: string;
}
export const removeMember = createAsyncThunk<
    void,
    IRemoveMemberOptions,
    AppThunkArg
>("alliances/remove-member", async (input, thunkAPI) => {
    await thunkAPI.extra
        .createClient(getToken(thunkAPI.getState()), AllianceClient)
        .removeMember(input.allianceId, input.userId);

    await thunkAPI.dispatch(fetch(input.allianceId));
});

export interface IChangeAdminOptions {
    allianceId: string;
    userId: string;
    isAdmin: boolean;
}
export const changeAdmin = createAsyncThunk<
    void,
    IChangeAdminOptions,
    AppThunkArg
>("alliances/remove-member", async (input, thunkAPI) => {
    await thunkAPI.extra
        .createClient(getToken(thunkAPI.getState()), AllianceClient)
        .changeAdmin(input.allianceId, input.userId, input.isAdmin);

    await thunkAPI.dispatch(fetch(input.allianceId));
});

export const fetch = createAsyncThunk<Alliance, string, AppThunkArg>(
    "alliances/fetch",
    async (allianceId, thunkAPI) => {
        const alliance = await thunkAPI.extra
            .createClient(getToken(thunkAPI.getState()), AllianceClient)
            .get(allianceId);

        const userInfo = thunkAPI.getState().session.userInfo;
        if (userInfo.allianceAdmin && userInfo.allianceId === allianceId) {
            // If the user is an admin of the current alliance, also retrieve requests for the alliance
            await thunkAPI.dispatch(getRequests(allianceId));
        }

        if (!userInfo.allianceId) {
            // User is not member of any alliance, get pending requests
            await thunkAPI.dispatch(getAllRequests());
        }

        return alliance;
    }
);

export const fetchAll = createAsyncThunk<AllianceSummary[], void, AppThunkArg>(
    "alliances/fetch-all",
    (_, thunkAPI) => {
        return thunkAPI.extra
            .createClient(getToken(thunkAPI.getState()), AllianceClient)
            .getAll();
    }
);

const alliances = createSlice({
    name: "alliances",
    initialState,
    reducers: {},
    extraReducers: (b) => {
        // Fetch all
        b.addCase(fetchAll.pending, (state) => {
            state.isLoading = true;
        });
        b.addCase(fetchAll.fulfilled, (state, action) => {
            state.isLoading = false;
            state.alliances = action.payload;
            state.alliances.sort(
                (a, b) => b.numberOfMembers - a.numberOfMembers
            );
        });

        // Fetch
        b.addCase(fetch.pending, (state) => {
            state.isLoading = true;
        });
        b.addCase(fetch.fulfilled, (state, action) => {
            state.isLoading = false;
            state.alliance = action.payload;
        });

        b.addCase(getRequests.fulfilled, (state, action) => {
            state.requests = action.payload;
        });

        b.addCase(getAllRequests.fulfilled, (state, action) => {
            state.pendingRequests = action.payload;
        });
    },
});

export default alliances.reducer;
