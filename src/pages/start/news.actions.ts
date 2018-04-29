import { NewsClient, NewsItem } from "../../external/imperaClients";
import { makePromiseAction } from "../../lib/action";

export const refresh = makePromiseAction<void, NewsItem[]>(
    "news-refresh", (input, dispatch, getState, deps) =>
        ({
            payload: {
                promise: deps.getCachedClient(NewsClient).getAll()
            },
            options: {
                useMessage: true
            }
        }));
