import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import {
    ChannelInformation,
    ChatInformation,
    Message,
    UserChangeEvent,
} from "../../../../external/chatModel";
import { AppThunkArg } from "../../../../store";
import { getToken } from "../session/session.selectors";

const initialState = {
    isVisible: false,
    isActive: false,
    activeChannelId: null as string,
    channels: [] as ChannelInformation[],
    unreadCount: null as number,
};

export type ChatState = typeof initialState;

export const START = "chat-start";
export interface IStartPayload {
    channels: ChannelInformation[];
}

export const showHide = createAsyncThunk<boolean, boolean, AppThunkArg>(
    "chat/showHide",
    async (show, thunkAPI) => {
        // Transition to start
        if (show) {
            const client = thunkAPI.extra.getSignalRClient(
                getToken(thunkAPI.getState()),
                "chat"
            );
            if (!client.isConnected()) {
                client.detachAllHandlers();

                client.on("broadcastMessage", (message: Message) => {
                    thunkAPI.dispatch(receiveMessage(message));
                });

                client.on("join", (user: UserChangeEvent) => {
                    thunkAPI.dispatch(
                        join({
                            channelId: user.channelIdentifier,
                            userName: user.userName,
                        })
                    );
                });

                client.on("leave", (user: UserChangeEvent) => {
                    thunkAPI.dispatch(
                        leave({
                            channelId: user.channelIdentifier,
                            userName: user.userName,
                        })
                    );
                });

                client.onInit(async () => {
                    const chatInformation: ChatInformation = await client.invoke(
                        "init"
                    );

                    thunkAPI.dispatch(
                        start({
                            channels: chatInformation.channels,
                        })
                    );
                });

                client.start();
            }
        }

        return show;
    }
);

export const close = createAsyncThunk<void, void, AppThunkArg>(
    "chat/close",
    async (_, thunkAPI) => {
        const client = thunkAPI.extra.getSignalRClient(
            getToken(thunkAPI.getState()),
            "chat"
        );
        await client.stop();
    }
);

export interface IMessagePayload {
    channel: number;
    message: string;
}
export const message = createAsyncThunk<void, string, AppThunkArg>(
    "chat/message",
    async (message, thunkAPI) => {
        const currentChannelId = thunkAPI.getState().chat.activeChannelId;

        const client = thunkAPI.extra.getSignalRClient(
            getToken(thunkAPI.getState()),
            "chat"
        );
        await client.invoke<IMessagePayload>(
            "sendMessage",
            currentChannelId,
            message
        );
    }
);

export interface IUserEventPayload {
    channelId: string;
    userName: string;
}

function getChannelIdxById(
    channels: ChannelInformation[],
    channelId: string
): number {
    let matchingChannels = channels.filter(
        (c: ChannelInformation) => c.identifier === channelId
    );
    if (!matchingChannels.length) {
        throw new Error("No matching channel found");
    }

    const matchingChannel = matchingChannels[0];
    return channels.indexOf(matchingChannel);
}

const chat = createSlice({
    name: "chat",
    initialState,
    reducers: {
        switchChannel: (state, action: PayloadAction<string>) => {
            state.activeChannelId = action.payload;
        },
        join: (state, action: PayloadAction<IUserEventPayload>) => {
            const channelIdx = getChannelIdxById(
                state.channels,
                action.payload.channelId
            );

            state.channels[channelIdx].users.push({
                name: action.payload.userName,
                type: 0,
            });
        },
        leave: (state, action: PayloadAction<IUserEventPayload>) => {
            const channelIdx = getChannelIdxById(
                state.channels,
                action.payload.channelId
            );

            state.channels[channelIdx].users = state.channels[
                channelIdx
            ].users.filter((u) => u.name !== action.payload.userName);
        },
        start: (state, action: PayloadAction<ChatInformation>) => {
            state.isActive = true;
            state.channels = action.payload.channels;
            state.activeChannelId =
                action.payload.channels &&
                action.payload.channels.length &&
                action.payload.channels[0].identifier;
        },
        receiveMessage: (state, action: PayloadAction<Message>) => {
            const message = action.payload;

            const channels = state.channels;
            const matchingChannels = channels.filter(
                (c: ChannelInformation) =>
                    c.identifier === message.channelIdentifier
            );
            if (!matchingChannels.length) {
                return;
            }

            const matchingChannel = matchingChannels[0];
            const idx = state.channels.indexOf(matchingChannel);

            state.channels[idx].messages.push(message);
            state.unreadCount = !state.isVisible
                ? (state.unreadCount || 0) + 1
                : null;
        },
    },
    extraReducers: (b) => {
        b.addCase(close.fulfilled, (state) => (state = initialState));

        b.addCase(showHide.fulfilled, (state, action) => {
            const isVisible = action.payload;
            state.isVisible = isVisible;
            state.unreadCount = null;
        });
    },
});

export const {
    join,
    leave,
    receiveMessage,
    start,
    switchChannel,
} = chat.actions;

export default chat.reducer;
