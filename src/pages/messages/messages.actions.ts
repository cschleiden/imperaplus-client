import { push } from "react-router-redux";
import { IAction, makePromiseAction, IAsyncAction } from "../../lib/action";
import { Message, MessageFolder, MessageClient, SendMessage, FolderInformation } from "../../external/imperaClients";
import { show, MessageType } from "../../common/message/message.actions";

export const SWITCH_FOLDER = "messages-switch-folder";
export interface ISwitchFolderPayload {
    folder: MessageFolder;
    messages: Message[];
}
export const switchFolder = makePromiseAction<MessageFolder, ISwitchFolderPayload>((folder, dispatch, getState, deps) =>
    ({
        type: SWITCH_FOLDER,
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

export const LOAD = "messages-load";
export const load = makePromiseAction<void, FolderInformation[]>((_, dispatch, getState, deps) =>
    ({
        type: LOAD,
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

export const LOAD_MESSAGE = "messages-load-single";
export const loadMessage = makePromiseAction<string, void>((messageId, dispatch, getState, deps) =>
    ({
        type: LOAD_MESSAGE,
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


export const MARK_READ = "messages-mark-read";
export const markRead = makePromiseAction<string, string>((messageId, dispatch, getState, deps) =>
    ({
        type: MARK_READ,
        payload: {
            promise: deps.getCachedClient(MessageClient).patchMarkRead(messageId).then(() => {
                return messageId;
            })
        },
        options: {
            useMessage: true
        }
    }));

export const SEND = "messages-send";
export const sendMessage = makePromiseAction<SendMessage, void>((message, dispatch, getState, deps) =>
    ({
        type: SEND,
        payload: {
            promise: deps.getCachedClient(MessageClient).postSend(message).then(() => {
                dispatch(push("/game/messages"));
            })
        },
        options: {
            useMessage: true
        }
    }));


export const DELETE = "messages-delete";
export const deleteMessage = makePromiseAction<string, void>((messageId, dispatch, getState, deps) =>
    ({
        type: DELETE,
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