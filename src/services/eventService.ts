export interface IEventHandler<TPayload> {
    (payload?: TPayload): void;
}

export class EventService {
    private static _instance: EventService;

    public static getInstance(): EventService {
        if (!EventService._instance) {
            EventService._instance = new EventService();
        }

        return EventService._instance;
    }

    private _handlers: { [eventName: string]: IEventHandler<any>[] } = {};

    attachHandler<TPayload>(
        eventName: string,
        handler: IEventHandler<TPayload>
    ) {
        if (!this._handlers[eventName]) {
            this._handlers[eventName] = [handler];
        } else {
            this._handlers[eventName].push(handler);
        }
    }

    detachHandler<TPayload>(
        eventName: string,
        handler: IEventHandler<TPayload>
    ) {
        if (this._handlers[eventName]) {
            const idx = this._handlers[eventName].indexOf(handler);
            if (idx !== -1) {
                this._handlers[eventName].splice(idx, 1);
            }
        }
    }

    fire<TPayload>(eventName: string, payload?: TPayload) {
        const handlers = this._handlers[eventName];
        if (handlers) {
            for (const handler of handlers) {
                handler(payload);
            }
        }
    }
}
