import { IAction, IAsyncAction, makePromiseAction } from "../../lib/action";
import { getSignalRClient } from "../../clients/signalrFactory";
import { ChatInformation, ChannelInformation, Message } from "../../external/chatModel";

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
            let client = deps.getSignalRClient("chat", {});
            if (!client.isConnected()) {
                client.on("broadcastMessage", (message: Message) => {
                    console.debug("[chat] message received");
                    dispatch(receiveMessage(message));
                });

                client.start().then(() => {
                    client.invoke("init").then((result: ChatInformation) => {
                        dispatch(<IAction<IStartPayload>>{
                            type: START,
                            payload: {
                                channels: result.channels
                            }
                        });
                    });
                });
            }
        }
    };

export const CLOSE = "chat-close";
export const close: IAsyncAction<void> = () =>
    (dispatch, getState, deps) => {
        deps.getSignalRClient("chat", {}).stop();

        dispatch(<IAction<void>>{
            type: CLOSE
        });
    };

export const SWITCH_CHANNEL = "chat-switch-channel";
export const switchChannel = (channel: string): IAction<string> => ({
    type: SWITCH_CHANNEL,
    payload: channel
});

export const MESSAGE = "chat-message";
export interface IMessagePayload {
    channel: number;
    message: string;
}
export const message = makePromiseAction<string, IMessagePayload>((msg: string, dispatch, getState, deps) => {
    let currentChannelId = getState().chat.data.activeChannelId;

    return {
        type: MESSAGE,
        payload: {
            promise: deps.getSignalRClient("chat", {}).invoke("sendMessage", currentChannelId, msg)
        }
    };
});

export const RECEIVE_MESSAGE = "chat-receive-message";
export const receiveMessage = (msg: Message): IAction<Message> => ({
    type: RECEIVE_MESSAGE,
    payload: msg
});