import reducerMap from "../../../lib/reducerMap";

import { failed, IAction, pending, success } from "../../../lib/action";
import { initialState, IPlayState, ITwoCountry } from "./play.reducer.state";

import * as Actions from "../play.actions";
import * as ActionHandlers from "./play.reducer";

export { IPlayState, ITwoCountry };

/** Reducer */
export const play = <TPayload>(
    state = initialState,
    action?: IAction<TPayload>) => {

    const userActions = [
        Actions.SELECT_COUNTRY,
        Actions.SET_PLACE_UNITS,
        Actions.SET_ACTION_UNITS
    ];

    if (state.data.operationInProgress && action && userActions.some(a => a === action.type)) {
        // No input allowed while operation is in progress
        return state;
    }

    return reducerMap(action, state, {
        [Actions.TOGGLE_SIDEBAR]: ActionHandlers.toggleSidebar,
        [success(Actions.SWITCH_GAME)]: ActionHandlers.switchGame,
        [pending(Actions.SWITCH_GAME)]: ActionHandlers.pendingOperation,
        [success(Actions.refreshGame.TYPE)]: ActionHandlers.refreshGame,
        [pending(Actions.refreshGame.TYPE)]: ActionHandlers.pendingOperation,

        // Other games
        [success(Actions.refreshOtherGames.TYPE)]: ActionHandlers.refreshOtherGames,

        [Actions.LEAVE]: ActionHandlers.leave,

        // Game chat
        [Actions.GAME_CHAT_MESSAGE]: ActionHandlers.gameChatMessage,
        [pending(Actions.gameChatSendMessage.TYPE)]: ActionHandlers.gameChatSendMessagePending,
        [success(Actions.gameChatSendMessage.TYPE)]: ActionHandlers.gameChatSendMessageSuccess,
        [success(Actions.gameChatMessages.TYPE)]: ActionHandlers.gameChatMessages,

        // History
        [pending(Actions.historyTurn.TYPE)]: ActionHandlers.pendingOperation,
        [success(Actions.historyTurn.TYPE)]: ActionHandlers.historyTurn,
        [Actions.HISTORY_EXIT]: ActionHandlers.historyExit,

        // Play actions
        [Actions.SELECT_COUNTRY]: ActionHandlers.selectCountry,
        [Actions.SET_PLACE_UNITS]: ActionHandlers.setPlaceUnits,
        [Actions.SET_ACTION_UNITS]: ActionHandlers.setActionUnits,

        [pending(Actions.place.TYPE)]: ActionHandlers.pendingOperation,
        [success(Actions.place.TYPE)]: ActionHandlers.updateFromResult,
        [failed(Actions.place.TYPE)]: ActionHandlers.error,

        [pending(Actions.exchange.TYPE)]: ActionHandlers.pendingOperation,
        [success(Actions.exchange.TYPE)]: ActionHandlers.updateFromResult,
        [failed(Actions.exchange.TYPE)]: ActionHandlers.error,

        [pending(Actions.attack.TYPE)]: ActionHandlers.pendingOperation,
        [success(Actions.attack.TYPE)]: ActionHandlers.updateFromResult,
        [failed(Actions.attack.TYPE)]: ActionHandlers.error,

        [pending(Actions.endAttack.TYPE)]: ActionHandlers.pendingOperation,
        [success(Actions.endAttack.TYPE)]: ActionHandlers.updateFromResult,
        [failed(Actions.endAttack.TYPE)]: ActionHandlers.error,

        [pending(Actions.move.TYPE)]: ActionHandlers.pendingOperation,
        [success(Actions.move.TYPE)]: ActionHandlers.updateFromResult,
        [failed(Actions.move.TYPE)]: ActionHandlers.error,

        [pending(Actions.endTurn.TYPE)]: ActionHandlers.pendingOperation,
        [success(Actions.endTurn.TYPE)]: ActionHandlers.updateFromResult,
        [failed(Actions.endTurn.TYPE)]: ActionHandlers.error
    });
};
