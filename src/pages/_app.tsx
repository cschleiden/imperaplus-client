import nextCookie from "next-cookies";
import NextApp, { AppContext, AppInitialProps, AppProps } from "next/app";
import * as React from "react";
import { Provider } from "react-redux";
import Layout from "../components/layouts/main";
import GameNav from "../components/navigation/game";
import PublicNav from "../components/navigation/public";
import { setLanguagProvider } from "../i18n/i18n";
import { IState } from "../reducers";
import { AppPageContext, getOrCreateStore, AppNextPage } from "../store";
import "../styles/index.scss";
import { setTitle } from "../lib/domain/shared/general/general.slice";

// HACK: Move forward!
const X: any = Layout;

function App({
    Component,
    pageProps,
    router,
    storeState,
}: AppProps & { storeState: IState }) {
    const store = getOrCreateStore(storeState);
    setLanguagProvider(() => store.getState().session?.language);

    // There has to be a better way to get the title into the state
    if ((Component as AppNextPage).getTitle) {
        const title = (Component as AppNextPage).getTitle(store.getState());
        store.dispatch(setTitle(title));
    }

    const nav = router.pathname.startsWith("/game") ? (
        <GameNav />
    ) : (
        <PublicNav />
    );

    return (
        <Provider store={store}>
            <X nav={nav}>
                <Component {...pageProps} />
            </X>
        </Provider>
    );
}

App.getInitialProps = async (
    appContext: AppContext
): Promise<AppInitialProps & { storeState: IState }> => {
    const cookieState = nextCookie(appContext.ctx);

    const access_token = cookieState["token"];
    if (access_token) {
        // Active session, get session state
    }

    // TODO: Detect or take from cookie
    const store = getOrCreateStore({
        session: {
            language: cookieState["lang"],
            access_token: cookieState["token"],
        },
    });
    setLanguagProvider(() => store.getState().session?.language);

    // Make store available to pages getInitialProps
    (appContext.ctx as AppPageContext).store = store;

    const appProps = await NextApp.getInitialProps(appContext);

    return {
        ...appProps,
        storeState: store.getState(),
    };
};

export default App;
