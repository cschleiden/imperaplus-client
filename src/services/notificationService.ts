import { getSignalRClient, ISignalRClient } from "../clients/signalrFactory";
import { INotification, NotificationType } from "../external/notificationModel";

export interface INotificationHandler<TNotification extends INotification> {
    (notification: TNotification): void;
}

export class NotificationService {
    private _handlers: {
        [type: number]: INotificationHandler<any>[];
    } = {};

    private _client: ISignalRClient;

    private _start: (value?: void | PromiseLike<void>) => void;

    // Create unresolved promise, it will be resolved once the client is initialized
    private _initPromise = new Promise<void>((resolve) => {
        this._start = resolve;
    });

    /**
     * Initialize client
     */
    async init(token: string): Promise<void> {
        console.trace("i");

        // TODO: Restart with refresh token?
        this._client = getSignalRClient(token, "game");
        this._client.on("notification", this._onNotification);
        await this._client.start();

        // Play back any operations
        this._start();

        await this._initPromise;
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
        return this._ensureInit(() =>
            this._client.invoke<void>(
                "sendGameMessage",
                gameId,
                message,
                isPublic
            )
        );
    }

    async switchGame(oldGameId: number, gameId: number): Promise<void> {
        if (oldGameId !== gameId) {
            return this._ensureInit(() =>
                this._client.invoke<void>("switchGame", oldGameId, gameId)
            );
        }
    }

    leaveGame(gameId: number): Promise<void> {
        return this._ensureInit(() =>
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

    private _ensureInit(op: () => Promise<void>): Promise<void> {
        if (this._client) {
            return op();
        }

        // Queue up requests if client is not yet initialized
        this._initPromise = this._initPromise.then(op);

        // We don't want to wait for queued requests
        return Promise.resolve();
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

export const notificationService: NotificationService = new NotificationService();
