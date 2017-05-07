import { NewsClient, NewsItem } from "../../external/imperaClients";
import { IAction, makePromiseAction } from "../../lib/action";

export const REFRESH = "news-refresh";
export const refresh = makePromiseAction<void, NewsItem[]>((input, dispatch, getState, deps) =>
    ({
        type: REFRESH,
        payload: {
            promise: deps.getCachedClient(NewsClient).getAll()
        },
        options: {
            useMessage: true
        }
    }));
