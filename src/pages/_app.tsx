import nextCookie from "next-cookies";
import NextApp, { AppContext, AppInitialProps, AppProps } from "next/app";
import Router from "next/router";
import * as React from "react";
import { Provider } from "react-redux";
import { createClientWithToken } from "../clients/clientFactory";
import Layout from "../components/layouts/main";
import GameNav from "../components/navigation/game";
import PublicNav from "../components/navigation/public";
import { FixedAccountClient } from "../external/accountClient";
import { setLanguagProvider } from "../i18n/i18n";
import { setTitle } from "../lib/domain/shared/general/general.slice";
import { restoreSession } from "../lib/domain/shared/session/session.slice";
import { IState } from "../reducers";
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
    setLanguagProvider(() => store.getState().session?.language);

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
    const store = getOrCreateStore(() => {
        return {
            session: {
                language: cookieState["lang"],
            },
        };
    });

    const page = appContext.Component as AppNextPage;

    const isLoggedIn = !!store.getState().session.access_token;
    if (page.needsLogin && !isLoggedIn) {
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
                const client = createClientWithToken(
                    FixedAccountClient,
                    access_token
                );
                try {
                    const userInfo = await client.getUserInfo();

                    store.dispatch(
                        restoreSession({
                            access_token,
                            refresh_token,
                            userInfo,
                        })
                    );
                } catch (e) {
                    console.log("redirect");

                    // Redirect to the login page for server and client-side
                    if (appContext.ctx.res) {
                        appContext.ctx.res.writeHead(302, {
                            Location: "/login",
                        });
                        appContext.ctx.res.end();
                    } else {
                        Router.push("/login");
                    }
                }
            }
        } else {
            console.log("Redirect to login");

            // Redirect to the login page for server and client-side
            if (appContext.ctx.res) {
                appContext.ctx.res.writeHead(302, { Location: "/login" });
                appContext.ctx.res.end();
            } else {
                Router.push("/login");
            }
        }
    }

    // Connect i18n tools to store (for now.. should probably be a component... maybe connected?)
    setLanguagProvider(() => store.getState().session?.language);

    // Make store available to pages getInitialProps
    (appContext.ctx as AppPageContext).store = store;

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
};

export default App;
