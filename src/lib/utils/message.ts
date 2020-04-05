import { MessageType } from "../domain/shared/message/message.slice";

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
