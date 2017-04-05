import { UserReference, GameChatMessage } from "./imperaClients";

export enum NotificationType {
    PlayerTurn = 0,

    EndTurn,

    PlayerSurrender,

    GameChatMessage,

    NewMessage
}

export interface INotification {
    type: NotificationType;
}

export interface IGameNotification extends INotification {
    gameId: number;
}

export interface IGameChatMessageNotification extends IGameNotification {
    message: GameChatMessage;
}