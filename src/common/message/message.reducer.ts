import { IImmutable, makeImmutable } from "immuts";
import reducerMap from "../../lib/reducerMap";

import { IAction } from "../../lib/action";
import { IMessage, MESSAGE_CLEAR, MESSAGE_SHOW } from "./message.actions";

const initialState = makeImmutable({
    message: null
});

export type IMessageState = typeof initialState;

const showMessage = (state: IMessageState, action: IAction<IMessage>) => {
    const message = action.payload;
    return state.__set(x => x.message, message);
};

const clearMessage = (state: IMessageState, action: IAction<void>) => {
    return state.__set(x => x.message, null);
};

export const message = <TPayload>(
    state = initialState,
    action?: IAction<TPayload>): IMessageState => {

    return reducerMap(action, state, {
        [MESSAGE_SHOW]: showMessage,
        [MESSAGE_CLEAR]: clearMessage
    });
};