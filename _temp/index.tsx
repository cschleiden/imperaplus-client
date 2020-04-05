// import * as React from "react";
// import { render } from "react-dom";
// import App from "./app";
// import { NotificationType } from "./external/notificationModel";
// import "./external/polyfills";
// import { NotificationService } from "./services/notificationService";
// import { TokenProvider } from "./services/tokenProvider";
// import { store } from "./lib/store";

// const rootElement = document.getElementById("root");

// // Set token retriever for http clients from global state.
// TokenProvider.tokenRetriever = () => {
//     let state = store && store.getState();
//     if (state) {
//         const session = state.session;
//         return session.access_token;
//     }
// };

// render(
//     <App
//         store={store}
//         history={syncHistoryWithStore(browserHistory as any, store)}
//     />,
//     rootElement,
//     () => {
//         appInit();
//     }
// );

// function appInit() {
//     if (store.getState().session.isLoggedIn) {
//         const service = NotificationService.getInstance();
//         service.init();

//         service.attachHandler(NotificationType.PlayerTurn, () => {
//             // Update count
//             // TODO: CS:
//         });

//         service.attachHandler(NotificationType.NewMessage, () => {
//             // Update count
//             // TODO: CS:
//         });
//     }
// }
