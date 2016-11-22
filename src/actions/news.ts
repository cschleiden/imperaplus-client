import { IAction, makeAsyncAction } from "./action";
import { getCachedClient } from "../clients/clientFactory";
import { NewsClient, NewsItem } from "../external/imperaClients";

export const REFRESH = "news-refresh";
export const refresh = makeAsyncAction<void, NewsItem[]>((input, dispatch) =>
    ({
        type: REFRESH,
        payload: {
            promise: getCachedClient(NewsClient).getAll()
        },
        options: {
            useMessage: true
        }
    }));
