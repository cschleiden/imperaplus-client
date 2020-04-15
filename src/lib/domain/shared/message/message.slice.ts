import { createSlice, PayloadAction } from "@reduxjs/toolkit";

const initialState = {
    message: null,
};
export type IMessageState = typeof initialState;

export enum MessageType {
    info,
    success,
    warning,
    error,
}

export interface IMessage {
    message: string;
    type: MessageType;
}

const slice = createSlice({
    name: "message",
    initialState,
    reducers: {
        showMessage: (state, action: PayloadAction<IMessage>) => {
            state.message = action.payload;
        },
        clearMessage: state => {
            state.message = null;
        },
    },
});

export const { showMessage, clearMessage } = slice.actions;
export default slice.reducer;
