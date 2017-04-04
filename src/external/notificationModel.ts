import { UserReference } from "./imperaClients";

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

export interface IGameChatMessage {
    id: number;

    gameId: number;

    user: UserReference;

    teamId: string;

    dateTime: Date;

    text: string;
}

export interface IGameChatMessageNotification extends IGameNotification {
    message: IGameChatMessage;
}