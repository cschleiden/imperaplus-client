import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface ILookupSetPayload<T> {
    key: string;
    data: T[];
}

const general = createSlice({
    name: "general",
    initialState: {
        isNavOpen: false,
        lookup: {} as { [key: string]: any[] },
        title: "",
    },
    reducers: {
        openClose: (state, action: PayloadAction<boolean>) => {
            state.isNavOpen = action.payload;
        },
        lookupSet: (
            state,
            action: PayloadAction<ILookupSetPayload<unknown>>
        ) => {
            state.lookup[action.payload.key] = action.payload.data;
        },
        locationChange: (state) => {
            state.isNavOpen = false;
        },
        setTitle: (state, action) => {
            const { payload: title } = action;
            state.title = title;
        },
    },
});

export default general.reducer;

export const { openClose, lookupSet, locationChange, setTitle } =
    general.actions;
