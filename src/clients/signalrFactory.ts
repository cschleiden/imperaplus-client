import * as Q from "q";
import * as $ from "jquery";
import "ms-signalr-client";

import { TokenProvider } from "../services/tokenProvider";
import { baseUri } from "../configuration";
import jsonParseReviver from "../lib/jsonReviver";

const cachedClients: { [hubName: string]: ISignalRClient } = {};

export interface ISignalRClient {
    start(startOptions?: SignalR.ConnectionOptions): Promise<void>;
    stop(): void;

    on(eventName: string, callback: Function);
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
        if (cachedClient.connection.state !== $.signalR.connectionState.disconnected) {
            return cachedClients[hubName];
        }
    }

    let client = new SignalRClient(hubName);
    cachedClients[hubName] = client;
    return client;
}

class SignalRClient implements ISignalRClient {
    private _proxy: SignalR.Hub.Proxy;
    private _eventCallbacks: [string, any][] = [];

    public connection: SignalR.Hub.Connection;

    constructor(hubName: string) {
        this.connection = $.hubConnection(baseUri);
        
        this._setToken();
        this.connection.json = <any>{
            parse: (text: string, reviver?: (key: any, value: any) => any): any => JSON.parse(text, jsonParseReviver),
            stringify: (value: any, replacer?: any, space?: any): string => JSON.stringify(value, replacer, space)
        };

        this._proxy = this.connection.createHubProxy(hubName);
    }

    private _setToken() {
        // WebSockets does not allow sending custom headers, so we send the token in the query string
        this.connection.qs = { "bearer_token": TokenProvider.getToken() };
    }

    public start(startOptions?: SignalR.ConnectionOptions) {
        startOptions = startOptions || {};
        startOptions["withCredentials"] = false;

        this.connection.logging = true;

        this.connection.error(error => {
            /*if (error.context && error.context.status === 401) {
                if (onUnauthorized) {
                    onUnauthorized().then<void>(() => {
                        if (continuation) {
                            return continuation();
                        }

                        return null;
                    });
                }
            }*/

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

        return Q<void>(this.connection.start(startOptions)) as any;
    }

    public isActive() {
        return !!this.connection.state;
    }

    public stop() {
        this.connection.stop(false, true);

        for (let event of this._eventCallbacks) {
            this._proxy.off(event[0], event[1]);
        }

        this._eventCallbacks = [];
    }

    public on(eventName, callback) {
        this._proxy.on(eventName, (...result) => {
            if (callback) {
                if (result.length === 1) {
                    callback(result[0]);
                } else {
                    callback(result);
                }
            }
        });

        this._eventCallbacks.push([eventName, callback]);
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
        return this._proxy.invoke.apply(this._proxy, [methodName].concat(args));
    }

    public isConnected(): boolean {
        return this.connection.state === $.signalR.connectionState.connected;
    }
}