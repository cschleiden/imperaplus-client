import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { NewsClient, NewsItem } from "../../../external/imperaClients";
import { AppThunkArg } from "../../../store";
import { getToken } from "../shared/session/session.selectors";

export const fetch = createAsyncThunk<NewsItem[], void, AppThunkArg>(
    "news/fetch",
    (_, thunkApi) => {
        return thunkApi.extra
            .createClient(getToken(thunkApi.getState()), NewsClient)
            .getAll();
    }
);

const slice = createSlice({
    name: "news",
    initialState: {
        isLoading: false,
        news: [] as NewsItem[],
    },
    reducers: {},
    extraReducers: (b) => {
        b.addCase(fetch.pending, (state, action) => {
            state.isLoading = true;
        });

        b.addCase(fetch.rejected, (state, action) => {});

        b.addCase(fetch.fulfilled, (state, action) => {
            state.news = action.payload;
            state.isLoading = false;
        });
    },
});

export default slice.reducer;
