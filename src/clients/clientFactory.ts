import { baseUri } from "../configuration";
import { TokenProvider } from "../services/tokenProvider";

import { SessionService } from "../common/session/session.service";
import { AccountClient, ErrorResponse } from "../external/imperaClients";
import jsonParseReviver from "../lib/jsonReviver";
import { onUnauthorized } from "../services/authProvider";
import { UserProvider } from "../services/userProvider";

export interface IClient<TClient> {
    new(baseUri: string, http?: { fetch(url: RequestInfo, init?: RequestInit): Promise<Response> }): TClient;
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

let miniProfilerInitialized = false;

const fetchWrapper = (tokenProvider: () => string, url: string, init: RequestInit) => {
    const accessToken = tokenProvider();

    if (accessToken) {
        if (!init.headers) {
            init.headers = new Headers();
        }

        init.headers.set("Authorization", "Bearer " + accessToken);
        init.mode = "cors";
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
        } else if (status === "400") {
            return response.text().then((responseText) => {
                let result400: ErrorResponse | null = null;
                result400 = responseText === "" ? null : <ErrorResponse>JSON.parse(responseText, this.jsonParseReviver);
                throw result400;
            });
        }

        if (UserProvider.isAdmin()) {
            if (!miniProfilerInitialized) {
                miniProfilerInitialized = true;

                // Initialize mini profiler
                const scriptTag = $("<script>").attr({
                    "type": "text/javascript",
                    "id": "mini-profiler",
                    "src": baseUri + "/admin/profiler/includes.js",
                    "data-path": baseUri + "/admin/profiler/",
                    "data-position": "bottomleft",
                    "data-authorized": "true",
                    "data-controls": "true",
                    "data-ids": "abc",
                    "data-max-traces": 10,
                    "data-start-hidden": true,
                    "data-toggle-shortcut": "Alt+P"
                });
                $("head").append(scriptTag);
            }

            const miniProfiler = (<any>window).MiniProfiler;
            if (miniProfiler) {
                const miniProfilerIds = response.headers.get("X-MiniProfiler-Ids");
                if (miniProfilerIds && miniProfiler) {
                    // tslint:disable-next-line:no-eval
                    miniProfiler.fetchResults(eval(miniProfilerIds));
                }
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