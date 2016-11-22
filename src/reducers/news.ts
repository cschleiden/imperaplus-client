import { makeImmutable, IImmutable } from "immuts";
import { reducerMap } from "./lib/shared";
import { NewsClient, NewsItem } from "../external/imperaClients";
import { IAction, success, pending, failed } from "../actions/action";
import { REFRESH } from "../actions/news";

const initialState = makeImmutable({
    isLoading: false,
    news: [] as NewsItem[]
});

const refresh = (state: typeof initialState, action: IAction<NewsItem[]>) => {
    return state.set(x => x.news, action.payload).set(x => x.isLoading, false);
};

const loading = (state: typeof initialState, action: IAction<NewsItem[]>) => {
    return state.set(x => x.isLoading, true);
};

export const news = <TPayload>(
    state = initialState,
    action?: IAction<TPayload>) => {

    return reducerMap(action, state, {
        [pending(REFRESH)]: loading,
        [success(REFRESH)]: refresh
    });
};