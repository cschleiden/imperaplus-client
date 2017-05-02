import { push } from "react-router-redux";
import { IAction, makePromiseAction } from "../../lib/action";
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
export const load = makePromiseAction<void, FolderInformation[]>((folder, dispatch, getState, deps) =>
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
export const deleteMessage = makePromiseAction<string, string>((messageId, dispatch, getState, deps) =>
    ({
        type: DELETE,
        payload: {
            promise: deps.getCachedClient(MessageClient).delete(messageId).then(() => messageId)
        },
        options: {
            useMessage: true
        }
    }));
