import { Game, GameState } from "../../../../external/imperaClients";
import { PlaySliceState } from "./play.slice.state";

export function game(state: PlaySliceState): Game {
    const { game, historyTurn } = state;

    if (historyTurn) {
        return historyTurn.game;
    }

    return game;
}

export function canPlace(state: PlaySliceState): boolean {
    const { game, placeCountries } = state;

    return (
        game &&
        game.unitsToPlace ===
            Object.keys(placeCountries).reduce(
                (sum, id) => sum + placeCountries[id],
                0
            )
    );
}

export function canMoveOrAttack(state: PlaySliceState): boolean {
    const { twoCountry } = state;

    return (
        twoCountry.originCountryIdentifier &&
        twoCountry.destinationCountryIdentifier &&
        twoCountry.numberOfUnits >= twoCountry.minUnits &&
        twoCountry.numberOfUnits <= twoCountry.maxUnits
    );
}

export function inputActive(state: PlaySliceState, userId: string) {
    const { game, historyTurn } = state;

    // - When history is active, no input is allowed
    // - Current player has to be the user
    return (
        !historyTurn &&
        game &&
        game.currentPlayer.userId === userId &&
        game.state === GameState.Active
    );
}
