import * as signalR from "@microsoft/signalr";
import { baseUri } from "../configuration";
import { onUnauthorized } from "../services/authProvider";
import { EventService } from "../services/eventService";

const cachedClients: { [hubName: string]: ISignalRClient } = {};

export interface ISignalRClient {
    start(): Promise<void>;
    stop(): Promise<void>;
    detachAllHandlers(): void;

    on(eventName: string, callback: Function);
    onInit(callback: () => Promise<void>);
    off(eventName: string, callback: Function);

    invoke<TResult>(methodName: string, ...args: any[]): Promise<TResult>;

    isConnected(): boolean;

    connection: signalR.HubConnection;
}

export function getSignalRClient(
    token: string,
    hubName: string
): ISignalRClient {
    if (cachedClients[hubName]) {
        let cachedClient = cachedClients[hubName];

        // Only use cached client if disconnected
        // TODO: CS: Why?
        /*if (cachedClient.connection.state !== $.signalR.connectionState.disconnected) {
            return cachedClients[hubName];
        }*/

        return cachedClient;
    }

    let client = new SignalRClient(token, hubName);
    cachedClients[hubName] = client;
    return client;
}

/** Close all open SignalR connections */
function stopAllConnections() {
    const clientKeys = Object.keys(cachedClients);

    for (let clientKey of clientKeys) {
        let client = cachedClients[clientKey];

        client.stop();
    }
}

EventService.getInstance().attachHandler("signalr.stop", () => {
    stopAllConnections();
});

class SignalRClient implements ISignalRClient {
    private _eventCallbacks: [string, any][] = [];

    public connection: signalR.HubConnection;

    private _reconnect: Promise<void>;

    private _onInit: () => Promise<void>;

    constructor(token: string, hubName: string) {
        this.connection = new signalR.HubConnectionBuilder()
            .withUrl(`${baseUri}/api/signalr/${hubName}`, {
                accessTokenFactory: () => token,
            })
            .configureLogging(signalR.LogLevel.Trace)
            .build();

        // this.connection.json = <any>{
        //   parse: (text: string, reviver?: (key: any, value: any) => any): any =>
        //     JSON.parse(text, jsonParseReviver),
        //   stringify: (value: any, replacer?: any, space?: any): string =>
        //     JSON.stringify(value, replacer, space)
        // };

        // this.connection.logging = true;

        // this.connection.error(error => {
        //   if (error.context && error.context.status === 401) {
        //     // Try to reconnect
        //     if (!this._reconnect) {
        //       this._reconnect = this._reconnectWithAuth();
        //     }
        //   }

        //   console.error("!!! SignalR error: " + error);
        // });
        // this.connection.disconnected(() => {
        //   log("!!! SignalR disconnected");
        // });
        // this.connection.reconnected(() => {
        //   log("!!! SignalR reconnected");
        // });
        // this.connection.reconnecting(() => {
        //   log("!!! SignalR reconnecting");
        // });
        // this.connection.stateChanged(change => {
        //   log(
        //     "!!! SignalR stateChanged: " +
        //       change.newState +
        //       "(0-conn-ng,1=conn-ed,2=reconn,4=disconn)"
        //   );
        // });
        // this.connection.connectionSlow(() => {
        //   log("!!! SignalR connectionSlow");
        // });

        // this._proxy = this.connection.createHubProxy(hubName);
    }

    public start(): Promise<void> {
        return this.connection.start().then(
            () => {
                if (this._onInit) {
                    return this._onInit();
                }
            },
            (e) => {
                console.log(`SignalR connection error ${e}`);

                // Retry in case of invalid auth
                return this._reconnectWithAuth();
            }
        ) as any;
    }

    public isActive() {
        return !!this.connection.state;
    }

    public async stop() {
        await this.connection.stop();

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
        for (const event of this._eventCallbacks) {
            this.connection.off(event[0], event[1]);
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

        this.connection.on(eventName, wrappedCallback);
        this._eventCallbacks.push([eventName, wrappedCallback]);
    }

    public off(eventName, callback) {
        this.connection.off(eventName, (result) => {
            if (callback) {
                callback(result);
            }
        });

        // Remove from event map
        let matchingEvents = this._eventCallbacks.filter(
            (e) => e[0] === eventName && e[1] === callback
        );
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

        return (
            this.connection
                .invoke<TResult>(methodName, ...args)
                // .then((result) => {
                //     // SignalR does not allow passing a custom reviver: https://github.com/dotnet/aspnetcore/issues/5321
                //     // so run ours on the result

                //     // adapted from https://stackoverflow.com/a/41550077/561159
                //     const loopNestedObj = (obj) => {
                //         Object.keys(obj).forEach((key) => {
                //             if (
                //                 (obj[key] && typeof obj[key] === "object") ||
                //                 Array.isArray(obj[key])
                //             ) {
                //                 loopNestedObj(obj[key]);
                //             } else {
                //                 obj[key] = jsonReviver(key, obj[key]);
                //             }
                //         });
                //     };

                //     !!result && loopNestedObj(result);

                //     return result;
                // })
                .then(null, (error) => {
                    console.log(`SignalR error ${error}`);

                    return this._reconnectWithAuth().then(() => {
                        return this.invoke<TResult>(
                            methodName,
                            ...originalArgs
                        );
                    });
                })
        );
    }

    public isConnected(): boolean {
        return this.connection.state === signalR.HubConnectionState.Connected;
    }

    private _reconnectWithAuth(): Promise<void> {
        console.log("reconnected to signalr");
        return; // TODO: CS: Re-enable

        if (this._reconnect) {
            return this._reconnect;
        }

        const reset = () => {
            this._reconnect = null;
        };

        return onUnauthorized().then(() => {
            this.connection.stop();
            return this.start().then(reset, reset);
        }, reset);
    }
}
