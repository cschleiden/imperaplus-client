import { produce } from "immer";
import {
    FolderInformation,
    Message,
    MessageFolder,
} from "../../external/imperaClients";
import { IAction, pending, success } from "../../lib/utils/action";
import reducerMap from "../../lib/utils/reducerMap";
import * as Actions from "./messages.actions";

const initialState = makeImmutable({
    isLoading: false,
    folderInformation: null as FolderInformation[],
    currentFolder: null as MessageFolder,
    currentMessages: [] as Message[],

    currentMessage: null as Message,
});

export type IMessagesState = typeof initialState;

const switchFolder = (
    state: IMessagesState,
    action: ActionPayload<Actions.ISwitchFolderPayload>
) => {
    const { folder, messages } = action.payload;

    if (messages) {
        messages.sort((a, b) => b.sentAt.getTime() - a.sentAt.getTime());
    }

    return state.__set(x => x, {
        currentFolder: folder,
        currentMessages: messages || [],
    });
};

const loadPending = (
    state: IMessagesState,
    action: ActionPayload<FolderInformation[]>
) => {
    return state
        .__set(x => x.folderInformation, null)
        .__set(x => x.currentMessages, []);
};

const load = (
    state: IMessagesState,
    action: ActionPayload<FolderInformation[]>
) => {
    return state.__set(x => x.folderInformation, action.payload);
};

const openMessage = (state: IMessagesState, action: ActionPayload<Message>) => {
    return state.__set(x => x.currentMessage, action.payload);
};

const markRead = (state: IMessagesState, action: ActionPayload<string>) => {
    const messageId = action.payload;

    // Try to find message
    const idx = state.currentMessages.findIndex(m => m.id === messageId);
    if (-1 !== idx) {
        const message = state.currentMessages[idx];
        state = state.__set(
            x => x.currentMessages,
            m => {
                return m.slice(0).splice(idx, 1, {
                    ...message,
                    isRead: true,
                });
            }
        );
    }

    return state.__set(x => x.currentMessage.isRead, true);
};

const loading = (state: IMessagesState, action: ActionPayload<void>) => {
    return state.__set(x => x.isLoading, true);
};

export const messages = <TPayload>(
    state = initialState,
    action?: ActionPayload<TPayload>
) => {
    return reducerMap(action, state, {
        [pending(Actions.switchFolder.TYPE)]: loading,
        [success(Actions.switchFolder.TYPE)]: switchFolder,

        [pending(Actions.load.TYPE)]: loadPending,
        [success(Actions.load.TYPE)]: load,

        [Actions.OPEN_MESSAGE]: openMessage,

        [success(Actions.markRead.TYPE)]: markRead,
    });
};
