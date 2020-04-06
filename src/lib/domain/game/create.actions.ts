import {
    GameClient,
    GameCreationOptions,
    MapClient,
} from "../../../external/imperaClients";
import __ from "../../../i18n/i18n";
import { AppThunk, AsyncAction } from "../../../store";
import { lookupSet } from "../shared/general/general.slice";
import { MessageType, showMessage } from "../shared/message/message.slice";
import { getToken } from "../shared/session/session.selectors";

export const create: AsyncAction<GameCreationOptions> = async (
    dispatch,
    getState,
    extra,
    input
) => {
    await extra.createClient(getToken(getState()), GameClient).post(input);

    dispatch(
        showMessage({
            message: __(
                "Game created, you can find it now in [My Games](/game/games)."
            ),
            type: MessageType.success,
        })
    );
};

export const getMaps = (): AppThunk => async (dispatch, getState, extra) => {
    const mapTemplates = await extra
        .createClient(getToken(getState()), MapClient)
        .getAllSummary();

    dispatch(lookupSet({ key: "maps", data: mapTemplates }));
};
