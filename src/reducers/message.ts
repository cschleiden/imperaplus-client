import { makeImmutable, IImmutable } from "immuts";
import { reducerMap } from "./lib/shared";

import { IAction } from "../actions/action";
import { IMessage, MESSAGE_SHOW, MESSAGE_CLEAR } from "../actions/message"; 

interface IMessageState {
     message: IMessage;
}

const initialState = makeImmutable(<IMessageState>{
    message: null
});

const showMessage = (state: IImmutable<IMessageState>, action: IAction<IMessage>) => {
    const message = action.payload;
    return state.set(x => x.message, message);
};

const clearMessage = (state: IImmutable<IMessageState>, action: IAction<void>) => {
    return state.set(x => x.message, null);
};

export type TState = IImmutable<IMessageState>;

export const message = <TPayload>(
    state: IImmutable<IMessageState> = initialState,
    action?: IAction<TPayload>): IImmutable<IMessageState> => {

    return reducerMap(action, state, {
        [MESSAGE_SHOW]: showMessage,
        [MESSAGE_CLEAR]: clearMessage
    });
};