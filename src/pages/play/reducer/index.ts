import reducerMap from "../../../lib/reducerMap";

import { IPlayState, ITwoCountry, initialState } from "./play.reducer.state";
import { IAction, success, pending, failed } from "../../../lib/action";

import * as Actions from "../play.actions";
import * as ActionHandlers from "./play.reducer";

export { IPlayState, ITwoCountry };

/** Reducer */
export const play = <TPayload>(
    state = initialState,
    action?: IAction<TPayload>) => {

    return reducerMap(action, state, {
        [Actions.TOGGLE_SIDEBAR]: ActionHandlers.toggleSidebar,
        [success(Actions.SWITCH_GAME)]: ActionHandlers.switchGame,
        [pending(Actions.SWITCH_GAME)]: ActionHandlers.pendingOperation,
        [success(Actions.REFRESH_GAME)]: ActionHandlers.refreshGame,
        [pending(Actions.REFRESH_GAME)]: ActionHandlers.pendingOperation,

        [Actions.LEAVE]: ActionHandlers.leave,

        // Game chat
        [Actions.GAME_CHAT_MESSAGE]: ActionHandlers.gameChatMessage,
        [pending(Actions.GAME_CHAT_SEND_MESSAGE)]: ActionHandlers.gameChatSendMessagePending,
        [success(Actions.GAME_CHAT_SEND_MESSAGE)]: ActionHandlers.gameChatSendMessageSuccess,
        [success(Actions.GAME_CHAT_MESSAGES)]: ActionHandlers.gameChatMessages,

        // History
        [success(Actions.HISTORY_TURN)]: ActionHandlers.historyTurn,
        [Actions.HISTORY_EXIT]: ActionHandlers.historyExit,

        // Play actions
        [Actions.SELECT_COUNTRY]: ActionHandlers.selectCountry,
        [Actions.SET_PLACE_UNITS]: ActionHandlers.setPlaceUnits,
        [Actions.SET_ACTION_UNITS]: ActionHandlers.setActionUnits,

        [pending(Actions.PLACE)]: ActionHandlers.pendingOperation,
        [success(Actions.PLACE)]: ActionHandlers.updateFromResult,
        [failed(Actions.PLACE)]: ActionHandlers.error,

        [pending(Actions.EXCHANGE)]: ActionHandlers.pendingOperation,
        [success(Actions.EXCHANGE)]: ActionHandlers.updateFromResult,
        [failed(Actions.EXCHANGE)]: ActionHandlers.error,

        [pending(Actions.ATTACK)]: ActionHandlers.pendingOperation,
        [success(Actions.ATTACK)]: ActionHandlers.updateFromResult,
        [failed(Actions.ATTACK)]: ActionHandlers.error,

        [pending(Actions.END_ATTACK)]: ActionHandlers.pendingOperation,
        [success(Actions.END_ATTACK)]: ActionHandlers.updateFromResult,
        [failed(Actions.END_ATTACK)]: ActionHandlers.error,

        [pending(Actions.MOVE)]: ActionHandlers.pendingOperation,
        [success(Actions.MOVE)]: ActionHandlers.updateFromResult,
        [failed(Actions.MOVE)]: ActionHandlers.error,

        [pending(Actions.END_TURN)]: ActionHandlers.pendingOperation,
        [success(Actions.END_TURN)]: ActionHandlers.updateFromResult,
        [failed(Actions.END_TURN)]: ActionHandlers.error
    });
};
