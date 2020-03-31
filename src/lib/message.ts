import { MessageType } from "../common/message/message.actions";

export function getStyleForMessage(messageType: MessageType): string {
    switch (messageType) {
        case MessageType.error:
            return "danger";

        case MessageType.warning:
            return "warning";

        default:
            return "info";
    }
}
