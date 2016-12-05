import { makeImmutable, IImmutable } from "immuts";
import reducerMap from "../../lib/reducerMap";

import { IAction } from "../../lib/action";
import { IMessage, MESSAGE_SHOW, MESSAGE_CLEAR } from "./message.actions"; 

const initialState = makeImmutable({
    message: null
});

export type IMessageState = typeof initialState;

const showMessage = (state: IMessageState, action: IAction<IMessage>) => {
    const message = action.payload;
    return state.set(x => x.message, message);
};

const clearMessage = (state: IMessageState, action: IAction<void>) => {
    return state.set(x => x.message, null);
};

export const message = <TPayload>(
    state = initialState,
    action?: IAction<TPayload>): IMessageState => {

    return reducerMap(action, state, {
        [MESSAGE_SHOW]: showMessage,
        [MESSAGE_CLEAR]: clearMessage
    });
};