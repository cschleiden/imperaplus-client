import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { Ladder, LadderSummary } from "../../../external/imperaClients";
import { LadderClient } from "../../../external/LadderClient";
import __ from "../../../i18n/i18n";
import { AppThunkArg } from "../../../store";
import { MessageType, showMessage } from "../shared/message/message.slice";
import { getToken } from "../shared/session/session.selectors";

const initialState = {
    isLoading: false,
    ladders: {} as { [ladderId: number]: LadderSummary },
    /** Current ladder */
    ladder: null as Ladder,
};

export const fetchAll = createAsyncThunk<LadderSummary[], void, AppThunkArg>(
    "ladders/fetch-all",
    (_, thunkAPI) => {
        return thunkAPI.extra
            .createClient(getToken(thunkAPI.getState()), LadderClient)
            .getAll();
    }
);

export const fetch = createAsyncThunk<Ladder, string, AppThunkArg>(
    "ladders/fetch",
    (ladderId, thunkAPI) => {
        return thunkAPI.extra
            .createClient(getToken(thunkAPI.getState()), LadderClient)
            .get(ladderId);
    }
);

export const join = createAsyncThunk<void, string, AppThunkArg>(
    "ladders/join",
    async (ladderId, thunkAPI) => {
        await thunkAPI.extra
            .createClient(getToken(thunkAPI.getState()), LadderClient)
            .postJoin(ladderId);

        await thunkAPI.dispatch(fetchAll());

        thunkAPI.dispatch(
            showMessage({
                message: __("You are now in the queue"),
                type: MessageType.success,
            })
        );
    }
);

export const leave = createAsyncThunk<void, string, AppThunkArg>(
    "ladders/leave",
    async (ladderId, thunkAPI) => {
        await thunkAPI.extra
            .createClient(getToken(thunkAPI.getState()), LadderClient)
            .deleteJoin(ladderId);

        await thunkAPI.dispatch(fetchAll());

        thunkAPI.dispatch(
            showMessage({
                message: __("You have left the queue"),
                type: MessageType.success,
            })
        );
    }
);

const ladders = createSlice({
    name: "ladders",
    initialState,
    reducers: {},
    extraReducers: (b) => {
        b.addCase(fetchAll.pending, (state) => {
            state.isLoading = true;
        });
        b.addCase(fetchAll.fulfilled, (state, action) => {
            state.isLoading = false;
            state.ladders = action.payload;
        });

        b.addCase(fetch.pending, (state) => {
            state.isLoading = true;
        });
        b.addCase(fetch.fulfilled, (state, action) => {
            state.isLoading = false;
            state.ladder = action.payload;
        });
    },
});

export default ladders.reducer;
