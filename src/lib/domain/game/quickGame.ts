import Router from "next/router";
import { GameClient } from "../../../external/GameClient";
import {
    MapDistribution,
    VictoryConditionType,
    VisibilityModifierType,
} from "../../../external/imperaClients";
import __ from "../../../i18n/i18n";
import { AppThunk } from "../../../store";
import { getToken } from "../shared/session/session.selectors";

export const doQuickGame = (): AppThunk => async (
    dispatch,
    getState,
    extra
) => {
    const currentUser = getState().session.userInfo.userName;

    const game = await extra
        .createClient(getToken(getState()), GameClient)
        .post({
            name: `${__("QuickGame")}-${currentUser}-${Date.now()}`,

            mapTemplate: "WorldDeluxe",
            numberOfPlayersPerTeam: 1,
            numberOfTeams: 2,
            timeoutInSeconds: 86400,
            attacksPerTurn: 5,
            movesPerTurn: 7,
            newUnitsPerTurn: 3,
            victoryConditions: [VictoryConditionType.Survival],
            visibilityModifier: [VisibilityModifierType.None],
            mapDistribution: MapDistribution.Default,
            initialCountryUnits: 1,
            maximumNumberOfCards: 5,
            minUnitsPerCountry: 1,
            maximumTimeoutsPerPlayer: 2,
            addBot: true,
        });

    Router.push("/game/play/[gameId]", `/game/play/${game.id}`);
};
