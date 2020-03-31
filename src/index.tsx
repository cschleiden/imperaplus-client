import * as React from "react";
import { render } from "react-dom";
import { AppContainer } from "react-hot-loader";
import { browserHistory } from "react-router";
import { syncHistoryWithStore } from "react-router-redux";
import App from "./app";
import { NotificationType } from "./external/notificationModel";
import "./external/polyfills";
import { NotificationService } from "./services/notificationService";
import { TokenProvider } from "./services/tokenProvider";
import { store } from "./store";

const rootElement = document.getElementById("root");

// Set token retriever for http clients from global state.
TokenProvider.tokenRetriever = () => {
    let state = store && store.getState();
    if (state) {
        const session = state.session;
        return session.access_token;
    }
};

// Hot Module Replacement API
declare var module: any;

render(
    <AppContainer>
        <App
            store={store}
            history={syncHistoryWithStore(browserHistory as any, store)}
        />
    </AppContainer>,
    rootElement,
    () => {
        appInit();
    }
);

// Dev hot module reloading
if (module.hot) {
    module.hot.accept(["./app"], () => {
        // tslint:disable-next-line:no-require-imports
        const NextApp = (require("./app") as any).default;
        render(
            <AppContainer>
                <NextApp store={store} />
            </AppContainer>,
            rootElement
        );
    });
}

function appInit() {
    if (store.getState().session.isLoggedIn) {
        const service = NotificationService.getInstance();
        service.init();

        service.attachHandler(NotificationType.PlayerTurn, () => {
            // Update count
            // TODO: CS:
        });

        service.attachHandler(NotificationType.NewMessage, () => {
            // Update count
            // TODO: CS:
        });
    }
}
