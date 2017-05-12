import { push } from "react-router-redux";
import { MessageType, show } from "../../common/message/message.actions";
import { FolderInformation, Message, MessageClient, MessageFolder, SendMessage } from "../../external/imperaClients";
import { IAction, IAsyncAction, makePromiseAction } from "../../lib/action";

export interface ISwitchFolderPayload {
    folder: MessageFolder;
    messages: Message[];
}
export const switchFolder = makePromiseAction<MessageFolder, ISwitchFolderPayload>(
    "messages-switch-folder", (folder, dispatch, getState, deps) =>
        ({
            payload: {
                promise: deps.getCachedClient(MessageClient).getAll(folder).then(messages => ({
                    folder,
                    messages
                }))
            },
            options: {
                useMessage: true
            }
        }));

export const load = makePromiseAction<void, FolderInformation[]>(
    "messages-load", (_, dispatch, getState, deps) =>
        ({
            payload: {
                promise: deps.getCachedClient(MessageClient).getFolderInformation().then((folderInformation: FolderInformation[]) => {
                    dispatch(switchFolder(MessageFolder.Inbox));

                    return folderInformation;
                })
            },
            options: {
                useMessage: true
            }
        }));

export const loadMessage = makePromiseAction<string, void>(
    "messages-load-single", (messageId, dispatch, getState, deps) =>
        ({
            payload: {
                promise: deps.getCachedClient(MessageClient).get(messageId).then(message => {
                    dispatch({
                        type: OPEN_MESSAGE,
                        payload: message
                    } as IAction<Message>);
                })
            },
            options: {
                useMessage: true
            }
        }));


export const markRead = makePromiseAction<string, string>(
    "messages-mark-read", (messageId, dispatch, getState, deps) =>
        ({
            payload: {
                promise: deps.getCachedClient(MessageClient).patchMarkRead(messageId).then(() => {
                    return messageId;
                })
            },
            options: {
                useMessage: true
            }
        }));

export const sendMessage = makePromiseAction<SendMessage, void>(
    "messages-send", (message, dispatch, getState, deps) =>
        ({
            payload: {
                promise: deps.getCachedClient(MessageClient).postSend(message).then(() => {
                    dispatch(push("/game/messages"));
                })
            },
            options: {
                useMessage: true
            }
        }));

export const deleteMessage = makePromiseAction<string, void>(
    "messages-delete", (messageId, dispatch, getState, deps) =>
        ({
            payload: {
                promise: deps.getCachedClient(MessageClient).delete(messageId).then(() => {
                    // Take the easy way, just refresh everything after delete
                    dispatch(load(null));
                })
            },
            options: {
                useMessage: true
            }
        }));

export const OPEN_MESSAGE = "messages-open";
export const openMessage: IAsyncAction<string> = (messageId: string) => (dispatch, getState, deps) => {
    const state = getState().messages.data;

    const idx = state.currentMessages.findIndex(m => m.id === messageId);
    if (idx !== -1) {
        dispatch({
            type: OPEN_MESSAGE,
            payload: state.currentMessages[idx]
        } as IAction<Message>);

        dispatch(markRead(messageId) as any);
    } else {
        dispatch(loadMessage(messageId) as any);
    }
};