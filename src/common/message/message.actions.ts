import { IAction, makePromiseAction } from "../../lib/action";

import { MessageBarType } from "office-ui-fabric-react/lib/MessageBar";

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
export const clear = (): IAction<void> => ({
    type: MESSAGE_CLEAR
});