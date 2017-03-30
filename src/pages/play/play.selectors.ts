import { IPlayState } from "./play.reducer";
import { UserProvider } from "../../services/userProvider";

export const canPlace = (state: IPlayState): boolean => {
    const { game, placeCountries } = state.data;

    return game && game.unitsToPlace === Object.keys(placeCountries).reduce((sum, id) => sum + placeCountries[id], 0);
};

export const canMoveOrAttack = (state: IPlayState): boolean => {
    const { twoCountry, countriesByIdentifier } = state.data;

    return twoCountry.originCountryIdentifier && twoCountry.destinationCountryIdentifier && twoCountry.numberOfUnits > 0;
};

export const inputActive = (state: IPlayState) => {
    const { game } = state.data;

    return game && game.currentPlayer.userId === UserProvider.getUserId();
};