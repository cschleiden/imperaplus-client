import { IAction, IAsyncAction, makePromiseAction } from "../../lib/action";

import { MessageBarType } from "office-ui-fabric-react/lib/MessageBar";

// Reexport
export { MessageBarType };

export interface IMessage {
    message: string;
    type: MessageBarType;
}

export const MESSAGE_SHOW = "message-show";
export const show = (message: string, type: MessageBarType = MessageBarType.info): IAction<IMessage> => ({
    type: MESSAGE_SHOW,
    payload: {
        message,
        type
    }
});

export const MESSAGE_CLEAR = "message-clear";
export const clear: IAsyncAction<void> = () =>
    (dispatch, getState, deps) => {
        if (!getState().message.data.message) {
            // No message, nothing to clear
            return;
        }

        dispatch({
            type: MESSAGE_CLEAR
        });
    };