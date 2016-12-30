import { TokenProvider } from "../services/tokenProvider";
import { baseUri } from "../configuration";

const clientCache: [any, any][] = [];
export interface IClient<TClient> {
    new (baseUri: string, http?: { fetch(url: RequestInfo, init?: RequestInit): Promise<Response> }): TClient;
}

export function getCachedClient<TClient>(
    navigate: (path: string) => void,
    clientType: IClient<TClient>): TClient {
    for (let [cachedClientType, cachedInstance] of clientCache) {
        if (cachedClientType === clientType) {
            return cachedInstance;
        }
    }

    let instance = createClient(navigate, clientType, () => TokenProvider.getToken());
    clientCache.push([clientType, instance]);
    return instance;
}

export function createClientWithToken<TClient>(
    navigate: (path: string) => void,
    clientType: IClient<TClient>,
    access_token: string): TClient {

    return createClient(navigate, clientType, () => access_token);
}

function createClient<TClient>(
    navigate: (path: string) => void,
    clientType: IClient<TClient>,
    tokenRetriever: () => string): TClient {
    let client = new clientType(baseUri, {
        fetch: (url, init) => {
            const token = tokenRetriever();

            if (token) {
                init.headers = Object.assign({}, init.headers, {
                    "Authorization": "Bearer " + token
                });
            }

            return fetch(url, init).then((response) => {
                // Intercept 401 responses, to redirect to login
                const status = response.status.toString();
                if (status === "401") {
                    navigate("/login");
                    throw new Error(__("Your session has expired. Please login."));
                }

                return response;
            });
        }
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