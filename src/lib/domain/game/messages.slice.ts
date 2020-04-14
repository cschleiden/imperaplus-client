import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import Router from "next/router";
import {
    FolderInformation,
    Message,
    MessageFolder,
    SendMessage,
} from "../../../external/imperaClients";
import { MessageClient } from "../../../external/MessageClient";
import { AppThunkArg } from "../../../store";
import { getToken } from "../shared/session/session.selectors";
import { refreshNotifications } from "../shared/session/session.slice";

const initialState = {
    isLoading: false,
    folderInformation: null as FolderInformation[],
    currentFolder: null as MessageFolder,
    currentMessages: [] as Message[],

    currentMessage: null as Message,
};

export type IMessagesState = typeof initialState;

export interface ISwitchFolderPayload {
    folder: MessageFolder;
    messages: Message[];
}
export const switchFolder = createAsyncThunk<
    ISwitchFolderPayload,
    MessageFolder,
    AppThunkArg
>("messages/switch-folder", async (messageFolder, thunkAPI) => {
    const messages = await thunkAPI.extra
        .createClient(getToken(thunkAPI.getState()), MessageClient)
        .getAll(messageFolder);

    return {
        folder: messageFolder,
        messages,
    };
});

export const fetch = createAsyncThunk<FolderInformation[], void, AppThunkArg>(
    "messages/fetch",
    async (_, thunkAPI) => {
        const folders = await thunkAPI.extra
            .createClient(getToken(thunkAPI.getState()), MessageClient)
            .getFolderInformation();

        await thunkAPI.dispatch(
            switchFolder(thunkAPI.getState().messages.currentFolder)
        );

        return folders;
    }
);

export const fetchMessage = createAsyncThunk<Message, string, AppThunkArg>(
    "messages/fetchMessage",
    async (messageId, thunkAPI) => {
        const client = thunkAPI.extra.createClient(
            getToken(thunkAPI.getState()),
            MessageClient
        );

        const message = await client.get(messageId);

        if (!message.isRead) {
            await client.patchMarkRead(message.id);
            message.isRead = true;

            // Ensure notifications are up-to-date
            await thunkAPI.dispatch(refreshNotifications());
        }

        return message;
    }
);

export const sendMessage = createAsyncThunk<void, SendMessage, AppThunkArg>(
    "messages/send",
    async (message, thunkAPI) => {
        const client = thunkAPI.extra.createClient(
            getToken(thunkAPI.getState()),
            MessageClient
        );

        await client.postSend(message);

        Router.push("/game/messages");
    }
);

export const deleteMessage = createAsyncThunk<void, string, AppThunkArg>(
    "messages/delete",
    async (messageId, thunkAPI) => {
        const client = thunkAPI.extra.createClient(
            getToken(thunkAPI.getState()),
            MessageClient
        );

        await client.delete(messageId);

        // Take the easy way, just refresh everything after delete
        await thunkAPI.dispatch(fetch());
        await thunkAPI.dispatch(refreshNotifications());
    }
);

const loading = (state: IMessagesState) => {
    state.isLoading = true;
};

const messages = createSlice({
    name: "messages",
    initialState,
    reducers: {},
    extraReducers: (b) => {
        b.addCase(switchFolder.pending, loading);
        b.addCase(switchFolder.fulfilled, (state, action) => {
            const { folder, messages } = action.payload;

            if (messages) {
                messages.sort(
                    (a, b) =>
                        new Date(b.sentAt).getTime() -
                        new Date(a.sentAt).getTime()
                );
            }

            state.currentFolder = folder;
            state.currentMessages = messages || [];
            state.isLoading = false;
        });

        b.addCase(fetch.prototype, (state) => {
            state.folderInformation = null;
            state.currentMessages = [];
        });
        b.addCase(fetch.fulfilled, (state, action) => {
            state.folderInformation = action.payload;
        });

        b.addCase(fetchMessage.fulfilled, (state, action) => {
            const existingMessage = state.currentMessages.find(
                (x) => x.id == action.payload.id
            );
            if (existingMessage) {
                // Once a message is opened, it's read.
                existingMessage.isRead = true;
            }

            state.currentMessage = action.payload;
        });
    },
});

export default messages.reducer;
