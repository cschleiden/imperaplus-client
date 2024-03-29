import "typeface-open-sans";
import "../external/polyfills";
import "../styles/index.scss";

import * as React from "react";

import NextApp, { AppContext, AppInitialProps, AppProps } from "next/app";
import LoadingBar, { resetLoading } from "react-redux-loading-bar";
import {
    openClose,
    setTitle,
} from "../lib/domain/shared/general/general.slice";
import { AppNextPage, AppPageContext, getOrCreateStore } from "../store";

import nextCookie from "next-cookies";
import Router from "next/router";
import { Provider } from "react-redux";
import GameLayout from "../components/layouts/game";
import MainLayout from "../components/layouts/main";
import PlayLayout from "../components/layouts/play";
import GameNav from "../components/navigation/game";
import PublicNav from "../components/navigation/public";
import { setLanguageProvider } from "../i18n/i18n";
import MiniProfiler from "../lib/admin/miniprofiler";
import { clearMessage } from "../lib/domain/shared/message/message.slice";
import { doRestoreSession } from "../lib/domain/shared/session/session.actions";
import { isLoggedIn } from "../lib/domain/shared/session/session.selectors";
import { IState } from "../reducers";
import { setOnUnauthorized } from "../services/authProvider";
import { notificationService } from "../services/notificationService";

const isSSR = typeof window === "undefined";

function App({
    Component,
    pageProps,
    router,
    storeState,
}: AppProps & { storeState: IState }) {
    //@ts-ignore see https://github.com/reduxjs/redux/pull/4078
    const store = getOrCreateStore(() => storeState);

    React.useEffect(() => {
        const handleRouteChange = () => {
            console.log("nav starts");

            // Ensure nav is closed
            store.dispatch(openClose(false));

            // Clear any flash message
            store.dispatch(clearMessage());
        };

        const handleRouteChangeComplete = () => {
            console.log("nav done");
        };

        Router.events.on("routeChangeStart", handleRouteChange);
        Router.events.on("routeChangeComplete", handleRouteChangeComplete);
        return () => {
            Router.events.off("routeChangeStart", handleRouteChange);
            Router.events.off("routeChangeComplete", handleRouteChangeComplete);
        };
    }, []);

    setLanguageProvider(() => store.getState().session?.language);

    if ((Component as AppNextPage).needsLogin && !isSSR) {
        const token = store.getState().session.access_token;
        notificationService.init(token);
    }

    const nav =
        isLoggedIn(store.getState()) || router.pathname.startsWith("/game") ? (
            <GameNav />
        ) : (
            <PublicNav />
        );

    const pageContent = <Component {...pageProps} />;

    const isPlay = router.pathname.startsWith("/game/play");
    const Layout = isPlay ? (
        <PlayLayout children={pageContent} />
    ) : router.pathname.startsWith("/game") ? (
        <GameLayout>
            <MainLayout nav={nav} children={pageContent} />
        </GameLayout>
    ) : (
        <MainLayout nav={nav} children={pageContent} />
    );

    return (
        <Provider store={store}>
            <MiniProfiler />
            <LoadingBar className="loading-bar" />
            {Layout}
        </Provider>
    );
}

App.getInitialProps = async (
    appContext: AppContext
): Promise<AppInitialProps & { storeState: IState }> => {
    const cookieState = nextCookie(appContext.ctx);

    // Create or get redux store
    const store = getOrCreateStore(() => {
        return {
            session: {
                language: cookieState["lang"],
            },
        } as any;
    });

    // Setup handler for 401 responses
    setOnUnauthorized(async () => {
        // Temporarily disable re-login
        if (isSSR) {
            // This will only work if we hit it during the initial rendering. Need to rework the session management
            redirectToLogin(appContext);
        } else {
            Router.push("/login");
        }

        return Promise.reject("do not retry");

        // if (store) {
        //     // Try to refresh token
        //     let error = false;

        //     try {
        //         await store.dispatch(refresh());
        //     } catch (e) {
        //         error = true;
        //     }

        //     const tokenAccessor = () => store.getState().session.access_token;
        //     if (error || !tokenAccessor()) {
        //         console.error("Could not login.");
        //         if (isSSR) {
        //             // This will only work if we hit it during the initial rendering. Need to rework the session management
        //             redirectToLogin(appContext);
        //         } else {
        //             Router.push("/login");
        //         }
        //         return;
        //     }

        //     return tokenAccessor;
        // } else {
        //     throw new Error("No store, but trying to reauthorize");
        // }
    });

    const page = appContext.Component as AppNextPage;

    if (page.needsLogin && !isLoggedIn(store.getState())) {
        // Check for login
        let access_token: string;
        let refresh_token: string;
        const token = cookieState["token"];
        if (!!token) {
            console.info("Found token");

            // We have a token and the current store is not yet signed in, try to get user info using that token
            const result = token as any as {
                access_token: string;
                refresh_token: string;
            };
            access_token = result.access_token;
            refresh_token = result.refresh_token;

            if (access_token && refresh_token) {
                try {
                    await store.dispatch(
                        doRestoreSession(access_token, refresh_token)
                    );
                } catch (e) {
                    if (e.message == "Not authorized") {
                        return redirectToLogin(appContext);
                    }

                    console.error(e);
                    throw e;
                }
            }
        } else {
            // No saved token, redirect to login
            return redirectToLogin(appContext);
        }
    }

    // Connect i18n tools to store (for now.. should probably be a component... maybe connected?)
    setLanguageProvider(() => store.getState().session?.language);

    // Make store available to pages getInitialProps
    (appContext.ctx as AppPageContext).store = store;

    try {
        console.info("Getting props");
        const appProps = await NextApp.getInitialProps(appContext);

        // TODO: There has to be a better way to get the title into the state
        if (page.getTitle) {
            const title = (appContext.Component as AppNextPage).getTitle(
                store.getState()
            );
            store.dispatch(setTitle(title));
        }

        // Reset loading bar after SSR
        store.dispatch(resetLoading());

        return {
            ...appProps,
            storeState: store.getState(),
        };
    } catch (e) {
        if (e.message && e.message == "Not authorized") {
            // Assume it's not authorized.
            return redirectToLogin(appContext);
        }

        console.error("Error", e);

        throw e;
    }
};

/** Redirect to the login page for server and client-side */
function redirectToLogin(appContext: AppContext) {
    console.log("Redirecting to login.");

    if (appContext.ctx.res) {
        appContext.ctx.res.writeHead(302, { Location: "/login" });
        appContext.ctx.res.end();
    } else {
        Router.push("/login");
    }

    return {
        pageProps: {},
        storeState: undefined,
    };
}

export default App;
