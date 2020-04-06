import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { AppThunkArg } from "../../../store";
import { getToken } from "../shared/session/session.selectors";
import {
    fetchMapTemplate,
    MapTemplateCacheEntry,
} from "./play/mapTemplateCache";

export const loadMapPreview = createAsyncThunk<
    MapTemplateCacheEntry,
    string,
    AppThunkArg
>("games/map-preview", async (name, thunkAPI) => {
    return fetchMapTemplate(getToken(thunkAPI.getState()), name);
});

const mapPreview = createSlice({
    name: "mapPreview",
    initialState: {
        isLoading: true,
        mapTemplate: null as MapTemplateCacheEntry,
    },
    reducers: {},
    extraReducers: (b) => {
        b.addCase(loadMapPreview.pending, (state, action) => {
            state.isLoading = true;
        });

        b.addCase(loadMapPreview.fulfilled, (state, action) => {
            state.isLoading = false;
            state.mapTemplate = action.payload;
        });
    },
});

export default mapPreview.reducer;
