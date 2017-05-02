import { makeImmutable, IImmutable } from "immuts";
import reducerMap from "../../lib/reducerMap";
import { FolderInformation, Message, MessageFolder } from "../../external/imperaClients";
import { IAction, success, pending, failed } from "../../lib/action";
import { DELETE, SWITCH_FOLDER, ISwitchFolderPayload, LOAD } from "./messages.actions";

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

    return state.merge(x => x, {
        currentFolder: folder,
        currentMessages: messages || []
    });
};

const load = (state: IMessagesState, action: IAction<FolderInformation[]>) => {
    return state.set(x => x.folderInformation, action.payload);
};

const deleteMessage = (state: IMessagesState, action: IAction<string>) => {
    return state.remove(
        x => x.currentMessages.findIndex(m => m.id === action.payload)
    );
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

        [pending(LOAD)]: loading,
        [success(LOAD)]: load,

        [success(DELETE)]: deleteMessage
    });
};