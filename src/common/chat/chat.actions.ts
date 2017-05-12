import { ChannelInformation, ChatInformation, Message, UserChangeEvent } from "../../external/chatModel";
import { IAction, IAsyncAction, IAsyncActionVoid, makePromiseAction } from "../../lib/action";

export const START = "chat-start";
export interface IStartPayload {
    channels: ChannelInformation[];
}

export const SHOW_HIDE = "chat-show-hide";
export const showHide: IAsyncAction<boolean> = (show) =>
    (dispatch, getState, deps) => {
        dispatch(<IAction<boolean>>{
            type: SHOW_HIDE,
            payload: show
        });

        // Transition to start
        if (show) {
            // get client
            let client = deps.getSignalRClient("chat");
            if (!client.isConnected()) {
                client.detachAllHandlers();

                client.on("broadcastMessage", (message: Message) => {
                    dispatch(receiveMessage(message));
                });

                client.on("join", (user: UserChangeEvent) => {
                    dispatch(join(user.channelIdentifier, user.userName));
                });

                client.on("leave", (user: UserChangeEvent) => {
                    dispatch(leave(user.channelIdentifier, user.userName));
                });

                client.onInit(() => {
                    return client.invoke("init").then((result: ChatInformation) => {
                        dispatch(<IAction<IStartPayload>>{
                            type: START,
                            payload: {
                                channels: result.channels
                            }
                        });
                    });
                });

                client.start();
            }
        }
    };

export const CLOSE = "chat-close";
export const close: IAsyncActionVoid = () =>
    (dispatch, getState, deps) => {
        let client = deps.getSignalRClient("chat");
        client.stop();

        dispatch(<IAction<void>>{
            type: CLOSE
        });
    };

export const SWITCH_CHANNEL = "chat-switch-channel";
export const switchChannel = (channel: string): IAction<string> => ({
    type: SWITCH_CHANNEL,
    payload: channel
});

export interface IMessagePayload {
    channel: number;
    message: string;
}
export const message = makePromiseAction<string, IMessagePayload>("chat-message", (msg: string, dispatch, getState, deps) => {
    let currentChannelId = getState().chat.data.activeChannelId;

    return {
        payload: {
            promise: deps.getSignalRClient("chat").invoke("sendMessage", currentChannelId, msg).then(null, (error) => {
                if (error.context && error.context.status === 401) {
                    // Re-authorize
                    // Re-try?
                    // TODO
                }
            })
        },
        options: {
            // Prevent loading bar from picking this up
            customSuffix: "-chat"
        }
    };
});

export const RECEIVE_MESSAGE = "chat-receive-message";
export const receiveMessage = (msg: Message): IAction<Message> => ({
    type: RECEIVE_MESSAGE,
    payload: msg
});

export interface IUserEventPayload {
    channelId: string;
    userName: string;
}

export const JOIN = "chat-join";
/** User has joined a channel */
export const join = (channelId: string, userName: string): IAction<IUserEventPayload> => ({
    type: JOIN,
    payload: {
        channelId,
        userName
    }
});

export const LEAVE = "chat-leave";
/** User has left a channel */
export const leave = (channelId: string, userName: string): IAction<IUserEventPayload> => ({
    type: LEAVE,
    payload: {
        channelId,
        userName
    }
});