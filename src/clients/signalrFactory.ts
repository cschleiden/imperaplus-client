import * as Q from "q";
import * as $ from "jquery";
import "ms-signalr-client";

import { SessionService } from "../common/session/session.service";
import { TokenProvider } from "../services/tokenProvider";
import { baseUri } from "../configuration";
import jsonParseReviver from "../lib/jsonReviver";

const cachedClients: { [hubName: string]: ISignalRClient } = {};

export interface ISignalRClient {
    start(): Promise<void>;
    stop(): void;
    detachAllHandlers(): void;

    on(eventName: string, callback: Function);
    onInit(callback: () => void);
    off(eventName: string, callback: Function);

    invoke<TResult>(methodName: string, ...args): Promise<TResult>;

    isConnected(): boolean;

    connection: SignalR.Hub.Connection;
}

export function getSignalRClient(hubName: string, onUnauthorized: () => Promise<void>): ISignalRClient {
    if (cachedClients[hubName]) {
        let cachedClient = cachedClients[hubName];

        // Only use cached client if disconnected
        // TODO: CS: Why?
        /*if (cachedClient.connection.state !== $.signalR.connectionState.disconnected) {
            return cachedClients[hubName];
        }*/

        return cachedClient;
    }

    let client = new SignalRClient(hubName);
    cachedClients[hubName] = client;
    return client;
}

/** Close all open SignalR connections */
export function stopAllConnections() {
    const clientKeys = Object.keys(cachedClients);

    for (let clientKey of clientKeys) {
        let client = cachedClients[clientKey];

        client.stop();
    }
}

class SignalRClient implements ISignalRClient {
    private _proxy: SignalR.Hub.Proxy;
    private _eventCallbacks: [string, any][] = [];

    public connection: SignalR.Hub.Connection;

    private _reconnect: Promise<void>;

    private _onInit: () => Promise<void>;

    constructor(hubName: string) {
        this.connection = $.hubConnection(baseUri);

        this.connection.json = <any>{
            parse: (text: string, reviver?: (key: any, value: any) => any): any => JSON.parse(text, jsonParseReviver),
            stringify: (value: any, replacer?: any, space?: any): string => JSON.stringify(value, replacer, space)
        };

        this.connection.logging = true;

        this.connection.error(error => {
            if (error.context && error.context.status === 401) {
                // Try to reconnect
                if (!this._reconnect) {
                    this._reconnect = this._reconnectWithAuth();
                }
            }

            console.error("!!! SignalR error: " + error);
        });
        this.connection.disconnected(() => {
            console.debug("!!! SignalR disconnected");
        });
        this.connection.reconnected(() => {
            console.debug("!!! SignalR reconnected");
        });
        this.connection.reconnecting(() => {
            console.debug("!!! SignalR reconnecting");
        });
        this.connection.stateChanged(change => {
            console.debug("!!! SignalR stateChanged: " + change.newState + "(0-conn-ng,1=conn-ed,2=reconn,4=disconn)");
        });
        this.connection.connectionSlow(() => {
            console.debug("!!! SignalR connectionSlow");
        });

        this._proxy = this.connection.createHubProxy(hubName);
    }

    private _setToken() {
        // WebSockets does not allow sending custom headers, so we send the token in the query string
        this.connection.qs = { "bearer_token": TokenProvider.getToken() };
    }

    public start(): Promise<void> {
        let startOptions: SignalR.ConnectionOptions = {};

        startOptions["withCredentials"] = false;

        this._setToken();

        return this.connection.start(startOptions).then(() => {
            if (this._onInit) {
                return this._onInit();
            }
        }, () => {
            // Retry in case of invalid auth
            return this._reconnectWithAuth();
        }) as any;
    }

    public isActive() {
        return !!this.connection.state;
    }

    public stop() {
        this.connection.stop(false, true);

        this._detachListeners();
    }

    public onInit(callback: () => Promise<void>) {
        this._onInit = callback;
    }

    public detachAllHandlers() {
        this._detachListeners();
    }

    private _detachListeners() {
        // Detach all event handlers
        for (let event of this._eventCallbacks) {
            this._proxy.off(event[0], event[1]);
        }

        this._eventCallbacks = [];
    }

    public on(eventName, callback) {
        const wrappedCallback = (...result) => {
            if (callback) {
                if (result.length === 1) {
                    callback(result[0]);
                } else {
                    callback(result);
                }
            }
        };

        this._proxy.on(eventName, wrappedCallback);
        this._eventCallbacks.push([eventName, wrappedCallback]);
    }

    public off(eventName, callback) {
        this._proxy.off(eventName, (result) => {
            if (callback) {
                callback(result);
            }
        });

        // Remove from event map
        let matchingEvents = this._eventCallbacks.filter(e => e[0] === eventName && e[1] === callback);
        if (matchingEvents && matchingEvents.length > 0) {
            for (let matchingEvent of matchingEvents) {
                let idx = this._eventCallbacks.indexOf(matchingEvent);
                if (idx >= 0) {
                    this._eventCallbacks.splice(idx, 1);
                }
            }
        }
    }

    public invoke<TResult>(methodName, ...args): Promise<TResult> {
        // Create copy in case we need to retry, signalR api modifies arguments in place
        const originalArgs = args.slice(0);

        return this._proxy.invoke.apply(this._proxy, [methodName].concat(args)).then(null, (error) => {
            return this._reconnectWithAuth().then(() => {
                return this.invoke(methodName, ...originalArgs);
            });
        });
    }

    public isConnected(): boolean {
        return this.connection.state === $.signalR.connectionState.connected;
    }

    private _reconnectWithAuth(): Promise<void> {
        if (this._reconnect) {
            return this._reconnect;
        }

        return SessionService.getInstance().reAuthorize().then(() => {
            // Reconnect before retrying
            this.connection.stop(false, false);

            /*for (let callback of this._eventCallbacks) {
                this._proxy.on(callback[0], callback[1]);
            }*/

            return this.start().then(() => {
                this._reconnect = null;
            }, () => {
                this._reconnect = null;
            });
        }, () => {
            this._reconnect = null;
        });
    }
}