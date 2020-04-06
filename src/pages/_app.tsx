import nextCookie from "next-cookies";
import NextApp, { AppContext, AppInitialProps, AppProps } from "next/app";
import Router from "next/router";
import * as React from "react";
import { Provider } from "react-redux";
import Layout from "../components/layouts/main";
import GameNav from "../components/navigation/game";
import PublicNav from "../components/navigation/public";
import { setLanguageProvider } from "../i18n/i18n";
import { setTitle } from "../lib/domain/shared/general/general.slice";
import { doRestoreSession } from "../lib/domain/shared/session/session.actions";
import { isLoggedIn } from "../lib/domain/shared/session/session.selectors";
import { IState } from "../reducers";
import { NotificationService } from "../services/notificationService";
import { AppNextPage, AppPageContext, getOrCreateStore } from "../store";
import "../styles/index.scss";

// HACK: Move forward!
const X: any = Layout;

function App({
    Component,
    pageProps,
    router,
    storeState,
}: AppProps & { storeState: IState }) {
    const store = getOrCreateStore(() => storeState);
    setLanguageProvider(() => store.getState().session?.language);

    if ((Component as AppNextPage).needsLogin) {
        const token = store.getState().session.access_token;
        NotificationService.getInstance().init(token);
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
    // TODO: CS: Do this on demand?
    const cookieState = nextCookie(appContext.ctx);

    // Create or get redux store
    const store = getOrCreateStore(() => {
        return {
            session: {
                language: cookieState["lang"],
            },
        };
    });

    const page = appContext.Component as AppNextPage;

    if (page.needsLogin && !isLoggedIn(store.getState())) {
        // Check for login
        let access_token: string;
        let refresh_token: string;
        const token = cookieState["token"];
        if (!!token) {
            // We have a token and the current store is not yet signed in, try to get user info using that token
            const result = (token as any) as {
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
        const appProps = await NextApp.getInitialProps(appContext);

        // There has to be a better way to get the title into the state
        if (page.getTitle) {
            const title = (appContext.Component as AppNextPage).getTitle(
                store.getState()
            );
            store.dispatch(setTitle(title));
        }

        return {
            ...appProps,
            storeState: store.getState(),
        };
    } catch (e) {
        if (e.message && e.message == "Not authorized") {
            // Assume it's not authorized.
            return redirectToLogin(appContext);
        }

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
