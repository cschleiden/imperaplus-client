import { IAction, IAsyncAction } from "../../lib/action";

export enum MessageType {
    info,
    success,
    warning,
    error
}

export interface IMessage {
    message: string;
    type: MessageType;
}

export const MESSAGE_SHOW = "message-show";
export const show = (message: string, type: MessageType = MessageType.info): IAction<IMessage> => ({
    type: MESSAGE_SHOW,
    payload: {
        message,
        type
    }
});

export const MESSAGE_CLEAR = "message-clear";
export const clear: IAsyncAction<void> = () =>
    (dispatch, getState, deps) => {
        if (!getState().message.message) {
            // No message, nothing to clear
            return;
        }

        dispatch({
            type: MESSAGE_CLEAR
        });
    };