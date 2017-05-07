import { IImmutable, makeImmutable } from "immuts";
import { FolderInformation, Message, MessageFolder } from "../../external/imperaClients";
import { failed, IAction, pending, success } from "../../lib/action";
import reducerMap from "../../lib/reducerMap";
import { DELETE, ISwitchFolderPayload, LOAD, LOAD_MESSAGE, MARK_READ, OPEN_MESSAGE, SWITCH_FOLDER } from "./messages.actions";

const initialState = makeImmutable({
    isLoading: false,
    folderInformation: null as FolderInformation[],
    currentFolder: null as MessageFolder,
    currentMessages: [] as Message[],

    currentMessage: null as Message
});

export type IMessagesState = typeof initialState;

const switchFolder = (state: IMessagesState, action: IAction<ISwitchFolderPayload>) => {
    const { folder, messages } = action.payload;

    if (messages) {
        messages.sort((a, b) => b.sentAt.getTime() - a.sentAt.getTime());
    }

    return state.merge(x => x, {
        currentFolder: folder,
        currentMessages: messages || []
    });
};

const loadPending = (state: IMessagesState, action: IAction<FolderInformation[]>) => {
    return state
        .set(x => x.folderInformation, null)
        .set(x => x.currentMessages, []);
};

const load = (state: IMessagesState, action: IAction<FolderInformation[]>) => {
    return state.set(x => x.folderInformation, action.payload);
};

const openMessage = (state: IMessagesState, action: IAction<Message>) => {
    return state.set(x => x.currentMessage, action.payload);
};

const markRead = (state: IMessagesState, action: IAction<string>) => {
    const messageId = action.payload;

    // Try to find message
    const idx = state.data.currentMessages.findIndex(m => m.id === messageId);
    if (-1 !== idx) {
        const message = state.data.currentMessages[idx];
        state = state.update(x => x.currentMessages, m => {
            return m.slice(0).splice(idx, 1, {
                ...message,
                isRead: true
            });
        });
    }

    return state.set(x => x.currentMessage.isRead, true);
};

const loading = (state: IMessagesState, action: IAction<void>) => {
    return state.set(x => x.isLoading, true);
};

export const messages = <TPayload>(
    state = initialState,
    action?: IAction<TPayload>) => {

    return reducerMap(action, state, {
        [pending(SWITCH_FOLDER)]: loading,
        [success(SWITCH_FOLDER)]: switchFolder,

        [pending(LOAD)]: loadPending,
        [success(LOAD)]: load,

        [OPEN_MESSAGE]: openMessage,

        [success(MARK_READ)]: markRead
    });
};