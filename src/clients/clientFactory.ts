import { TokenProvider } from "../services/tokenProvider";
import { baseUri } from "../configuration";

import { AccountClient } from "../external/imperaClients";
import { SessionService } from "../common/session/session.service";
import jsonParseReviver from "../lib/jsonReviver";

export interface IClient<TClient> {
    new (baseUri: string, http?: { fetch(url: RequestInfo, init?: RequestInit): Promise<Response> }): TClient;
}

const clientCache: [IClient<any>, any][] = [];

export function getCachedClient<TClient>(
    clientType: IClient<TClient>): TClient {
    for (let [cachedClientType, cachedInstance] of clientCache) {
        if (cachedClientType === clientType) {
            return cachedInstance;
        }
    }

    let instance = createClient(clientType, () => TokenProvider.getToken());
    clientCache.push([clientType, instance]);
    return instance;
}

export function createClientWithToken<TClient>(
    clientType: IClient<TClient>,
    access_token: string): TClient {

    return createClient(clientType, () => access_token);
}

let onUnauthorized: () => Promise<any>;

export const setOnUnauthorized = (callback: () => Promise<any>) => {
    onUnauthorized = callback;
};

const fetchWrapper = (tokenProvider: () => string, url: string, init) => {
    const access_token = tokenProvider();

    if (access_token) {
        init.headers = Object.assign({}, init.headers, {
            "Authorization": "Bearer " + access_token
        });
    }

    return fetch(url, init).then((response) => {
        // Intercept 401 responses, to redirect to login or refresh token
        const status = response.status.toString();
        if (status === "401") {
            if (onUnauthorized) {
                return onUnauthorized().then(() => {
                    // Successful, retry request
                    return fetchWrapper(tokenProvider, url, init);
                }, (error) => {
                    throw error;
                });
            } else {
                throw new Error("Not authorized");
            }
        }

        return response;
    });
};

function createClient<TClient>(
    clientType: IClient<TClient>, tokenProvider: () => string): TClient {

    let client = new clientType(baseUri, {
        fetch: fetchWrapper.bind(null, tokenProvider)
    });

    // Hack: jsonParseReviver is protected, force set for now
    (<any>client).jsonParseReviver = jsonParseReviver;

    return client;
}