import { getSignalRClient, ISignalRClient } from "../clients/signalrFactory";
import { INotification, NotificationType } from "../external/notificationModel";

export interface INotificationHandler<TNotification extends INotification> {
    (notification: TNotification): void;
}

export class NotificationService {
    private static _instance: NotificationService;

    public static getInstance(): NotificationService {
        if (!NotificationService._instance) {
            NotificationService._instance = new NotificationService();
        }

        return NotificationService._instance;
    }

    private _handlers: {
        [type: number]: INotificationHandler<any>[];
    } = {};

    private _client: ISignalRClient;

    private _initPromise: Promise<void> | undefined;

    /**
     * Initialize client
     */
    init(token: string): Promise<void> {
        if (!this._initPromise) {
            // TODO: Restart with token?
            this._client = getSignalRClient(token, "game");
            this._client.on("notification", this._onNotification);
            this._initPromise = this._client.start();
        }

        return this._initPromise;
    }

    /**
     * Stop connection, dispose handlers
     */
    stop() {
        this._client.detachAllHandlers();
        this._client.stop();
    }

    sendGameMessage(
        gameId: number,
        message: string,
        isPublic: boolean
    ): Promise<void> {
        return this._ensureInit().then(() =>
            this._client.invoke<void>(
                "sendGameMessage",
                gameId,
                message,
                isPublic
            )
        );
    }

    switchGame(oldGameId: number, gameId: number): Promise<void> {
        if (oldGameId !== gameId) {
            return this._ensureInit().then(() =>
                this._client.invoke<void>("switchGame", oldGameId, gameId)
            );
        }

        return Promise.resolve(null);
    }

    leaveGame(gameId: number): Promise<void> {
        return this._ensureInit().then(() =>
            this._client.invoke<void>("leaveGame", gameId)
        );
    }

    attachHandler<TNotification extends INotification>(
        type: NotificationType,
        handler: INotificationHandler<TNotification>
    ) {
        if (!this._handlers[type]) {
            this._handlers[type] = [handler];
        } else {
            this._handlers[type].push(handler);
        }
    }

    detachHandler<TNotification extends INotification>(
        type: NotificationType,
        handler: INotificationHandler<TNotification>
    ) {
        if (this._handlers[type]) {
            const idx = this._handlers[type].indexOf(handler);
            if (idx !== -1) {
                this._handlers[type].splice(idx, 1);
            }
        }
    }

    private async _ensureInit(): Promise<void> {
        await this._initPromise;
    }

    private _onNotification = (notification: INotification) => {
        const handlers = this._handlers[notification.type];

        if (handlers) {
            for (const handler of handlers) {
                handler(notification);
            }
        }
    };
}
