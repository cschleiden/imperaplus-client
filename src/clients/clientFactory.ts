import { TokenProvider } from "../services/tokenProvider";
import { baseUri } from "../configuration";

import { refresh } from "../common/session/session.actions";

export interface IClient<TClient> {
    new (baseUri: string, http?: { fetch(url: RequestInfo, init?: RequestInit): Promise<Response> }): TClient;
}

const clientCache: [IClient<any>, any][] = [];

export function getCachedClient<TClient>(
    onUnauthorized: () => Promise<void>,
    clientType: IClient<TClient>): TClient {
    for (let [cachedClientType, cachedInstance] of clientCache) {
        if (cachedClientType === clientType) {
            return cachedInstance;
        }
    }

    let instance = createClient(onUnauthorized, clientType, () => TokenProvider.getToken());
    clientCache.push([clientType, instance]);
    return instance;
}

export function createClientWithToken<TClient>(
    onUnauthorized: () => Promise<void>,
    clientType: IClient<TClient>,
    access_token: string): TClient {

    return createClient(onUnauthorized, clientType, () => access_token);
}

const fetchWrapper = (tokenRetriever, onUnauthorized: () => Promise<void>, url: string, init) => {
    const token = tokenRetriever();

    if (token) {
        init.headers = Object.assign({}, init.headers, {
            "Authorization": "Bearer " + token
        });
    }

    return fetch(url, init).then((response) => {
        // Intercept 401 responses, to redirect to login or refresh token
        const status = response.status.toString();
        if (status === "401") {
            return onUnauthorized().then(() => {
                // Retry request
                return fetchWrapper(tokenRetriever, onUnauthorized, url, init);
            });
        }

        return response;
    });
};

function createClient<TClient>(
    onUnauthorized: () => Promise<void>,
    clientType: IClient<TClient>,
    tokenRetriever: () => string): TClient {
    let client = new clientType(baseUri, {
        fetch: fetchWrapper.bind(null, tokenRetriever, onUnauthorized)
    });

    // Recreate dates.
    (<any>client).jsonParseReviver = (key: string, value: string): any => {
        if (typeof value === "string") {
            let a = /^(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2}):(\d{2}(?:\.\d*)?)Z$/.exec(value);
            if (a) {
                return new Date(Date.UTC(+a[1], +a[2] - 1, +a[3], +a[4], +a[5], +a[6]));
            }
        }

        return value;
    };

    return client;
}