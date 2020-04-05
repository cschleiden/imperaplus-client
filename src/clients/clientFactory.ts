import fetch from "isomorphic-unfetch";
import { baseUri } from "../configuration";
import { ErrorResponse } from "../external/imperaClients";
import { onUnauthorized } from "../services/authProvider";
import { TokenProvider } from "../services/tokenProvider";

export interface IClient<TClient> {
    new (
        baseUri: string,
        http?: {
            fetch(url: RequestInfo, init?: RequestInit): Promise<Response>;
        }
    ): TClient;
}

const clientCache: [IClient<any>, any][] = [];

export function getCachedClient<TClient>(
    tokenProvider: TokenProvider,
    clientType: IClient<TClient>
): TClient {
    for (let [cachedClientType, cachedInstance] of clientCache) {
        if (cachedClientType === clientType) {
            return cachedInstance;
        }
    }

    let instance = createClient(clientType, tokenProvider);
    clientCache.push([clientType, instance]);
    return instance;
}

export function createClientWithToken<TClient>(
    clientType: IClient<TClient>,
    access_token: string
): TClient {
    return createClient(clientType, () => access_token);
}

const fetchWrapper = (
    tokenProvider: () => string,
    url: string,
    init: RequestInit
) => {
    const accessToken = tokenProvider();

    if (accessToken) {
        if (!init.headers) {
            init.headers = new Headers();
        }

        init.headers["Authorization"] = "Bearer " + accessToken;
        init.mode = "cors";
    }

    return fetch(url, init).then((response) => {
        // Intercept 401 responses, to redirect to login or refresh token
        const status = response.status.toString();
        if (status === "401") {
            console.log("401");

            if (onUnauthorized) {
                return onUnauthorized().then(
                    () => {
                        // Successful, retry request
                        return fetchWrapper(tokenProvider, url, init);
                    },
                    (error) => {
                        throw error;
                    }
                );
            } else {
                throw new Error("Not authorized");
            }
        } else if (status === "400") {
            return response.text().then((responseText) => {
                let result400: ErrorResponse | null = null;
                result400 =
                    responseText === ""
                        ? null
                        : <ErrorResponse>JSON.parse(responseText);
                throw result400;
            });
        }

        return response;
    });
};

function createClient<TClient>(
    clientType: IClient<TClient>,
    tokenProvider: TokenProvider
): TClient {
    let client = new clientType(baseUri, {
        fetch: fetchWrapper.bind(null, tokenProvider),
    });

    return client;
}
