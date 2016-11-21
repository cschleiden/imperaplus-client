import { TokenProvider } from "../services/tokenProvider";

// TODO: CS: Retrieve from config
const baseUri = "http://localhost:57676/";
const clientCache: [any, any][] = [];

export function getCachedClient<TClient>(
    clientType: new (baseUri: string, http?: { fetch(url: RequestInfo, init?: RequestInit): Promise<Response> }) => TClient): TClient {
    for (let [cacheClientType, cachedInstance] of clientCache) {
        if (cacheClientType === clientType) {
            return cachedInstance;
        }
    }

    let instance = createClient(clientType);
    clientCache.push([clientType, instance]);
    return instance;
}

export function createClient<TClient>(
    clientType: new (baseUri: string, http?: { fetch(url: RequestInfo, init?: RequestInit): Promise<Response> }) => TClient): TClient {
    return new clientType(baseUri, {
        fetch: (url, init) => {
            const token = TokenProvider.getToken();

            if (token) {
                init.headers = Object.assign({}, init.headers, {
                    "Authorization": "Bearer " + token
                });
            }

            return fetch(url, init);
        }
    });
}

export function createClientWithToken<TClient>(
    clientType: new (baseUri: string, http?: { fetch(url: RequestInfo, init?: RequestInit): Promise<Response> }) => TClient,
    access_token: string): TClient {
    return new clientType(baseUri, {
        fetch: (url, init) => {
            init.headers = Object.assign({}, init.headers, {
                "Authorization": "Bearer " + access_token
            });

            return fetch(url, init);
        }
    });
}