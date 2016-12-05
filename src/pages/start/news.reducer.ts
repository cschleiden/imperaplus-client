import { makeImmutable, IImmutable } from "immuts";
import reducerMap from "../../lib/reducerMap";
import { NewsClient, NewsItem } from "../../external/imperaClients";
import { IAction, success, pending, failed } from "../../lib/action";
import { REFRESH } from "./news.actions";

const initialState = makeImmutable({
    isLoading: false,
    news: [] as NewsItem[]
});

export type INewsState = typeof initialState;

const refresh = (state: INewsState, action: IAction<NewsItem[]>) => {
    return state.set(x => x.news, action.payload).set(x => x.isLoading, false);
};

const loading = (state: INewsState, action: IAction<NewsItem[]>) => {
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