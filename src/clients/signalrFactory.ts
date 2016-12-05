import * as Q from "q";
import * as $ from "jquery";
import "ms-signalr-client";

const cachedClients: { [hubName: string]: ISignalRClient } = {};

export interface ISignalRClient {
    start(): Promise<void>;
    stop(): void;

    on(eventName: string, callback: Function);
    off(eventName: string, callback: Function);

    invoke<TResult>(methodName: string, ...args): Promise<TResult>;

    isConnected(): boolean;

    connection: SignalR.Hub.Connection;
}

export function getSignalRClient(baseUri: string, access_token: string, hubName: string, startOptions: SignalR.ConnectionOptions): ISignalRClient {
    if (cachedClients[hubName]) {
        return cachedClients[hubName];
    }

    startOptions = startOptions || {};
    startOptions["withCredentials"] = false;

    let connection = $.hubConnection(baseUri);

    // WebSockets does not allow sending custom headers, so we send the token in the query string
    connection.qs = { "bearer_token": access_token };
    connection.json = <any>{
        parse: (text: string, reviver?: (key: any, value: any) => any): any => JSON.parse(text, jsonParseReviver),
        stringify: (value: any, replacer?: any, space?: any): string => JSON.stringify(value, replacer, space)
    };

    let proxy = connection.createHubProxy(hubName);

    let client = <ISignalRClient>{
        start: () => {
            connection.logging = true;

            connection.error(error => {
                console.error("!!! SignalR error: " + error);
            });
            connection.disconnected(() => {
                console.debug("!!! SignalR disconnected");
            });
            connection.reconnected(() => {
                console.debug("!!! SignalR reconnected");
            });
            connection.reconnecting(() => {
                console.debug("!!! SignalR reconnecting");
            });
            connection.stateChanged(change => {
                console.debug("!!! SignalR stateChanged: " + change.newState + "(0-conn-ng,1=conn-ed,2=reconn,4=disconn)");
            });
            connection.connectionSlow(() => {
                console.debug("!!! SignalR connectionSlow");
            });

            return Q<void>(connection.start(startOptions)) as any;
        },
        isActive: () => !!connection.state,
        stop: () => {
            connection.stop(false, true);
        },
        on: (eventName, callback) => {
            proxy.on(eventName, (...result) => {
                if (callback) {
                    if (result.length === 1) {
                        callback(result[0]);
                    } else {
                        callback(result);
                    }
                }
            });
        },
        off: (eventName, callback) => {
            proxy.off(eventName, (result) => {
                if (callback) {
                    callback(result);
                }
            });
        },
        invoke: <TResult>(methodName, ...args): Promise<TResult> => {
            console.debug("[signalR] calling " + methodName + " with " + args.length + " arguments");

            return proxy.invoke.apply(proxy, [methodName].concat(args));
        },
        connection: connection,
        isConnected: (): boolean => {
            return connection.state === $.signalR.connectionState.connected;
        }
    };

    cachedClients[hubName] = client;

    return client;
}

const jsonParseReviver = (key: string, value: string): any => {
    if (typeof value === "string") {
        let a = /^(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2}):(\d{2}(?:\.\d*)?)Z$/.exec(value);
        if (a) {
            return new Date(Date.UTC(+a[1], +a[2] - 1, +a[3], +a[4], +a[5], +a[6]));
        }
    }

    return value;
};