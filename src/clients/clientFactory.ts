import fetch from "isomorphic-unfetch";
import { baseUri } from "../configuration";
import { ErrorResponse } from "../external/imperaClients";
import { isSSR } from "../lib/utils/isSSR";
import { onUnauthorized } from "../services/authProvider";

export interface IClient<TClient> {
    new (
        baseUri: string,
        http?: {
            fetch(url: RequestInfo, init?: RequestInit): Promise<Response>;
        }
    ): TClient;
}

export function createClient<TClient>(
    access_token: string,
    clientType: IClient<TClient>
): TClient {
    return _createClient(clientType, () => access_token);
}

const fetchWrapper = (
    tokenProvider: () => string,
    url: string,
    init: RequestInit,
    authorizationAttempts = 0
) => {
    console.log(`Fetching ${url}`);

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
                if (authorizationAttempts > 1) {
                    throw new Error("Not authorized");
                }

                return onUnauthorized().then(
                    (newTokenProvider) => {
                        tokenProvider = newTokenProvider;

                        console.log("Got a new token, retrying.");

                        // Successful, retry request
                        return fetchWrapper(
                            tokenProvider,
                            url,
                            init,
                            authorizationAttempts + 1
                        );
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

        if (!isSSR()) {
            const miniProfiler = (<any>window).MiniProfiler;
            if (miniProfiler) {
                const miniProfilerIds = response.headers.get(
                    "X-MiniProfiler-Ids"
                );
                if (miniProfilerIds && miniProfiler) {
                    // tslint:disable-next-line:no-eval
                    miniProfiler.fetchResults(eval(miniProfilerIds));
                }
            }
        }

        return response;
    });
};

type TokenProvider = () => string;

function _createClient<TClient>(
    clientType: IClient<TClient>,
    tokenProvider: TokenProvider
): TClient {
    let client = new clientType(baseUri, {
        fetch: fetchWrapper.bind(null, tokenProvider),
    });

    return client;
}
