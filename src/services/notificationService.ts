import { getSignalRClient, ISignalRClient } from "../clients/signalrFactory";
import { INotification, NotificationType } from "../external/notificationModel";
import { autobind } from "../lib/autobind";

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

    private _handlers: { [type: number]: INotificationHandler<any>[] } = {};

    private _client: ISignalRClient;

    private _initPromise: Promise<void>;

    /**
     * Initialize client
     */
    init(): Promise<void> {
        if (!this._initPromise) {
            this._client = this._getClient();

            this._client.on("notification", this._onNotification);

            this._initPromise = this._client.start();
        }

        return this._initPromise;
    }

    /**
     * Stop connection, dispose handlers
     */
    stop() {
        this._getClient().detachAllHandlers();
        this._getClient().stop();
    }

    sendGameMessage(gameId: number, message: string, isPublic: boolean): Promise<void> {
        return this._ensureInit().then(() => this._client.invoke<void>("sendGameMessage", gameId, message, isPublic));
    }

    switchGame(oldGameId: number, gameId: number): Promise<void> {
        return this._ensureInit().then(() => this._client.invoke<void>("switchGame", oldGameId, gameId));
    }

    leaveGame(gameId: number): Promise<void> {
        return this._ensureInit().then(() => this._client.invoke<void>("leaveGame", gameId));
    }

    attachHandler<TNotification extends INotification>(
        type: NotificationType, handler: INotificationHandler<TNotification>) {
        if (!this._handlers[type]) {
            this._handlers[type] = [handler];
        } else {
            this._handlers[type].push(handler);
        }
    }

    detachHandler<TNotification extends INotification>(
        type: NotificationType, handler: INotificationHandler<TNotification>) {
        if (this._handlers[type]) {
            const idx = this._handlers[type].indexOf(handler);
            if (idx !== -1) {
                this._handlers[type].splice(idx, 1);
            }
        }
    }

    private _ensureInit(): Promise<void> {
        if (!this._initPromise) {
            this._initPromise = this.init();
        }

        return this._initPromise;
    }

    @autobind
    private _onNotification(notification: INotification) {
        const handlers = this._handlers[notification.type];

        if (handlers) {
            for (const handler of handlers) {
                handler(notification);
            }
        }
    }

    private _getClient(): ISignalRClient {
        return getSignalRClient("game");
    }
}