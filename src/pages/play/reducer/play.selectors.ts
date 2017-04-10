import { IPlayState } from "./play.reducer.state";
import { UserProvider } from "../../../services/userProvider";
import { Game, GameState } from "../../../external/imperaClients";

export function game(state: IPlayState): Game {
    const { game, historyTurn } = state.data;

    if (historyTurn) {
        return historyTurn.game;
    }

    return game;
}

export function canPlace(state: IPlayState): boolean {
    const { game, placeCountries } = state.data;

    return game && game.unitsToPlace === Object.keys(placeCountries).reduce((sum, id) => sum + placeCountries[id], 0);
}

export function canMoveOrAttack(state: IPlayState): boolean {
    const { twoCountry } = state.data;

    return twoCountry.originCountryIdentifier && twoCountry.destinationCountryIdentifier && twoCountry.numberOfUnits > 0;
}

export function inputActive(state: IPlayState) {
    const { game, historyTurn } = state.data;

    // - When history is active, no input is allowed
    // - Current player has to be the user
    return !historyTurn && game && game.currentPlayer.userId === UserProvider.getUserId() && game.state === GameState.Active;
}